/* Community figures for the footer (members, newest member), independent of visitor statistics.
   Read only: since 30.10.2026 the footer shows no online count, so no presence is reported. */
(() => {
    'use strict';
    if (window.ZHCommunityStats) return;
    const INTERVAL = 60000;
    const ONLINE_WINDOW = 180000;
    const panels = [...document.querySelectorAll('[data-community-stats]')];
    let settings, client;
    let snapshot = null, receivedAt = 0, timer, busy = false, started = false, suspended = false;
    let refreshPending = false, channel;
    // Browser ID and heartbeat marker of the former presence report are no longer needed.
    for (const name of ['localStorage', 'sessionStorage']) {
        try { window[name].removeItem('zhserver_presence_browser'); window[name].removeItem('zhserver_presence_heartbeat'); }
        catch (_) { /* Storage blocked: nothing was stored there either. */ }
    }

    const language = () => {
        if (window.ZHLanguage) return window.ZHLanguage.language;
        try { return localStorage.getItem('zh_language') === 'en' ? 'en' : 'de'; }
        catch (_) { return 'de'; }
    };
    const text = key => window.ZHLanguage?.t(`community.stats.${key}`) ??
        window.ZHTranslations?.messages[`community.stats.${key}`]?.[language()] ?? '';
    const count = value => {
        if (typeof value !== 'number' && typeof value !== 'string') return null;
        if (typeof value === 'string' && !/^\d+$/.test(value)) return null;
        const number = Number(value);
        return Number.isSafeInteger(number) && number >= 0 ? number : null;
    };
    function validate(data) {
        const row = Array.isArray(data) ? data[0] : data;
        if (!row || typeof row !== 'object') return null;
        const total = count(row.online_total), members = count(row.online_members), guests = count(row.online_guests);
        if (total === null || members === null || guests === null || total !== members + guests) return null;
        // Only the server's explicitly public profile adapter may supply this name.
        const name = row.newest_member;
        const publicName = row.public_name_available === true && typeof name === 'string' &&
            name.trim().length > 0 && name.length <= 80 && !/[@\u0000-\u001f\u007f]/.test(name) &&
            !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(name) ? name.trim() : null;
        return { online_total: total, online_members: members, online_guests: guests,
            registered_members: count(row.registered_members), newest_member: publicName };
    }
    function render() {
        const lang = language(), fresh = snapshot && Date.now() - receivedAt < ONLINE_WINDOW;
        for (const panel of panels) {
            panel.lang = lang;
            panel.dataset.communityState = fresh ? 'available' : 'unavailable';
            panel.querySelectorAll('[data-community-text]').forEach(el => {
                el.textContent = text(el.dataset.communityText);
            });
            panel.querySelectorAll('[data-community-value]').forEach(el => {
                const field = el.dataset.communityValue;
                const value = fresh ? snapshot[field] : null;
                el.textContent = value === null ? text('none') : typeof value === 'number' ?
                    value.toLocaleString(lang === 'en' ? 'en-GB' : 'de-DE') : value;
                if (field === 'newest_member' && value === null) el.title = text('nameUnavailable');
                else el.removeAttribute('title');
            });
            const status = panel.querySelector('[data-community-status]');
            if (status) status.textContent = fresh ? '' : text('unavailable');
        }
    }
    function accept(data, broadcast = true) {
        const parsed = validate(data);
        if (!parsed) return false;
        snapshot = parsed;
        receivedAt = Date.now();
        render();
        // No identities, tokens or raw presence records are exchanged between tabs.
        if (broadcast) channel?.postMessage({ stats: { ...parsed,
            public_name_available: parsed.newest_member !== null } });
        return true;
    }
    async function rpc(name, args = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
            const { data, error } = await client.rpc(name, args).abortSignal(controller.signal);
            return error ? null : data;
        } catch (_) { return null; }
        finally { clearTimeout(timeout); }
    }
    async function sample() {
        if (document.hidden || suspended) return;
        accept(await rpc('get_zh_community_stats'));
    }
    function schedule(delay = INTERVAL) {
        clearTimeout(timer);
        if (!suspended && !document.hidden) timer = setTimeout(tick, delay);
    }
    async function tick() {
        if (busy || suspended || document.hidden) return;
        busy = true;
        refreshPending = false;
        try {
            if (navigator.locks?.request) await navigator.locks.request('zhserver_community_heartbeat', sample);
            else await sample();
        } catch (_) { /* Temporary auth/network/storage failure: no invented numbers. */ }
        finally { busy = false; render(); schedule(refreshPending ? 0 : INTERVAL); }
    }
    async function getClient() {
        if (window.zhSupabaseClient) return window.zhSupabaseClient;
        if (!window.supabase?.createClient) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0';
                script.integrity = 'sha384-UagCvVPT5XXA0Hx+nJYUAGBFseHT9zBgpJMSebsAxl9lciTwbT+39j5VfRjdP5Tp';
                script.crossOrigin = 'anonymous';
                script.onload = resolve;
                script.onerror = reject;
                document.head.append(script);
            });
        }
        // Same project, default auth storage key and session behavior as /admin.
        return window.zhSupabaseClient ||= window.supabase.createClient(settings.url, settings.key);
    }
    async function start(options) {
        if (started) return;
        started = true;
        settings = options;
        render();
        document.addEventListener('zh:languagechange', render);
        window.addEventListener('storage', event => {
            if (event.key === 'zh_language') render();
        });
        // No calls to unverified/nonexistent production RPCs, and no local fake totals.
        if (window.ZHCommunityConfig?.enabled !== true) return;
        try { client = await getClient(); }
        catch (_) { return; }
        try {
            channel = new BroadcastChannel('zhserver.community');
            channel.onmessage = event => accept(event.data?.stats, false);
        } catch (_) { /* Cross-tab locks plus server deduplication work without this. */ }
        client.auth.onAuthStateChange(() => {
            // Return synchronously: SDK auth callbacks must not await another auth call.
            refreshPending = true;
            if (!busy) schedule(0);
        });
        document.addEventListener('visibilitychange', () => {
            render();
            if (document.hidden) clearTimeout(timer);
            else { refreshPending = true; if (!busy) schedule(0); }
        });
        window.addEventListener('pagehide', () => { suspended = true; clearTimeout(timer); });
        window.addEventListener('pageshow', () => {
            suspended = false; refreshPending = true; if (!busy) schedule(0);
        });
        await tick();
    }
    window.ZHCommunityStats = Object.freeze({ start });
})();
