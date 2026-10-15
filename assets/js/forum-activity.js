/* Activity from the existing forum read RPC; statistics remain in the global footer. */
(() => {
    'use strict';
    if (!document.body.classList.contains('forum-page') || !window.ZHForum) return;
    const api = window.ZHForum, identity = window.ZHIdentity, lang = window.ZHLanguage;
    const $ = id => document.getElementById(id);
    const scope = () => (identity.state.userId || 'guest') + ':' + identity.state.status;
    const recentFirst = (a, b) => Date.parse(b.last_activity_at) - Date.parse(a.last_activity_at) || a.id.localeCompare(b.id);
    const node = (tag, text = '', cls = '') => {
        const el = document.createElement(tag); el.textContent = text; el.className = cls;
        el.setAttribute('data-i18n-ignore', ''); return el;
    };
    let controller, currentScope, generation = 0, snapshot = null, summary = [], pending = null, loadedAt = 0;
    const latestPosts = new Map(), queue = [];
    let active = 0;
    function pump() {
        while (active < 3 && queue.length) {
            const job = queue.shift(); active++;
            Promise.resolve().then(job.run).then(job.resolve, job.reject).finally(() => { active--; pump(); });
        }
    }
    function limited(run) {
        return new Promise((resolve, reject) => { queue.push({ run, resolve, reject }); pump(); });
    }
    function timestamp(value) {
        const el = node('time', '—');
        if (Number.isFinite(Date.parse(value))) {
            el.dateTime = value;
            el.textContent = new Intl.DateTimeFormat(lang.locale, { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit', timeZone:'Europe/Berlin' }).format(new Date(value));
            el.title = new Intl.DateTimeFormat(lang.locale, { dateStyle:'full', timeStyle:'short', timeZone:'Europe/Berlin' }).format(new Date(value));
        }
        return el;
    }
    const publicTopics = () => snapshot ? snapshot.topics.filter(topic => !topic.hidden && topic.category!=='changelog').sort(recentFirst) : [];
    const replies = count => lang.t(count === 1 ? 'forum.replyCountOne' : 'forum.replyCount', { count:count.toLocaleString(lang.locale) });
    function isRecent(value) {
        const age = Date.now() - Date.parse(value);
        return Number.isFinite(age) && age >= 0 && age < 86400000;
    }
    function refreshAccents() {
        document.querySelectorAll('[data-forum-activity-at]').forEach(row => {
            const recent = isRecent(row.dataset.forumActivityAt);
            row.classList.toggle('forum-topic-recent', recent);
            if (recent) row.title = lang.t('forum.recentActivity');
            else row.removeAttribute('title');
        });
    }
    function latest(topic) {
        const key = [currentScope, topic.id, topic.last_activity_at, topic.updated_at, topic.replies, topic.hidden].join(':');
        if (latestPosts.has(key)) return latestPosts.get(key);
        const ticket = generation;
        const promise = limited(async () => {
            if (ticket !== generation) return null;
            // With no visible replies the opening post is the last public post.
            if (topic.replies === 0 && !topic.hidden) return { author:topic.author, created_at:topic.created_at };
            let data = await api.rpc('get_zh_forum', { p_topic_id:topic.id });
            let offset = Math.max(0, data.post_count - 30);
            if (offset) data = await api.rpc('get_zh_forum', { p_topic_id:topic.id, p_post_offset:offset });
            while (ticket === generation) {
                const post = data.posts.filter(item => !item.hidden).at(-1);
                if (post || !offset) return post || null;
                offset = Math.max(0, offset - 30);
                data = await api.rpc('get_zh_forum', { p_topic_id:topic.id, p_post_offset:offset });
            }
            return null;
        }).catch(() => { if (ticket === generation) latestPosts.delete(key); return null; });
        latestPosts.set(key, promise); return promise;
    }
    function authorLine(post, linked = false) {
        const line = node('span', '', 'forum-last-author');
        if (!post) { line.textContent = '—'; line.title = lang.t('forum.activityUnavailable'); return line; }
        const name = post.author?.display_name || lang.t('forum.formerMember');
        line.append(document.createTextNode(lang.t('forum.lastBy') + ' '));
        const author = api.name(post.author, linked && post.author?.user_id ? 'a' : 'span');
        if (author.tagName === 'A') author.href = '#profile/' + post.author.user_id;
        line.append(author); return line;
    }
    function topicCell(topic) {
        const cell = node('span', '', 'forum-topic-activity');
        const ticket = generation;
        cell.append(authorLine(null), timestamp(topic.last_activity_at));
        latest(topic).then(post => {
            if (ticket === generation && cell.isConnected) cell.querySelector('.forum-last-author').replaceWith(authorLine(post, true));
        });
        return cell;
    }
    function renderCategories() {
        const stats = new Map(summary.map(item => [item.category, item])), topics = publicTopics();
        document.querySelectorAll('[data-forum-category]').forEach(row => {
            const stat = stats.get(row.dataset.forumCategory);
            const count = row.querySelector('.forum-category-count span:last-child');
            count.removeAttribute('data-forum-label'); count.removeAttribute('aria-label');
            count.setAttribute('data-i18n-ignore', ''); count.textContent = String(stat?.topics ?? 0);
            const activity = row.querySelector('.forum-category-activity');
            activity.removeAttribute('data-forum-i18n'); activity.setAttribute('data-i18n-ignore', '');
            activity.replaceChildren();
            if (!stat?.topics) { activity.textContent = lang.t('forum.noActivity'); return; }
            const topic = topics.find(item => item.category === row.dataset.forumCategory && item.last_activity_at === stat.last_activity_at) || stat.latest_topic;
            if (!topic) { activity.append(timestamp(stat.last_activity_at)); return; }
            const title = node('span', topic.title, 'forum-last-topic'); title.title = topic.title;
            if(row.dataset.forumCategory==='changelog'){
                activity.append(title,authorLine({author:topic.author}),node('time',window.ZHForumChangelog.date(topic)));return;
            }
            activity.append(title, authorLine(null), timestamp(topic.last_activity_at));
            const ticket = generation;
            latest(topic).then(post => {
                if (ticket === generation && activity.isConnected && activity.firstElementChild?.textContent === topic.title) activity.querySelector('.forum-last-author').replaceWith(authorLine(post));
            });
        });
    }
    function render() {
        refreshAccents();
        if (!controller || !snapshot) return;
        const topics = publicTopics();
        $('forum-top-topics').replaceChildren(...topics.slice(0, 5).map(topic => {
            const item = node('li', '', 'forum-active-topic'), link = node('a', topic.title, 'forum-active-title');
            link.href = '#thread/' + topic.id;
            const meta = node('span', '', 'forum-active-meta'), category = node('a', controller.title(topic.category));
            category.href = '#category/' + topic.category;
            meta.append(category, node('span', replies(topic.replies)));
            item.append(link, meta, authorLine(null, true), timestamp(topic.last_activity_at));
            const ticket = generation;
            latest(topic).then(post => {
                if (ticket === generation && item.isConnected) item.querySelector('.forum-last-author').replaceWith(authorLine(post, true));
            });
            window.ZHForumLinks.bind(item, link); return item;
        }));
        $('forum-top-status').hidden = topics.length > 0;
        if (!topics.length) lang.bind($('forum-top-status'), 'forum.noActivity');
        renderCategories();
    }
    function clear() {
        generation++; snapshot = null; summary = []; pending = null; loadedAt = 0; latestPosts.clear();
        $('forum-top-topics').replaceChildren();
    }
    async function refresh(force = false) {
        if (currentScope !== scope()) { currentScope = scope(); clear(); }
        if (!force && snapshot && Date.now() - loadedAt < 60000) { render(); return snapshot; }
        if (pending) return pending;
        const ticket = generation;
        $('forum-top-status').hidden = false; lang.bind($('forum-top-status'), 'forum.loading');
        let request;
        request = (async () => {
            try {
                let first = await api.rpc('get_zh_forum', {}), topics = first.topics.slice();
                // The RPC puts pinned topics first. Read all existing pages before ranking by activity.
                while (topics.length < first.total) {
                    if (ticket !== generation) return null;
                    const page = await api.rpc('get_zh_forum', { p_offset:topics.length });
                    if (!page.topics.length) throw new Error('forum.networkError');
                    topics.push(...page.topics);
                }
                const data = { ...first, topics:[...new Map(topics.map(topic => [topic.id, topic])).values()] };
                if (ticket !== generation || currentScope !== scope()) return null;
                snapshot = data; summary = data.categories; loadedAt = Date.now(); render(); return data;
            } catch (error) {
                if (ticket === generation) {
                    snapshot = null; $('forum-top-topics').replaceChildren();
                    $('forum-top-status').hidden = false; lang.bind($('forum-top-status'), 'forum.networkError');
                }
                throw error;
            } finally { if (pending === request) pending = null; }
        })();
        pending = request; return request;
    }
    const backgroundRefresh = () => { refresh().catch(() => {}); };
    function invalidate() { clear(); backgroundRefresh(); }
    function categories(data) { summary = data.categories; renderCategories(); }
    function connect(drafts) {
        controller = drafts;
        document.addEventListener('zh:languagechange', render);
        window.addEventListener('hashchange', backgroundRefresh);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) backgroundRefresh(); });
        identity.subscribe(backgroundRefresh);
        backgroundRefresh();
    }
    window.ZHForumActivity = Object.freeze({ connect, refresh, invalidate, categories, topicCell, replies, isRecent, lastAuthor:latest, authorLine });
})();
