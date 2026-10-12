/* Own avatar/bio use the central UUID; display_name and private account fields stay unchanged. */
(() => {
    'use strict';
    const form = document.getElementById('profile-community-form');
    if (!form || !window.ZHForum) return;
    const api = window.ZHForum, identity = window.ZHIdentity, lang = window.ZHLanguage;
    const fileInput = document.getElementById('profile-avatar-file');
    const bio = document.getElementById('profile-bio');
    const preview = document.getElementById('profile-avatar-preview');
    const status = document.getElementById('profile-community-status');
    const link = document.getElementById('profile-public-link');
    const ownLabels = document.getElementById('profile-system-labels');
    let profile = null, owner = null, read = 0, busy = false;
    const message = key => { status.hidden = false; lang.bind(status, key); };
    function render() {
        if (profile) preview.replaceChildren(api.avatar(profile));
        const labels = api.labels(profile);
        ownLabels.replaceChildren(labels); ownLabels.hidden = labels.hidden;
        form.querySelectorAll('input,textarea,button').forEach(e => { e.disabled = busy || identity.state.status !== 'member'; });
    }
    async function load(state) {
        if (state.status !== 'member') {
            ++read; owner = null; profile = null; bio.value = ''; fileInput.value = ''; preview.replaceChildren();
            form.hidden = true; link.hidden = true; status.hidden = true;
            ownLabels.replaceChildren(); ownLabels.hidden = true; return;
        }
        form.hidden = false;
        if (owner === state.userId && profile) { render(); return; }
        owner = state.userId; const ticket = ++read;
        message('forum.loading');
        try {
            const data = await api.rpc('get_zh_forum_profile', { p_user_id: owner });
            if (ticket !== read || owner !== identity.state.userId) return;
            profile = data.profile; bio.value = profile.bio || ''; render(); status.hidden = true;
            link.href = '../forum/#profile/' + owner; link.hidden = false;
        } catch (error) { if (ticket === read) message(error.message); }
    }
    async function normalizedAvatar(file) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size < 12 || file.size > 2097152) throw new Error('forum.avatarInputInvalid');
        const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
        const png = [137,80,78,71,13,10,26,10].every((n,i) => bytes[i] === n);
        const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
        const webp = String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP';
        if (!(png && file.type === 'image/png' || jpeg && file.type === 'image/jpeg' || webp && file.type === 'image/webp')) throw new Error('forum.avatarInputInvalid');
        if (png) {
            const header = new DataView(bytes.buffer);
            if (header.getUint32(16) > 4096 || header.getUint32(20) > 4096) throw new Error('forum.avatarInputInvalid');
        }
        let bitmap;
        try { bitmap = await createImageBitmap(file); } catch (_) { throw new Error('forum.avatarInputInvalid'); }
        try {
            if (!bitmap.width || !bitmap.height || bitmap.width > 4096 || bitmap.height > 4096) throw new Error('forum.avatarInputInvalid');
            const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
            const side = Math.min(bitmap.width, bitmap.height);
            canvas.getContext('2d').drawImage(bitmap, (bitmap.width-side)/2, (bitmap.height-side)/2, side, side, 0, 0, 256, 256);
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .86));
            if (!blob || blob.size > 262144 || !['image/webp','image/png'].includes(blob.type)) throw new Error('forum.avatarInputInvalid');
            return blob;
        } finally { bitmap.close(); }
    }
    form.addEventListener('submit', async event => {
        event.preventDefault(); if (busy || !profile || identity.state.status !== 'member') return;
        const currentOwner = owner; const previousPath = profile.avatar_path;
        busy = true; render(); message('forum.saving');
        let uploadedPath = null;
        try {
            const principal = await identity.forSubmission();
            if (principal.userId !== currentOwner) throw new Error('identity.sessionChanged');
            const file = fileInput.files[0];
            if (file) {
                const blob = await normalizedAvatar(file);
                if (identity.state.userId !== currentOwner) throw new Error('identity.sessionChanged');
                uploadedPath = currentOwner + '/' + crypto.randomUUID() + (blob.type === 'image/webp' ? '.webp' : '.png');
                const upload = await api.client.storage.from('zh-avatars').upload(uploadedPath, blob, { contentType: blob.type, upsert: false, cacheControl: '31536000' });
                if (upload.error) throw new Error('forum.avatarUploadFailed');
            }
            const saved = await api.rpc('save_zh_forum_profile', { p_bio: bio.value, p_avatar_path: uploadedPath || previousPath || null }, true, currentOwner);
            profile = saved; fileInput.value = ''; render(); message('forum.profileSaved');
            document.dispatchEvent(new CustomEvent('zh:publicprofilechange'));
            try { localStorage.setItem('zhserver_public_profile_revision', String(Date.now())); } catch (_) { /* A normal reload also refreshes avatars. */ }
            if (previousPath && uploadedPath && previousPath !== uploadedPath && identity.state.userId === currentOwner) {
                // Best-effort cleanup after the new avatar is safely associated with this account.
                await api.client.storage.from('zh-avatars').remove([previousPath]);
            }
        } catch (error) { message(error.message.startsWith('identity.') || error.message.startsWith('forum.') ? error.message : 'forum.networkError'); }
        finally { busy = false; render(); }
    });
    document.addEventListener('zh:languagechange', render);
    identity.subscribe(load);
})();
