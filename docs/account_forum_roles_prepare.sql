-- PREPARED ONLY. Apply only after explicit approval of this reviewed migration.
-- Existing account UUIDs, login, profiles and game data remain unchanged.
-- Bootstrap UUID below is a one-time conversion of the existing admin assignment.
-- Ongoing permissions use the private role table, never names or user_metadata.
do $$ begin
    if md5(pg_get_functiondef('public.get_zh_forum(text,uuid,integer,integer)'::regprocedure))<>'ff9d2f022082d45864cdcde9d51fad5e' then
        raise exception 'Backend function changed; audit before migration: public.get_zh_forum';
    end if;
    if md5(pg_get_functiondef('zh_identity_private.own_identity()'::regprocedure))<>'af523f7f058e58105562bed766ed9dde' then
        raise exception 'Backend function changed; audit before migration: zh_identity_private.own_identity';
    end if;
    if md5(pg_get_functiondef('zh_forum_private.public_profile(uuid)'::regprocedure))<>'6fda330e46245e4a574a79c91adb7006' then
        raise exception 'Backend function changed; audit before migration: zh_forum_private.public_profile';
    end if;
    if md5(pg_get_functiondef('zh_forum_private.is_admin()'::regprocedure))<>'27a970420b84775b22d396326e69cd57' then
        raise exception 'Backend function changed; audit before migration: zh_forum_private.is_admin';
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename='gallery'
        and policyname='Admin can read gallery' and cmd='SELECT' and qual is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)'
        and with_check is not distinct from null and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can read gallery';
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename='gallery'
        and policyname='Admin can update gallery' and cmd='UPDATE' and qual is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)'
        and with_check is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)' and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can update gallery';
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename='gallery'
        and policyname='Admin can delete gallery' and cmd='DELETE' and qual is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)'
        and with_check is not distinct from null and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can delete gallery';
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename='guestbook'
        and policyname='Admin can read all guestbook entries' and cmd='SELECT' and qual is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)'
        and with_check is not distinct from null and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can read all guestbook entries';
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename='guestbook'
        and policyname='Admin can update guestbook' and cmd='UPDATE' and qual is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)'
        and with_check is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)' and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can update guestbook';
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename='guestbook'
        and policyname='Admin can delete guestbook' and cmd='DELETE' and qual is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)'
        and with_check is not distinct from null and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can delete guestbook';
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename='community_feedback'
        and policyname='Admin can update community feedback' and cmd='UPDATE' and qual is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)'
        and with_check is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)' and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can update community feedback';
    end if;
    if not exists(select 1 from pg_policies where schemaname='public' and tablename='community_feedback'
        and policyname='Admin can delete community feedback' and cmd='DELETE' and qual is not distinct from '(auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid)'
        and with_check is not distinct from null and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can delete community feedback';
    end if;
    if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects'
        and policyname='Admin can delete feedback screenshots' and cmd='DELETE' and qual is not distinct from '((bucket_id = ''community-feedback''::text) AND (auth.uid() = ''7ba1fad4-d113-4526-8873-3e3b97e9be7e''::uuid))'
        and with_check is not distinct from null and roles=array['authenticated']::name[]) then
        raise exception 'Admin policy changed; audit before migration: Admin can delete feedback screenshots';
    end if;
    if not exists(select 1 from auth.users where id='7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid
        and deleted_at is null and not coalesce(is_anonymous,false)) then
        raise exception 'Existing central admin account missing; stop migration';
    end if;
    if to_regclass('zh_identity_private.account_roles') is not null then
        raise exception 'Role structure already exists; audit instead of overwriting';
    end if;
end $$;

create table zh_identity_private.account_roles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    system_role text not null default 'member' check(system_role in ('member','admin')),
    updated_at timestamptz not null default clock_timestamp(),
    updated_by uuid references auth.users(id) on delete set null
);
alter table zh_identity_private.account_roles enable row level security;
revoke all on zh_identity_private.account_roles from public,anon,authenticated;
insert into zh_identity_private.account_roles(user_id,system_role)
select id,case when id='7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid then 'admin' else 'member' end
from auth.users where deleted_at is null and not coalesce(is_anonymous,false);

create function zh_identity_private.system_role(p_user_id uuid) returns text
language sql stable security definer set search_path='' as $$
    select coalesce(r.system_role,'member') from auth.users u
    left join zh_identity_private.account_roles r on r.user_id=u.id
    where u.id=p_user_id and u.deleted_at is null and not coalesce(u.is_anonymous,false);
$$;
create function zh_identity_private.current_is_admin() returns boolean
language sql stable security definer set search_path='' as $$
    select coalesce(zh_identity_private.system_role(auth.uid())='admin',false);
$$;
create function public.is_zh_admin() returns boolean language sql stable set search_path='' as $$
    select zh_identity_private.current_is_admin();
$$;
revoke all on function zh_identity_private.system_role(uuid) from public,anon,authenticated;
revoke all on function zh_identity_private.current_is_admin(),public.is_zh_admin() from public,anon,authenticated;
grant execute on function zh_identity_private.current_is_admin(),public.is_zh_admin() to anon,authenticated;

-- Adds only a default-member hook; the existing profile/game signup trigger stays intact.
create function zh_identity_private.initialize_account_role() returns trigger
language plpgsql security definer set search_path='' as $$
begin
    if not coalesce(new.is_anonymous,false) then
        insert into zh_identity_private.account_roles(user_id) values(new.id) on conflict(user_id) do nothing;
    end if;
    return new;
end $$;
revoke all on function zh_identity_private.initialize_account_role() from public,anon,authenticated;
create trigger on_zh_account_role_created after insert on auth.users
    for each row execute function zh_identity_private.initialize_account_role();

-- Controlled promotion/demotion of existing registered accounts only.
-- No frontend role editor in this phase. The last active admin cannot be demoted.
create function zh_identity_private.set_account_role(p_user_id uuid,p_role text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare v_actor uuid := auth.uid(); v_previous text;
begin
    perform pg_advisory_xact_lock(hashtextextended('zhserver:account-role-assignment',0));
    if not zh_identity_private.current_is_admin() then raise exception 'account.roleForbidden' using errcode='42501'; end if;
    if p_role is null or p_role not in ('member','admin') or zh_identity_private.system_role(p_user_id) is null then
        raise exception 'account.roleInvalid';
    end if;
    select system_role into v_previous from zh_identity_private.account_roles where user_id=p_user_id for update;
    if v_previous='admin' and p_role='member' and
        (select count(*) from zh_identity_private.account_roles r join auth.users u on u.id=r.user_id
         where r.system_role='admin' and u.deleted_at is null and not coalesce(u.is_anonymous,false))<=1 then
        raise exception 'account.lastAdmin' using errcode='42501';
    end if;
    insert into zh_identity_private.account_roles(user_id,system_role,updated_by)
        values(p_user_id,p_role,v_actor)
        on conflict(user_id) do update set system_role=excluded.system_role,
            updated_at=clock_timestamp(),updated_by=excluded.updated_by;
    return jsonb_build_object('user_id',p_user_id,'system_role',p_role);
end $$;
create function public.set_zh_account_role(p_user_id uuid,p_role text) returns jsonb
language sql set search_path='' as $$ select zh_identity_private.set_account_role(p_user_id,p_role); $$;
revoke all on function zh_identity_private.set_account_role(uuid,text),public.set_zh_account_role(uuid,text) from public,anon,authenticated;
grant execute on function zh_identity_private.set_account_role(uuid,text),public.set_zh_account_role(uuid,text) to authenticated;

create or replace function zh_identity_private.own_identity() returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
    select jsonb_build_object('display_name',zh_identity_private.valid_display_name(p.display_name),
        'created_at',u.created_at,'role_version',1,'system_role',zh_identity_private.system_role(u.id),
        'rank_label',null::text) into result
    from auth.users u left join public.profiles p on p.id=u.id
    where u.id=auth.uid() and not coalesce(u.is_anonymous,false) and u.deleted_at is null;
    if result is null then raise exception 'identity.signInRequired' using errcode='42501'; end if;
    return result;
end $$;

-- Forum ownership stays auth.uid() through the unchanged member_id()/write_post().
create or replace function zh_forum_private.is_admin() returns boolean language sql stable set search_path='' as $$
    select zh_identity_private.current_is_admin();
$$;
create or replace function zh_forum_private.public_profile(p_id uuid) returns jsonb
language sql stable security definer set search_path='' as $$
    select jsonb_build_object('user_id',u.id,'display_name',zh_identity_private.valid_display_name(p.display_name),
        'created_at',u.created_at,'bio',coalesce(e.bio,''),'avatar_path',e.avatar_path,
        'system_role',zh_identity_private.system_role(u.id),'rank_label',null::text)
    from auth.users u join public.profiles p on p.id=u.id
    left join zh_forum_private.profile_extras e on e.user_id=u.id
    where u.id=p_id and not coalesce(u.is_anonymous,false) and u.deleted_at is null
        and zh_identity_private.valid_display_name(p.display_name) is not null;
$$;
create or replace function public.get_zh_forum(p_category text default null,p_topic_id uuid default null,
    p_offset integer default 0,p_post_offset integer default 0) returns jsonb
language sql stable set search_path='' as $$
    select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset)
        || jsonb_build_object('role_version',1);
$$;

-- Existing admin policies retain their commands/targets; only the identity test changes.
alter policy "Admin can read gallery" on "public"."gallery" to authenticated
    using ((select public.is_zh_admin()));
alter policy "Admin can update gallery" on "public"."gallery" to authenticated
    using ((select public.is_zh_admin()))
    with check ((select public.is_zh_admin()));
alter policy "Admin can delete gallery" on "public"."gallery" to authenticated
    using ((select public.is_zh_admin()));
alter policy "Admin can read all guestbook entries" on "public"."guestbook" to authenticated
    using ((select public.is_zh_admin()));
alter policy "Admin can update guestbook" on "public"."guestbook" to authenticated
    using ((select public.is_zh_admin()))
    with check ((select public.is_zh_admin()));
alter policy "Admin can delete guestbook" on "public"."guestbook" to authenticated
    using ((select public.is_zh_admin()));
alter policy "Admin can update community feedback" on "public"."community_feedback" to authenticated
    using ((select public.is_zh_admin()))
    with check ((select public.is_zh_admin()));
alter policy "Admin can delete community feedback" on "public"."community_feedback" to authenticated
    using ((select public.is_zh_admin()));
alter policy "Admin can delete feedback screenshots" on "storage"."objects" to authenticated
    using (((bucket_id = 'community-feedback'::text) AND (select public.is_zh_admin())));

-- Existing forum moderate()/write_post() now use the role predicate above.
-- Topic/reply removal uses their existing hidden flags, with admin-only restore.
-- No forum rows, avatars, accounts, inventories or saves are deleted by this migration.
-- rank_label remains NULL: no invented rank, no game-role/rank change.
