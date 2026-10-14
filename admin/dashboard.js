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
    document.querySelectorAll('[data-admin-i18n]').forEach(node => language.bind(node,
        node.dataset.adminI18n, {}, node.hasAttribute('data-admin-label') ? 'aria-label' : 'textContent'));
    async function render(identity, state) {
        const ticket = ++revision;
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
