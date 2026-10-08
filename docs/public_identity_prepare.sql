-- Minimal identity adapter in the existing zhserver project.
-- profiles/auth/roles/signup remain unchanged and private.
create schema if not exists zh_identity_private;
revoke all on schema zh_identity_private from public;
grant usage on schema zh_identity_private to anon, authenticated;

create function zh_identity_private.valid_display_name(p_name text)
returns text language sql immutable security invoker set search_path = '' as $$
    select case when pg_catalog.char_length(pg_catalog.btrim(p_name)) between 1 and 80
        and p_name !~ '[[:cntrl:]]' and p_name not like '%@%'
        and pg_catalog.btrim(p_name) !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then pg_catalog.btrim(p_name) else null end;
$$;
revoke all on function zh_identity_private.valid_display_name(text) from public, anon, authenticated;

create function zh_identity_private.own_identity()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
    select pg_catalog.jsonb_build_object(
        'display_name', zh_identity_private.valid_display_name(p.display_name),
        'created_at', u.created_at
    ) into result
    from auth.users u left join public.profiles p on p.id = u.id
    where u.id = auth.uid() and not coalesce(u.is_anonymous, false) and u.deleted_at is null;
    if result is null then raise exception 'identity.signInRequired' using errcode = '42501'; end if;
    return result;
end $$;
revoke all on function zh_identity_private.own_identity() from public, anon;
grant execute on function zh_identity_private.own_identity() to authenticated;

create function zh_identity_private.newest_identity()
returns jsonb language sql stable security definer set search_path = '' as $$
    select coalesce((
        select pg_catalog.jsonb_build_object(
            'display_name', zh_identity_private.valid_display_name(p.display_name),
            'created_at', u.created_at
        )
        from auth.users u left join public.profiles p on p.id = u.id
        where not coalesce(u.is_anonymous, false) and u.deleted_at is null
        order by u.created_at desc, u.id desc limit 1
    ), pg_catalog.jsonb_build_object('display_name', null, 'created_at', null));
$$;
revoke all on function zh_identity_private.newest_identity() from public;
grant execute on function zh_identity_private.newest_identity() to anon, authenticated;

create function public.get_zh_own_identity()
returns jsonb language sql stable security invoker set search_path = '' as $$
    select zh_identity_private.own_identity();
$$;
revoke all on function public.get_zh_own_identity() from public, anon;
grant execute on function public.get_zh_own_identity() to authenticated;

create function public.get_zh_newest_member()
returns jsonb language sql stable security invoker set search_path = '' as $$
    select zh_identity_private.newest_identity();
$$;
revoke all on function public.get_zh_newest_member() from public;
grant execute on function public.get_zh_newest_member() to anon, authenticated;

-- Only the name adapter changes. Existing online/count/TTL logic stays intact.
create or replace function zh_community_private.get_stats()
returns jsonb language sql security definer set search_path = '' as $$
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
    ), latest as (
        select zh_identity_private.newest_identity() as identity
    )
    select jsonb_build_object(
        'online_total', members + guests,
        'online_members', members,
        'online_guests', guests,
        'registered_members', (
            select count(*) from auth.users u
            where not coalesce(u.is_anonymous, false) and u.deleted_at is null
        ),
        'newest_member', identity->>'display_name',
        'public_name_available', identity->>'display_name' is not null,
        'sampled_at', now(),
        'online_window_seconds', 180
    ) from online cross join latest;
$$;
