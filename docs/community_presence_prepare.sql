-- Backend inventory verified on 07.10.2026 in project yawadxzeyyrozmlrokun.
-- Existing player_presence is game-position presence (15s), not website activity.
-- Existing profiles are private. Do not publish display_name or create profiles.
-- One homepage-wide presence source. Apply once; guards prevent overwriting.
-- No changes to visitor history, counters, auth accounts, profiles or roles.
begin;

do $guard$
begin
    if exists (
        select 1 from pg_catalog.pg_class c
        join pg_catalog.pg_namespace n on n.oid = c.relnamespace
        where n.nspname not in ('pg_catalog', 'information_schema', 'auth', 'storage', 'realtime')
          and n.nspname not like 'pg_%' and c.relkind in ('r', 'p', 'v', 'm')
          -- The audited game table remains completely untouched.
          and not (n.nspname = 'public' and c.relname = 'player_presence' and (
              select count(*) from pg_catalog.pg_attribute a
              where a.attrelid = c.oid and not a.attisdropped
                and a.attname in ('player_id', 'world_id', 'position_x', 'position_y')
          ) = 4)
          and (c.relname ~* '(presence|online|community_session)'
              or exists (select 1 from pg_catalog.pg_attribute a
                  where a.attrelid = c.oid and not a.attisdropped
                    and a.attname in ('last_seen', 'last_seen_at', 'heartbeat_at')))
    ) then
        raise exception 'Existing presence candidate found: review/reuse it; no parallel table created';
    end if;
    if exists (
        select 1 from pg_catalog.pg_proc p
        join pg_catalog.pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname in ('get_zh_community_stats', 'heartbeat_zh_community')
    ) then
        raise exception 'Community RPC already exists: review it before any change';
    end if;
    if exists (select 1 from pg_catalog.pg_namespace where nspname = 'zh_community_private') then
        raise exception 'Community private schema already exists: review it before any change';
    end if;
end;
$guard$;

-- Privileged implementation stays outside the exposed public schema.
-- USAGE permits only the two explicitly granted helper calls, not table access.
create schema zh_community_private;
revoke all on schema zh_community_private from public, anon, authenticated;
grant usage on schema zh_community_private to anon, authenticated;

-- Transient presence only. No page path, IP, email or activity history.
create table public.zh_community_presence (
    browser_id uuid primary key,
    user_id uuid references auth.users(id) on delete set null,
    last_seen_at timestamptz not null default now()
);
create index zh_community_presence_last_seen_idx
    on public.zh_community_presence(last_seen_at);
create index zh_community_presence_user_idx
    on public.zh_community_presence(user_id) where user_id is not null;
alter table public.zh_community_presence enable row level security;
revoke all on table public.zh_community_presence from public, anon, authenticated;
-- No client table policies/grants: raw presence is never exposed through the API.

create function zh_community_private.get_stats()
returns jsonb
language sql
volatile
security definer
set search_path = ''
as $stats$
    with active as (
        select case when u.id is not null
                          and not coalesce(u.is_anonymous, false)
                          and u.deleted_at is null
                    then p.user_id else null end as member_id
        from public.zh_community_presence p
        left join auth.users u on u.id = p.user_id
        where p.last_seen_at > now() - interval '3 minutes'
    ), online as (
        select count(distinct member_id) as members,
               count(*) filter (where member_id is null) as guests
        from active
    )
    select jsonb_build_object(
        'online_total', members + guests,
        'online_members', members,
        'online_guests', guests,
        'registered_members', (
            select count(*) from auth.users u
            where not coalesce(u.is_anonymous, false) and u.deleted_at is null
        ),
        -- The verified profiles.display_name is private under existing RLS.
        -- A future explicit public-profile decision is required for this field.
        'newest_member', null,
        'public_name_available', false,
        'sampled_at', now(),
        'online_window_seconds', 180
    ) from online;
$stats$;

create function zh_community_private.heartbeat(p_browser_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $heartbeat$
declare
    verified_user_id uuid := auth.uid();
begin
    if p_browser_id is null or p_browser_id = '00000000-0000-0000-0000-000000000000'::uuid then
        raise exception 'Valid browser UUID required' using errcode = '22023';
    end if;
    -- Identity comes exclusively from the JWT validated by Supabase/PostgREST.
    -- Never accept a client-supplied member ID, admin flag or role.
    if verified_user_id is not null and not exists (
        select 1 from auth.users u where u.id = verified_user_id
          and not coalesce(u.is_anonymous, false) and u.deleted_at is null
    ) then
        verified_user_id := null;
    end if;
    insert into public.zh_community_presence as existing (browser_id, user_id, last_seen_at)
    values (p_browser_id, verified_user_id, now())
    on conflict (browser_id) do update
        set user_id = excluded.user_id, last_seen_at = excluded.last_seen_at
        where existing.last_seen_at <= now() - interval '10 seconds'
           or existing.user_id is distinct from excluded.user_id;

    -- Index-backed cleanup on activity; inactive rows never contribute to counts.
    -- A quiet site retains at most its last 24h of activity until the next heartbeat.
    delete from public.zh_community_presence
    where last_seen_at < now() - interval '24 hours';
    return zh_community_private.get_stats();
end;
$heartbeat$;

-- Public RPC entry points do not run with elevated privileges themselves.
create function public.get_zh_community_stats()
returns jsonb
language sql volatile security invoker set search_path = ''
as $api$ select zh_community_private.get_stats(); $api$;

create function public.heartbeat_zh_community(p_browser_id uuid)
returns jsonb
language sql volatile security invoker set search_path = ''
as $api$ select zh_community_private.heartbeat(p_browser_id); $api$;

revoke all on function zh_community_private.get_stats() from public, anon, authenticated;
revoke all on function zh_community_private.heartbeat(uuid) from public, anon, authenticated;
grant execute on function zh_community_private.get_stats() to anon, authenticated;
grant execute on function zh_community_private.heartbeat(uuid) to anon, authenticated;

revoke all on function public.get_zh_community_stats() from public, anon, authenticated;
revoke all on function public.heartbeat_zh_community(uuid) from public, anon, authenticated;
grant execute on function public.get_zh_community_stats() to anon, authenticated;
grant execute on function public.heartbeat_zh_community(uuid) to anon, authenticated;
commit;
