/* Footer "Aktuell": game server reachability and the current release from the forum changelog.
   Read only: no login, no counts, no view registration, no presence report. */
(() => {
    'use strict';
    if (window.ZHFooterStatus) return;
    // Same fixed address and check as the game page: a WebSocket that only opens and closes.
    const SERVER_URL = 'wss://ws.zhserver.de/ws';
    const SERVER_CACHE = 'zh_footer_server_v1';
    const SERVER_FRESH = 120000, SERVER_REFRESH = 300000, PROBE_TIMEOUT = 6000;
    const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const root = new URL('../../', document.currentScript?.src || location.href);
    let settings, server = 'checking', release = null, releaseState = 'checking';
    let timer, probing = false;

    const language = () => window.ZHLanguage?.language || (() => {
        try { return localStorage.getItem('zh_language') === 'en' ? 'en' : 'de'; } catch (_) { return 'de'; }
    })();
    const text = (key, values = {}) => {
        const raw = window.ZHLanguage?.t(`footer.status.${key}`, values) ??
            window.ZHTranslations?.messages[`footer.status.${key}`]?.[language()] ?? '';
        return raw.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
    };
    const panels = () => [...document.querySelectorAll('[data-footer-status]')];

    function link(href, label) {
        const anchor = document.createElement('a');
        anchor.href = href; anchor.textContent = label;
        return anchor;
    }
    function render() {
        const lang = language();
        for (const panel of panels()) {
            panel.lang = lang;
            panel.querySelectorAll('[data-footer-text]').forEach(el => { el.textContent = text(el.dataset.footerText); });
            const state = panel.querySelector('[data-footer-server]');
            state.dataset.state = server;
            state.querySelector('span').textContent = text(server === 'online' ? 'online' : server === 'offline' ? 'offline' : 'checking');
            const version = panel.querySelector('[data-footer-release]');
            if (release) {
                const date = release.date ? new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'de-DE',
                    lang === 'en' ? { day: 'numeric', month: 'short', timeZone: 'Europe/Berlin' } :
                        { day: '2-digit', month: '2-digit', timeZone: 'Europe/Berlin' }).format(new Date(release.date + 'T12:00:00Z')) : '';
                const anchor = link(new URL('forum/#thread/' + release.id, root).href, release.label);
                const note = document.createElement('small');
                note.textContent = date ? text('updated', { date }) : '';
                version.replaceChildren(anchor, note);
            } else version.textContent = text(releaseState === 'checking' ? 'checking' : 'unavailable');
        }
    }
    function readCache() {
        try {
            const saved = JSON.parse(sessionStorage.getItem(SERVER_CACHE));
            if (saved && ['online', 'offline'].includes(saved.state) && Date.now() - saved.at < SERVER_FRESH && saved.at <= Date.now()) return saved;
        } catch (_) { /* No cache: probe directly. */ }
        return null;
    }
    function probe() {
        if (probing || document.hidden) return;
        const cached = readCache();
        if (cached) { server = cached.state; render(); return; }
        probing = true;
        let socket, done = false, timeout;
        const finish = state => {
            if (done) return;
            done = true; probing = false; clearTimeout(timeout);
            if (socket) { socket.onopen = socket.onerror = socket.onclose = null; try { socket.close(); } catch (_) { /* Already closed. */ } }
            server = state;
            try { sessionStorage.setItem(SERVER_CACHE, JSON.stringify({ state, at: Date.now() })); } catch (_) { /* Optional. */ }
            render();
        };
        try {
            // Transport reachability only: no game login, guest creation or gameplay messages.
            socket = new WebSocket(SERVER_URL);
            socket.onopen = () => finish('online');
            socket.onerror = socket.onclose = () => finish('offline');
            timeout = setTimeout(() => finish('offline'), PROBE_TIMEOUT);
        } catch (_) { finish('offline'); }
    }
    async function forum(args) {
        const response = await fetch(`${settings.url}/rest/v1/rpc/get_zh_forum`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', apikey: settings.key, Authorization: 'Bearer ' + settings.key },
            body: JSON.stringify(args), signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) throw new Error('unavailable');
        const data = await response.json();
        if (!data || !Array.isArray(data.topics)) throw new Error('unavailable');
        return data.topics;
    }
    async function loadRelease() {
        try {
            const day = item => /^\d{4}-\d{2}-\d{2}$/.test(item.changelog?.date || '') ? item.changelog.date : '';
            // Newest release by its date; published with every release through the forum changelog.
            const newest = (await forum({ p_category: 'changelog' }))
                .filter(item => item && UUID.test(item.id) && item.category === 'changelog' && item.hidden === false &&
                    typeof item.title === 'string' && item.title.trim())
                .sort((a, b) => day(b).localeCompare(day(a)) || Date.parse(b.last_activity_at) - Date.parse(a.last_activity_at))[0];
            const version = newest?.changelog?.version;
            release = newest ? { id: newest.id, date: day(newest),
                label: typeof version === 'string' && /^\d+(\.\d+){1,3}$/.test(version) ? 'Alpha ' + version : newest.title.trim() } : null;
            releaseState = release ? 'ready' : 'empty';
        } catch (_) { release = null; releaseState = 'unavailable'; }
        render();
    }
    function schedule() {
        clearTimeout(timer);
        if (!document.hidden) timer = setTimeout(() => { probe(); schedule(); }, SERVER_REFRESH);
    }
    function start(options) {
        if (settings) return;
        settings = options;
        render();
        document.addEventListener('zh:languagechange', render);
        window.addEventListener('storage', event => { if (event.key === 'zh_language') render(); });
        document.addEventListener('visibilitychange', () => { if (!document.hidden) { probe(); schedule(); } else clearTimeout(timer); });
        probe(); schedule();
        void loadRelease();
    }
    window.ZHFooterStatus = Object.freeze({ start });
})();
