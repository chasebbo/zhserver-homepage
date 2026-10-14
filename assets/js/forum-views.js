/* Counts only a visible, successfully loaded standalone thread. Read RPCs never count. */
(() => {
    'use strict';
    const lang=window.ZHLanguage, identity=window.ZHIdentity, api=window.ZHForum;
    const counts=new Map(); let controller, data, lastOpen, generation=0;
    const valid=value=>Number.isSafeInteger(value)&&value>=0;
    function count(topic) {
        const known=counts.get(topic.id), value=topic.views_count;
        if(!valid(value)) return valid(known)?known:null;
        return valid(known)?Math.max(known,value):value;
    }
    function update(topic) {
        const value=count(topic); if(value!==null)counts.set(topic.id,value);
        document.querySelectorAll('[data-forum-views]').forEach(cell=>{
            if(cell.dataset.forumViews===topic.id) cell.textContent=value===null?'—':value.toLocaleString(lang.locale);
        });
        const line=document.getElementById('forum-thread-views');
        if(controller?.route().id===topic.id) {
            line.hidden=false; lang.bind(line,'forum.viewCount',{count:value===null?'—':value.toLocaleString(lang.locale)});
            line.title=lang.t(value===null?'forum.viewsPending':'forum.viewsSinceStart');
        }
    }
    function cell(topic) {
        const node=document.createElement('span'); node.className='forum-topic-views'; node.dataset.forumViews=topic.id;
        node.dataset.label=lang.t('forum.views'); node.setAttribute('aria-label',lang.t('forum.views'));
        node.setAttribute('data-i18n-ignore',''); const value=count(topic); node.textContent=value===null?'—':value.toLocaleString(lang.locale); return node;
    }
    function browserId() {
        try {
            const key='zh_forum_view_browser_v1'; let id=localStorage.getItem(key);
            if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id||'')) {
                id=crypto.randomUUID(); localStorage.setItem(key,id);
            }
            return id;
        } catch (_) { return null; } // Without durable guest identity, do not invent a fresh view on every reload.
    }
    async function observe(next, drafts) {
        controller=drafts; data=next; update(next.topic);
        if(!window.ZHCommunityFeatures?.forumViews||next.views_version!==1||document.hidden||controller.route().view!=='thread')return;
        if(identity.state.status==='checking'||identity.state.status==='unavailable')return;
        const key=next.topic.id+':'+(identity.state.userId||'guest');
        if(lastOpen===key)return;
        const browser=browserId(); if(!browser&&!identity.state.userId)return;
        lastOpen=key; const ticket=++generation;
        try {
            const result=await api.rpc('register_zh_forum_view',{p_topic_id:next.topic.id,p_browser_id:browser});
            if(ticket!==generation||controller.route().id!==next.topic.id||key!==next.topic.id+':'+(identity.state.userId||'guest'))return;
            if(result.topic_id===next.topic.id&&valid(result.views_count)){next.topic.views_count=result.views_count;update(next.topic);}
        } catch (_) { document.getElementById('forum-thread-views').title=lang.t('forum.viewUnavailable'); }
    }
    window.addEventListener('hashchange',()=>{lastOpen=null;generation++;});
    identity.subscribe(()=>{if(data&&controller?.route().id===data.topic.id)observe(data,controller);});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&data&&controller?.route().id===data.topic.id)observe(data,controller);});
    window.ZHForumViews=Object.freeze({cell,observe});
})();
