/* Central homepage account UI. Existing Auth, session storage and public identity. */
(() => {
    'use strict';
    if (window.ZHAccount || !window.ZHLanguage) return;
    const root = new URL('../../', document.currentScript.src);
    const config = Object.freeze({
        url: 'https://yawadxzeyyrozmlrokun.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE'
    });
    const language = window.ZHLanguage;
    const site = path => new URL(path, root).href;
    const allowed = new Set(['', 'index.html', 'game.html', 'gallery.html', 'wiki.html', 'forum/',
        'forum/index.html', 'arma/', 'arma/index.html', 'bugs/', 'bugs/index.html', 'profile/', 'profile/index.html']);
    function safeNext(value) {
        try {
            const url = new URL(value || 'profile/', root);
            if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname) || url.username || url.password ||
                !allowed.has(url.pathname.slice(root.pathname.length)) ||
                ['access_token', 'refresh_token', 'code', 'token_hash'].some(key => url.searchParams.has(key)) ||
                /(?:^|[&#?])(?:access_token|refresh_token|code|token_hash)=/i.test(decodeURIComponent(url.hash))) return site('profile/');
            return url.href;
        } catch (_) { return site('profile/'); }
    }
    function authUrl(mode = 'login', next = location.href) {
        const url = new URL('account/', root);
        if (['register', 'forgot'].includes(mode)) url.searchParams.set('mode', mode);
        const target = new URL(safeNext(next));
        url.searchParams.set('next', target.pathname + target.search + target.hash);
        return url.href;
    }
    function loadScript(src, ready) {
        if (ready()) return Promise.resolve();
        return new Promise((resolve, reject) => {
            let script = [...document.scripts].find(node => node.src === src);
            const created = !script;
            script ||= document.createElement('script');
            const timer = setTimeout(() => reject(new Error('account.unavailable')), 10000);
            script.addEventListener('load', () => { clearTimeout(timer); ready() ? resolve() : reject(new Error('account.unavailable')); }, { once: true });
            script.addEventListener('error', () => { clearTimeout(timer); reject(new Error('account.unavailable')); }, { once: true });
            if (created) { script.src = src; document.body.append(script); }
        });
    }
    const cssUrl = site('assets/css/account.css?v=20261008-account1');
    if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(node => node.href === cssUrl)) {
        const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = cssUrl;
        document.head.append(css);
    }
    const header = document.querySelector('.header.zh-site-header');
    const widget = document.createElement('div');
    widget.className = 'zh-account'; widget.setAttribute('data-i18n-ignore', '');
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>';
    widget.innerHTML = '<a class="zh-account-guest" data-account-guest>' + icon + '<span data-account-i18n="account.signIn"></span></a>' +
        '<button type="button" class="zh-account-trigger" aria-expanded="false" aria-controls="zh-account-menu" hidden>' + icon + '<span data-account-name></span><span class="zh-account-chevron" aria-hidden="true">⌄</span></button>' +
        '<nav class="zh-account-menu" id="zh-account-menu" hidden><a data-account-profile data-account-i18n="account.myProfile"></a><a data-account-game data-account-i18n="account.toGame"></a><button type="button" data-account-logout data-account-i18n="account.signOut"></button><p class="zh-account-error" role="status" hidden></p></nav>';
    const trigger = widget.querySelector('button'), menu = widget.querySelector('nav');
    const guest = widget.querySelector('[data-account-guest]');
    guest.href = authUrl();
    widget.querySelector('[data-account-profile]').href = site('profile/');
    widget.querySelector('[data-account-game]').href = site('game.html');
    const mobileItem = document.createElement('li'); mobileItem.className = 'zh-account-mobile';
    const mobile = window.matchMedia('(max-width: 900px)');
    function placeWidget() {
        if (!header) return;
        if (mobile.matches) {
            header.querySelector('.nav-menu').append(mobileItem); mobileItem.append(widget);
        } else {
            header.querySelector('.header-controls').prepend(widget); mobileItem.remove();
        }
    }
    placeWidget(); mobile.addEventListener('change', placeWidget);
    function closeMenu(focus = false) {
        menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
        if (focus && !trigger.hidden) trigger.focus();
    }
    trigger.addEventListener('click', () => {
        menu.hidden = !menu.hidden; trigger.setAttribute('aria-expanded', String(!menu.hidden));
    });
    trigger.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown') { event.preventDefault(); menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); menu.querySelector('a').focus(); }
    });
    document.addEventListener('click', event => { if (!widget.contains(event.target)) closeMenu(); });
    widget.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(true); } });
    const bindText = (scope = document) => {
        scope.querySelectorAll('[data-account-i18n]').forEach(node => language.bind(node, node.dataset.accountI18n));
        scope.querySelectorAll('[data-account-label]').forEach(node => language.bind(node, node.dataset.accountLabel, {}, 'aria-label'));
    };
    let accountStatus = '';
    const params = new URLSearchParams(location.search);
    const mode = ['register', 'forgot'].includes(params.get('mode')) ? params.get('mode') : 'login';
    const next = safeNext(params.get('next'));
    const form = document.getElementById('zh-account-form');
    const profile = document.getElementById('zh-profile');
    function setMessage(key) {
        accountStatus = key;
        const message = document.getElementById('account-status');
        if (message) { message.hidden = !key; if (key) language.bind(message, key); }
    }
    function render(state) {
        const signedIn = !!state.userId && ['member', 'nameRequired'].includes(state.status);
        guest.hidden = signedIn; trigger.hidden = !signedIn;
        const name = widget.querySelector('[data-account-name]');
        name.textContent = state.displayName || language.t('account.title');
        trigger.setAttribute('aria-label', language.t('account.menuLabel', { name: state.displayName || language.t('account.title') }));
        if (!signedIn) closeMenu();
        if (profile) {
            profile.dataset.identityState = state.status;
            document.getElementById('profile-details').hidden = !signedIn;
            const gate = document.getElementById('profile-gate');
            gate.hidden = signedIn;
            language.bind(document.getElementById('profile-gate-message'), state.status === 'guest' ? 'account.profileGuest' : 'identity.' + state.status);
            document.getElementById('profile-name-missing').hidden = state.status !== 'nameRequired';
            document.getElementById('profile-display-name').textContent = state.displayName || '—';
            const created = document.getElementById('profile-created-at');
            created.textContent = state.createdAt ? new Intl.DateTimeFormat(language.locale,
                { dateStyle: 'long', timeZone: 'Europe/Berlin' }).format(new Date(state.createdAt)) : '—';
            created.setAttribute('datetime', state.createdAt || '');
        }
        if (form && signedIn && mode !== 'forgot') {
            setMessage('account.redirecting');
            location.replace(next);
        }
    }
    async function bootstrap() {
        await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', () => !!window.supabase?.createClient);
        window.zhSupabaseClient ||= window.supabase.createClient(config.url, config.key);
        window.ZHPasswordReset?.connect(window.zhSupabaseClient);
        if (form && mode === 'register') {
            await loadScript(site('assets/js/legal.js?v=20261008-legal1'), () => !!window.ZHLegal);
        }
        await loadScript(site('assets/js/identity.js?v=20261008-account1'), () => !!window.ZHIdentity);
        window.ZHIdentity.subscribe(render);
        return window.ZHIdentity;
    }
    const ready = Promise.resolve().then(bootstrap);
    window.ZHAccount = Object.freeze({ config, authUrl, safeNext, ready });
    ready.catch(() => {
        setMessage('account.unavailable');
        window.ZHPasswordReset?.unavailable();
        if (profile) language.bind(document.getElementById('profile-gate-message'), 'account.unavailable');
    });
    widget.querySelector('[data-account-logout]').addEventListener('click', async event => {
        const button = event.currentTarget, note = widget.querySelector('.zh-account-error');
        button.disabled = true; note.hidden = true;
        try { const identity = await ready; const result = await identity.client.auth.signOut(); if (result.error) throw result.error; }
        catch (_) { language.bind(note, 'account.logoutFailed'); note.hidden = false; }
        finally { button.disabled = false; }
    });
    document.querySelectorAll('[data-central-auth]').forEach(link => {
        link.href = authUrl(link.dataset.centralAuth, link.dataset.accountNext || location.href);
    });
    if (form) {
        document.getElementById('account-register-fields').hidden = mode !== 'register';
        document.getElementById('account-password-repeat-field').hidden = mode !== 'register';
        document.getElementById('account-consent-fields').hidden = mode !== 'register';
        document.getElementById('account-consent').checked = false;
        form.querySelectorAll('[data-registration-only]').forEach(input => { input.disabled = mode !== 'register'; input.required = mode === 'register'; });
        const password = document.getElementById('account-password');
        document.getElementById('account-password-field').hidden = mode === 'forgot';
        password.disabled = mode === 'forgot'; password.required = mode !== 'forgot';
        document.getElementById('account-forgot-password').hidden = mode !== 'login';
        document.getElementById('account-forgot-password').href = authUrl('forgot', next);
        document.getElementById('account-intro-copy').dataset.accountI18n = mode === 'forgot' ? 'recovery.requestIntro' : 'account.intro';
        password.autocomplete = mode === 'register' ? 'new-password' : 'current-password';
        password.minLength = mode === 'register' ? 6 : 1;
        const heading = document.getElementById('account-heading');
        const titleKey = mode === 'forgot' ? 'recovery.requestTitle' : mode === 'register' ? 'account.registerTitle' : 'account.loginTitle';
        language.bind(heading, titleKey);
        language.bind(document.querySelector('title'), titleKey);
        const submit = form.querySelector('[type="submit"]');
        language.bind(submit, mode === 'forgot' ? 'recovery.sendLink' : mode === 'register' ? 'account.register' : 'account.signIn');
        const other = document.getElementById('account-other-mode');
        other.href = authUrl(mode === 'register' ? 'login' : 'register', next);
        if (mode === 'forgot') other.href = authUrl('login', next);
        language.bind(other, mode === 'forgot' ? 'recovery.backToSignIn' : mode === 'register' ? 'account.alreadyRegistered' : 'account.needAccount');
        form.addEventListener('submit', async event => {
            event.preventDefault(); if (form.dataset.busy === 'true') return;
            if (mode === 'register' && !document.getElementById('account-consent').checked) {
                setMessage('legal.acceptanceRequired'); document.getElementById('account-consent').focus(); return;
            }
            if (!form.reportValidity()) return;
            form.dataset.busy = 'true'; submit.disabled = true; setMessage('account.working');
            let attempted = false;
            try {
                const identity = await ready;
                const email = document.getElementById('account-email').value.trim();
                if (mode === 'forgot') {
                    const result = await identity.client.auth.resetPasswordForEmail(email, { redirectTo: site('account/reset-password/') });
                    if (result.error && result.error.code !== 'user_not_found') throw result.error;
                    setMessage('recovery.sent');
                    return;
                }
                const credentials = { email, password: password.value };
                if (mode === 'register') {
                    const name = document.getElementById('account-display-name').value.trim();
                    if (!identity.validName(name)) { setMessage('account.nameInvalid'); return; }
                    if (password.value !== document.getElementById('account-password-repeat').value) { setMessage('account.passwordMismatch'); return; }
                    await window.ZHLegal.verifyRegistration(identity.client);
                    attempted = true;
                    const result = await identity.client.auth.signUp({ ...credentials, options: { data: { display_name: name, ...window.ZHLegal.signupData() } } });
                    if (result.error) throw result.error;
                    if (result.data.session) {
                        const resolved = await identity.resolve();
                        if (resolved.status === 'unavailable') setMessage('account.unavailable');
                    }
                    else setMessage('account.checkMail');
                } else {
                    attempted = true;
                    const result = await identity.client.auth.signInWithPassword(credentials);
                    if (result.error) throw result.error;
                    const resolved = await identity.resolve();
                    if (resolved.status === 'unavailable') setMessage('account.unavailable');
                }
            } catch (error) {
                const legalError = ['legal.registrationUnavailable', 'legal.versionChanged'].includes(error?.message);
                const key = legalError ? error.message : error?.code === 'invalid_credentials' ? 'account.invalidCredentials' :
                    error?.code === 'email_not_confirmed' ? 'account.emailUnconfirmed' :
                    error?.code === 'weak_password' ? 'account.weakPassword' : 'account.requestFailed';
                setMessage(key);
            } finally {
                if (attempted) { password.value = ''; document.getElementById('account-password-repeat').value = ''; }
                form.dataset.busy = 'false'; submit.disabled = false;
            }
        });
    }
    if (profile) language.bind(document.querySelector('title'), 'account.profileTitle');
    bindText();
    document.addEventListener('zh:languagechange', () => {
        if (window.ZHIdentity) render(window.ZHIdentity.state);
        if (accountStatus) setMessage(accountStatus);
    });
})();
