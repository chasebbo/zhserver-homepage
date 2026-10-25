/* Landingpage only: newest published changelog as a slim band. Existing public reader, no view registration. */
(() => {
    'use strict';
    const band = document.querySelector('.home-page.home-chapters .home-changelog-band');
    const lang = window.ZHLanguage;
    if (!band || !lang) return;
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let entry = null;

    function text(tag, className, value) {
        const node = document.createElement(tag);
        node.className = className;
        node.textContent = value;
        return node;
    }

    function render() {
        // Without a changelog the band stays hidden; there is no error state.
        band.hidden = !entry;
        if (!entry) return band.replaceChildren();
        const link = document.createElement('a');
        link.className = 'home-changelog-link';
        link.href = 'forum/#thread/' + entry.id;
        link.setAttribute('aria-label', lang.t('home.changelog.label', {title: entry.title}));
        const lead = text('span', 'home-changelog-lead', '');
        lead.append(text('span', 'home-changelog-new', lang.t('home.changelog.new')), text('span', 'home-changelog-title', entry.title),
            text('span', 'home-changelog-more', lang.t('home.changelog.more')), text('span', 'home-changelog-arrow', '→'));
        const meta = text('span', 'home-changelog-meta', '');
        if (entry.date) {
            const time = text('time', '', new Intl.DateTimeFormat(lang.locale, {dateStyle: 'medium', timeZone: 'Europe/Berlin'}).format(new Date(entry.date + 'T12:00:00Z')));
            time.dateTime = entry.date;
            meta.append(time);
        }
        if (entry.views !== null) {
            const views = text('span', 'home-changelog-views', '');
            views.setAttribute('role', 'img');
            views.setAttribute('aria-label', lang.t('forum.viewCount', {count: entry.views.toLocaleString(lang.locale)}));
            const eye = document.createElement('i');
            eye.className = 'fa-solid fa-eye';
            eye.setAttribute('aria-hidden', 'true');
            const count = text('span', '', entry.views.toLocaleString(lang.locale));
            count.setAttribute('aria-hidden', 'true');
            views.append(eye, count);
            meta.append(views);
        }
        link.append(lead, meta);
        band.replaceChildren(link);
    }

    async function load() {
        try {
            const client = window.ZHIdentity?.client;
            const key = typeof SUPABASE_KEY === 'string' ? SUPABASE_KEY : null;
            if (!client || !key) throw new Error('unavailable');
            const {data, error} = await client.rpc('get_zh_forum', {p_category: 'changelog'})
                // Only this request uses public rights; the shared session is untouched.
                .setHeader('Authorization', 'Bearer ' + key)
                .abortSignal(AbortSignal.timeout(10000));
            if (error || !data || !Array.isArray(data.topics)) throw new Error('unavailable');
            const day = topic => /^\d{4}-\d{2}-\d{2}$/.test(topic.changelog?.date || '') ? topic.changelog.date : '';
            // Newest by release date; the reader may list pinned entries first.
            const newest = data.topics.filter(topic => topic && uuid.test(topic.id) && topic.category === 'changelog' && topic.hidden === false &&
                    typeof topic.title === 'string' && topic.title.trim() && Number.isFinite(Date.parse(topic.last_activity_at)))
                .sort((a, b) => day(b).localeCompare(day(a)) || Date.parse(b.last_activity_at) - Date.parse(a.last_activity_at) || a.id.localeCompare(b.id))[0];
            entry = newest ? {id: newest.id, title: newest.title.trim(), date: day(newest),
                views: Number.isSafeInteger(newest.views_count) && newest.views_count >= 0 ? newest.views_count : null} : null;
        } catch (_) {
            entry = null;
        }
        render();
    }
    document.addEventListener('zh:languagechange', render);
    load();
})();
