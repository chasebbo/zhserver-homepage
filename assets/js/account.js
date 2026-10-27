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
    // Prepared editor stays inactive until game nickname references are separated from UUIDs.
    // Keep the installed own-profile RPC; this is a UI gate, not an authorization rule.
    const nameEditingEnabled = false;
    const site = path => new URL(path, root).href;
    const allowed = new Set(['', 'index.html', 'game.html', 'game-test-v129.html', 'gallery.html', 'wiki.html', 'forum/',
        'forum/index.html', 'arma/', 'arma/index.html', 'bugs/', 'bugs/index.html', 'profile/', 'profile/index.html',
        'admin/', 'admin/index.html']);
    // Allowed targets that need more than a signed-in account. They are reached after sign-in only when
    // the existing server role check passes; otherwise the start page is used.
    const restricted = new Set(['admin/', 'admin/index.html']);
    const pagePath = href => new URL(href).pathname.slice(root.pathname.length);
    function safeNext(value) {
        try {
            const url = new URL(value || '', root);
            if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname) || url.username || url.password ||
                !allowed.has(url.pathname.slice(root.pathname.length)) ||
                ['access_token', 'refresh_token', 'code', 'token_hash'].some(key => url.searchParams.has(key)) ||
                /(?:^|[&#?])(?:access_token|refresh_token|code|token_hash)=/i.test(decodeURIComponent(url.hash))) return site('');
            return url.href;
        } catch (_) { return site(''); }
    }
    // Header links never carry a restricted page: after a sign-out there, the next account may lack the role.
    const headerNext = () => restricted.has(pagePath(location.href)) ? site('') : location.href;
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
            if (created) {
                script.src = src;
                if (src === 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0') {
                    script.integrity = 'sha384-UagCvVPT5XXA0Hx+nJYUAGBFseHT9zBgpJMSebsAxl9lciTwbT+39j5VfRjdP5Tp';
                    script.crossOrigin = 'anonymous';
                }
                document.body.append(script);
            }
        });
    }
    const cssUrl = site('assets/css/account.css?v=20261027-google1');
    if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(node => node.href === cssUrl)) {
        const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = cssUrl;
        document.head.append(css);
    }
    const header = document.querySelector('.header.zh-site-header');
    const widget = document.createElement('div');
    widget.className = 'zh-account'; widget.setAttribute('data-i18n-ignore', '');
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>';
    widget.innerHTML = '<a class="zh-account-guest" data-account-guest>' + icon + '<span data-account-i18n="account.signIn"></span></a>' +
        '<a class="zh-account-register" data-account-register><span data-account-i18n="account.register"></span></a>' +
        '<button type="button" class="zh-account-trigger" aria-expanded="false" aria-controls="zh-account-menu" hidden>' + icon + '<span data-account-name></span><span class="zh-account-chevron" aria-hidden="true">⌄</span></button>' +
        '<nav class="zh-account-menu" id="zh-account-menu" hidden><a data-account-profile data-account-i18n="account.myProfile"></a><a data-account-admin data-account-i18n="account.adminArea" hidden></a><a data-account-game data-account-i18n="account.toGame"></a><button type="button" data-account-logout data-account-i18n="account.signOut"></button><p class="zh-account-error" role="status" hidden></p></nav>';
    const trigger = widget.querySelector('button'), menu = widget.querySelector('nav');
    const guest = widget.querySelector('[data-account-guest]');
    const register = widget.querySelector('[data-account-register]');
    guest.href = authUrl('login', headerNext());
    register.href = authUrl('register', headerNext());
    widget.querySelector('[data-account-profile]').href = site('profile/');
    widget.querySelector('[data-account-game]').href = site('game.html');
    const mobileItem = document.createElement('li'); mobileItem.className = 'zh-account-mobile';
    // On small screens the signed-in disclosure stays in the menu; both guest links stay in the header.
    const quickActions = document.createElement('div'); quickActions.className = 'zh-account-quick-actions';
    const quickLogin = document.createElement('a'); quickLogin.className = 'zh-account-quick-login';
    quickLogin.href = authUrl('login', headerNext()); quickLogin.setAttribute('data-i18n-ignore', ''); language.bind(quickLogin, 'account.signIn');
    const quickRegister = document.createElement('a');
    quickRegister.className = 'zh-account-quick-register'; quickRegister.href = authUrl('register', headerNext());
    quickRegister.setAttribute('data-i18n-ignore', ''); language.bind(quickRegister, 'account.register');
    quickActions.append(quickLogin, quickRegister);
    const mobile = window.matchMedia('(max-width: 900px)');
    function placeWidget() {
        if (!header) return;
        if (mobile.matches) {
            header.querySelector('.nav-menu').append(mobileItem); mobileItem.append(widget);
            header.querySelector('.header-brand-row').append(quickActions);
        } else {
            header.querySelector('.header-controls').prepend(widget); mobileItem.remove(); quickActions.remove();
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
    // Confirmation links and Google sign-in return to this page. Read the result before the SDK consumes the URL hash.
    const landing = form ? (() => {
        const hash = new URLSearchParams(location.hash.slice(1));
        const code = hash.get('error_code') || params.get('error_code');
        const error = hash.get('error') || params.get('error');
        if (code || error) {
            const clean = new URL(location.href); clean.hash = '';
            ['error', 'error_code', 'error_description'].forEach(key => clean.searchParams.delete(key));
            history.replaceState(history.state, '', clean.href);
            // Only an expired or used email link offers a new link. Everything else came from Google.
            if (code === 'otp_expired') return { failed: code };
            return { google: error === 'access_denied' ? 'google.cancelled' : 'google.failed' };
        }
        return hash.get('type') === 'signup' && hash.has('access_token') ? { confirmed: true } : null;
    })() : null;
    const profile = document.getElementById('zh-profile');
    const nameForm = document.getElementById('profile-name-form');
    const nameInput = document.getElementById('profile-name-input');
    if (nameForm) nameForm.hidden = !nameEditingEnabled;
    let profileOwner = null, profileRead = 0, profileStatus = '';
    let adminState = null, adminRead = 0;
    function renderAdminLinks(state, signedIn) {
        if (adminState === state) return;
        adminState = state;
        const ticket = ++adminRead;
        const links = [...document.querySelectorAll('[data-account-admin]')];
        links.forEach(link => { link.href = site('admin/'); link.hidden = true; });
        if (!signedIn) return;
        ready.then(async identity => {
            await loadScript(site('admin/access.js?v=20261012-central-role2'), () => !!window.ZHAdminAccess);
            const allowed = await window.ZHAdminAccess.require(identity.client, { redirect: false });
            const current = await identity.client.auth.getSession();
            if (ticket !== adminRead || identity.state !== state || current.error ||
                current.data.session?.user?.id !== state.userId) return;
            links.forEach(link => { link.hidden = !allowed; });
        }).catch(() => { /* Unverified role never exposes an admin shortcut. */ });
    }
    function setMessage(key) {
        accountStatus = key;
        const message = document.getElementById('account-status');
        if (message) {
            message.hidden = !key;
            message.dataset.tone = ['account.working', 'account.redirecting', 'account.checkMail', 'recovery.sent', 'confirm.resent', 'google.redirecting'].includes(key) ? 'info' : 'error';
            if (key) language.bind(message, key);
        }
    }
    function authErrorKey(error, fallback) {
        if (error?.message === 'turnstile.failed' || error?.code === 'captcha_failed') return 'turnstile.failed';
        if (error?.status === 429 || ['over_email_send_rate_limit', 'over_request_rate_limit'].includes(error?.code)) return 'confirm.wait';
        return fallback;
    }
    // Email confirmation: pending after sign-up, expired or used link, confirmed landing.
    const confirmPanel = document.getElementById('account-confirm');
    let confirmEmail = '', confirmCaptcha = null, resendTimer = 0;
    function setConfirmStatus(key) {
        const status = document.getElementById('account-confirm-status');
        status.hidden = !key;
        status.dataset.tone = ['account.working', 'confirm.resent', 'confirm.done'].includes(key) ? 'info' : 'error';
        if (key) language.bind(status, key);
    }
    function showConfirm(view, email = '') {
        if (!confirmPanel || confirmPanel.dataset.view === view) return;
        confirmPanel.dataset.view = view; confirmEmail = email;
        form.hidden = true; confirmPanel.hidden = false;
        document.getElementById('account-oauth').hidden = true;
        const text = document.getElementById('account-confirm-text');
        text.hidden = view !== 'pending';
        if (view === 'pending') language.bind(text, 'confirm.sent', { email });
        document.getElementById('account-confirm-title').hidden = view === 'confirmed';
        document.getElementById('account-confirm-hint').hidden = view !== 'pending';
        document.getElementById('account-confirm-email-field').hidden = view !== 'expired';
        const resend = document.getElementById('account-confirm-resend');
        resend.hidden = view === 'confirmed'; resend.className = view === 'expired' ? 'btn btn-gold' : 'btn btn-outline';
        document.getElementById('account-confirm-continue').hidden = view !== 'confirmed';
        document.getElementById('account-other-mode').hidden = view === 'confirmed';
        setConfirmStatus(view === 'expired' ? 'confirm.expired' : view === 'confirmed' ? 'confirm.done' : '');
        if (view !== 'confirmed') confirmCaptcha ||= window.ZHTurnstile?.create(document.getElementById('account-confirm-turnstile'), language.language) || null;
    }
    async function resendConfirmation(email, captcha, report, button) {
        if (!email) { report('account.emailInvalid'); return; }
        button.disabled = true; report('account.working');
        let sent = false;
        try {
            const identity = await ready;
            const captchaToken = await captcha?.token();
            const result = await identity.client.auth.resend({ type: 'signup', email, options: { emailRedirectTo: authUrl('login', next), captchaToken } });
            if (result.error) throw result.error;
            sent = true; report('confirm.resent');
        } catch (error) {
            report(authErrorKey(error, 'account.requestFailed'));
        } finally {
            captcha?.reset();
            // Supabase allows one confirmation mail per address and minute.
            clearTimeout(resendTimer);
            if (sent) resendTimer = setTimeout(() => { button.disabled = false; }, 60000);
            else button.disabled = false;
        }
    }
    function setProfileMessage(key) {
        profileStatus = key;
        const message = document.getElementById('profile-save-status');
        if (!message) return;
        message.hidden = !key;
        message.dataset.tone = ['account.working', 'account.nameSaved'].includes(key) ? 'info' : 'error';
        if (key) language.bind(message, key);
    }
    async function readPrivateAccount(state) {
        const ticket = ++profileRead;
        try {
            const identity = await ready;
            const session = await identity.client.auth.getSession();
            if (session.error || !session.data.session) throw new Error();
            const verified = await identity.client.auth.getUser(session.data.session.access_token);
            const current = await identity.client.auth.getSession();
            if (verified.error || current.error) throw new Error();
            if (ticket !== profileRead || identity.state.userId !== state.userId || verified.data.user?.id !== state.userId ||
                current.data.session?.access_token !== session.data.session.access_token) return;
            if (verified.data.user.is_anonymous) throw new Error();
            // Auth returns only this signed-in owner's email. It never enters public identity state or RPCs.
            const email = verified.data.user.email;
            document.getElementById('profile-email').textContent = typeof email === 'string' ? email : '—';
            language.bind(document.getElementById('profile-account-status'), 'account.active');
        } catch (_) {
            if (ticket !== profileRead || window.ZHIdentity?.state.userId !== state.userId) return;
            document.getElementById('profile-email').textContent = '—';
            language.bind(document.getElementById('profile-account-status'), 'account.statusUnavailable');
            if (!profileStatus) setProfileMessage('account.profileUnavailable');
        }
    }
    function render(state) {
        const signedIn = !!state.userId && ['member', 'nameRequired'].includes(state.status);
        renderAdminLinks(state, signedIn);
        guest.hidden = signedIn; register.hidden = signedIn; quickActions.hidden = signedIn; trigger.hidden = !signedIn;
        if (signedIn) window.ZHWelcome?.close();
        // A pending Google account finishes terms, rules and name before using its profile.
        const profileLink = widget.querySelector('[data-account-profile]');
        profileLink.href = state.consentPending ? window.ZHIdentity.finishUrl(location.href) : site('profile/');
        language.bind(profileLink, state.consentPending ? 'consent.finish' : 'account.myProfile');
        if (profile && state.consentPending) { leaveForFinish(site('profile/')); return; }
        const name = widget.querySelector('[data-account-name]');
        name.textContent = state.displayName || language.t('account.title');
        trigger.setAttribute('aria-label', language.t('account.menuLabel', { name: state.displayName || language.t('account.title') }));
        if (!signedIn) closeMenu();
        if (profile) {
            const ownerChanged = profileOwner !== state.userId;
            if (ownerChanged || !signedIn) {
                ++profileRead; profileOwner = state.userId;
                document.getElementById('profile-email').textContent = '—';
                const status = document.getElementById('profile-account-status');
                language.bind(status, 'account.statusUnavailable');
                setProfileMessage('');
                nameInput.value = ''; nameInput.dataset.dirty = 'false';
            }
            profile.dataset.identityState = state.status;
            document.getElementById('profile-details').hidden = !signedIn;
            const gate = document.getElementById('profile-gate');
            gate.hidden = signedIn;
            language.bind(document.getElementById('profile-gate-message'), state.status === 'guest' ? 'account.profileGuest' : 'identity.' + state.status);
            document.getElementById('profile-name-missing').hidden = state.status !== 'nameRequired';
            language.bind(document.getElementById('profile-name-missing'), nameEditingEnabled ? 'account.nameMissing' : 'account.nameEditingPending');
            document.getElementById('profile-display-name').textContent = state.displayName || '—';
            const created = document.getElementById('profile-created-at');
            created.textContent = state.createdAt ? new Intl.DateTimeFormat(language.locale,
                { dateStyle: 'long', timeZone: 'Europe/Berlin' }).format(new Date(state.createdAt)) : '—';
            created.setAttribute('datetime', state.createdAt || '');
            if (ownerChanged || nameInput.dataset.dirty !== 'true') nameInput.value = state.displayName || '';
            nameInput.disabled = !nameEditingEnabled || !signedIn || nameForm.dataset.busy === 'true';
            nameForm.querySelector('[type="submit"]').disabled = !nameEditingEnabled || !signedIn || nameForm.dataset.busy === 'true';
            if (signedIn) readPrivateAccount(state);
        }
        if (form && signedIn && mode !== 'forgot') {
            if (state.consentPending) { setMessage('account.redirecting'); leaveForFinish(next); }
            else if (landing?.confirmed) showConfirm('confirmed');
            else { setMessage('account.redirecting'); void redirectAfterSignIn(state); }
        }
    }
    // Several identity updates arrive while the page is left; navigate only once.
    let finishing = false;
    function leaveForFinish(target) {
        if (finishing) return;
        finishing = true; location.replace(window.ZHIdentity.finishUrl(target));
    }
    let redirectRead = 0;
    async function redirectAfterSignIn(state) {
        const ticket = ++redirectRead;
        let target = next;
        if (restricted.has(pagePath(next))) {
            let permitted = false;
            try {
                const identity = await ready;
                await loadScript(site('admin/access.js?v=20261012-central-role2'), () => !!window.ZHAdminAccess);
                permitted = await window.ZHAdminAccess.require(identity.client, { redirect: false });
            } catch (_) { permitted = false; }
            // A later sign-in or account switch on this page decides again for its own account.
            if (ticket !== redirectRead || window.ZHIdentity?.state.userId !== state.userId) return;
            if (!permitted) target = site('');
        }
        location.replace(target);
    }
    // First-visit welcome for guests on content pages only. A local flag (never a cookie) stops repeats;
    // without any usable browser storage the welcome is skipped rather than shown on every page.
    const welcomeKey = 'zh_welcome_seen_v1';
    const welcomePages = new Set(['', 'index.html', 'gallery.html', 'forum/', 'forum/index.html', 'bugs/', 'bugs/index.html',
        'arma/', 'arma/index.html', 'game-development.html']);
    let welcomeTimer = 0, welcomeShown = false;
    function welcomeStore() {
        for (const name of ['localStorage', 'sessionStorage']) {
            try {
                const store = window[name];
                store.setItem('zh_storage_probe', '1'); store.removeItem('zh_storage_probe');
                return store;
            } catch (_) { /* Try the next storage area. */ }
        }
        return null;
    }
    function scheduleWelcome(state) {
        clearTimeout(welcomeTimer);
        if (welcomeShown || state.status !== 'guest' || form || profile) return;
        if (!welcomePages.has(location.pathname.slice(root.pathname.length))) return;
        const store = welcomeStore();
        if (!store || store.getItem(welcomeKey)) return;
        welcomeTimer = setTimeout(async () => {
            if (window.ZHIdentity?.state.status !== 'guest' || store.getItem(welcomeKey)) return;
            try {
                await loadScript(site('assets/js/welcome.js?v=20261014-welcome2'), () => !!window.ZHWelcome);
                welcomeShown = await window.ZHWelcome.open({
                    cssUrl: site('assets/css/welcome.css?v=20261014-welcome2'),
                    registerUrl: authUrl('register'),
                    loginUrl: authUrl('login'),
                    remember: () => { try { store.setItem(welcomeKey, new Date().toISOString().slice(0, 10)); } catch (_) { /* Optional. */ } }
                });
            } catch (_) { /* The welcome is optional and never blocks the page. */ }
        }, 1400);
    }
    async function bootstrap() {
        await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0', () => !!window.supabase?.createClient);
        window.zhSupabaseClient ||= window.supabase.createClient(config.url, config.key);
        window.ZHPasswordReset?.connect(window.zhSupabaseClient);
        if (form && mode === 'register') {
            await loadScript(site('assets/js/legal.js?v=20261008-legal1'), () => !!window.ZHLegal);
        }
        await loadScript(site('assets/js/identity.js?v=20261027-google1'), () => !!window.ZHIdentity);
        window.ZHIdentity.subscribe(render);
        window.ZHIdentity.subscribe(scheduleWelcome);
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
    if (nameForm) {
        nameInput.addEventListener('input', () => { nameInput.dataset.dirty = 'true'; });
        nameForm.addEventListener('invalid', () => setProfileMessage('account.nameInvalid'), true);
        nameForm.addEventListener('submit', async event => {
            event.preventDefault();
            if (!nameEditingEnabled) return;
            if (nameForm.dataset.busy === 'true' || !nameForm.reportValidity()) return;
            const value = nameInput.value, owner = window.ZHIdentity?.state.userId;
            if (!window.ZHIdentity?.validName(value)) { setProfileMessage('account.nameInvalid'); return; }
            nameForm.dataset.busy = 'true'; nameInput.disabled = true;
            nameForm.querySelector('[type="submit"]').disabled = true;
            setProfileMessage('account.working');
            try {
                const identity = await ready;
                await identity.updateDisplayName(value);
                if (identity.state.userId !== owner) return;
                nameInput.dataset.dirty = 'false'; nameInput.value = identity.state.displayName;
                setProfileMessage('account.nameSaved');
            } catch (error) {
                if (window.ZHIdentity?.state.userId !== owner) return;
                const known = ['account.nameInvalid', 'account.nameTaken', 'identity.sessionChanged', 'identity.signInRequired'];
                setProfileMessage(known.includes(error?.message) ? error.message : 'account.nameSaveFailed');
            } finally {
                nameForm.dataset.busy = 'false';
                if (window.ZHIdentity) render(window.ZHIdentity.state);
            }
        });
    }
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
        password.minLength = mode === 'register' ? 10 : 1;
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
        form.addEventListener('invalid', event => {
            setMessage(event.target.id === 'account-consent' ? 'legal.acceptanceRequired' :
                event.target.id === 'account-email' && event.target.validity.typeMismatch ? 'account.emailInvalid' :
                event.target === password && password.validity.tooShort ? 'account.passwordTooShort' : 'account.requiredFields');
        }, true);
        const formCaptcha = window.ZHTurnstile?.create(document.getElementById('account-turnstile'), language.language) || null;
        const resendButton = document.getElementById('account-resend');
        resendButton.addEventListener('click', () =>
            resendConfirmation(document.getElementById('account-email').value.trim(), formCaptcha, setMessage, resendButton));
        const confirmResend = document.getElementById('account-confirm-resend');
        confirmResend.addEventListener('click', () => {
            const email = confirmPanel.dataset.view === 'expired' ? document.getElementById('account-confirm-email').value.trim() : confirmEmail;
            resendConfirmation(email, confirmCaptcha, setConfirmStatus, confirmResend);
        });
        document.getElementById('account-confirm-continue').addEventListener('click', () => {
            if (window.ZHIdentity) void redirectAfterSignIn(window.ZHIdentity.state);
        });
        if (landing?.failed) showConfirm('expired');
        // Google: same account flow for sign-in and sign-up. A new account completes terms, rules and name afterwards.
        const oauth = document.getElementById('account-oauth');
        const google = document.getElementById('account-google');
        oauth.hidden = mode === 'forgot' || !!landing?.failed;
        language.bind(google.querySelector('span'), mode === 'register' ? 'google.signUp' : 'google.signIn');
        document.getElementById('account-oauth-note').hidden = mode !== 'register';
        if (landing?.google) setMessage(landing.google);
        google.addEventListener('click', async () => {
            if (form.dataset.busy === 'true') return;
            form.dataset.busy = 'true'; google.disabled = true; resendButton.hidden = true; setMessage('google.redirecting');
            try {
                const identity = await ready;
                const result = await identity.client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: authUrl('login', next) } });
                if (result.error) throw result.error;
                // The SDK now leaves this page for Google.
            } catch (_) {
                setMessage('google.failed');
                form.dataset.busy = 'false'; google.disabled = false;
            }
        });
        form.addEventListener('submit', async event => {
            event.preventDefault(); if (form.dataset.busy === 'true') return;
            resendButton.hidden = true;
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
                    const captchaToken = await formCaptcha?.token();
                    const result = await identity.client.auth.resetPasswordForEmail(email, { redirectTo: site('account/reset-password/'), captchaToken });
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
                    const captchaToken = await formCaptcha?.token();
                    attempted = true;
                    // The language only selects the text of the confirmation mail.
                    const result = await identity.client.auth.signUp({ ...credentials, options: { emailRedirectTo: authUrl('login', next), captchaToken,
                        data: { display_name: name, language: language.language, ...window.ZHLegal.signupData() } } });
                    if (result.error) throw result.error;
                    if (result.data.session) {
                        const resolved = await identity.resolve();
                        if (resolved.status === 'unavailable') setMessage('account.unavailable');
                    }
                    else { setMessage(''); showConfirm('pending', email); }
                } else {
                    const captchaToken = await formCaptcha?.token();
                    attempted = true;
                    const result = await identity.client.auth.signInWithPassword({ ...credentials, options: { captchaToken } });
                    if (result.error) throw result.error;
                    const resolved = await identity.resolve();
                    if (resolved.status === 'unavailable') setMessage('account.unavailable');
                }
            } catch (error) {
                const legalError = ['legal.registrationUnavailable', 'legal.versionChanged'].includes(error?.message);
                const invalidCredentials = ['invalid_credentials', 'invalid_login_credentials', 'invalid_grant', 'user_not_found'].includes(error?.code) ||
                    /invalid login credentials/i.test(error?.message || '');
                const key = legalError ? error.message : invalidCredentials ? 'account.invalidCredentials' :
                    error?.code === 'email_not_confirmed' ? 'account.emailUnconfirmed' :
                    error?.code === 'weak_password' ? 'account.weakPassword' : authErrorKey(error, mode === 'login' ? 'account.loginFailed' : 'account.requestFailed');
                setMessage(key);
                resendButton.hidden = key !== 'account.emailUnconfirmed';
            } finally {
                formCaptcha?.reset();
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
        if (profileStatus) setProfileMessage(profileStatus);
    });
})();
