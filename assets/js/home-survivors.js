/* Presentation adapter only. No endpoint, credentials or survival calculations. */
(() => {
    'use strict';
    const root = document.querySelector('.home-page.home-chapters .home-survivors');
    const lang = window.ZHLanguage;
    if (!root || !lang) return;
    const list = root.querySelector('#home-survivors-list');
    const status = root.querySelector('#home-survivors-status');
    const labels = [...root.querySelectorAll('[data-i18n-message]')]
        .filter(element => element !== status).map(element => [element, element.dataset.i18nMessage]);
    const refreshMs = 5 * 60 * 1000;
    let source = null, rows = [], statusKey = 'home.survivors.preparing';
    let timer, controller, revision = 0, lastAttempt = 0;

    function render() {
        labels.forEach(([element, key]) => lang.bind(element, key));
        lang.bind(status, statusKey);
        status.hidden = rows.length > 0;
        list.hidden = rows.length === 0;
        list.replaceChildren(...rows.map((row, index) => {
            const item = document.createElement('li');
            for (const [text, cls] of [
                [String(index + 1) + '.', 'home-survivor-position'],
                [row.displayName, 'home-survivor-name'],
                [lang.t(row.survivalDays === 1 ? 'home.survivors.day' : 'home.survivors.days',
                    {count: row.survivalDays.toLocaleString(lang.locale)}), 'home-survivor-days']
            ]) {
                const span = document.createElement('span');
                span.className = cls;
                span.textContent = text;
                item.append(span);
            }
            return item;
        }));
    }
    function cancel() {
        revision++;
        clearTimeout(timer);
        controller?.abort();
        controller = null;
    }
    function schedule() {
        clearTimeout(timer);
        if (source && !document.hidden) timer = setTimeout(() => void refresh(), refreshMs);
    }
    async function refresh() {
        if (!source || controller || document.hidden) return;
        const ticket = revision;
        const read = source;
        const request = new AbortController();
        controller = request;
        lastAttempt = Date.now();
        rows = [];
        statusKey = 'home.survivors.loading';
        render();
        let timeout;
        try {
            const data = await Promise.race([
                Promise.resolve().then(() => read({signal: request.signal})),
                new Promise((_, reject) => {
                    timeout = setTimeout(() => { request.abort(); reject(new Error('timeout')); }, 10000);
                })
            ]);
            if (ticket !== revision) return;
            if (!Array.isArray(data)) throw new Error('invalid public rows');
            // Keep the Dedicated's order. Only public display fields enter the DOM.
            rows = data.slice(0, 5).map(row => {
                if (!row || typeof row.displayName !== 'string' || !row.displayName.trim() ||
                    row.displayName.length > 120 || /[@\u0000-\u001f\u007f]/u.test(row.displayName) ||
                    !Number.isSafeInteger(row.survivalDays) || row.survivalDays < 0)
                    throw new Error('invalid public row');
                return {displayName: row.displayName.trim(), survivalDays: row.survivalDays};
            });
            statusKey = 'home.survivors.empty';
        } catch (error) {
            if (ticket !== revision) return;
            rows = [];
            // The leaderboard function arrives with a game release; until then keep the preparation note.
            statusKey = error?.message === 'survivors.notReady' ? 'home.survivors.preparing' : 'home.survivors.unavailable';
        } finally {
            clearTimeout(timeout);
            if (ticket === revision) { controller = null; render(); schedule(); }
        }
    }
    function disconnect() {
        cancel(); source = null; rows = [];
        statusKey = 'home.survivors.preparing'; render();
    }
    function connect(readPublicRows) {
        if (typeof readPublicRows !== 'function') throw new TypeError('Public reader required');
        disconnect();
        source = readPublicRows;
        void refresh();
    }
    document.addEventListener('zh:languagechange', render);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { if (controller) lastAttempt = 0; cancel(); }
        else if (source && Date.now() - lastAttempt >= refreshMs) void refresh();
        else schedule();
    });
    window.addEventListener('pagehide', cancel);
    window.addEventListener('pageshow', event => {
        if (event.persisted && source) void refresh();
    });
    window.ZHHomeSurvivors = Object.freeze({connect, disconnect});
    render();

    // Public leaderboard from the database (get_top_survivors, anon key, read only).
    // Result and "not ready yet" are kept 5 minutes in this browser; names stay plain text.
    const cacheKey = 'zh_top_survivors_v1';
    function cached() {
        try {
            const saved = JSON.parse(localStorage.getItem(cacheKey));
            const age = Date.now() - saved?.at;
            if (Number.isFinite(age) && age >= 0 && age < refreshMs && (saved.notReady === true || Array.isArray(saved.rows))) return saved;
        } catch (_) { /* No usable cache: ask the database. */ }
        return null;
    }
    function remember(value) {
        try { localStorage.setItem(cacheKey, JSON.stringify({...value, at: Date.now()})); } catch (_) { /* Optional. */ }
    }
    async function readTopSurvivors({signal}) {
        const saved = cached();
        if (saved?.notReady) throw new Error('survivors.notReady');
        if (saved) return saved.rows;
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_top_survivors`, {
            method: 'POST', signal, body: JSON.stringify({p_limit: 5}),
            headers: {'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY}
        });
        if (response.status === 404) { remember({notReady: true}); throw new Error('survivors.notReady'); }
        if (!response.ok) throw new Error('unavailable');
        const data = await response.json();
        if (!data || data.time_unit !== 'game_days' || !Array.isArray(data.survivors)) throw new Error('invalid');
        const result = [...data.survivors]
            .sort((a, b) => (a?.rank ?? 0) - (b?.rank ?? 0))
            .map(row => ({displayName: row?.player_name, survivalDays: row?.survived_days}));
        remember({rows: result});
        return result;
    }
    if (typeof SUPABASE_URL === 'string' && typeof SUPABASE_KEY === 'string') connect(readTopSurvivors);
})();
