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
    let moderationBusy = false, pendingDelete = null;
    const moderationReady = () => threadData?.moderation_version === 2;
    const userKey = () => identity.state.userId || 'guest';
    const textNode = (tag, text, cls) => {
        const node = document.createElement(tag); node.textContent = text; node.setAttribute('data-i18n-ignore', '');
        if (cls) node.className = cls; return node;
    };
    const bind = (id, key, params = {}) => { $(id).hidden = false; $(id).classList.remove('forum-error'); lang.bind($(id), key, params); };
    const date = value => new Intl.DateTimeFormat(lang.locale, { dateStyle:'medium', timeStyle:'short', timeZone:'Europe/Berlin' }).format(new Date(value));
    const memberName = profile => profile?.display_name || lang.t('forum.formerMember');
    function authorLink(profile) {
        const node = api.name(profile, profile?.user_id ? 'a' : 'span');
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
        // A pending Google account sees how to finish its sign-up instead of a sign-in request.
        const pending = identity.state.consentPending === true;
        if (form.hidden) lang.bind(hint, topic.closed ? 'forum.topicClosed' : topic.hidden ? 'forum.hiddenTopic' :
            identity.state.status !== 'member' ? (pending ? 'identity.consentRequired' : 'forum.loginRequired') : 'forum.announcementsAdmin');
        const login = $('forum-thread-login');
        login.hidden = !!identity.state.userId && !pending;
        login.href = pending ? identity.finishUrl(location.href) : '../account/?next=' + encodeURIComponent(location.pathname + location.hash);
        lang.bind(login, pending ? 'consent.finish' : 'account.signIn');
    }
    function topicItem(topic) {
        const row = textNode('li', '', 'forum-server-topic');
        if (topic.pinned) row.classList.add('forum-topic-pinned');
        if (topic.closed) row.classList.add('forum-topic-closed');
        row.dataset.forumActivityAt = topic.last_activity_at;
        if (window.ZHForumActivity.isRecent(topic.last_activity_at)) {
            row.classList.add('forum-topic-recent'); row.title = lang.t('forum.recentActivity');
        }
        const main = textNode('div', '', 'forum-topic-main');
        const states = textNode('span', '', 'forum-topic-states');
        for (const state of ['pinned','closed','hidden']) if (topic[state]) {
            const label = textNode('span', lang.t('forum.' + state), 'forum-topic-state'); label.dataset.forumState = state; states.append(label);
        }
        if (states.childElementCount) main.append(states);
        const link = textNode('a', topic.title); link.href = '#thread/' + topic.id; main.append(link);
        const suggestion = window.ZHForumSuggestion?.badge(topic); if (suggestion) main.append(suggestion);
        const meta = document.createElement('small'); meta.className = 'forum-topic-author';
        const official=window.ZHForumChangelog.is(topic);
        if(official){row.classList.add('forum-changelog-topic');main.prepend(window.ZHForumChangelog.label(topic));}
        meta.append(api.avatar(topic.author, true), authorDetails(topic.author), document.createTextNode(' · ' + (official?window.ZHForumChangelog.date(topic):date(topic.created_at)))); main.append(meta);
        const replies = textNode('span', String(topic.replies), 'forum-topic-count');
        replies.dataset.label = lang.t('forum.replies');
        replies.setAttribute('aria-label', window.ZHForumActivity.replies(topic.replies));
        if(official){
            const likes=textNode('span',Number.isSafeInteger(topic.changelog?.likes)?String(topic.changelog.likes):'—','forum-topic-likes');
            likes.dataset.label=lang.t('forum.changelogLikes');likes.setAttribute('aria-label',lang.t('forum.changelogLikes'));
            row.append(main,likes,window.ZHForumViews.cell(topic),textNode('span',window.ZHForumChangelog.date(topic),'forum-topic-activity'));
        }else row.append(main, replies, window.ZHForumViews.cell(topic), window.ZHForumActivity.topicCell(topic));
        window.ZHForumLinks.bind(row, link);
        return row;
    }
    function renderCategories(data) {
        window.ZHForumActivity.categories(data);
    }
    async function overview() {
        const key = userKey();
        overviewKey = key; const ticket = ++overviewTicket;
        bind('forum-server-status', 'forum.loading');
        try {
            const data = await window.ZHForumActivity.refresh();
            if (ticket !== overviewTicket || !data) return;
            overviewData = data; renderCategories(data); $('forum-server-status').hidden = true;
        } catch (e) { overviewKey = ''; error('forum-server-status', e); }
    }
    function renderTopicList(filter) {
        if (!categoryData) return;
        const ideas = window.ZHForumSuggestion?.filterVisible(drafts.route().category);
        if (filter === 'accepted' && !ideas) { document.querySelector('[data-forum-filter="all"]')?.click(); return; }
        const topics = categoryData.topics.filter(t => window.ZHForumSuggestion ? window.ZHForumSuggestion.matches(t, filter) : filter === 'all' || t[filter]);
        $('forum-server-topics').replaceChildren(...topics.map(topicItem));
        $('forum-empty-topics').hidden = topics.length > 0;
        $('forum-load-topics').hidden = categoryData.topics.length >= categoryData.total;
        $('forum-category-compose').href = '#compose/' + drafts.route().category;
        $('forum-category-compose').hidden = drafts.route().category === 'announcements' && !categoryData.can_announce;
        if (filter !== 'all' && topics.length === 0 && categoryData.topics.length < categoryData.total) bind('forum-category-server-status', 'forum.moreForFilter');
        else $('forum-category-server-status').hidden = true;
        window.ZHForumChangelog.category(categoryData);
    }
    async function category(id, filter = 'all', more = false) {
        if (!id) return;
        if(id==='changelog')window.ZHForumChangelog.category({});
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
    function renderPost(post, last = false) {
        const article = textNode('article', '', 'forum-post'); article.id = 'post-' + post.id;
        if (last) article.classList.add('forum-post-last');
        const author = textNode('aside', '', 'forum-post-author');
        author.append(api.avatar(post.author, true), authorDetails(post.author));
        const main = textNode('div', '', 'forum-post-content');
        const meta = textNode('div', '', 'forum-post-meta');
        const time = textNode('time', window.ZHForumChangelog.is(threadData?.topic)?window.ZHForumChangelog.date(threadData.topic):date(post.created_at));
        if(post.created_at)time.dateTime = post.created_at;
        meta.append(textNode('span', lang.t('forum.published')), time);
        if (last) meta.append(textNode('span', lang.t('forum.latestPost'), 'forum-latest-post-note'));
        if (post.updated_at !== post.created_at) meta.append(textNode('span', lang.t('forum.editedAt', { date:date(post.updated_at) })));
        if (post.hidden) meta.append(textNode('span', lang.t('forum.hidden')));
        main.append(meta, textNode('div', post.body, 'forum-post-body'));
        const actions = textNode('div', '', 'forum-post-footer');
        if (post.can_edit && identity.state.status === 'member' && (post.can_moderate || (!threadData.topic.closed && !threadData.topic.hidden && !post.hidden))) {
            const button = textNode('button', lang.t(post.opener ? 'forum.editPost' : 'forum.editReply'), 'forum-text-button'); button.type = 'button';
            button.addEventListener('click', () => window.ZHForumChangelog.is(threadData.topic)?window.ZHForumChangelog.openEdit(threadData):openEdit(post)); actions.append(button);
        }
        if (post.can_moderate && !post.opener) {
            const button = textNode('button', lang.t('forum.deleteReply'), 'forum-text-button forum-delete-link'); button.type='button';
            button.dataset.forumDelete = ''; button.disabled = !moderationReady() || moderationBusy;
            button.addEventListener('click', () => confirmDelete('delete_reply', post.id)); actions.append(button);
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
        // Only the actual end of the full thread is marked, never the end of a partial page.
        const last = !window.ZHForumChangelog.is(topic)&&threadData.posts.length >= threadData.post_count ? threadData.posts.filter(post => !post.hidden).at(-1) : null;
        $('forum-thread-posts').replaceChildren(...threadData.posts.map(post => renderPost(post, post.id === last?.id)));
        window.ZHForumReactions.mount(threadData, drafts);
        $('forum-load-posts').hidden = threadData.posts.length >= threadData.post_count;
        $('forum-thread-states').textContent = ['pinned','closed','hidden'].filter(s => topic[s]).map(s => lang.t('forum.'+s)).join(' · ');
        $('forum-thread-states').hidden = !$('forum-thread-states').textContent;
        renderSuggestion(topic);
        renderModeration(topic);
        permissionFields(topic);
        window.ZHForumChangelog.thread(threadData);
        window.ZHForumViews.observe(threadData, drafts);
    }
    function renderModeration(topic) {
        const moderation = $('forum-thread-moderation'); moderation.replaceChildren(); moderation.hidden = !topic.can_moderate;
        if (!topic.can_moderate) return;
        moderation.append(textNode('h3', lang.t('forum.moderation'), 'forum-moderation-heading'));
        const actions = textNode('div', '', 'forum-moderation-actions');
        const toggle = (state, key) => {
            const button = textNode('button', lang.t('forum.' + key), 'forum-button forum-button-secondary'); button.type='button';
            button.disabled = moderationBusy;
            button.addEventListener('click', () => moderate(state, !topic[state])); return button;
        };
        actions.append(toggle('pinned', topic.pinned ? 'unpinTopic' : 'pinTopic'));
        const move = textNode('form', '', 'forum-move-form');
        const label = textNode('label', lang.t('forum.moveCategory')); label.htmlFor = 'forum-move-category';
        const select = document.createElement('select'); select.id = 'forum-move-category'; select.setAttribute('data-i18n-ignore', '');
        document.querySelectorAll('[data-forum-category]').forEach(row => {
            if(row.dataset.forumCategory==='changelog')return;
            const option = textNode('option', drafts.title(row.dataset.forumCategory)); option.value = row.dataset.forumCategory; select.append(option);
        });
        select.value = topic.category; select.disabled = !moderationReady() || moderationBusy;
        const moveButton = textNode('button', lang.t('forum.moveTopic'), 'forum-button forum-button-secondary'); moveButton.type='submit';
        moveButton.disabled = !moderationReady() || moderationBusy || select.value === topic.category;
        select.addEventListener('change', () => { moveButton.disabled = moderationBusy || select.value === topic.category; });
        move.addEventListener('submit', event => { event.preventDefault(); if (!moveButton.disabled) moderate('move', null, null, select.value); });
        move.append(label, select, moveButton); move.hidden=window.ZHForumChangelog.is(topic);
        actions.append(move, toggle('closed', topic.closed ? 'openTopic' : 'closeTopic'));
        const remove = textNode('button', lang.t('forum.deleteTopic'), 'forum-button forum-button-danger'); remove.type='button';
        remove.dataset.forumDelete = ''; remove.disabled = !moderationReady() || moderationBusy;
        remove.addEventListener('click', () => confirmDelete('delete_topic')); actions.append(remove); moderation.append(actions);
        if (!moderationReady()) moderation.append(textNode('p', lang.t('forum.moderationPending'), 'forum-moderation-note'));
        const suggestion = window.ZHForumSuggestion?.controls(topic, threadData, setSuggestion);
        if (suggestion) { suggestion.querySelectorAll('button, input').forEach(node => { if (moderationBusy) node.disabled = true; }); moderation.append(suggestion); }
    }
    function renderSuggestion(topic) {
        let slot = $('forum-thread-suggestion');
        if (!slot) { slot = textNode('div', '', 'forum-thread-suggestion-slot'); slot.id = 'forum-thread-suggestion'; $('forum-thread-states').after(slot); }
        const note = window.ZHForumSuggestion?.threadNote(topic);
        slot.replaceChildren(...(note ? [note] : [])); slot.hidden = !note;
    }
    // Uses the same busy state, session check and refresh as the other moderation actions.
    async function setSuggestion(status, note) {
        const topic = threadData?.topic;
        if (!topic?.can_moderate || moderationBusy || threadData.suggestion_status_version !== 1) return;
        const id = topic.id, owner = identity.state.userId;
        moderationBusy = true; moderationControls(true); bind('forum-thread-server-status', 'forum.saving');
        try {
            await api.rpc('set_zh_forum_suggestion_status', { p_topic_id:id, p_status:status, p_note:note }, true, owner);
            overviewKey=''; categoryKey=''; profileKey='';
            window.ZHForumActivity.invalidate();
            if (drafts.route().id === id) await thread(id,false,true);
        } catch(e) { error('forum-thread-server-status', e); }
        finally {
            moderationBusy=false; moderationControls(false);
            if (threadData && drafts.route().id === id) renderThread();
        }
    }
    async function thread(id, more = false, refresh = false) {
        const key = id + ':' + userKey();
        if (threadKey === key && threadData && !more && !refresh) { renderThread(); return; }
        if (threadKey !== key) {
            threadData = null; editPost = null; $('forum-edit-form').hidden = true;
            $('forum-thread-posts').replaceChildren(); $('forum-thread-heading').textContent = lang.t('forum.topic');
            $('forum-thread-category').textContent = ''; $('forum-thread-moderation').hidden = true;
            $('forum-thread-states').hidden = true; $('forum-thread-write-note').hidden = true;
            if ($('forum-thread-suggestion')) $('forum-thread-suggestion').hidden = true;
            $('forum-thread-views').hidden = true;
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
            window.ZHForumActivity.invalidate();
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
            window.ZHForumActivity.invalidate();
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
            window.ZHForumActivity.invalidate();
        } catch(e) { error('forum-reply-status',e); }
        finally { replyBusy=false; $('forum-reply-submit').disabled=false; }
    }
    function confirmDelete(action, postId = null) {
        if (moderationBusy || !moderationReady() || !threadData.topic.can_moderate) return;
        pendingDelete = { action, postId, topicId:threadData.topic.id, category:threadData.topic.category, userId:identity.state.userId };
        lang.bind($('forum-delete-heading'), action === 'delete_topic' ? 'forum.confirmDeleteTopic' : 'forum.confirmDeleteReply');
        lang.bind($('forum-delete-warning'), action === 'delete_topic' ? 'forum.deleteTopicWarning' : 'forum.deleteReplyWarning');
        $('forum-delete-context').textContent = threadData.topic.title;
        $('forum-delete-status').hidden = true; $('forum-delete-confirm').showModal();
    }
    function cancelDelete() {
        pendingDelete = null;
        if ($('forum-delete-confirm').open) $('forum-delete-confirm').close();
    }
    function moderationControls(disabled) {
        document.querySelectorAll('#forum-thread-moderation button, #forum-thread-moderation select, [data-forum-delete], #forum-delete-confirm button').forEach(button => { button.disabled = disabled; });
    }
    async function moderate(action, value, postId = null, category = null, confirmed = null) {
        const topic = threadData?.topic;
        if (!topic?.can_moderate || moderationBusy) return;
        const owner = confirmed?.userId || identity.state.userId;
        const permanent = action === 'delete_topic' || action === 'delete_reply';
        if (permanent && (!confirmed || confirmed.topicId !== topic.id || owner !== identity.state.userId)) { cancelDelete(); return; }
        if (!moderationReady() && !['pinned', 'closed'].includes(action)) return;
        const id = topic.id, destination = category || topic.category;
        moderationBusy = true; moderationControls(true);
        const status = permanent ? 'forum-delete-status' : 'forum-thread-server-status'; bind(status, 'forum.saving');
        try {
            const name = moderationReady() ? 'moderate_zh_forum_topic_v2' : 'moderate_zh_forum_topic';
            const args = { p_topic_id:id, p_action:action, p_value:value, p_post_id:postId };
            if (moderationReady()) args.p_category = category;
            await api.rpc(name, args, true, owner);
            overviewKey=''; categoryKey=''; profileKey='';
            window.ZHForumActivity.invalidate();
            if (permanent) cancelDelete();
            if (drafts.route().id !== id) return;
            if (action === 'delete_topic') {
                threadData=null; threadKey=''; editPost=null; $('forum-edit-form').hidden=true;
                $('forum-thread-posts').replaceChildren(); location.hash='category/' + destination;
            } else {
                if (action === 'delete_reply' && editPost?.id === postId) { editPost=null; $('forum-edit-form').hidden=true; }
                await thread(id,false,true);
            }
        } catch(e) { error(permanent && !$('forum-delete-confirm').open ? 'forum-thread-server-status' : status,e); }
        finally {
            moderationBusy=false; moderationControls(false);
            if (threadData && drafts.route().id === id) renderThread();
        }
    }
    function renderProfile() {
        if (!profileData) return;
        const p=profileData.profile; const heading=$('forum-public-profile-heading'); heading.textContent=p.display_name;
        heading.classList.add('zh-public-name'); heading.removeAttribute('data-system-role');
        if(['admin','member'].includes(p.system_role))heading.dataset.systemRole=p.system_role;
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
        window.ZHForumChangelog.connect(controller);
        window.ZHForumActivity.connect(controller);
        document.querySelectorAll('[data-forum-publish]').forEach(b=>b.addEventListener('click',publish));
        $('forum-load-topics').addEventListener('click',()=>category(drafts.route().category, document.querySelector('[data-forum-filter][aria-pressed="true"]').dataset.forumFilter, true));
        $('forum-load-posts').addEventListener('click',()=>thread(threadData.topic.id,true));
        $('forum-reply-form').addEventListener('submit',submitReply);
        $('forum-edit-form').addEventListener('submit',submitEdit);
        $('forum-edit-cancel').addEventListener('click',()=>{editPost=null;$('forum-edit-form').hidden=true;});
        $('forum-delete-cancel').addEventListener('click', cancelDelete);
        $('forum-delete-submit').addEventListener('click', () => {
            if (pendingDelete && !moderationBusy) moderate(pendingDelete.action, true, pendingDelete.postId, null, pendingDelete);
        });
        $('forum-delete-confirm').addEventListener('cancel', event => { if (moderationBusy) event.preventDefault(); });
        $('forum-delete-confirm').addEventListener('close', () => { pendingDelete=null; });
        window.addEventListener('hashchange', cancelDelete);
        identity.subscribe(state => {
            if (pendingDelete && (state.userId !== pendingDelete.userId || state.status !== 'member')) cancelDelete();
        });
        function refresh() { window.ZHForumActivity.invalidate(); categoryKey=''; threadKey=''; profileKey=''; overviewKey=''; const r=drafts.route(); if(r.view==='thread') thread(r.id); if(r.view==='profile') profile(r.id); if(r.view==='category') category(r.category); if(r.view==='overview') overview(); }
        document.addEventListener('zh:publicprofilechange',refresh);
        document.addEventListener('zh:forumchange',refresh);
        const reactionChanged=()=>{
            categoryKey='';profileKey='';
            if(drafts.route().view==='category'&&drafts.route().category==='changelog')category('changelog');
        };
        document.addEventListener('zh:forumreactionchange',reactionChanged);
        window.addEventListener('storage',e=>{if(e.key==='zh_forum_reaction_revision')reactionChanged();});
        window.addEventListener('storage',e=>{if(e.key==='zhserver_public_profile_revision') refresh();});
    }
    window.ZHForumContent=Object.freeze({connect,overview,category,thread,profile});
})();
