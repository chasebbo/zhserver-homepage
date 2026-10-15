/* A single central account, server counts only. Missing capability makes no new RPC call. */
(() => {
    'use strict';
    const api = window.ZHForum, identity = window.ZHIdentity, lang = window.ZHLanguage;
    if (!api || !identity) return;
    let data, controller, bindings = [], generation = 0, readRevision = 0;
    let actorKey = (identity.state.userId || '') + ':' + identity.state.status;
    const pending = new Set(), revisionKey = 'zh_forum_reaction_revision';
    const visible = () => data?.reactions_version === 1 && controller?.route().view === 'thread' && controller.route().id === data.topic.id;
    const signedIn = () => !!identity.state.userId && ['member','nameRequired'].includes(identity.state.status);
    const busyKey = id => (identity.state.userId || '') + ':' + id;
    const valid = row => row && Number.isSafeInteger(row.likes) && row.likes >= 0 && Number.isSafeInteger(row.dislikes) && row.dislikes >= 0 && [-1,0,1].includes(row.own_reaction);
    function paint(binding) {
        for (const [value, button] of binding.buttons) {
            const key = value === 1 ? 'forum.like' : 'forum.dislike';
            const count = binding.value ? binding.value[value === 1 ? 'likes' : 'dislikes'].toLocaleString(lang.locale) : '—';
            button.querySelector('[data-count]').textContent = count;
            button.setAttribute('aria-label', lang.t(key) + ': ' + count);
            button.title = lang.t(key);
            button.setAttribute('aria-pressed', String(binding.value?.own_reaction === value));
            button.disabled = !binding.value || pending.has(busyKey(binding.id));
        }
    }
    function note(binding, key) { binding.status.textContent = key ? lang.t(key) : ''; }
    async function refresh() {
        if (!visible() || document.hidden || !bindings.length) return;
        const ticket = generation, read = ++readRevision, owner = actorKey;
        try {
            const rows = new Map(); let canReact = false;
            // Existing threads load 30 posts at a time; support bounded batches after Load more.
            for (let offset = 0; offset < bindings.length; offset += 50) {
                const result = await api.rpc('get_zh_forum_reactions', { p_post_ids:bindings.slice(offset,offset+50).map(b=>b.id) });
                if (result.version !== 1 || !Array.isArray(result.posts) || typeof result.can_react !== 'boolean') throw Error();
                canReact = result.can_react;
                for (const row of result.posts) { if (!valid(row)) throw Error(); rows.set(row.post_id,row); }
            }
            if (ticket !== generation || read !== readRevision || owner !== actorKey || !visible()) return;
            for (const binding of bindings) {
                binding.value = rows.get(binding.id) || null; binding.canReact = canReact;
                if (!binding.value) note(binding,'forum.reactionsUnavailable');
                paint(binding);
            }
        } catch (_) {
            if (ticket === generation && read === readRevision && owner === actorKey) bindings.forEach(b=>note(b,'forum.reactionsUnavailable'));
        }
    }
    async function choose(binding, reaction) {
        if (!visible() || !binding.value || pending.has(busyKey(binding.id))) return;
        if (!signedIn() || !binding.canReact) { note(binding,data.topic.category==='changelog'?'forum.changelogSignIn':'forum.reactionSignIn'); return; }
        const owner = identity.state.userId, key = busyKey(binding.id), topicId=data.topic.id;
        const wanted = binding.value.own_reaction === reaction ? 0 : reaction;
        pending.add(key); readRevision++; paint(binding); note(binding,'forum.saving');
        let failure = false;
        try {
            // Reuse the central verifier. A reaction needs an account, not a public nickname.
            const principal = await identity.resolve();
            const current = await identity.client.auth.getSession();
            if (principal.userId !== owner || !['member','nameRequired'].includes(principal.status) || current.error ||
                current.data.session?.user?.id !== owner || current.data.session?.access_token !== principal.accessToken) throw Error();
            const result = await identity.client.rpc('set_zh_forum_reaction', { p_post_id:binding.id, p_reaction:wanted });
            if (result.error || result.data?.version !== 1) throw Error();
            if(data.topic.id===topicId&&data.topic.category==='changelog')document.dispatchEvent(new CustomEvent('zh:forumreactionchange'));
            // Cross-tab signal only; neither reaction state nor identity is stored in the browser.
            try { localStorage.setItem(revisionKey, Date.now() + ':' + Math.random().toString(36).slice(2)); } catch (_) { /* Focus refresh remains available. */ }
        } catch (_) { failure = true; }
        finally {
            pending.delete(key);
            if (identity.state.userId === owner && visible()) {
                bindings.forEach(b=>{ paint(b); if (b.id===binding.id) note(b,failure?'forum.reactionsUnavailable':''); });
                await refresh();
            }
        }
    }
    function mount(next, drafts) {
        data = next; controller = drafts; bindings = []; generation++; readRevision++;
        // Until the approved migration advertises v1, show no invented zero counts and cause no 404.
        if (next.reactions_version !== 1 || next.topic.hidden) return;
        const official=next.topic.category==='changelog';
        for (const post of next.posts.filter(p=>!p.hidden)) {
            const footer = document.querySelector('#post-' + post.id + ' .forum-post-footer');
            if (!footer) continue;
            const group = document.createElement('div'); group.className='forum-reactions';
            group.setAttribute('role','group'); group.setAttribute('aria-label',lang.t('forum.reactions')); group.setAttribute('data-i18n-ignore','');
            const status = document.createElement('span'); status.className='forum-reaction-status'; status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
            const binding = { id:post.id, group, status, buttons:new Map(), value:null, canReact:false };
            for (const value of (official?[1]:[1,-1])) {
                const button = document.createElement('button'); button.type='button'; button.className='forum-reaction-choice';
                const symbol = document.createElement('span'); symbol.className='forum-reaction-symbol'; symbol.textContent=value===1?'👍':'👎'; symbol.setAttribute('aria-hidden','true');
                const count = document.createElement('span'); count.setAttribute('data-count','');
                button.append(symbol,count); button.addEventListener('click',()=>choose(binding,value)); binding.buttons.set(value,button); group.append(button);
            }
            group.append(status); footer.prepend(group); bindings.push(binding); paint(binding);
        }
        refresh();
    }
    identity.subscribe(() => {
        const next = (identity.state.userId || '') + ':' + identity.state.status;
        if (actorKey === next) return;
        actorKey = next; generation++; readRevision++;
        bindings.forEach(b=>{ b.value=null; note(b,''); paint(b); }); refresh();
    });
    window.addEventListener('hashchange',()=>{ generation++; readRevision++; });
    window.addEventListener('storage',e=>{ if(e.key===revisionKey) refresh(); });
    window.addEventListener('focus',()=>refresh());
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden)refresh(); });
    window.ZHForumReactions=Object.freeze({mount});
})();
