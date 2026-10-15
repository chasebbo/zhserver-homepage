/* Same central client, same server-verified administrator role. */
(() => {
    'use strict';
    const api=window.ZHPulseAPI, lang=window.ZHLanguage, identity=window.ZHIdentity;
    const $=id=>document.getElementById(id); let polls=[], selected=null, busy=false, deleteReady=false, deleting=null;
    document.querySelectorAll('[data-i18n-message]').forEach(e=>{const key=e.getAttribute('data-i18n-message');if(key)lang.bind(e,key);});
    const node=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=text;e.setAttribute('data-i18n-ignore','');if(cls)e.className=cls;return e;};
    function feedback(key) { lang.bind($('pulse-admin-status'),key); }
    function optionFields(options, locked=false) {
        $('pulse-admin-options').replaceChildren();
        options.forEach((option,index)=>{
            const row=node('div','','pulse-admin-option-row');
            for(const language of ['de','en']){
                const label=node('label',''), caption=node('span','');lang.bind(caption,'pulse.admin.option',{number:index+1,language:language.toUpperCase()});label.append(caption);
                const input=document.createElement('input');input.type='text';input.required=true;input.maxLength=80;
                input.value=option[language]||'';input.dataset.optionLanguage=language;input.readOnly=locked; label.append(input);row.append(label);
            }
            $('pulse-admin-options').append(row);
        });
        $('pulse-admin-add-option').disabled=locked||options.length>=4;
        $('pulse-admin-remove-option').disabled=locked||options.length<=2;
        $('pulse-admin-option-note').hidden=!locked;
    }
    function options() { return [...$('pulse-admin-options').children].map(row=>Object.fromEntries([...row.querySelectorAll('input')].map(i=>[i.dataset.optionLanguage,i.value]))); }
    function edit(poll=null) {
        selected=poll; $('pulse-admin-form').hidden=false;
        $('pulse-admin-question-de').value=poll?.question.de||''; $('pulse-admin-question-en').value=poll?.question.en||'';
        $('pulse-admin-state').value=poll?.state||'open'; $('pulse-admin-active').checked=poll?.active||false;
        $('pulse-admin-order').value=poll?.sort_order??0;
        optionFields(poll?poll.options.map(o=>o.labels):[{de:'',en:''},{de:'',en:''}],Boolean(poll?.total));
        stateField(); $('pulse-admin-question-de').focus();
    }
    function stateField() { const archived=$('pulse-admin-state').value==='archived'; $('pulse-admin-active').disabled=archived; if(archived)$('pulse-admin-active').checked=false; }
    function render() {
        const list=$('pulse-admin-list');list.replaceChildren();
        if(!polls.length){list.append(node('p',lang.t('pulse.empty')));return;}
        polls.forEach(poll=>{
            const article=node('article','','pulse-admin-poll');article.append(node('h2',api.copy(poll.question)));
            article.append(node('p',lang.t('pulse.admin.summary',{state:lang.t('pulse.admin.state.'+poll.state),active:lang.t(poll.active?'pulse.admin.active':'pulse.admin.inactive'),order:poll.sort_order}),'pulse-admin-meta'));
            poll.options.forEach(option=>{
                const share=poll.total?Math.round(option.votes/poll.total*100):0;
                article.append(node('p',api.copy(option.labels)+' · '+share+' % · '+option.votes.toLocaleString(lang.locale),'pulse-admin-result'));
            });
            article.append(node('p',lang.t(poll.total===1?'pulse.totalOne':'pulse.total',{count:poll.total.toLocaleString(lang.locale)}),'pulse-admin-meta'));
            const button=node('button',lang.t('pulse.admin.edit'),'btn btn-outline');button.type='button';button.disabled=busy;
            button.addEventListener('click',()=>edit(poll));article.append(button);
            if(deleteReady){
                const remove=node('button',lang.t('pulse.admin.delete'),'btn btn-outline pulse-admin-delete');remove.type='button';remove.disabled=busy;
                remove.addEventListener('click',()=>{
                    deleting={poll,userId:identity.state.userId,trigger:remove};
                    $('pulse-delete-question').textContent=api.copy(poll.question);$('pulse-delete-dialog').showModal();
                });article.append(remove);
            }
            list.append(article);
        });
    }
    async function load() {
        if(!api.enabled()){feedback('pulse.preparing');return;}
        try{const data=await api.read(true);polls=data.polls;deleteReady=data.delete_version===1;render();feedback('pulse.admin.ready');}
        catch(e){feedback(lang.t(e.message)===e.message?'pulse.network':e.message);}
    }
    $('pulse-admin-create').addEventListener('click',()=>edit());
    $('pulse-delete-cancel').addEventListener('click',()=>{$('pulse-delete-dialog').close();});
    $('pulse-delete-dialog').addEventListener('close',()=>{const previous=deleting;deleting=null;previous?.trigger?.focus();});
    $('pulse-delete-confirm').addEventListener('click',async()=>{
        const pending=deleting;if(busy||!pending||pending.userId!==identity.state.userId)return;
        busy=true;$('pulse-delete-confirm').disabled=true;$('pulse-delete-cancel').disabled=true;
        try{
            const data=await api.remove(pending.poll.id,pending.poll.updated_at);polls=data.polls;
            if(selected?.id===pending.poll.id){selected=null;$('pulse-admin-form').hidden=true;}
            $('pulse-delete-dialog').close();feedback('pulse.admin.deleted');
            try{localStorage.setItem('zh_pulse_revision',String(Date.now()));}catch(_){/* Reload/visibility refresh remains available. */}
            document.dispatchEvent(new CustomEvent('zh:pulsechange'));
        }catch(e){$('pulse-delete-dialog').close();feedback(lang.t(e.message)===e.message?'pulse.network':e.message);}
        finally{busy=false;$('pulse-delete-confirm').disabled=false;$('pulse-delete-cancel').disabled=false;render();}
    });
    $('pulse-delete-dialog').addEventListener('cancel',event=>{if(busy)event.preventDefault();});
    identity.subscribe(state=>{if(deleting&&deleting.userId!==state.userId)$('pulse-delete-dialog').close();});
    $('pulse-admin-refresh').addEventListener('click',load);
    $('pulse-admin-state').addEventListener('change',stateField);
    $('pulse-admin-add-option').addEventListener('click',()=>optionFields([...options(),{de:'',en:''}]));
    $('pulse-admin-remove-option').addEventListener('click',()=>optionFields(options().slice(0,-1)));
    $('pulse-admin-cancel').addEventListener('click',()=>{$('pulse-admin-form').hidden=true;selected=null;});
    $('pulse-admin-form').addEventListener('submit',async event=>{
        event.preventDefault();if(busy||!api.enabled()||!$('pulse-admin-form').reportValidity())return;
        busy=true;$('pulse-admin-save').disabled=true;feedback('pulse.saving');
        try{
            const data=await api.save({p_poll_id:selected?.id||null,
                p_question:{de:$('pulse-admin-question-de').value,en:$('pulse-admin-question-en').value},p_options:options(),
                p_active:$('pulse-admin-active').checked,p_state:$('pulse-admin-state').value,
                p_order:Number($('pulse-admin-order').value),p_expected_at:selected?.updated_at||null});
            polls=data.polls;$('pulse-admin-form').hidden=true;selected=null;feedback('pulse.admin.saved');
        }catch(e){feedback(lang.t(e.message)===e.message?'pulse.network':e.message);}
        finally{busy=false;$('pulse-admin-save').disabled=false;render();}
    });
    document.addEventListener('zh:languagechange',render);
    (async()=>{
        if(!await window.ZHAdminAccess.require(identity.client))return;
        $('pulse-admin-create').disabled=!api.enabled();$('pulse-admin-refresh').disabled=!api.enabled();await load();
    })();
})();
