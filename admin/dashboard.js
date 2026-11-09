/* Central overview. All actions remain on the existing guarded admin pages/RPCs. */
(() => {
    'use strict';
    if (document.body.hasAttribute('data-admin-redirect')) {
        location.replace(new URL('./', document.currentScript.src).href);
        return;
    }
    const language = window.ZHLanguage;
    const gate = document.getElementById('admin-hub-gate');
    const content = document.getElementById('admin-hub-content');
    const message = document.getElementById('admin-hub-status');
    const login = document.getElementById('admin-hub-login');
    let revision = 0;
    // Spielserver-Kachel: Abruf nur nach bestandener Adminprüfung, einmal pro Minute und nur bei sichtbarer Seite.
    const server = { players: document.getElementById('admin-server-players'), age: document.getElementById('admin-server-age'),
        client: null, timer: 0, ticket: 0, busy: false, loadedAt: 0, reportedAt: 0 };
    const serverInterval = 60000;
    function serverAge() {
        if (!server.reportedAt) return;
        language.bind(server.age, 'admin.serverAge', { seconds: Math.max(0, Math.round((Date.now() - server.reportedAt) / 1000)) });
    }
    function serverShow(key, params = {}, reportedAt = 0) {
        language.bind(server.players, key, params);
        server.reportedAt = reportedAt;
        server.age.hidden = !reportedAt;
        serverAge();
    }
    async function serverLoad() {
        const client = server.client, ticket = server.ticket;
        if (!client || server.busy || document.hidden || !document.body.hasAttribute('data-zh-admin-verified')) return;
        server.busy = true; server.loadedAt = Date.now();
        try {
            const { data, error } = await client.rpc('get_zh_admin_server_stats');
            if (ticket !== server.ticket) return;
            const reported = data ? Date.parse(data.reported_at) : NaN;
            if (error) serverShow('admin.serverUnavailable');
            else if (data === null || data?.online === false) serverShow('admin.serverSilent');
            else if (data?.online === true && Number.isInteger(data.players) && Number.isInteger(data.capacity) && !Number.isNaN(reported))
                serverShow('admin.serverPlayers', { players: data.players, capacity: data.capacity }, reported);
            else serverShow('admin.serverUnavailable');
        } catch (_) {
            if (ticket === server.ticket) serverShow('admin.serverUnavailable');
        } finally {
            if (ticket === server.ticket) server.busy = false;
        }
    }
    function serverTick() {
        if (document.hidden) return;
        if (Date.now() - server.loadedAt >= serverInterval) serverLoad(); else serverAge();
    }
    function serverRun() {
        clearInterval(server.timer); server.timer = 0;
        if (!server.client || document.hidden) return;
        serverTick();
        server.timer = setInterval(serverTick, 1000);
    }
    function serverStop() {
        clearInterval(server.timer); server.timer = 0; server.client = null; server.ticket++; server.busy = false;
    }
    function serverStart(client) {
        serverStop(); server.client = client; server.loadedAt = 0;
        serverShow('admin.serverLoading');
        serverRun();
    }
    document.addEventListener('visibilitychange', serverRun);
    document.querySelectorAll('[data-admin-i18n]').forEach(node => language.bind(node,
        node.dataset.adminI18n, {}, node.hasAttribute('data-admin-label') ? 'aria-label' : 'textContent'));
    async function render(identity, state) {
        const ticket = ++revision;
        serverStop();
        content.hidden = true; gate.hidden = false;
        document.body.removeAttribute('data-zh-admin-verified');
        login.hidden = state.status !== 'guest';
        if (state.status === 'guest') {
            language.bind(message, 'admin.signInRequired');
            return;
        }
        if (!state.userId || !['member', 'nameRequired'].includes(state.status)) {
            language.bind(message, state.status === 'checking' ? 'admin.checking' : 'account.unavailable');
            return;
        }
        language.bind(message, 'admin.checking');
        const allowed = await window.ZHAdminAccess.require(identity.client, { redirect: false });
        if (ticket !== revision || identity.state !== state) return;
        if (!allowed) {
            language.bind(message, 'admin.denied');
            return;
        }
        language.bind(document.getElementById('admin-hub-identity'), 'admin.signedIn',
            { name: state.displayName || language.t('account.title') });
        gate.hidden = true; content.hidden = false;
        serverStart(identity.client);
    }
    window.ZHAccount.ready.then(identity => {
        login.href = window.ZHAccount.authUrl('login', new URL('./', location.href));
        identity.subscribe(state => { render(identity, state).catch(() => language.bind(message, 'account.unavailable')); });
        document.addEventListener('zh:languagechange', () => {
            if (!content.hidden) language.bind(document.getElementById('admin-hub-identity'), 'admin.signedIn',
                { name: identity.state.displayName || language.t('account.title') });
        });
    }).catch(() => language.bind(message, 'account.unavailable'));
})();
