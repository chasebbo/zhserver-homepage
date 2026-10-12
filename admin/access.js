/* Central server role verified through the existing Supabase session. */
(() => {
    'use strict';
    const login = new URL('index.html?status=denied', document.currentScript.src).href;
    const watched = new WeakSet();
    const pending = new WeakMap();
    const protectedPage = document.body.hasAttribute('data-zh-admin-protected');
    function hide() { document.body.removeAttribute('data-zh-admin-verified'); }
    function deny(redirect) { hide(); if (redirect) location.replace(login); return false; }
    async function requireAdmin(client, { redirect = true } = {}) {
        let verification = pending.get(client);
        if (!verification) {
            verification = verify(client); pending.set(client, verification);
        }
        const allowed = await verification;
        if (pending.get(client) === verification) pending.delete(client);
        return allowed || deny(redirect);
    }
    async function verify(client, retry = true) {
        try {
            const session = await client.auth.getSession();
            if (session.error || !session.data.session) return false;
            const verified = await client.auth.getUser(session.data.session.access_token);
            const current = await client.auth.getSession();
            if (verified.error || current.error || !verified.data.user?.id || verified.data.user.is_anonymous) return false;
            if (current.data.session?.access_token !== session.data.session.access_token) {
                return retry && current.data.session ? verify(client, false) : false;
            }
            const role = await client.rpc('get_zh_own_identity');
            if (role.error || !role.data || typeof role.data !== 'object') return false;
            const latest = await client.auth.getSession();
            if (latest.error || latest.data.session?.access_token !== session.data.session.access_token) {
                return retry && latest.data.session ? verify(client, false) : false;
            }
            const allowed = role.data.role_version === 1 && role.data.system_role === 'admin';
            if (!allowed) return false;
            if (protectedPage) document.body.setAttribute('data-zh-admin-verified', '');
            if (protectedPage && !watched.has(client)) {
                watched.add(client);
                client.auth.onAuthStateChange((_event, next) => {
                    hide();
                    if (!next) deny(true);
                    else setTimeout(() => requireAdmin(client), 0); // Keep SDK calls outside its Auth lock.
                });
            }
            return true;
        } catch (_) { return false; }
    }
    const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g,
        char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    window.ZHAdminAccess = Object.freeze({ require: requireAdmin, escapeHTML });
})();
