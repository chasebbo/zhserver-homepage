/* Recovery UI only. The shared account bootstrap supplies the existing client. */
(() => {
    'use strict';
    const form = document.getElementById('zh-password-reset-form');
    if (!form || window.ZHPasswordReset) return;
    const language = window.ZHLanguage;
    const root = new URL('../../', document.currentScript.src);
    const fragment = new URLSearchParams(location.hash.slice(1));
    const query = new URLSearchParams(location.search);
    const callbackPresent = (fragment.get('type') === 'recovery' && fragment.has('access_token')) || query.has('code');
    const callbackError = ['error', 'error_code', 'error_description'].some(key => fragment.has(key) || query.has(key));
    const note = document.getElementById('password-reset-status');
    const password = document.getElementById('password-reset-new');
    const repeat = document.getElementById('password-reset-repeat');
    const save = form.querySelector('[type="submit"]');
    const login = document.getElementById('password-reset-login');
    const finish = document.getElementById('password-reset-finish');
    let client, active = false, principal = null, revision = 0;
    let status = 'checking', message = 'recovery.checking', changed = false;
    function cleanCallback() {
        // Do not keep credentials, authorization codes or raw errors in history.
        if (location.search || location.hash) history.replaceState(history.state, '', location.pathname);
    }
    function render(next = status, key = message) {
        status = next; message = key;
        form.dataset.recoveryState = status;
        form.hidden = !['ready', 'saving'].includes(status);
        save.disabled = status !== 'ready';
        password.disabled = repeat.disabled = status !== 'ready';
        login.hidden = status !== 'success';
        finish.hidden = status !== 'logoutPending';
        finish.disabled = status === 'finishing';
        language.bind(note, message);
    }
    function invalidate(key = 'recovery.invalidLink') {
        ++revision; active = false; principal = null;
        password.value = repeat.value = '';
        cleanCallback(); render('invalid', key);
    }
    async function verifiedSession() {
        const result = await client.auth.getSession();
        const session = result.data?.session;
        if (result.error || !session || session.user?.is_anonymous ||
            !Number.isFinite(session.expires_at) || session.expires_at * 1000 <= Date.now()) {
            throw new Error('recovery.invalidLink');
        }
        const verified = await client.auth.getUser(session.access_token);
        if (verified.error || !verified.data.user || verified.data.user.is_anonymous) throw new Error('recovery.invalidLink');
        const current = await client.auth.getSession();
        if (current.error || current.data.session?.access_token !== session.access_token ||
            (principal && principal !== verified.data.user.id)) throw new Error('recovery.sessionChanged');
        return verified.data.user.id;
    }
    async function checkRecovery() {
        if (!active || changed || status === 'saving') return;
        const ticket = ++revision;
        try {
            const userId = await verifiedSession();
            if (ticket !== revision || !active) return;
            principal = userId; cleanCallback(); render('ready', 'recovery.ready');
        } catch (error) {
            if (ticket === revision) invalidate(error.message === 'recovery.sessionChanged' ? error.message : 'recovery.invalidLink');
        }
    }
    function connect(sharedClient) {
        if (client) return;
        client = sharedClient;
        // Registered immediately after createClient, before URL initialization completes.
        client.auth.onAuthStateChange((event, session) => {
            if (changed) return;
            if (event === 'PASSWORD_RECOVERY') {
                if (!callbackPresent || callbackError) return;
                active = true;
                setTimeout(checkRecovery, 0);
            } else if (event === 'SIGNED_OUT' && active) {
                invalidate('recovery.sessionChanged');
            } else if (active && ['SIGNED_IN', 'INITIAL_SESSION', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
                if (principal && session?.user?.id !== principal) invalidate('recovery.sessionChanged');
                else if (status !== 'saving') setTimeout(checkRecovery, 0);
            }
            // No asynchronous Auth call under the auth-state callback's SDK lock.
        });
        client.auth.initialize().then(result => {
            if (result.error || callbackError) invalidate();
            else setTimeout(() => { if (!active && status === 'checking') invalidate(); }, 0);
        }).catch(() => invalidate());
    }
    async function endRecoverySession() {
        finish.disabled = true;
        try {
            const result = await client.auth.signOut({ scope: 'local' });
            if (result.error) throw result.error;
            render('success', 'recovery.changed');
        } catch (_) { render('logoutPending', 'recovery.logoutPending'); }
        finally { finish.disabled = false; }
    }
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (status !== 'ready' || !active || !principal || !form.reportValidity()) return;
        if (password.value !== repeat.value) { render('ready', 'account.passwordMismatch'); repeat.focus(); return; }
        const ticket = ++revision;
        render('saving', 'recovery.saving');
        try {
            await verifiedSession();
            if (ticket !== revision || !active) return;
            const result = await client.auth.updateUser({ password: password.value });
            if (result.error) throw result.error;
            if (ticket !== revision || !active) return;
            changed = true; active = false; principal = null;
            password.value = repeat.value = '';
            cleanCallback(); render('finishing', 'recovery.saving');
            await endRecoverySession();
        } catch (error) {
            if (ticket !== revision) return;
            const expired = error?.name === 'AuthSessionMissingError' || error?.status === 401 ||
                ['session_not_found', 'refresh_token_not_found', 'refresh_token_already_used',
                    'bad_jwt', 'invalid_jwt', 'otp_expired', 'reauthentication_needed', 'reauthentication_not_valid'].includes(error?.code);
            if (expired || error?.message === 'recovery.invalidLink' || error?.message === 'recovery.sessionChanged') {
                invalidate(error?.message === 'recovery.sessionChanged' ? error.message : 'recovery.invalidLink');
            } else {
                render('ready', error?.code === 'same_password' ? 'recovery.samePassword' :
                    error?.code === 'weak_password' ? 'recovery.weakPassword' : 'recovery.requestFailed');
            }
        }
    });
    finish.addEventListener('click', () => { if (changed && status === 'logoutPending') void endRecoverySession(); });
    login.href = new URL('account/', root).href;
    document.getElementById('password-reset-request').href = new URL('account/?mode=forgot', root).href;
    document.querySelectorAll('[data-account-i18n]').forEach(node => language.bind(node, node.dataset.accountI18n));
    language.bind(document.querySelector('title'), 'recovery.setTitle');
    document.addEventListener('zh:languagechange', () => render());
    window.ZHPasswordReset = Object.freeze({ connect, unavailable: () => invalidate('account.unavailable') });
    render();
})();
