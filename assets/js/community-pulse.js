(() => {
    'use strict';
    const root = document.getElementById('community-pulse-card');
    if (!root || !window.ZHPulseAPI) return;
    const api = window.ZHPulseAPI, identity = window.ZHIdentity, lang = window.ZHLanguage;
    document.querySelectorAll('#community-pulse-card [data-i18n-message], .era-arma-note [data-i18n-message]').forEach(e=>{
        const key=e.getAttribute('data-i18n-message'); if(key)lang.bind(e,key);
    });
    const $ = id => document.getElementById(id);
    let polls = [], index = 0, busy = false, generation = 0, timer, touchTimer;
    const pauses = new Set();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const number = value => Number(value).toLocaleString(lang.locale);
    function node(tag, text, cls) {
        const e = document.createElement(tag); e.textContent = text; e.setAttribute('data-i18n-ignore','');
        if (cls) e.className = cls; return e;
    }
    function schedule() {
        clearTimeout(timer);
        if (polls.length > 1 && !busy && !polls[index].my_vote && polls[index].state !== 'closed' && !pauses.size && !reduced.matches && !document.hidden)
            timer = setTimeout(() => change(1), 10000);
    }
    function pause(reason, value) { if (value) pauses.add(reason); else pauses.delete(reason); schedule(); }
    function change(step, target) {
        if (busy || !polls.length) return;
        index = target ?? (index + step + polls.length) % polls.length;
        $('pulse-feedback').hidden = true; render();
    }
    function status(key) {
        $('pulse-status').hidden = false; lang.bind($('pulse-status'), key);
        $('pulse-body').hidden = true; clearTimeout(timer);
    }
    function render() {
        if (!api.enabled()) { status('pulse.preparing'); return; }
        if (!polls.length) { status('pulse.empty'); return; }
        const poll = polls[index];
        const member = ['member','nameRequired'].includes(identity.state.status);
        $('pulse-status').hidden = true; $('pulse-body').hidden = false;
        $('pulse-question').textContent = api.copy(poll.question);
        const options = $('pulse-options'); options.replaceChildren();
        for (const option of poll.options) {
            const selected = member && poll.my_vote === option.id;
            const button = node('button', '', 'pulse-option' + (selected ? ' is-selected' : ''));
            button.type = 'button'; button.disabled = busy || poll.state !== 'open' || !member;
            button.setAttribute('aria-pressed', String(selected));
            const name = node('span', api.copy(option.labels)); button.append(name);
            const share = poll.total ? option.votes / poll.total * 100 : 0;
            button.append(node('span', Math.round(share) + ' %', 'pulse-percent'));
            const bar = node('span', '', 'pulse-result-bar'); bar.setAttribute('aria-hidden','true');
            bar.style.setProperty('--pulse-share', share + '%'); button.append(bar);
            button.addEventListener('click', () => vote(poll.id, option.id)); options.append(button);
        }
        root.classList.add('pulse-showing-results');
        $('pulse-total').hidden = false;
        lang.bind($('pulse-total'), poll.total === 1 ? 'pulse.totalOne' : 'pulse.total', { count:number(poll.total) });
        $('pulse-account').hidden = member || poll.state !== 'open';
        $('pulse-closed').hidden = poll.state !== 'closed';
        lang.bind($('pulse-position'), 'pulse.position', { current:index+1,total:polls.length });
        $('pulse-prev').disabled = busy || polls.length < 2; $('pulse-next').disabled = busy || polls.length < 2;
        const dots = $('pulse-dots'); dots.replaceChildren(); dots.hidden = polls.length < 2 || polls.length > 8;
        if (!dots.hidden) polls.forEach((_poll, i) => {
            const button = node('button',''); button.type='button'; button.className='community-pulse-dot'; button.disabled=busy;
            button.setAttribute('aria-label',lang.t('pulse.questionNumber',{number:i+1})); button.setAttribute('aria-pressed',String(i===index));
            button.addEventListener('click',()=>change(0,i)); dots.append(button);
        });
        root.setAttribute('aria-busy',String(busy)); schedule();
        root.querySelector('.pulse-nav').setAttribute('aria-label',lang.t('pulse.polls'));
    }
    async function vote(id, option) {
        if (busy) return;
        if (!['member','nameRequired'].includes(identity.state.status)) {
            $('pulse-account').hidden=false; $('pulse-login').focus(); return;
        }
        busy = true; const ticket = generation; $('pulse-feedback').hidden=true; pause('vote',true); render();
        try {
            const data = await api.vote(id,option);
            if (ticket !== generation) return;
            polls = data.polls; index=Math.max(0,polls.findIndex(p=>p.id===id));
            lang.bind($('pulse-feedback'),'pulse.saved'); $('pulse-feedback').hidden=false;
        } catch (e) {
            if (ticket !== generation) return;
            lang.bind($('pulse-feedback'), lang.t(e.message) === e.message ? 'pulse.network' : e.message); $('pulse-feedback').hidden=false;
        } finally { if(ticket===generation) { busy=false; pause('vote',false); render(); } }
    }
    async function load(refresh=false) {
        const previous=refresh?polls[index]:null;
        const ticket = ++generation; clearTimeout(timer); busy=false;
        if(!refresh){polls=[];render();}
        if (!api.enabled()) return;
        if(!refresh||!polls.length)status('pulse.loading');
        try {
            const data=await api.read(); if(ticket!==generation) return;
            polls=data.polls; index=Math.max(0,polls.findIndex(p=>p.id===previous?.id));
            render();
        } catch (e) { if(ticket===generation) status(e.message==='identity.sessionChanged'?'pulse.loading':'pulse.network'); }
    }
    root.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')pause('hover',true);});
    root.addEventListener('pointerleave',()=>pause('hover',false));
    root.addEventListener('focusin',()=>pause('focus',true));
    root.addEventListener('focusout',()=>setTimeout(()=>pause('focus',root.contains(document.activeElement)),0));
    root.addEventListener('pointerdown',e=>{
        if(e.pointerType==='touch') { clearTimeout(touchTimer); pause('touch',true); touchTimer=setTimeout(()=>pause('touch',false),20000); }
    });
    document.addEventListener('visibilitychange',()=>schedule()); reduced.addEventListener('change',schedule);
    $('pulse-prev').addEventListener('click',()=>change(-1)); $('pulse-next').addEventListener('click',()=>change(1));
    document.addEventListener('zh:languagechange',render);
    document.addEventListener('zh:pulsechange',()=>load(true));
    window.addEventListener('storage',event=>{if(event.key==='zh_pulse_revision')load(true);});
    // A previously open homepage refreshes when returning from poll administration.
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)load(true);});
    let scope;
    identity.subscribe(state=>{const next=state.status+':'+state.userId;if(next!==scope){scope=next;load();}});
    load();
})();
