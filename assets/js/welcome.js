/* First-visit community welcome. Opened only by account.js for guests; no auth, no cookies. */
(() => {
    'use strict';
    if (window.ZHWelcome) return;
    const language = window.ZHLanguage;
    const keys = ['welcome.dialog', 'welcome.title', 'welcome.text', 'welcome.benefits', 'welcome.game', 'welcome.forum', 'welcome.pulse',
        'welcome.profile', 'welcome.name', 'welcome.accountNote', 'welcome.guestNote', 'welcome.register', 'welcome.login', 'welcome.guest', 'welcome.close'];
    let dialog = null, returnFocus = null, remember = null;

    function loadCss(href) {
        if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(node => node.href === href)) return Promise.resolve();
        return new Promise(resolve => {
            const css = document.createElement('link');
            css.rel = 'stylesheet'; css.href = href;
            const done = () => { clearTimeout(timer); resolve(); };
            const timer = setTimeout(done, 4000);
            css.addEventListener('load', done, { once: true });
            css.addEventListener('error', done, { once: true });
            document.head.append(css);
        });
    }

    function text(tag, key, className) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        language.bind(node, key);
        return node;
    }

    function build(registerUrl, loginUrl) {
        const box = document.createElement('dialog');
        box.className = 'zh-welcome';
        box.setAttribute('aria-labelledby', 'zh-welcome-title');
        box.setAttribute('aria-describedby', 'zh-welcome-text');
        box.setAttribute('data-i18n-ignore', '');
        const inner = document.createElement('div');
        inner.className = 'zh-welcome-inner';

        const close = document.createElement('button');
        close.type = 'button'; close.className = 'zh-welcome-close'; close.textContent = '×';
        language.bind(close, 'welcome.close', {}, 'aria-label');
        close.addEventListener('click', () => finish());

        const kicker = document.createElement('span');
        kicker.className = 'zh-welcome-kicker'; kicker.textContent = 'ZHSERVER COMMUNITY';
        const title = text('h2', 'welcome.title');
        title.id = 'zh-welcome-title'; title.tabIndex = -1;
        const intro = text('p', 'welcome.text', 'zh-welcome-text');
        intro.id = 'zh-welcome-text';

        const list = document.createElement('ul');
        list.className = 'zh-welcome-benefits';
        // The shared game account comes first; community features follow.
        list.append(text('li', 'welcome.game', 'zh-welcome-benefit-game'));
        ['welcome.forum', 'welcome.pulse', 'welcome.profile', 'welcome.name'].forEach(key => list.append(text('li', key)));

        const actions = document.createElement('div');
        actions.className = 'zh-welcome-actions';
        const register = text('a', 'welcome.register', 'zh-welcome-register');
        register.href = registerUrl;
        const login = text('a', 'welcome.login', 'zh-welcome-login');
        login.href = loginUrl;
        // Choosing a path counts as seen; the link itself then follows the existing account flow.
        [register, login].forEach(link => link.addEventListener('click', () => remember?.()));
        const guest = text('button', 'welcome.guest', 'zh-welcome-guest');
        guest.type = 'button';
        guest.addEventListener('click', () => finish());
        actions.append(register, login, guest);

        inner.append(close, kicker, title, intro, text('p', 'welcome.benefits', 'zh-welcome-benefits-title'), list,
            text('p', 'welcome.accountNote', 'zh-welcome-note'), text('p', 'welcome.guestNote', 'zh-welcome-note'), actions);
        box.append(inner);

        // Escape and backdrop clicks close like "continue as guest".
        box.addEventListener('cancel', event => { event.preventDefault(); finish(); });
        box.addEventListener('click', event => { if (event.target === box) finish(); });
        // Browsers may also close a modal directly (e.g. a repeated Escape); treat that the same way.
        box.addEventListener('close', () => { if (dialog === box) finish(); });
        return box;
    }

    function finish() {
        if (!dialog) return;
        remember?.();
        const box = dialog, target = returnFocus;
        dialog = null; returnFocus = null;
        if (box.open) box.close();
        box.remove();
        document.documentElement.classList.remove('zh-welcome-open');
        if (target?.isConnected && typeof target.focus === 'function') target.focus({ preventScroll: true });
    }

    async function open(options) {
        if (!language || dialog || typeof HTMLDialogElement !== 'function') return false;
        // A cached older translation catalogue would show raw keys; skip quietly instead.
        if (keys.some(key => language.t(key) === key)) return false;
        await loadCss(options.cssUrl);
        if (dialog || window.ZHIdentity?.state.status !== 'guest') return false;
        remember = options.remember;
        returnFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
        dialog = build(options.registerUrl, options.loginUrl);
        document.body.append(dialog);
        document.documentElement.classList.add('zh-welcome-open');
        dialog.showModal();
        // Start on the heading so screen readers announce the welcome before the choices.
        dialog.querySelector('#zh-welcome-title').focus({ preventScroll: true });
        return true;
    }

    window.ZHWelcome = Object.freeze({ open, close: () => { if (dialog) finish(); } });
})();
