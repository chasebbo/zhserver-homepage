-- Real installed functions, disposable rows inside one rolled-back transaction.
-- No test poll or test vote is committed or visible to other browser sessions.
begin;
do $test$
declare v_admin uuid := '7ba1fad4-d113-4526-8873-3e3b97e9be7e'; v_member uuid;
    v_before text; v_after text; v_data jsonb; v_poll jsonb; v_id uuid; v_blocked boolean;
begin
    select u.id into strict v_member from auth.users u
      where u.deleted_at is null and not coalesce(u.is_anonymous,false)
        and zh_identity_private.system_role(u.id)='member' order by u.id limit 1;
    select md5(jsonb_build_array(
        (select jsonb_agg(to_jsonb(p) order by p.id) from zh_pulse_private.polls p),
        (select jsonb_agg(to_jsonb(o) order by o.id) from public.community_votes o),
        (select jsonb_agg(to_jsonb(v) order by v.poll_id,v.voter_id) from zh_pulse_private.votes v))::text) into v_before;
    perform set_config('request.jwt.claim.sub',v_admin::text,true);
    v_data:=zh_pulse_private.manage_poll(null,'{"de":"Temporärer SQL-Test – Rollback","en":"Temporary SQL test – rollback"}',
        '[{"de":"A","en":"A"},{"de":"B","en":"B"}]',false,'open',0,null);
    v_id:=(v_data->>'saved_poll_id')::uuid;
    select value into v_poll from jsonb_array_elements(v_data->'polls') where value->>'id'=v_id::text;
    perform set_config('request.jwt.claim.sub',v_member::text,true);
    v_blocked:=false;
    begin perform public.delete_zh_community_pulse(v_id,(v_poll->>'updated_at')::timestamptz);
    exception when insufficient_privilege then v_blocked:=true; end;
    if not v_blocked then raise exception 'Member deletion was not blocked'; end if;
    perform set_config('request.jwt.claim.sub',v_admin::text,true);
    v_blocked:=false;
    begin perform public.delete_zh_community_pulse(v_id,'2000-01-01');
    exception when others then if sqlerrm='pulse.editConflict' then v_blocked:=true;else raise;end if;end;
    if not v_blocked then raise exception 'Stale confirmation was not blocked'; end if;
    perform public.delete_zh_community_pulse(v_id,(v_poll->>'updated_at')::timestamptz);
    if exists(select 1 from zh_pulse_private.polls where id=v_id)
      or exists(select 1 from public.community_votes where pulse_poll_id=v_id) then raise exception 'Empty poll cascade failed';end if;
    v_data:=zh_pulse_private.manage_poll(null,'{"de":"Aktiver SQL-Test – Rollback","en":"Active SQL test – rollback"}',
        '[{"de":"A","en":"A"},{"de":"B","en":"B"}]',true,'open',0,null);
    v_id:=(v_data->>'saved_poll_id')::uuid;
    select value into v_poll from jsonb_array_elements(v_data->'polls') where value->>'id'=v_id::text;
    perform set_config('request.jwt.claim.sub',v_member::text,true);
    perform zh_pulse_private.cast_vote(v_id,v_poll->'options'->0->>'id');
    if not exists(select 1 from zh_pulse_private.votes where poll_id=v_id) then raise exception 'Vote fixture failed';end if;
    perform set_config('request.jwt.claim.sub',v_admin::text,true);
    perform public.delete_zh_community_pulse(v_id,(v_poll->>'updated_at')::timestamptz);
    if exists(select 1 from zh_pulse_private.polls where id=v_id)
      or exists(select 1 from public.community_votes where pulse_poll_id=v_id)
      or exists(select 1 from zh_pulse_private.votes where poll_id=v_id)
      or exists(select 1 from jsonb_array_elements(public.get_zh_community_pulse(false)->'polls') p where p->>'id'=v_id::text)
      then raise exception 'Voted active poll cascade failed';end if;
    select md5(jsonb_build_array(
        (select jsonb_agg(to_jsonb(p) order by p.id) from zh_pulse_private.polls p),
        (select jsonb_agg(to_jsonb(o) order by o.id) from public.community_votes o),
        (select jsonb_agg(to_jsonb(v) order by v.poll_id,v.voter_id) from zh_pulse_private.votes v))::text) into v_after;
    if v_before is distinct from v_after then raise exception 'Existing polls/votes changed';end if;
    if has_function_privilege('anon','public.delete_zh_community_pulse(uuid,timestamptz)','execute') then raise exception 'Guest RPC privilege';end if;
    perform set_config('zh.pulse_test',jsonb_build_object('member_blocked',true,'guest_denied',true,'stale_confirmation_blocked',true,
      'empty_poll_deleted',true,'active_poll_with_vote_deleted',true,'options_and_votes_removed',true,'existing_poll_vote_hash_unchanged',true,
      'test_rows_committed',false)::text,true);
end $test$;
select current_setting('zh.pulse_test')::jsonb as regression;
rollback;
