/* Homepage -> Godot handoff. The Dedicated must independently verify the token. */
(() => {
    'use strict';
    if (window.ZHGameAuth) return;
    const client = window.zhSupabaseClient;
    const origin = window.location.origin;
    const loginUrl = new URL('account/', window.location.href).href;
    const gamePath = new URL('game/', window.location.href).pathname;
    let generation = 0, expiryTimer, readPromise;
    let state = Object.freeze({ version: 1, revision: 0, status: 'checking',
        auth_status: 'checking', reason: 'initializing', session: null });

    function frameTarget() {
        const frame = document.getElementById('spiel-starten');
        try {
            if (!/^https?:$/.test(window.location.protocol) || !frame?.getAttribute('src')) return null;
            const url = new URL(frame.src);
            if (url.origin !== origin || !url.pathname.startsWith(gamePath) ||
                frame.contentWindow.location.origin !== origin) return null;
            return frame.contentWindow;
        } catch (_) { return null; }
    }
    function info() {
        // Notifications deliberately contain no token, account ID or profile data.
        return Object.freeze({ version: 1, revision: state.revision, status: state.status,
            auth_status: state.auth_status, reason: state.reason });
    }
    function notify() {
        window.dispatchEvent(new CustomEvent('zhserver:game-auth-change', { detail: info() }));
        frameTarget()?.postMessage({ type: 'zhserver.game.auth.changed', ...info() }, origin);
    }
    function setState(status, authStatus, reason, session = null) {
        if (state.status === status && state.auth_status === authStatus && state.reason === reason &&
            state.session?.access_token === session?.access_token &&
            state.session?.expires_at === session?.expires_at) return;
        clearTimeout(expiryTimer);
        state = Object.freeze({ version: 1, revision: state.revision + 1,
            status, auth_status: authStatus, reason, session });
        if (session) {
            expiryTimer = setTimeout(() => {
                snapshot();
                void read();
            }, Math.min(2147483647, Math.max(0, session.expires_at * 1000 - Date.now())));
        }
        notify();
    }
    function accept(session, reason = 'session_available') {
        if (!session) { setState('signed_out', 'guest', 'no_session'); return; }
        const token = session.access_token, expiry = session.expires_at;
        if (typeof token !== 'string' || token.length > 16384 ||
            !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token) ||
            !Number.isSafeInteger(expiry) || expiry <= 0 || session.user?.is_anonymous === true) {
            setState('signed_out', 'unauthenticated', 'invalid_session'); return;
        }
        if (expiry * 1000 <= Date.now()) {
            setState('signed_out', 'unauthenticated', 'expired'); return;
        }
        // This is a fresh SDK credential candidate, not a server authorization decision.
        setState('signed_in', 'authenticated', reason,
            Object.freeze({ access_token: token, expires_at: expiry }));
    }
    function snapshot() {
        // A background tab can throttle timers. Never hand out an expired cached token.
        if (state.session && state.session.expires_at * 1000 <= Date.now()) {
            setState('signed_out', 'unauthenticated', 'expired');
        }
        return state;
    }
    function read() {
        if (readPromise) return readPromise;
        if (!client?.auth?.getSession) {
            setState('unavailable', 'unavailable', 'sdk_unavailable');
            return Promise.resolve(snapshot());
        }
        const ticket = generation;
        readPromise = (async () => {
            try {
                const result = await client.auth.getSession();
                if (ticket === generation) {
                    if (result.error) setState('unavailable', 'unavailable', 'session_error');
                    else accept(result.data?.session || null);
                }
            } catch (_) {
                if (ticket === generation) setState('unavailable', 'unavailable', 'session_error');
            }
            return snapshot();
        })().finally(() => { readPromise = null; });
        return readPromise;
    }
    function poll() {
        const current = snapshot();
        return JSON.stringify({ ...info(), access_token: current.session?.access_token || '',
            expires_at: current.session?.expires_at ?? null });
    }
    function openLogin(mode = 'login') {
        // Call directly from a game button/user gesture; keep the running game in its tab.
        const target = new URL(loginUrl);
        if (mode === 'register') target.searchParams.set('mode', 'register');
        if (navigator.userActivation && !navigator.userActivation.isActive) {
            return { status: 'user_action_required', url: target.href };
        }
        window.open(target.href, '_blank', 'noopener');
        // noopener returns no window handle; a popup blocker may still require a normal link.
        return { status: 'requested', url: target.href };
    }
    window.ZHGameAuth = Object.freeze({ version: 1, loginUrl,
        getSnapshot: snapshot, getSession: read, poll, openLogin,
        async getAccessToken() { return (await read()).session?.access_token || ''; } });

    client?.auth?.onAuthStateChange?.((event, session) => {
        // Synchronous: calling another Auth method here can block the SDK's session lock.
        ++generation;
        if (event === 'SIGNED_OUT') setState('signed_out', 'guest', 'signed_out');
        else accept(session);
    });
    window.addEventListener('message', async event => {
        const data = event.data;
        const target = frameTarget();
        if (!target || event.origin !== origin || event.source !== target || !data ||
            data.type !== 'zhserver.game.auth.request' || data.version !== 1 ||
            typeof data.request_id !== 'string' || !/^[0-9a-f]{32}$/.test(data.request_id)) return;
        await read();
        // Recheck the window/origin after awaiting refresh and use the latest bounded snapshot.
        if (event.source !== frameTarget()) return;
        const current = snapshot();
        event.source.postMessage({ type: 'zhserver.game.auth.session', ...info(),
            request_id: data.request_id, session: current.session }, origin);
    });
    const reread = () => { void read(); };
    window.addEventListener('focus', reread);
    window.addEventListener('pageshow', reread);
    window.addEventListener('storage', event => {
        if (event.key === null || event.key.startsWith('sb-')) reread();
    });
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) reread();
    });
    document.getElementById('spiel-starten')?.addEventListener('load', notify);
    void read();
})();
