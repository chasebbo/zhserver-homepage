/* Landingpage only: existing public reader, no view registration, votes or polling. */
(() => {
    'use strict';
    const root = document.querySelector('.home-page.home-chapters .home-forum-teaser');
    const lang = window.ZHLanguage;
    if (!root || !lang) return;
    const list = document.getElementById('home-forum-topics');
    const status = document.getElementById('home-forum-status');
    const bindings = [...root.querySelectorAll('[data-i18n-message]')]
        .filter(element => element !== status).map(element => [element, element.dataset.i18nMessage]);
    const categories = new Set(['announcements', 'general', 'bugs', 'ideas', 'guides', 'groups', 'trading', 'offtopic']);
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let topics = [], statusKey = 'forum.loading';

    function render() {
        bindings.forEach(([element, key]) => lang.bind(element, key));
        lang.bind(status, statusKey);
        status.hidden = topics.length > 0;
        list.hidden = topics.length === 0;
        list.replaceChildren(...topics.map(topic => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'home-forum-topic';
            link.href = 'forum/#thread/' + topic.id;
            link.setAttribute('data-i18n-ignore', '');
            const title = document.createElement('span');
            title.className = 'home-forum-topic-title';
            title.textContent = topic.title;
            const meta = document.createElement('span');
            meta.className = 'home-forum-topic-meta';
            const category = window.ZHTranslations.copy['forum-category-' + topic.category];
            meta.textContent = (category[lang.language] || category.de) + ' · ' +
                lang.t(topic.replies === 1 ? 'forum.replyCountOne' : 'forum.replyCount', {count: topic.replies.toLocaleString(lang.locale)});
            if (topic.views !== null) {
                const views = document.createElement('span');
                views.className = 'home-forum-topic-views';
                views.setAttribute('role', 'img');
                views.setAttribute('aria-label', lang.t('forum.viewCount', {count: topic.views.toLocaleString(lang.locale)}));
                const eye = document.createElement('i');
                eye.className = 'fa-solid fa-eye';
                eye.setAttribute('aria-hidden', 'true');
                const count = document.createElement('span');
                count.textContent = topic.views.toLocaleString(lang.locale);
                count.setAttribute('aria-hidden', 'true');
                views.append(eye, count);
                meta.append(document.createTextNode(' · '), views);
            }
            link.append(title, meta);
            item.append(link);
            return item;
        }));
    }

    async function load() {
        try {
            const client = window.ZHIdentity?.client;
            const key = typeof SUPABASE_KEY === 'string' ? SUPABASE_KEY : null;
            if (!client || !key) throw new Error('unavailable');
            const seen = new Set(), discussions = [];
            let offset = 0, total;
            // The reader sorts pins first, then activity. Include the pins before
            // re-sorting; stop after two normal discussions, since later ones are older.
            do {
                const {data, error} = await client.rpc('get_zh_forum', {p_offset: offset})
                    // Only this request uses public rights; the shared session is untouched.
                    .setHeader('Authorization', 'Bearer ' + key)
                    .abortSignal(AbortSignal.timeout(10000));
                if (error || !data || !Array.isArray(data.topics) || !Number.isSafeInteger(data.total) || data.total < 0 || data.total > 100000)
                    throw new Error('unavailable');
                total = data.total;
                if (!data.topics.length && offset < total) throw new Error('incomplete');
                for (const topic of data.topics) {
                    if (!topic || !uuid.test(topic.id) || seen.has(topic.id)) throw new Error('invalid');
                    seen.add(topic.id);
                    if (topic.hidden !== false || !categories.has(topic.category) || topic.changelog) continue;
                    if (typeof topic.title !== 'string' || !topic.title.trim() ||
                        !Number.isSafeInteger(topic.replies) || topic.replies < 0 || typeof topic.pinned !== 'boolean' ||
                        typeof topic.last_activity_at !== 'string' || !Number.isFinite(Date.parse(topic.last_activity_at))) continue;
                    // Retain only public display fields, never profiles or email addresses.
                    discussions.push({id: topic.id, title: topic.title, category: topic.category,
                        replies: topic.replies, activity: Date.parse(topic.last_activity_at), pinned: topic.pinned,
                        views: Number.isSafeInteger(topic.views_count) && topic.views_count >= 0 ? topic.views_count : null});
                }
                offset += data.topics.length;
                if (discussions.filter(topic => !topic.pinned).length >= 2) break;
            } while (offset < total);
            topics = discussions.sort((a, b) => b.activity - a.activity || a.id.localeCompare(b.id)).slice(0, 2);
            statusKey = 'forum.noActivity';
        } catch (_) {
            topics = [];
            statusKey = 'home.forum.unavailable';
        }
        render();
    }
    document.addEventListener('zh:languagechange', render);
    render();
    load();
})();
