-- PREPARED ONLY. Do not apply to production without explicit user approval.
-- Audited project: yawadxzeyyrozmlrokun (08.10.2026).
-- Existing accounts, profiles, inventory and on_auth_user_created remain unchanged.
-- Requires coordinating the new signup frontend with this trigger.
begin;

create schema zh_legal_private;
revoke all on schema zh_legal_private from public, anon, authenticated;
grant usage on schema zh_legal_private to anon, authenticated;

create table zh_legal_private.account_consents (
    user_id uuid not null references auth.users(id) on delete cascade,
    terms_version text not null check (terms_version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
    community_rules_version text not null check (community_rules_version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
    accepted_at timestamptz not null default pg_catalog.clock_timestamp(),
    primary key (user_id, terms_version, community_rules_version)
);
alter table zh_legal_private.account_consents enable row level security;
revoke all on zh_legal_private.account_consents from public, anon, authenticated, service_role;
create policy own_consent_read on zh_legal_private.account_consents
    for select to authenticated using ((select auth.uid()) = user_id);
-- No direct client grants and no INSERT/UPDATE/DELETE policies.

create function zh_legal_private.current_policy()
returns jsonb language sql immutable security invoker set search_path = '' as $$
    select pg_catalog.jsonb_build_object(
        'terms_version', '2026-10-08',
        'community_rules_version', '2026-10-08',
        'acceptance_required', true
    );
$$;
revoke all on function zh_legal_private.current_policy() from public;
grant execute on function zh_legal_private.current_policy() to anon, authenticated;

create function zh_legal_private.capture_registration_consent()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
    offer jsonb := new.raw_user_meta_data -> 'zh_legal_consent';
    policy jsonb := zh_legal_private.current_policy();
begin
    -- Existing guest mode is not a registered account. Anonymous Auth is currently disabled.
    if coalesce(new.is_anonymous, false) then return new; end if;
    if pg_catalog.jsonb_typeof(offer) is distinct from 'object'
        or offer -> 'accepted' is distinct from 'true'::jsonb
        or pg_catalog.jsonb_typeof(offer -> 'terms_version') is distinct from 'string'
        or pg_catalog.jsonb_typeof(offer -> 'community_rules_version') is distinct from 'string'
        or offer ->> 'terms_version' is distinct from policy ->> 'terms_version'
        or offer ->> 'community_rules_version' is distinct from policy ->> 'community_rules_version'
    then
        raise exception 'legal.acceptanceRequired' using errcode = '23514';
    end if;
    -- Metadata is only the submitted acceptance assertion. The durable source is
    -- this private row: versions validated against server policy, ID from NEW,
    -- timestamp from the server. No client ID/time and no metadata UPDATE trigger.
    insert into zh_legal_private.account_consents
        (user_id, terms_version, community_rules_version, accepted_at)
    values (new.id, policy ->> 'terms_version', policy ->> 'community_rules_version', pg_catalog.clock_timestamp());
    return new;
end $$;
revoke all on function zh_legal_private.capture_registration_consent() from public, anon, authenticated, service_role;

create trigger on_zh_account_legal_created after insert on auth.users
    for each row execute function zh_legal_private.capture_registration_consent();

create function zh_legal_private.own_consents()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
    own_id uuid := auth.uid();
    history jsonb;
begin
    if own_id is null or not exists (
        select 1 from auth.users u where u.id = own_id
            and not coalesce(u.is_anonymous, false) and u.deleted_at is null
    ) then raise exception 'identity.signInRequired' using errcode = '42501'; end if;
    select coalesce(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
        'terms_version', c.terms_version,
        'community_rules_version', c.community_rules_version,
        'accepted_at', c.accepted_at
    ) order by c.accepted_at desc), '[]'::jsonb) into history
    from zh_legal_private.account_consents c where c.user_id = own_id;
    return pg_catalog.jsonb_build_object('acceptances', history);
end $$;
revoke all on function zh_legal_private.own_consents() from public, anon, service_role;
grant execute on function zh_legal_private.own_consents() to authenticated;

create function public.get_zh_registration_policy()
returns jsonb language sql immutable security invoker set search_path = '' as $$
    select zh_legal_private.current_policy();
$$;
revoke all on function public.get_zh_registration_policy() from public;
grant execute on function public.get_zh_registration_policy() to anon, authenticated;

create function public.get_zh_own_legal_consents()
returns jsonb language sql stable security invoker set search_path = '' as $$
    select zh_legal_private.own_consents();
$$;
revoke all on function public.get_zh_own_legal_consents() from public, anon, service_role;
grant execute on function public.get_zh_own_legal_consents() to authenticated;

comment on table zh_legal_private.account_consents is
    'Private versioned account acceptance; server-assigned account/time, no direct client writes. Existing accounts are not backfilled or blocked.';

commit;
