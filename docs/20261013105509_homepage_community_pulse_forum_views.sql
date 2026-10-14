-- Applied after user approval on 2026-10-13; registry version 20261013164013.
-- Historical migration record only. Do not reapply during the homepage release.
-- Extends the existing option table. No historical votes/views are reconstructed.
begin;
do $guard$ begin
    if md5(pg_get_functiondef('public.vote_for_feature(text)'::regprocedure)) <> '545619dc1a506a59abaea0488d2be517'
       or md5(pg_get_functiondef('public.get_zh_forum(text,uuid,integer,integer)'::regprocedure)) <> '313487672eaa3f2dc6680d85d24ab160'
       or md5(pg_get_functiondef('zh_identity_private.current_is_admin()'::regprocedure)) <> 'd5fc0d745ae4bbe4bdae24c9069cf3ef'
       or md5(pg_get_functiondef('zh_forum_private.topic_json(zh_forum_private.topics)'::regprocedure)) <> '49fee2479b683415d38b1a16f43a1768' then
        raise exception 'Affected backend changed; re-audit before applying';
    end if;
    if (select count(*) from information_schema.columns where table_schema='public' and table_name='community_votes') <> 4
       or not exists(select 1 from pg_policies where schemaname='public' and tablename='community_votes'
          and policyname='Oeffentlicher Lesezugriff auf Votes' and cmd='SELECT' and qual='true')
       or (select count(*) from pg_policies where schemaname='public' and tablename='community_votes') <> 1
       or exists(select 1 from pg_namespace where nspname='zh_pulse_private') then
        raise exception 'Affected schema/policy changed or migration already present';
    end if;
end $guard$;

create schema zh_pulse_private;
revoke all on schema zh_pulse_private from public,anon,authenticated;
grant usage on schema zh_pulse_private to anon,authenticated,service_role;
create table zh_pulse_private.polls(
    id uuid primary key default gen_random_uuid(), question jsonb not null,
    active boolean not null default false, state text not null default 'open' check(state in ('open','closed','archived')),
    sort_order integer not null default 0 check(sort_order between -10000 and 10000),
    created_at timestamptz not null default clock_timestamp(), updated_at timestamptz not null default clock_timestamp(),
    created_by uuid not null, check(state<>'archived' or not active)
);
alter table public.community_votes add column pulse_poll_id uuid references zh_pulse_private.polls(id) on delete cascade,
    add column pulse_labels jsonb, add column pulse_position smallint;
alter table public.community_votes add constraint pulse_options_unique unique(pulse_poll_id,id);
create unique index pulse_option_position on public.community_votes(pulse_poll_id,pulse_position) where pulse_poll_id is not null;
create table zh_pulse_private.votes(
    poll_id uuid not null references zh_pulse_private.polls(id) on delete cascade,
    voter_id uuid not null references auth.users(id) on delete cascade,
    option_id text not null, updated_at timestamptz not null default clock_timestamp(), primary key(poll_id,voter_id),
    foreign key(poll_id,option_id) references public.community_votes(pulse_poll_id,id) on delete cascade
);
create index pulse_vote_option on zh_pulse_private.votes(poll_id,option_id);
alter table zh_pulse_private.polls enable row level security;
alter table zh_pulse_private.votes enable row level security;
revoke all on zh_pulse_private.polls,zh_pulse_private.votes from public,anon,authenticated;
-- Existing frontend writes use the RPC, never these direct grants. RLS does not cover TRUNCATE.
revoke insert,update,delete,truncate,references,trigger on public.community_votes from anon,authenticated;

create function zh_pulse_private.member_id() returns uuid language plpgsql stable security definer set search_path='' as $$
declare v_id uuid := auth.uid(); begin
    if v_id is null or not exists(select 1 from auth.users where id=v_id and not coalesce(is_anonymous,false) and deleted_at is null) then
        raise exception 'pulse.signInRequired' using errcode='42501';
    end if;
    return v_id;
end $$;
create function zh_pulse_private.labels_valid(v jsonb, maximum integer) returns boolean language sql immutable set search_path='' as $$
    select coalesce(jsonb_typeof(v)='object' and jsonb_typeof(v->'de')='string' and jsonb_typeof(v->'en')='string'
        and length(btrim(v->>'de')) between 1 and maximum and length(btrim(v->>'en')) between 1 and maximum,false);
$$;
create function zh_pulse_private.option_visible(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
    select zh_identity_private.current_is_admin() or exists(select 1 from zh_pulse_private.polls where id=p_id and active and state<>'archived');
$$;
alter policy "Oeffentlicher Lesezugriff auf Votes" on public.community_votes
    using(pulse_poll_id is null or zh_pulse_private.option_visible(pulse_poll_id));

-- Keep aggregate values in the existing table, including vote changes/account deletion.
create function zh_pulse_private.sync_votes() returns trigger language plpgsql security definer set search_path='' as $$
begin
    if tg_op='UPDATE' and old.option_id=new.option_id then return new; end if;
    perform 1 from public.community_votes where id in
        (case when tg_op<>'INSERT' then old.option_id end,case when tg_op<>'DELETE' then new.option_id end)
        order by id for update;
    if tg_op<>'INSERT' then update public.community_votes set votes=greatest(0,votes-1),updated_at=clock_timestamp()
        where id=old.option_id and pulse_poll_id=old.poll_id; end if;
    if tg_op<>'DELETE' then update public.community_votes set votes=votes+1,updated_at=clock_timestamp()
        where id=new.option_id and pulse_poll_id=new.poll_id; end if;
    if tg_op='DELETE' then return old; end if; return new;
end $$;
create trigger pulse_vote_totals after insert or update or delete on zh_pulse_private.votes
    for each row execute function zh_pulse_private.sync_votes();

create function zh_pulse_private.read_polls(p_admin boolean) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_rows jsonb; begin
    if p_admin and not zh_identity_private.current_is_admin() then raise exception 'pulse.forbidden' using errcode='42501'; end if;
    select coalesce(jsonb_agg(jsonb_build_object('id',p.id,'question',p.question,'active',p.active,'state',p.state,
        'sort_order',p.sort_order,'updated_at',p.updated_at,'total',coalesce(o.total,0),'options',coalesce(o.options,'[]'::jsonb),
        'my_vote',(select option_id from zh_pulse_private.votes where poll_id=p.id and voter_id=auth.uid()))
        order by p.sort_order,p.created_at,p.id),'[]'::jsonb) into v_rows
    from zh_pulse_private.polls p left join lateral (
        select sum(v.votes) as total,jsonb_agg(jsonb_build_object('id',v.id,'labels',v.pulse_labels,'votes',v.votes)
            order by v.pulse_position) as options from public.community_votes v where v.pulse_poll_id=p.id
    ) o on true where p_admin or (p.active and p.state<>'archived');
    return jsonb_build_object('version',1,'polls',v_rows);
end $$;

create function zh_pulse_private.cast_vote(p_poll_id uuid,p_option_id text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_user uuid := zh_pulse_private.member_id(); v_poll zh_pulse_private.polls; begin
    select * into v_poll from zh_pulse_private.polls where id=p_poll_id for update;
    if not found or not v_poll.active or v_poll.state<>'open' then raise exception 'pulse.closed'; end if;
    if not exists(select 1 from public.community_votes where id=p_option_id and pulse_poll_id=p_poll_id) then raise exception 'pulse.invalid'; end if;
    insert into zh_pulse_private.votes(poll_id,voter_id,option_id) values(p_poll_id,v_user,p_option_id)
        on conflict(poll_id,voter_id) do update set option_id=excluded.option_id,updated_at=clock_timestamp()
        where zh_pulse_private.votes.option_id<>excluded.option_id;
    return zh_pulse_private.read_polls(false);
end $$;

create function zh_pulse_private.manage_poll(p_poll_id uuid,p_question jsonb,p_options jsonb,p_active boolean,
    p_state text,p_order integer,p_expected_at timestamptz) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_user uuid := zh_pulse_private.member_id(); v_id uuid; v_poll zh_pulse_private.polls;
    v_options jsonb; v_existing jsonb; v_option jsonb; v_count integer; v_index integer := 0; begin
    if not zh_identity_private.current_is_admin() then raise exception 'pulse.forbidden' using errcode='42501'; end if;
    if not zh_pulse_private.labels_valid(p_question,300) or jsonb_typeof(p_options) is distinct from 'array'
       or jsonb_array_length(p_options) not between 2 and 4 or p_active is null
       or p_state is null or p_state not in ('open','closed','archived') or p_order is null or p_order not between -10000 and 10000 then
        raise exception 'pulse.invalid';
    end if;
    if exists(select 1 from jsonb_array_elements(p_options) e where not zh_pulse_private.labels_valid(e,80)) then raise exception 'pulse.invalid'; end if;
    select jsonb_agg(jsonb_build_object('de',btrim(e->>'de'),'en',btrim(e->>'en'))) into v_options from jsonb_array_elements(p_options) e;
    if (select count(distinct lower(e->>'de')) from jsonb_array_elements(v_options) e)<>jsonb_array_length(v_options)
       or (select count(distinct lower(e->>'en')) from jsonb_array_elements(v_options) e)<>jsonb_array_length(v_options) then raise exception 'pulse.invalid'; end if;
    if p_poll_id is null then
        insert into zh_pulse_private.polls(question,active,state,sort_order,created_by)
            values(jsonb_build_object('de',btrim(p_question->>'de'),'en',btrim(p_question->>'en')),p_active and p_state<>'archived',p_state,p_order,v_user)
            returning id into v_id;
    else
        select * into v_poll from zh_pulse_private.polls where id=p_poll_id for update;
        if not found then raise exception 'pulse.notFound'; end if;
        if p_expected_at is distinct from v_poll.updated_at then raise exception 'pulse.editConflict'; end if;
        v_id:=p_poll_id;
        select jsonb_agg(pulse_labels order by pulse_position),sum(votes) into v_existing,v_count from public.community_votes where pulse_poll_id=v_id;
        if v_count>0 and v_existing is distinct from v_options then raise exception 'pulse.optionsLocked'; end if;
        update zh_pulse_private.polls set question=jsonb_build_object('de',btrim(p_question->>'de'),'en',btrim(p_question->>'en')),
            active=p_active and p_state<>'archived',state=p_state,sort_order=p_order,updated_at=clock_timestamp() where id=v_id;
        if v_existing is distinct from v_options then delete from public.community_votes where pulse_poll_id=v_id; end if;
    end if;
    if not exists(select 1 from public.community_votes where pulse_poll_id=v_id) then
        for v_option in select value from jsonb_array_elements(v_options) loop
            insert into public.community_votes(id,title,votes,pulse_poll_id,pulse_labels,pulse_position)
                values('pulse_'||gen_random_uuid()::text,v_option->>'de',0,v_id,v_option,v_index);
            v_index:=v_index+1;
        end loop;
    end if;
    return zh_pulse_private.read_polls(true)||jsonb_build_object('saved_poll_id',v_id);
end $$;

-- Same legacy RPC contract; Pulse options cannot bypass authenticated vote uniqueness.
create function zh_pulse_private.legacy_vote(feature_id text) returns json language plpgsql security definer set search_path='' as $$
declare updated_votes integer; begin
    update public.community_votes set votes=votes+1,updated_at=now() where id=feature_id and pulse_poll_id is null returning votes into updated_votes;
    if not found then return json_build_object('success',false,'error','Feature nicht gefunden'); end if;
    return json_build_object('success',true,'feature_id',feature_id,'votes',updated_votes);
end $$;
create or replace function public.vote_for_feature(feature_id text) returns json language sql security invoker set search_path='' as $$
    select zh_pulse_private.legacy_vote(feature_id);
$$;
create function public.get_zh_community_pulse(p_admin boolean default false) returns jsonb language sql security invoker set search_path='' as $$
    select zh_pulse_private.read_polls(coalesce(p_admin,false));
$$;
create function public.cast_zh_community_pulse_vote(p_poll_id uuid,p_option_id text) returns jsonb language sql security invoker set search_path='' as $$
    select zh_pulse_private.cast_vote(p_poll_id,p_option_id);
$$;
create function public.manage_zh_community_pulse(p_poll_id uuid,p_question jsonb,p_options jsonb,p_active boolean,
    p_state text,p_order integer,p_expected_at timestamptz default null) returns jsonb language sql security invoker set search_path='' as $$
    select zh_pulse_private.manage_poll(p_poll_id,p_question,p_options,p_active,p_state,p_order,p_expected_at);
$$;

create table zh_forum_private.view_totals(
    topic_id uuid primary key references zh_forum_private.topics(id) on delete cascade,
    views_count bigint not null default 0 check(views_count>=0), started_at timestamptz not null default clock_timestamp()
);
create table zh_forum_private.view_windows(
    topic_id uuid not null references zh_forum_private.topics(id) on delete cascade,
    actor_hash text not null check(length(actor_hash)=64), last_counted_at timestamptz not null,
    primary key(topic_id,actor_hash)
);
alter table zh_forum_private.view_totals enable row level security;
alter table zh_forum_private.view_windows enable row level security;
revoke all on zh_forum_private.view_totals,zh_forum_private.view_windows from public,anon,authenticated;

create function zh_forum_private.register_view(p_topic_id uuid,p_browser_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_user uuid := auth.uid(); v_keys text[] := array[]::text[]; v_now timestamptz := clock_timestamp();
    v_last timestamptz; v_count bigint; v_counted boolean; begin
    -- Match the existing writer lock order: topic first. Never change its activity timestamps.
    perform 1 from zh_forum_private.topics where id=p_topic_id and (not hidden or zh_forum_private.is_admin()) for update;
    if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;
    if v_user is not null and exists(select 1 from auth.users where id=v_user and not coalesce(is_anonymous,false) and deleted_at is null) then
        v_keys:=array_append(v_keys,encode(sha256(convert_to('account:'||v_user::text,'UTF8')),'hex'));
    end if;
    if p_browser_id is not null then v_keys:=array_append(v_keys,encode(sha256(convert_to('browser:'||p_browser_id::text,'UTF8')),'hex')); end if;
    if cardinality(v_keys)=0 then raise exception 'forum.viewIdentityUnavailable'; end if;
    select max(last_counted_at) into v_last from zh_forum_private.view_windows where topic_id=p_topic_id and actor_hash=any(v_keys);
    v_counted:=v_last is null or v_last<=v_now-interval '24 hours';
    if v_counted then v_last:=v_now; end if;
    insert into zh_forum_private.view_totals(topic_id,views_count) values(p_topic_id,case when v_counted then 1 else 0 end)
        on conflict(topic_id) do update set views_count=zh_forum_private.view_totals.views_count+case when v_counted then 1 else 0 end
        returning views_count into v_count;
    insert into zh_forum_private.view_windows(topic_id,actor_hash,last_counted_at)
        select p_topic_id,k,v_last from unnest(v_keys) k
        on conflict(topic_id,actor_hash) do update set last_counted_at=greatest(zh_forum_private.view_windows.last_counted_at,excluded.last_counted_at);
    return jsonb_build_object('topic_id',p_topic_id,'views_count',v_count,'counted',v_counted,'window_seconds',86400);
end $$;

-- Only an additional public count. Existing author/visibility/moderation fields remain identical.
create or replace function zh_forum_private.topic_json(t zh_forum_private.topics)
    returns jsonb language sql stable security definer set search_path='' as $$
    select jsonb_build_object('id',t.id,'category',t.category,'title',t.title,
        'author',zh_forum_private.public_profile(t.author_id),'created_at',t.created_at,'updated_at',t.updated_at,
        'last_activity_at',t.last_activity_at,'pinned',t.pinned,'closed',t.closed,'hidden',t.hidden,
        'can_moderate',coalesce(zh_forum_private.is_admin(),false),
        'replies',(select count(*) from zh_forum_private.posts p where p.topic_id=t.id and not p.opener and not p.hidden),
        'views_count',coalesce((select v.views_count from zh_forum_private.view_totals v where v.topic_id=t.id),0));
$$;
create or replace function public.get_zh_forum(p_category text default null,p_topic_id uuid default null,p_offset integer default 0,p_post_offset integer default 0)
    returns jsonb language sql stable security invoker set search_path='' as $$
    select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset)
        ||jsonb_build_object('role_version',1,'moderation_version',2,'views_version',1);
$$;
create function public.register_zh_forum_view(p_topic_id uuid,p_browser_id uuid default null)
    returns jsonb language sql security invoker set search_path='' as $$
    select zh_forum_private.register_view(p_topic_id,p_browser_id);
$$;

-- Deny implicit/default EXECUTE first, then grant only the intended entrypoints.
do $rights$ declare f record; begin
    for f in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace
        where n.nspname='zh_pulse_private' or (n.nspname='zh_forum_private' and p.proname='register_view')
        or (n.nspname='public' and p.proname in ('get_zh_community_pulse','cast_zh_community_pulse_vote','manage_zh_community_pulse','register_zh_forum_view')) loop
        execute format('revoke all on function %s from public,anon,authenticated,service_role',f.signature);
    end loop;
end $rights$;
grant execute on function zh_pulse_private.option_visible(uuid),zh_pulse_private.read_polls(boolean),zh_pulse_private.legacy_vote(text)
    to anon,authenticated;
grant execute on function zh_pulse_private.legacy_vote(text) to service_role;
grant execute on function zh_pulse_private.cast_vote(uuid,text),zh_pulse_private.manage_poll(uuid,jsonb,jsonb,boolean,text,integer,timestamptz) to authenticated;
grant execute on function public.get_zh_community_pulse(boolean) to anon,authenticated;
grant execute on function public.cast_zh_community_pulse_vote(uuid,text),public.manage_zh_community_pulse(uuid,jsonb,jsonb,boolean,text,integer,timestamptz) to authenticated;
grant execute on function zh_forum_private.register_view(uuid,uuid),public.register_zh_forum_view(uuid,uuid) to anon,authenticated;
-- Public get_zh_forum and legacy vote_for_feature keep their previously installed ACLs.
notify pgrst,'reload schema';
commit;
