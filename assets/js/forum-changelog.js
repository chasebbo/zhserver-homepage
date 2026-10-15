/* Official publications remain ordinary forum topics with server-enforced rules. */
(() => {
    'use strict';
    const api=window.ZHForum, identity=window.ZHIdentity, lang=window.ZHLanguage;
    if(!api||!identity)return;
    const $=id=>document.getElementById(id);
    let controller, editorKey='', editorData=null, requestId=null, busy=false, ticket=0;
    const is=topic=>topic?.category==='changelog';
    function date(topic){
        const value=topic.changelog?.date;
        if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return lang.t('forum.changelogDateUnknown');
        return new Intl.DateTimeFormat(lang.locale,{dateStyle:'medium',timeZone:'Europe/Berlin'}).format(new Date(value+'T12:00:00Z'));
    }
    function label(topic){
        const line=document.createElement('span');line.className='forum-changelog-version';line.setAttribute('data-i18n-ignore','');
        const badge=document.createElement('span');badge.className='forum-alpha-label';badge.textContent=topic.changelog?.version?'ALPHA':lang.t('forum.changelogUpdate');
        line.append(badge,document.createTextNode(topic.changelog?.version||''));return line;
    }
    function category(data){
        const active=controller?.route().category==='changelog';
        $('forum-category').classList.toggle('forum-changelog-category',active);
        const heading=document.querySelector('#forum-category .forum-topic-heading');
        if(heading){const cells=heading.children;lang.bind(cells[1],active?'forum.changelogLikes':'forum.replies');lang.bind(cells[3],active?'forum.changelogDate':'forum.lastActivity');}
        for(const id of ['forum-category-compose','forum-new-draft']){
            const button=$(id);if(!button)continue;
            if(active){button.hidden=data.changelog_version!==1||!data.can_publish_changelog;lang.bind(button,'forum.changelogNew');}
            else lang.bind(button,'forum.createPost');
        }
        if(active&&data.changelog_version!==1){$('forum-empty-topics').hidden=true;lang.bind($('forum-category-server-status'),'forum.changelogPending');$('forum-category-server-status').hidden=false;}
    }
    function thread(data){
        const active=is(data.topic);$('forum-thread').classList.toggle('forum-changelog-thread',active);
        $('forum-thread-alpha').replaceChildren(...(active?[label(data.topic)]:[]));$('forum-thread-alpha').hidden=!active;
        if(active){$('forum-reply-form').hidden=true;$('forum-thread-write-note').hidden=true;$('forum-thread-login').hidden=true;}
    }
    async function editor(drafts){
        controller=drafts;
        lang.bind($('forum-changelog-heading'),drafts.route().id?'forum.changelogEdit':'forum.changelogNew');
        const key=(drafts.route().id||'new')+':'+(identity.state.userId||'guest');
        if(editorKey===key)return;
        editorKey=key;editorData=null;requestId=crypto.randomUUID();const current=++ticket;
        $('forum-changelog-form').hidden=true;$('forum-changelog-form-status').hidden=false;lang.bind($('forum-changelog-form-status'),'forum.loading');
        try{
            const data=await api.rpc('get_zh_forum',drafts.route().id?{p_topic_id:drafts.route().id}:{p_category:'changelog'});
            if(current!==ticket||drafts.route().view!=='changelog')return;
            if(data.changelog_version!==1){lang.bind($('forum-changelog-form-status'),'forum.changelogPending');return;}
            if(!data.can_publish_changelog||identity.state.status!=='member'){lang.bind($('forum-changelog-form-status'),'forum.changelogPublisher');return;}
            if(data.topic&&!is(data.topic))throw Error('forum.invalid');
            editorData=data.topic?data:null;
            $('forum-changelog-version').value=data.topic?.changelog?.version||'';
            $('forum-changelog-version').required=!data.topic||Boolean(data.topic.changelog?.version);
            $('forum-changelog-title').value=data.topic?.title||'';
            $('forum-changelog-date').value=data.topic?.changelog?.date||'';
            $('forum-changelog-body').value=data.posts?.find(p=>p.opener)?.body||'';
            $('forum-changelog-form').hidden=false;$('forum-changelog-form-status').hidden=true;
            $('forum-changelog-cancel').href=data.topic?'#thread/'+data.topic.id:'#category/changelog';
            lang.bind($('forum-changelog-submit'),data.topic?'forum.saveChanges':'forum.changelogPublish');
        }catch(e){editorKey='';lang.bind($('forum-changelog-form-status'),e.message?.startsWith('forum.')?e.message:'forum.networkError');}
    }
    function connect(drafts){controller=drafts;}
    function openEdit(data){location.hash='editchangelog/'+data.topic.id;}
    $('forum-changelog-form').addEventListener('submit',async event=>{
        event.preventDefault();if(busy||!controller||controller.route().view!=='changelog'||!$('forum-changelog-form').reportValidity())return;
        busy=true;$('forum-changelog-submit').disabled=true;$('forum-changelog-form-status').hidden=false;lang.bind($('forum-changelog-form-status'),'forum.saving');
        const owner=identity.state.userId;
        try{
            const result=await api.rpc('publish_zh_changelog',{
                p_request_id:requestId,p_version:$('forum-changelog-version').value.trim()||null,p_title:$('forum-changelog-title').value.trim(),
                p_date:$('forum-changelog-date').value,p_body:$('forum-changelog-body').value.trim(),
                p_topic_id:editorData?.topic.id||null,p_expected_at:editorData?.posts.find(p=>p.opener)?.updated_at||null
            },true,owner);
            editorKey='';document.dispatchEvent(new CustomEvent('zh:forumchange'));location.hash='thread/'+result.topic_id;
        }catch(e){lang.bind($('forum-changelog-form-status'),e.message?.startsWith('forum.')||e.message?.startsWith('identity.')?e.message:'forum.networkError');}
        finally{busy=false;$('forum-changelog-submit').disabled=false;}
    });
    identity.subscribe(()=>{editorKey='';if(controller?.route().view==='changelog')editor(controller);});
    window.ZHForumChangelog=Object.freeze({is,date,label,category,thread,editor,connect,openEdit});
})();
