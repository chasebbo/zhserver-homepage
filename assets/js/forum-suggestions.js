/* Status for topics in "Ideen & Vorschläge". Display for everyone; setting only via the admin-checked RPC. */
(() => {
    'use strict';
    if (window.ZHForumSuggestion) return;
    const lang = window.ZHLanguage;
    // The interface offers accepted/declined; other stored values are still shown readably.
    const known = ['accepted', 'declined', 'reviewing', 'in_progress', 'done'];
    const status = topic => topic?.category === 'ideas' && known.includes(topic?.suggestion?.status) ? topic.suggestion.status : null;
    function badge(topic) {
        const value = status(topic); if (!value) return null;
        const node = document.createElement('span');
        node.className = 'forum-suggestion-badge'; node.dataset.suggestionStatus = value;
        node.setAttribute('data-i18n-ignore', '');
        node.textContent = lang.t('forum.suggestion.' + value);
        return node;
    }
    function threadNote(topic) {
        const value = status(topic); if (!value) return null;
        const wrap = document.createElement('div');
        wrap.className = 'forum-suggestion-thread'; wrap.setAttribute('data-i18n-ignore', '');
        wrap.append(badge(topic));
        if (value === 'declined' && topic.suggestion.note) {
            const note = document.createElement('p'); note.className = 'forum-suggestion-note';
            note.textContent = lang.t('forum.suggestionReasonShown', { reason: topic.suggestion.note });
            wrap.append(note);
        }
        return wrap;
    }
    // Admin controls inside "Thema moderieren". The server decides; the buttons only call the checked RPC.
    function controls(topic, data, apply) {
        if (topic?.category !== 'ideas' || !topic.can_moderate || data?.suggestion_status_version !== 1) return null;
        const current = status(topic);
        const box = document.createElement('div'); box.className = 'forum-suggestion-controls';
        box.setAttribute('data-i18n-ignore', '');
        const heading = document.createElement('h4'); heading.textContent = lang.t('forum.suggestionHeading'); box.append(heading);
        const row = document.createElement('div'); row.className = 'forum-suggestion-actions';
        const button = (key, cls, handler) => {
            const node = document.createElement('button'); node.type = 'button'; node.className = 'forum-button ' + cls;
            node.textContent = lang.t(key); node.addEventListener('click', handler); return node;
        };
        const accept = button('forum.suggestionAccept', 'forum-button-secondary forum-suggestion-accept', () => apply('accepted', null));
        accept.disabled = current === 'accepted';
        const reasonId = 'forum-suggestion-reason';
        const label = document.createElement('label'); label.htmlFor = reasonId; label.textContent = lang.t('forum.suggestionReason');
        const reason = document.createElement('input'); reason.id = reasonId; reason.type = 'text'; reason.maxLength = 200;
        reason.value = current === 'declined' ? topic.suggestion.note || '' : '';
        const decline = button('forum.suggestionDecline', 'forum-button-danger forum-suggestion-decline',
            () => apply('declined', reason.value.trim() || null));
        const field = document.createElement('div'); field.className = 'forum-suggestion-reason'; field.append(label, reason);
        row.append(accept, field, decline);
        if (current) row.append(button('forum.suggestionClear', 'forum-button-secondary forum-suggestion-clear', () => apply(null, null)));
        box.append(row);
        return box;
    }
    // The extra filter exists only in "Ideen & Vorschläge"; elsewhere it falls back to all topics.
    function filterVisible(category) {
        const node = document.querySelector('[data-forum-filter="accepted"]');
        if (node) node.hidden = category !== 'ideas';
        return category === 'ideas';
    }
    const matches = (topic, filter) => filter === 'accepted' ? status(topic) === 'accepted' : filter === 'all' || !!topic[filter];
    window.ZHForumSuggestion = Object.freeze({ badge, threadNote, controls, filterVisible, matches });
})();
