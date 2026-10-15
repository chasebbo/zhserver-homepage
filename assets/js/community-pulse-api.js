/* Extension of the existing voting option table and central Supabase session. */
(() => {
    'use strict';
    const identity = window.ZHIdentity;
    const errors = new Set(['pulse.signInRequired','pulse.forbidden','pulse.invalid','pulse.closed',
        'pulse.notFound','pulse.editConflict','pulse.optionsLocked']);
    const enabled = () => window.ZHCommunityFeatures?.pulse === true;
    const validCopy = value => value && typeof value.de === 'string' && typeof value.en === 'string';
    const validPoll = poll => poll && typeof poll.id === 'string' && validCopy(poll.question) &&
        ['open','closed','archived'].includes(poll.state) && Number.isSafeInteger(poll.total) && poll.total >= 0 &&
        Array.isArray(poll.options) && poll.options.length >= 2 && poll.options.length <= 4 &&
        poll.options.every(option => typeof option.id === 'string' && validCopy(option.labels) && Number.isSafeInteger(option.votes) && option.votes >= 0) &&
        poll.options.reduce((sum,option)=>sum+option.votes,0) === poll.total;
    async function request(name, args, write = false) {
        if (!enabled()) throw new Error('pulse.preparing');
        const principal = write ? await identity.resolve() : identity.state;
        if (write && (!principal.userId || !['member','nameRequired'].includes(principal.status))) throw new Error('pulse.signInRequired');
        const owner = principal.userId;
        let result;
        try { result = await identity.client.rpc(name, args); } catch (_) { throw new Error('pulse.network'); }
        if (result.error) throw new Error(errors.has(result.error.message) ? result.error.message : 'pulse.network');
        if (identity.state.userId !== owner) throw new Error('identity.sessionChanged');
        if (!result.data || result.data.version !== 1 || !Array.isArray(result.data.polls) || !result.data.polls.every(validPoll)) throw new Error('pulse.network');
        return result.data;
    }
    const copy = value => value?.[window.ZHLanguage.language] || value?.de || '';
    window.ZHPulseAPI = Object.freeze({ enabled, copy,
        read: (admin = false) => request('get_zh_community_pulse', { p_admin:admin }),
        vote: (id, option) => request('cast_zh_community_pulse_vote', { p_poll_id:id,p_option_id:option }, true),
        save: payload => request('manage_zh_community_pulse', payload, true),
        remove: (id, expected) => request('delete_zh_community_pulse', {p_poll_id:id,p_expected_at:expected}, true) });
})();
