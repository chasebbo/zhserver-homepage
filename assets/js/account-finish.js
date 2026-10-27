/* Completes a pending Google account: terms, community rules and a public player name in one server call. */
(() => {
    'use strict';
    const form = document.getElementById('zh-finish-form');
    if (!form || !window.ZHAccount || !window.ZHLanguage) return;
    const language = window.ZHLanguage;
    const account = window.ZHAccount;
    // Same allow-list as every other sign-in target; anything else goes to the start page.
    const next = account.safeNext(new URLSearchParams(location.search).get('next'));
    const check = document.getElementById('finish-check');
    const signIn = document.getElementById('finish-signin');
    const nameInput = document.getElementById('finish-name');
    const consent = document.getElementById('finish-consent');
    const submit = document.getElementById('finish-submit');
    const cancel = document.getElementById('finish-cancel');
    const status = document.getElementById('finish-status');
    let statusKey = '', busy = false, leaving = false;
    language.bind(document.querySelector('title'), 'finish.pageTitle');
    nameInput.value = ''; consent.checked = false;
    function setStatus(key) {
        statusKey = key;
        status.hidden = !key;
        status.dataset.tone = ['account.working', 'finish.done', 'account.redirecting'].includes(key) ? 'info' : 'error';
        if (key) language.bind(status, key);
    }
    function render(state) {
        if (leaving) return;
        const pending = state.consentPending === true;
        const signedIn = !!state.userId && ['member', 'nameRequired'].includes(state.status);
        // Only a pending account fills in this page. A finished or older account simply continues.
        if (signedIn && !pending) { leaving = true; location.replace(next); return; }
        form.hidden = !pending;
        signIn.hidden = state.status !== 'guest';
        check.hidden = pending;
        if (!pending) language.bind(check, state.status === 'guest' ? 'finish.guest' :
            state.status === 'unavailable' ? 'account.unavailable' : 'finish.checking');
        submit.disabled = busy; cancel.disabled = busy; nameInput.disabled = busy; consent.disabled = busy;
    }
    // The browser reports every invalid field; the message names the first one.
    let reported = false;
    form.addEventListener('invalid', event => {
        if (reported) return;
        reported = true; setTimeout(() => { reported = false; }, 0);
        setStatus(event.target === consent ? 'legal.acceptanceRequired' : 'account.nameInvalid');
    }, true);
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (busy) return;
        const identity = window.ZHIdentity, owner = identity?.state.userId;
        const name = nameInput.value.trim();
        if (!identity?.validName(name)) { setStatus('account.nameInvalid'); nameInput.focus(); return; }
        if (!consent.checked) { setStatus('legal.acceptanceRequired'); consent.focus(); return; }
        busy = true; render(identity.state); setStatus('account.working');
        try {
            const ready = await account.ready;
            await window.ZHLegal.verifyRegistration(ready.client);
            const result = await ready.client.rpc('complete_zh_account_setup', { p_display_name: name, p_accepted: true,
                p_terms_version: window.ZHLegal.version, p_community_rules_version: window.ZHLegal.version });
            // Already completed in another tab counts as done.
            if (result.error && result.error.message !== 'legal.notPending') throw result.error;
            try { localStorage.setItem('zhserver_identity_revision', Date.now() + ':' + Math.random().toString(36).slice(2)); } catch (_) { /* Same-tab refresh still works. */ }
            setStatus('finish.done');
            const updated = await ready.resolve();
            if (updated.userId !== owner) throw new Error('identity.sessionChanged');
        } catch (error) {
            const known = ['account.nameInvalid', 'account.nameTaken', 'legal.acceptanceRequired', 'legal.versionChanged',
                'legal.registrationUnavailable', 'identity.signInRequired', 'identity.sessionChanged'];
            setStatus(known.includes(error?.message) ? error.message : 'finish.failed');
        } finally {
            busy = false;
            if (window.ZHIdentity) render(window.ZHIdentity.state);
        }
    });
    cancel.addEventListener('click', async () => {
        if (busy) return;
        busy = true; render(window.ZHIdentity?.state || { status: 'checking' });
        try {
            const ready = await account.ready;
            const result = await ready.client.auth.signOut();
            if (result.error) throw result.error;
            leaving = true; location.replace(new URL('../../', location.href).href);
        } catch (_) {
            setStatus('account.logoutFailed');
            busy = false; if (window.ZHIdentity) render(window.ZHIdentity.state);
        }
    });
    account.ready.then(identity => identity.subscribe(render)).catch(() => language.bind(check, 'account.unavailable'));
    document.addEventListener('zh:languagechange', () => { if (statusKey) setStatus(statusKey); });
})();
