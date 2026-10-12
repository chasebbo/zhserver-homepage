/* Real published topics/replies/profiles; the original browser draft editor is reused. */
(() => {
    'use strict';
    if (!document.body.classList.contains('forum-page') || !window.ZHForum) return;
    const api = window.ZHForum, identity = window.ZHIdentity, lang = window.ZHLanguage;
    const $ = id => document.getElementById(id);
    let drafts, categoryData = null, threadData = null, profileData = null;
    let categoryKey = '', threadKey = '', profileKey = '', overviewKey = '';
    let categoryTicket = 0, threadTicket = 0, profileTicket = 0, overviewTicket = 0;
    let publishing = false, replyBusy = false, editPost = null, replyRequest = null, overviewData = null;
    const userKey = () => identity.state.userId || 'guest';
    const textNode = (tag, text, cls) => {
        const node = document.createElement(tag); node.textContent = text; node.setAttribute('data-i18n-ignore', '');
        if (cls) node.className = cls; return node;
    };
    const bind = (id, key, params = {}) => { $(id).hidden = false; $(id).classList.remove('forum-error'); lang.bind($(id), key, params); };
    const date = value => new Intl.DateTimeFormat(lang.locale, { dateStyle:'medium', timeStyle:'short', timeZone:'Europe/Berlin' }).format(new Date(value));
    const memberName = profile => profile?.display_name || lang.t('forum.formerMember');
    function authorLink(profile) {
        const node = textNode(profile?.user_id ? 'a' : 'span', memberName(profile));
        if (profile?.user_id) node.href = '#profile/' + profile.user_id;
        return node;
    }
    function authorDetails(profile) {
        const node = textNode('span', '', 'forum-author-details');
        node.append(authorLink(profile), api.labels(profile)); return node;
    }
    function error(id, e) { bind(id, e.message?.startsWith('forum.') || e.message?.startsWith('identity.') ? e.message : 'forum.networkError'); $(id).classList.add('forum-error'); }
    function permissionFields(topic) {
        const form = $('forum-reply-form');
        form.hidden = identity.state.status !== 'member' || topic.closed || topic.hidden || (topic.category === 'announcements' && !topic.can_moderate);
        const hint = $('forum-thread-write-note');
        hint.hidden = !form.hidden;
        if (form.hidden) lang.bind(hint, topic.closed ? 'forum.topicClosed' : topic.hidden ? 'forum.hiddenTopic' : identity.state.status !== 'member' ? 'forum.loginRequired' : 'forum.announcementsAdmin');
        $('forum-thread-login').hidden = !!identity.state.userId;
        $('forum-thread-login').href = '../account/?next=' + encodeURIComponent(location.pathname + location.hash);
    }
    function topicItem(topic) {
        const row = textNode('li', '', 'forum-server-topic');
        const main = document.createElement('div');
        for (const state of ['pinned','closed','hidden']) if (topic[state]) main.append(textNode('span', lang.t('forum.' + state), 'forum-topic-state'));
        const link = textNode('a', topic.title); link.href = '#thread/' + topic.id; main.append(link);
        const meta = document.createElement('small'); meta.className = 'forum-topic-author';
        meta.append(api.avatar(topic.author, true), authorDetails(topic.author), document.createTextNode(' · ' + date(topic.created_at))); main.append(meta);
        row.append(main, textNode('span', String(topic.replies), 'forum-topic-count'), textNode('time', date(topic.last_activity_at), 'forum-topic-date'));
        return row;
    }
    function renderCategories(data) {
        const stats = new Map(data.categories.map(c => [c.category, c]));
        document.querySelectorAll('[data-forum-category]').forEach(row => {
            const stat = stats.get(row.dataset.forumCategory);
            const count = row.querySelector('.forum-category-count span:last-child');
            count.removeAttribute('data-forum-label'); count.removeAttribute('aria-label'); count.setAttribute('data-i18n-ignore', ''); count.textContent = String(stat?.topics || 0);
            const activity = row.querySelector('.forum-category-activity'); activity.removeAttribute('data-forum-i18n');
            if (stat?.last_activity_at) lang.bind(activity, 'forum.activityAt', { date:date(stat.last_activity_at) });
            else lang.bind(activity, 'forum.noActivity');
        });
    }
    async function overview() {
        const key = userKey();
        if (overviewKey === key && overviewData) { renderCategories(overviewData); return; }
        overviewKey = key; const ticket = ++overviewTicket;
        bind('forum-server-status', 'forum.loading');
        try {
            const data = await api.rpc('get_zh_forum', {});
            if (ticket !== overviewTicket) return;
            overviewData = data; renderCategories(data); $('forum-server-status').hidden = true;
        } catch (e) { overviewKey = ''; error('forum-server-status', e); }
    }
    function renderTopicList(filter) {
        if (!categoryData) return;
        const topics = categoryData.topics.filter(t => filter === 'all' || t[filter]);
        $('forum-server-topics').replaceChildren(...topics.map(topicItem));
        $('forum-empty-topics').hidden = topics.length > 0;
        $('forum-load-topics').hidden = categoryData.topics.length >= categoryData.total;
        $('forum-category-compose').href = '#compose/' + drafts.route().category;
        $('forum-category-compose').hidden = drafts.route().category === 'announcements' && !categoryData.can_announce;
        if (filter !== 'all' && topics.length === 0 && categoryData.topics.length < categoryData.total) bind('forum-category-server-status', 'forum.moreForFilter');
        else $('forum-category-server-status').hidden = true;
    }
    async function category(id, filter = 'all', more = false) {
        if (!id) return;
        const key = id + ':' + userKey();
        if (categoryKey === key && !more && categoryData) { renderTopicList(filter); return; }
        if (categoryKey !== key) { categoryData = null; $('forum-server-topics').replaceChildren(); }
        categoryKey = key; const ticket = ++categoryTicket;
        bind('forum-category-server-status', 'forum.loading'); $('forum-load-topics').disabled = true;
        try {
            const data = await api.rpc('get_zh_forum', { p_category: id, p_offset: more ? categoryData?.topics.length || 0 : 0 });
            if (ticket !== categoryTicket || drafts.route().category !== id) return;
            categoryData = { ...data, topics: more ? [...categoryData.topics, ...data.topics] : data.topics };
            renderCategories(data); renderTopicList(filter);
        } catch (e) { categoryKey = ''; error('forum-category-server-status', e); $('forum-empty-topics').hidden = true; }
        finally { $('forum-load-topics').disabled = false; }
    }
    function renderPost(post) {
        const article = textNode('article', '', 'forum-post'); article.id = 'post-' + post.id;
        const author = textNode('aside', '', 'forum-post-author');
        author.append(api.avatar(post.author, true), authorDetails(post.author));
        const main = textNode('div', '', 'forum-post-content');
        const meta = textNode('div', '', 'forum-post-meta'); meta.append(textNode('span', lang.t('forum.published')), textNode('time', date(post.created_at)));
        if (post.updated_at !== post.created_at) meta.append(textNode('span', lang.t('forum.editedAt', { date:date(post.updated_at) })));
        if (post.hidden) meta.append(textNode('span', lang.t('forum.hidden')));
        main.append(meta, textNode('div', post.body, 'forum-post-body'));
        const actions = textNode('div', '', 'forum-post-footer');
        if (post.can_edit && identity.state.status === 'member') {
            const button = textNode('button', lang.t('forum.editPost'), 'forum-text-button'); button.type = 'button';
            button.addEventListener('click', () => openEdit(post)); actions.append(button);
        }
        if (post.can_moderate && !post.opener) {
            const key = post.hidden ? 'forum.showPost' : threadData.role_version === 1 ? 'forum.deleteReply' : 'forum.hidePost';
            const button = textNode('button', lang.t(key), 'forum-text-button'); button.type='button';
            button.addEventListener('click', () => moderate('post_hidden', !post.hidden, post.id)); actions.append(button);
        }
        main.append(actions); article.append(author, main); return article;
    }
    function renderThread() {
        if (!threadData) return;
        const topic = threadData.topic;
        $('forum-thread-heading').textContent = topic.title;
        $('forum-thread-category').textContent = drafts.title(topic.category);
        const breadcrumb = $('forum-breadcrumb-category'); breadcrumb.hidden = false;
        const link = textNode('a', drafts.title(topic.category)); link.href = '#category/' + topic.category; breadcrumb.replaceChildren(link);
        $('forum-thread-posts').replaceChildren(...threadData.posts.map(renderPost));
        $('forum-load-posts').hidden = threadData.posts.length >= threadData.post_count;
        $('forum-thread-states').textContent = ['pinned','closed','hidden'].filter(s => topic[s]).map(s => lang.t('forum.'+s)).join(' · ');
        $('forum-thread-states').hidden = !$('forum-thread-states').textContent;
        const moderation = $('forum-thread-moderation'); moderation.replaceChildren(); moderation.hidden = !topic.can_moderate;
        if (topic.can_moderate) for (const state of ['pinned','closed','hidden']) {
            const key = { pinned: topic.pinned ? 'unpinTopic' : 'pinTopic', closed: topic.closed ? 'openTopic' : 'closeTopic', hidden: topic.hidden ? 'showTopic' : threadData.role_version === 1 ? 'deleteTopic' : 'hideTopic' }[state];
            const button = textNode('button', lang.t('forum.' + key), 'forum-button forum-button-secondary'); button.type='button';
            button.addEventListener('click', () => moderate(state, !topic[state])); moderation.append(button);
        }
        permissionFields(topic);
    }
    async function thread(id, more = false, refresh = false) {
        const key = id + ':' + userKey();
        if (threadKey === key && threadData && !more && !refresh) { renderThread(); return; }
        if (threadKey !== key) {
            threadData = null; editPost = null; $('forum-edit-form').hidden = true;
            $('forum-thread-posts').replaceChildren(); $('forum-thread-heading').textContent = lang.t('forum.topic');
            $('forum-thread-category').textContent = ''; $('forum-thread-moderation').hidden = true;
            $('forum-thread-states').hidden = true; $('forum-thread-write-note').hidden = true;
            $('forum-thread-login').hidden = true; $('forum-load-posts').hidden = true;
            $('forum-reply-body').value = ''; replyRequest = null;
        }
        threadKey = key; const ticket = ++threadTicket;
        $('forum-reply-form').hidden = true; bind('forum-thread-server-status', 'forum.loading');
        try {
            const data = await api.rpc('get_zh_forum', { p_topic_id:id, p_post_offset:more ? threadData?.posts.length || 0 : 0 });
            if (ticket !== threadTicket || drafts.route().id !== id) return;
            threadData = { ...data, posts:more ? [...threadData.posts,...data.posts] : data.posts };
            renderThread(); $('forum-thread-server-status').hidden = true;
        } catch (e) { threadKey = ''; error('forum-thread-server-status', e); }
    }
    async function publish() {
        if (publishing) return;
        const payload = drafts.prepare(); if (!payload) return;
        publishing = true;
        const buttons = document.querySelectorAll('[data-forum-publish]'); buttons.forEach(b => { b.dataset.busy='true'; b.disabled=true; });
        const origin = drafts.route().view === 'preview' ? 'forum-preview-publish-status' : 'forum-publish-status';
        bind(origin, 'forum.publishing');
        try {
            const result = await api.rpc('create_zh_forum_topic', { p_request_id:payload.requestId, p_category:payload.category, p_title:payload.title, p_body:payload.body }, true);
            // A retry can resolve a request whose first response was lost. Never delete
            // edited local text unless it matches the topic that actually reached the server.
            let matches = true;
            if (result.reused) {
                const saved = await api.rpc('get_zh_forum', { p_topic_id:result.topic_id });
                const opener = saved.posts.find(p => p.opener);
                matches = saved.topic.title === payload.title.trim() && opener?.body === payload.body.trim();
            }
            drafts.published(payload, matches); categoryKey=''; overviewKey=''; threadKey='';
            location.hash = 'thread/' + result.topic_id;
        } catch (e) { error(origin, e); }
        finally { publishing=false; buttons.forEach(b => { delete b.dataset.busy; }); drafts.renderIdentity(); }
    }
    function openEdit(post) {
        editPost = post; $('forum-edit-form').hidden = false;
        $('forum-edit-body').value = post.body; $('forum-edit-title-wrap').hidden = !post.opener;
        $('forum-edit-title').value = threadData.topic.title;
        $('forum-edit-status').hidden = true; $('forum-edit-body').focus();
    }
    async function submitEdit(event) {
        event.preventDefault(); if (!editPost || $('forum-edit-save').disabled) return;
        const post = editPost; const topicId = threadData.topic.id; $('forum-edit-save').disabled = true;
        bind('forum-edit-status', 'forum.saving');
        try {
            await api.rpc('edit_zh_forum_post', { p_post_id:post.id,p_body:$('forum-edit-body').value,p_title:$('forum-edit-title').value,p_expected_at:post.updated_at }, true);
            if (drafts.route().id !== topicId) return;
            editPost=null; $('forum-edit-form').hidden=true; categoryKey=''; overviewKey='';
            await thread(topicId,false,true);
        } catch (e) { error('forum-edit-status', e); }
        finally { $('forum-edit-save').disabled=false; }
    }
    async function submitReply(event) {
        event.preventDefault(); if (replyBusy || !threadData || identity.state.status !== 'member') return;
        const topicId=threadData.topic.id, body=$('forum-reply-body').value;
        if (body.trim().length<10) { bind('forum-reply-status','forum.bodyRequired'); return; }
        replyRequest ||= crypto.randomUUID(); replyBusy=true; $('forum-reply-submit').disabled=true;
        bind('forum-reply-status','forum.publishing');
        try {
            await api.rpc('reply_zh_forum_topic',{p_request_id:replyRequest,p_topic_id:topicId,p_body:body},true);
            if (drafts.route().id !== topicId) return;
            $('forum-reply-body').value=''; replyRequest=null; $('forum-reply-status').hidden=true;
            categoryKey=''; overviewKey=''; await thread(topicId,false,true);
        } catch(e) { error('forum-reply-status',e); }
        finally { replyBusy=false; $('forum-reply-submit').disabled=false; }
    }
    async function moderate(action,value,postId=null) {
        const id=threadData?.topic.id; if (!id) return;
        if (threadData.role_version === 1 && value && ['hidden','post_hidden'].includes(action) &&
            !window.confirm(lang.t(action === 'hidden' ? 'forum.confirmDeleteTopic' : 'forum.confirmDeleteReply'))) return;
        try { await api.rpc('moderate_zh_forum_topic',{p_topic_id:id,p_action:action,p_value:value,p_post_id:postId},true); overviewKey=''; categoryKey=''; await thread(id,false,true); }
        catch(e) { error('forum-thread-server-status',e); }
    }
    function renderProfile() {
        if (!profileData) return;
        const p=profileData.profile; $('forum-public-profile-heading').textContent=p.display_name;
        const labels = api.labels(p);
        $('forum-public-profile-labels').replaceChildren(labels); $('forum-public-profile-labels').hidden=labels.hidden;
        $('forum-public-profile-avatar').replaceChildren(api.avatar(p));
        $('forum-public-profile-bio').textContent=p.bio || lang.t('forum.noBio');
        $('forum-public-profile-since').textContent=lang.t('forum.memberSince',{date:date(p.created_at)});
        $('forum-public-profile-topics').replaceChildren(...profileData.topics.map(topicItem));
        $('forum-public-profile-posts').replaceChildren(...profileData.posts.map(post => {
            const node=textNode('div',''); const link=textNode('a',post.title); link.href='#thread/'+post.topic_id;
            node.append(link,textNode('small',date(post.created_at)),textNode('p',post.excerpt)); return node;
        }));
        $('forum-profile-no-topics').hidden=profileData.topics.length>0;
        $('forum-profile-no-posts').hidden=profileData.posts.length>0;
    }
    async function profile(id) {
        if (profileKey===id && profileData) { renderProfile(); return; }
        profileKey=id; profileData=null; const ticket=++profileTicket;
        $('forum-public-profile-heading').textContent=lang.t('forum.publicProfile');
        $('forum-profile-no-topics').hidden=true; $('forum-profile-no-posts').hidden=true;
        $('forum-public-profile-topics').replaceChildren(); $('forum-public-profile-posts').replaceChildren();
        $('forum-public-profile-avatar').replaceChildren(); $('forum-public-profile-bio').textContent=''; $('forum-public-profile-since').textContent='';
        $('forum-public-profile-labels').replaceChildren(); $('forum-public-profile-labels').hidden=true;
        bind('forum-profile-server-status','forum.loading');
        try {
            const data=await api.rpc('get_zh_forum_profile',{p_user_id:id});
            if (ticket!==profileTicket || drafts.route().id!==id) return;
            profileData=data; renderProfile(); $('forum-profile-server-status').hidden=true;
        } catch(e) { profileKey=''; error('forum-profile-server-status',e); }
    }
    function connect(controller) {
        drafts=controller;
        document.querySelectorAll('[data-forum-publish]').forEach(b=>b.addEventListener('click',publish));
        $('forum-load-topics').addEventListener('click',()=>category(drafts.route().category, document.querySelector('[data-forum-filter][aria-pressed="true"]').dataset.forumFilter, true));
        $('forum-load-posts').addEventListener('click',()=>thread(threadData.topic.id,true));
        $('forum-reply-form').addEventListener('submit',submitReply);
        $('forum-edit-form').addEventListener('submit',submitEdit);
        $('forum-edit-cancel').addEventListener('click',()=>{editPost=null;$('forum-edit-form').hidden=true;});
        function refresh() { categoryKey=''; threadKey=''; profileKey=''; overviewKey=''; const r=drafts.route(); if(r.view==='thread') thread(r.id); if(r.view==='profile') profile(r.id); if(r.view==='category') category(r.category); if(r.view==='overview') overview(); }
        document.addEventListener('zh:publicprofilechange',refresh);
        window.addEventListener('storage',e=>{if(e.key==='zhserver_public_profile_revision') refresh();});
    }
    window.ZHForumContent=Object.freeze({connect,overview,category,thread,profile});
})();
