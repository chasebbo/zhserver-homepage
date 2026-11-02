/* Public clan display: clan under the author name and a clan page (#clan/TAG). Read only, no online status. */
(() => {
    'use strict';
    if (!document.body.classList.contains('forum-page') || !window.ZHIdentity || !window.ZHLanguage) return;
    const client = window.ZHIdentity.client, lang = window.ZHLanguage;
    const texts = {
        de: { eyebrow: 'Clan', founded: 'Gegründet am {date}', founder: 'Gründer', leader: 'Anführer', members: 'Mitglieder ({count})',
            name: 'Name', rank: 'Rang', joined: 'Beigetreten', loading: 'Clan wird geladen …', notFound: 'Diesen Clan gibt es nicht.',
            unavailable: 'Der Clan kann gerade nicht geladen werden.', back: 'Zurück zum Forum', noDescription: 'Noch keine Beschreibung.',
            hint: 'Clans werden im Spiel gegründet und verwaltet.', ranks: {} },
        en: { eyebrow: 'Clan', founded: 'Founded {date}', founder: 'Founder', leader: 'Leader', members: 'Members ({count})',
            name: 'Name', rank: 'Rank', joined: 'Joined', loading: 'Loading clan …', notFound: 'This clan does not exist.',
            unavailable: 'The clan cannot be loaded right now.', back: 'Back to the forum', noDescription: 'No description yet.',
            hint: 'Clans are founded and managed in the game.', ranks: { 'Anführer': 'Leader', 'Offizier': 'Officer', 'Mitglied': 'Member' } }
    };
    const t = (key, params = {}) => (texts[lang.language] || texts.de)[key].replace(/\{(\w+)\}/g, (_, name) => params[name]);
    const rankText = rank => (texts[lang.language] || texts.de).ranks[rank] || rank;
    const $ = id => document.getElementById(id);
    const cacheKey = 'zh_public_clan_tags_v1', cacheMs = 5 * 60 * 1000;
    const validTag = tag => typeof tag === 'string' && /^[\p{L}\p{N}]{2,5}$/u.test(tag);
    const plain = (tag, text, cls) => {
        const node = document.createElement(tag); node.textContent = text; node.setAttribute('data-i18n-ignore', '');
        if (cls) node.className = cls; return node;
    };
    const day = value => new Intl.DateTimeFormat(lang.locale, { dateStyle: 'medium', timeZone: 'Europe/Berlin' }).format(new Date(value));
    let byName = null, loading = null, pending = [], pageTag = '', pageData = null, pageState = 'idle', pageTicket = 0;

    function readCache() {
        try {
            const saved = JSON.parse(localStorage.getItem(cacheKey));
            const age = Date.now() - saved?.at;
            if (Number.isFinite(age) && age >= 0 && age < cacheMs && Array.isArray(saved.rows)) return saved.rows;
        } catch (_) { /* No usable cache: ask the database. */ }
        return null;
    }
    function remember(rows) {
        try { localStorage.setItem(cacheKey, JSON.stringify({ rows, at: Date.now() })); } catch (_) { /* Optional. */ }
    }
    // One request per page view for all names, not one per post.
    function load() {
        if (byName) return Promise.resolve(byName);
        if (!loading) loading = (async () => {
            let rows = readCache();
            if (!rows) {
                const result = await client.rpc('get_public_clan_tags');
                if (result.error || !Array.isArray(result.data)) throw new Error('unavailable');
                rows = result.data.filter(row => typeof row?.player_name === 'string' && typeof row.clan_name === 'string' && validTag(row.clan_tag))
                    .map(row => ({ player_name: row.player_name, clan_name: row.clan_name, clan_tag: row.clan_tag }));
                remember(rows);
            }
            byName = new Map(rows.map(row => [row.player_name, row]));
            return byName;
        })().catch(() => { byName = new Map(); return byName; });
        return loading;
    }
    function line(clan) {
        const link = plain('a', '', 'forum-author-clan');
        link.href = '#clan/' + encodeURIComponent(clan.clan_tag);
        link.append(plain('b', '[' + clan.clan_tag + ']'), document.createTextNode(' ' + clan.clan_name));
        return link;
    }
    function decorate(container, profile) {
        container.querySelector(':scope > .forum-author-clan')?.remove();
        const clan = byName.get(profile?.display_name);
        if (clan) container.append(line(clan));
    }
    // Players without a clan get nothing. Names are matched as plain text.
    function attach(container, profile) {
        if (!container || typeof profile?.display_name !== 'string') return;
        if (byName) { decorate(container, profile); return; }
        pending.push([container, profile]);
        void load().then(() => {
            const waiting = pending; pending = [];
            for (const [node, owner] of waiting) if (node.isConnected) decorate(node, owner);
        });
    }

    function status(key) {
        const node = $('forum-clan-status');
        node.hidden = !key; node.textContent = key ? t(key) : '';
    }
    function renderPage() {
        $('forum-clan-eyebrow').textContent = t('eyebrow');
        $('forum-clan-back').textContent = t('back');
        $('forum-clan-hint').textContent = t('hint');
        const body = $('forum-clan-body'), clan = pageData;
        body.hidden = pageState !== 'ready';
        status(pageState === 'ready' ? '' : pageState);
        $('forum-clan-heading').textContent = clan?.clan_name || t('eyebrow');
        $('forum-clan-tag').textContent = clan ? '[' + clan.clan_tag + ']' : '';
        $('forum-clan-tag').hidden = !clan;
        if (pageState !== 'ready') return;
        $('forum-clan-founded').textContent = clan.founded_at ? t('founded', { date: day(clan.founded_at) }) : '';
        $('forum-clan-description').textContent = clan.description || t('noDescription');
        const facts = $('forum-clan-facts');
        facts.replaceChildren(...[['founder', clan.founder_name], ['leader', clan.leader_name]].filter(([, value]) => value).map(([key, value]) => {
            const item = document.createElement('div');
            item.append(plain('dt', t(key)), plain('dd', value));
            return item;
        }));
        $('forum-clan-members-heading').textContent = t('members', { count: clan.members.length });
        $('forum-clan-head-name').textContent = t('name');
        $('forum-clan-head-rank').textContent = t('rank');
        $('forum-clan-head-joined').textContent = t('joined');
        $('forum-clan-members').replaceChildren(...clan.members.map(member => {
            const row = document.createElement('tr');
            row.append(plain('td', member.player_name), plain('td', rankText(member.rank), 'forum-clan-rank'),
                plain('td', member.joined_at ? day(member.joined_at) : '', 'forum-clan-date'));
            return row;
        }));
    }
    function validClan(data) {
        return data && typeof data === 'object' && typeof data.clan_name === 'string' && validTag(data.clan_tag) && Array.isArray(data.members) &&
            data.members.every(member => typeof member?.player_name === 'string' && typeof member.rank === 'string');
    }
    async function page(tag) {
        if (pageTag === tag && pageState === 'ready') { renderPage(); return; }
        const ticket = ++pageTicket;
        pageTag = tag; pageData = null;
        pageState = validTag(tag) ? 'loading' : 'notFound';
        renderPage();
        if (pageState === 'notFound') return;
        try {
            const result = await client.rpc('get_public_clan', { p_tag: tag });
            if (ticket !== pageTicket) return;
            if (result.error) throw new Error('unavailable');
            if (result.data === null) { pageState = 'notFound'; renderPage(); return; }
            if (!validClan(result.data)) throw new Error('unavailable');
            pageData = result.data; pageState = 'ready';
        } catch (_) {
            if (ticket !== pageTicket) return;
            pageState = 'unavailable';
        }
        renderPage();
    }
    document.addEventListener('zh:languagechange', () => { if (pageTag) renderPage(); });
    window.ZHForumClan = Object.freeze({ attach, page });
})();
