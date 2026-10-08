/* One existing Supabase session and own profile for homepage content. */
(() => {
    'use strict';
    if (window.ZHIdentity) return;
    const client = window.zhSupabaseClient || window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    window.zhSupabaseClient = client;
    const anonymousKey = typeof SUPABASE_KEY === 'string' ? SUPABASE_KEY : window.ZHAccount?.config.key;
    const subscribers = new Set();
    const errorKeys = new Set(['identity.nameRequired', 'identity.unavailable', 'identity.sessionChanged', 'identity.signInRequired']);
    const errorKey = (error, fallback) => errorKeys.has(error?.message) ? error.message : fallback;
    const bindings = new Map();
    const nameRevisionKey = 'zhserver_identity_revision'; // Invalidation marker, never a session or identity value.
    let state = Object.freeze({ status: 'checking', userId: null, displayName: null, createdAt: null });
    let revision = 0;
    const validName = value => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 80 &&
        !/[@\u0000-\u001f\u007f]/.test(value) && !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(value);
    function setState(next) {
        state = Object.freeze(next);
        syncForms();
        for (const subscriber of subscribers) subscriber(state);
    }
    async function resolve() {
        const ticket = ++revision;
        try {
            const { data, error } = await client.auth.getSession();
            if (error) throw error;
            const session = data.session;
            if (!session) {
                if (ticket === revision) setState({ status: 'guest', userId: null, displayName: null, createdAt: null });
                return { status: 'guest', userId: null, displayName: null, accessToken: anonymousKey };
            }
            const verified = await client.auth.getUser(session.access_token);
            if (verified.error || !verified.data.user || verified.data.user.is_anonymous) throw verified.error || new Error('identity.unavailable');
            const userId = verified.data.user.id;
            const profile = await client.rpc('get_zh_own_identity');
            if (profile.error) throw profile.error;
            const current = await client.auth.getSession();
            if (current.error || current.data.session?.access_token !== session.access_token) {
                if (ticket === revision) setTimeout(resolve, 0);
                return { status: 'sessionChanged', userId: null, displayName: null };
            }
            const displayName = validName(profile.data?.display_name) ? profile.data.display_name.trim() : null;
            const date = profile.data?.created_at;
            const createdAt = typeof date === 'string' && Number.isFinite(Date.parse(date)) ? date : null;
            const next = { status: displayName ? 'member' : 'nameRequired', userId, displayName, createdAt };
            if (ticket === revision) setState(next);
            return { ...next, accessToken: session.access_token };
        } catch (_) {
            if (ticket === revision) setState({ status: 'unavailable', userId: null, displayName: null, createdAt: null });
            return { status: 'unavailable', userId: null, displayName: null };
        }
    }
    async function forSubmission() {
        const principal = await resolve();
        if (!['guest', 'member'].includes(principal.status)) throw new Error('identity.' + principal.status);
        const current = await client.auth.getSession();
        if (current.error || (current.data.session?.access_token || anonymousKey) !== principal.accessToken) {
            throw new Error('identity.sessionChanged');
        }
        return principal;
    }
    async function updateDisplayName(value) {
        if (!validName(value)) throw new Error('account.nameInvalid');
        const principal = await resolve();
        if (!['member', 'nameRequired'].includes(principal.status)) throw new Error('identity.' + principal.status);
        const before = await client.auth.getSession();
        if (before.error || before.data.session?.access_token !== principal.accessToken) throw new Error('identity.sessionChanged');
        const result = await client.rpc('set_zh_own_display_name', { p_display_name: value.trim() });
        if (result.error) throw result.error;
        try { localStorage.setItem(nameRevisionKey, Date.now() + ':' + Math.random().toString(36).slice(2)); } catch (_) { /* Same-tab refresh still works. */ }
        const after = await client.auth.getSession();
        if (after.error || after.data.session?.access_token !== principal.accessToken) throw new Error('identity.sessionChanged');
        const updated = await resolve();
        if (updated.userId !== principal.userId) throw new Error('identity.sessionChanged');
        if (updated.status !== 'member') throw new Error('identity.' + updated.status);
        return state;
    }
    function syncForms() {
        for (const [form, binding] of bindings) {
            const guest = state.status === 'guest';
            if (binding.guestMode && !guest) binding.guestName = binding.input.value;
            if (guest && !binding.guestMode) binding.input.value = binding.guestName;
            if (!guest) binding.input.value = state.displayName || '';
            binding.input.readOnly = !guest;
            binding.input.hidden = !guest;
            binding.input.required = guest;
            binding.guestMode = guest;
            binding.note.hidden = guest;
            if (!guest) window.ZHLanguage.bind(binding.note,
                state.status === 'member' ? 'identity.signedIn' : 'identity.' + state.status,
                { name: state.displayName || '' });
            const submit = form.querySelector('button[type="submit"]');
            if (submit) submit.disabled = !['guest', 'member'].includes(state.status) || form.dataset.identityBusy === 'true';
        }
    }
    function bindName(form, input, note) {
        bindings.set(form, { input, note, guestMode: true, guestName: input.value });
        note.setAttribute('data-i18n-ignore', '');
        form.addEventListener('reset', () => setTimeout(() => {
            if (state.status === 'guest') bindings.get(form).guestName = '';
            syncForms();
        }, 0));
        syncForms();
    }
    function subscribe(callback) { subscribers.add(callback); callback(state); return () => subscribers.delete(callback); }
    window.ZHIdentity = Object.freeze({ client, resolve, forSubmission, updateDisplayName, bindName, syncForms, subscribe, errorKey, validName, get state() { return state; } });
    client.auth.onAuthStateChange((event, session) => {
        ++revision;
        if (event === 'SIGNED_OUT') {
            setState({ status: 'guest', userId: null, displayName: null, createdAt: null });
        } else {
            if (session && session.user?.id !== state.userId) {
                setState({ status: 'checking', userId: null, displayName: null, createdAt: null });
            }
            setTimeout(resolve, 0); // Never await SDK calls inside the auth callback.
        }
    });
    document.addEventListener('zh:languagechange', syncForms);
    window.addEventListener('storage', event => { if (event.key === nameRevisionKey) resolve(); });
    const form = document.getElementById('guestbook-form') || document.getElementById('uploadForm');
    const input = document.getElementById('guestbook-name') || document.getElementById('uploader');
    const note = document.querySelector('[data-identity-status]');
    if (form && input && note) bindName(form, input, note);
    resolve();
})();
