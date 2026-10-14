/* Presentation for the forum overview: campfire visibility, intro by sign-in state and a
   community line built only from forum data the activity module has already loaded. */
(() => {
    'use strict';
    if (!document.body.classList.contains('forum-page')) return;
    const lang = window.ZHLanguage, identity = window.ZHIdentity, activity = window.ZHForumActivity;
    const overview = document.getElementById('forum-overview');
    const intro = document.getElementById('forum-intro-text');
    const guest = document.getElementById('forum-intro-guest');
    const pulse = document.getElementById('forum-pulse');
    if (!lang || !overview || !intro || !guest || !pulse) return;

    // The campfire belongs to the overview only; category and thread views keep the warm styling.
    const syncView = () => document.documentElement.classList.toggle('forum-detail-view', overview.hidden);
    new MutationObserver(syncView).observe(overview, { attributes: true, attributeFilter: ['hidden'] });
    syncView();

    let data = null, ticket = 0;
    const node = (tag, text, cls) => {
        const el = document.createElement(tag);
        if (text) el.textContent = text;
        if (cls) el.className = cls;
        return el;
    };

    function relative(value) {
        const time = Date.parse(value);
        if (!Number.isFinite(time)) return null;
        const minutes = Math.round((Date.now() - time) / 60000);
        if (minutes < 0 || minutes >= 60 * 24 * 30) {
            return new Intl.DateTimeFormat(lang.locale, { day: 'numeric', month: 'short', timeZone: 'Europe/Berlin' }).format(new Date(time));
        }
        const format = new Intl.RelativeTimeFormat(lang.locale, { numeric: 'auto' });
        if (minutes < 60) return format.format(-Math.max(minutes, 1), 'minute');
        if (minutes < 60 * 24) return format.format(-Math.round(minutes / 60), 'hour');
        return format.format(-Math.round(minutes / (60 * 24)), 'day');
    }

    function renderPulse() {
        const topics = data ? data.topics.filter(topic => !topic.hidden) : [];
        if (!topics.length) { pulse.hidden = true; pulse.replaceChildren(); return; }
        const latest = topics.reduce((a, b) => Date.parse(b.last_activity_at) > Date.parse(a.last_activity_at) ? b : a);
        const replies = topics.reduce((sum, topic) => sum + (Number(topic.replies) || 0), 0);
        const link = node('a', latest.title, 'forum-pulse-topic');
        link.href = '#thread/' + latest.id;
        const when = relative(latest.last_activity_at);
        const time = node('time', when);
        time.dateTime = latest.last_activity_at;
        const counts = node('span', lang.t(topics.length === 1 ? 'forum.pulse.topicsOne' : 'forum.pulse.topics', { count: topics.length })
            + ' · ' + activity.replies(replies), 'forum-pulse-counts');
        pulse.replaceChildren(node('span', lang.t('forum.pulse.latest'), 'forum-pulse-label'), link);
        if (when) pulse.append(node('span', '·', 'forum-pulse-sep'), time);
        pulse.append(counts);
        pulse.hidden = false;
    }

    async function loadPulse() {
        if (!activity) return;
        const mine = ++ticket;
        try {
            // refresh() reuses the activity module's cached snapshot or its pending request.
            const result = await activity.refresh();
            if (mine === ticket && result) { data = result; renderPulse(); }
        } catch (_) {
            if (mine === ticket) { data = null; renderPulse(); }
        }
    }

    function syncIdentity(state) {
        lang.bind(intro, state.status === 'member' ? 'forum.introMember' : 'forum.introGuest');
        guest.hidden = state.status !== 'guest';
        loadPulse();
    }

    if (identity) identity.subscribe(syncIdentity);
    else lang.bind(intro, 'forum.introGuest');
    document.addEventListener('zh:languagechange', renderPulse);
    window.addEventListener('hashchange', () => { if (!overview.hidden) loadPulse(); });
})();
