/* Forum/profile extension of the existing central Supabase client, never another login. */
(() => {
    'use strict';
    if (window.ZHForum) return;
    const identity = window.ZHIdentity;
    if (!identity) return;
    const client = identity.client;
    const allowedErrors = new Set(['identity.signInRequired', 'identity.nameRequired', 'identity.sessionChanged',
        'forum.invalid', 'forum.forbidden', 'forum.announcementsAdmin', 'forum.rateLimit', 'forum.topicClosed',
        'forum.notFound', 'forum.profileNotFound', 'forum.editConflict', 'forum.avatarInvalid']);
    async function rpc(name, args, write = false, expectedOwner = identity.state.userId) {
        const owner = write ? (await identity.forSubmission()).userId : null;
        if (write && !owner) throw new Error('identity.signInRequired');
        if (write && owner !== expectedOwner) throw new Error('identity.sessionChanged');
        let result;
        try { result = await client.rpc(name, args); } catch (_) { throw new Error('forum.networkError'); }
        if (result.error) throw new Error(allowedErrors.has(result.error.message) ? result.error.message : 'forum.networkError');
        if (write && identity.state.userId !== owner) throw new Error('identity.sessionChanged');
        if (!result.data || typeof result.data !== 'object') throw new Error('forum.networkError');
        return result.data;
    }
    function avatarUrl(path) {
        if (typeof path !== 'string' || !/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|png|jpg)$/.test(path)) return null;
        return client.storage.from('zh-avatars').getPublicUrl(path).data.publicUrl;
    }
    function avatar(profile, linked = false) {
        const node = document.createElement(linked && profile?.user_id ? 'a' : 'span');
        node.className = 'zh-public-avatar';
        node.setAttribute('data-i18n-ignore', '');
        if (node.tagName === 'A') { node.href = '#profile/' + profile.user_id; node.setAttribute('aria-label', profile.display_name); }
        const url = avatarUrl(profile?.avatar_path);
        const initials = (profile?.display_name || '?').slice(0, 2);
        node.textContent = initials;
        if (url) {
            const img = document.createElement('img'); img.src = url; img.alt = ''; img.width = 256; img.height = 256;
            img.loading = 'lazy'; img.addEventListener('error', () => { node.textContent = initials; }, { once: true });
            node.replaceChildren(img);
        }
        return node;
    }
    function labels(profile) {
        const node = document.createElement('span'); node.className = 'zh-public-labels';
        node.setAttribute('data-i18n-ignore', '');
        if (['member', 'admin'].includes(profile?.system_role)) {
            const role = document.createElement('span'); role.className = 'zh-public-role';
            role.dataset.systemRole = profile.system_role;
            role.textContent = window.ZHLanguage.t('forum.role.' + profile.system_role); node.append(role);
        }
        // Future central rank is display-only and never participates in permissions.
        const rank = profile?.rank_label;
        if (typeof rank === 'string' && rank.trim() && rank.length <= 80 && !/[@\u0000-\u001f\u007f]/.test(rank)) {
            const line = document.createElement('span'); line.className = 'zh-public-rank';
            line.textContent = rank.trim(); node.append(line);
        }
        node.hidden = !node.childElementCount;
        return node;
    }
    window.ZHForum = Object.freeze({ rpc, avatar, avatarUrl, labels, client });
})();
