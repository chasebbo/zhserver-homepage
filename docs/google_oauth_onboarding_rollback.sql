-- ROLLBACK for google_oauth_onboarding_prepare.sql. Only with explicit approval.
-- Restores the function bodies read from production on 27.10.2026.
-- Before running: switch Google off in Supabase. Accounts still marked as pending
-- keep their placeholder name and must then be completed or removed by hand.
begin;

create or replace function zh_legal_private.capture_registration_consent()
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

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = 'public' as $function$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Survivor'));
  insert into public.player_inventory (player_id, items, pistol_ammo)
  values (
    new.id,
    '{"Pistole": 1, "Axt": 1, "Konserven": 1, "Wasser": 1, "Verband": 1}'::jsonb,
    15
  );
  return new;
end;
$function$;

create or replace function zh_identity_private.own_identity()
returns jsonb language plpgsql stable security definer set search_path = '' as $function$
declare result jsonb;
begin
    select jsonb_build_object('display_name',zh_identity_private.valid_display_name(p.display_name),
        'created_at',u.created_at,'role_version',1,'system_role',zh_identity_private.system_role(u.id),
        'rank_label',null::text) into result
    from auth.users u left join public.profiles p on p.id=u.id
    where u.id=auth.uid() and not coalesce(u.is_anonymous,false) and u.deleted_at is null;
    if result is null then raise exception 'identity.signInRequired' using errcode='42501'; end if;
    return result;
end $function$;

create or replace function zh_identity_private.set_own_display_name(p_display_name text)
returns jsonb language plpgsql security definer set search_path = '' as $function$
DECLARE
    actor uuid := auth.uid();
    canonical_name text := zh_identity_private.valid_display_name(p_display_name);
    registered_at timestamptz;
BEGIN
    SELECT u.created_at INTO registered_at
    FROM auth.users u
    WHERE u.id = actor AND u.deleted_at IS NULL
      AND NOT coalesce(u.is_anonymous, false)
      AND (u.banned_until IS NULL OR u.banned_until <= pg_catalog.now());
    IF registered_at IS NULL THEN
        RAISE EXCEPTION 'identity.signInRequired' USING errcode = '42501';
    END IF;
    IF canonical_name IS NULL THEN
        RAISE EXCEPTION 'account.nameInvalid' USING errcode = '22023';
    END IF;
    BEGIN
        INSERT INTO public.profiles(id, display_name, created_at, updated_at)
        VALUES(actor, canonical_name, registered_at, pg_catalog.clock_timestamp())
        ON CONFLICT (id) DO UPDATE
            SET display_name = excluded.display_name,
                updated_at = excluded.updated_at;
    EXCEPTION WHEN unique_violation THEN
        RAISE EXCEPTION 'account.nameTaken' USING errcode = '22023';
    END;
    RETURN zh_identity_private.own_identity();
END;
$function$;

create or replace function zh_forum_private.member_id()
returns uuid language plpgsql stable security definer set search_path = '' as $function$
declare v_id uuid := auth.uid();
begin
    if v_id is null or not exists (select 1 from auth.users u where u.id=v_id and not coalesce(u.is_anonymous,false) and u.deleted_at is null) then
        raise exception 'identity.signInRequired' using errcode='42501';
    end if;
    if not exists (select 1 from public.profiles p where p.id=v_id and zh_identity_private.valid_display_name(p.display_name) is not null) then
        raise exception 'identity.nameRequired' using errcode='42501';
    end if;
    return v_id;
end $function$;

create or replace function zh_pulse_private.member_id()
returns uuid language plpgsql stable security definer set search_path = '' as $function$
declare v_id uuid := auth.uid(); begin
    if v_id is null or not exists(select 1 from auth.users where id=v_id and not coalesce(is_anonymous,false) and deleted_at is null) then
        raise exception 'pulse.signInRequired' using errcode='42501';
    end if;
    return v_id;
end $function$;

create or replace function public.initialize_my_player_state(p_spawn_name text, p_character_style integer)
returns jsonb language plpgsql security definer set search_path = '' as $function$
DECLARE
  v_player_id uuid := auth.uid();
  v_position jsonb;
  v_state jsonb;
BEGIN
  IF v_player_id IS NULL THEN
    RAISE EXCEPTION 'authentication required' USING ERRCODE = '42501';
  END IF;
  IF p_character_style IS NULL OR p_character_style NOT BETWEEN 0 AND 4 THEN
    RAISE EXCEPTION 'invalid character style' USING ERRCODE = '22023';
  END IF;
  -- Exact existing main.gd SPAWN_CELLS * TILE_SIZE; no free client coordinates.
  v_position := CASE p_spawn_name
    WHEN 'NORD' THEN '[11520,2944]'::jsonb
    WHEN 'OST' THEN '[86080,18560]'::jsonb
    WHEN 'SUED' THEN '[46400,40320]'::jsonb
    WHEN 'WEST' THEN '[5760,20800]'::jsonb
    WHEN 'ADMIN BASE' THEN '[45632,22880]'::jsonb
    ELSE NULL END;
  IF v_position IS NULL THEN
    RAISE EXCEPTION 'invalid spawn selection' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.player_state (player_id, position, items, pistol_ammo, rifle_ammo,
    cash, points, health, hunger, thirst, state_version)
  VALUES (v_player_id, v_position,
    jsonb_build_object('inventory', jsonb_build_object('Pistole', 1, 'Axt', 1, 'Konserven', 1,
      'Wasser', 1, 'Verband', 1, 'Basisflagge', 1, 'Karte', 1),
      'meta', jsonb_build_object('character_style', p_character_style, 'map_found', true,
        'rifle_reserve_ammo', 0, 'quick_slots', jsonb_build_array('', 'Pistole', 'Axt', 'Konserven', 'Wasser', 'Verband'))),
    15, 0, 120, 0, 100, 84, 76, 1)
  ON CONFLICT (player_id) DO NOTHING;
  SELECT to_jsonb(ps) INTO v_state FROM public.player_state AS ps WHERE ps.player_id = v_player_id;
  RETURN jsonb_build_object('success', true, 'state_version', (v_state->>'state_version')::integer, 'player_state', v_state);
END;
$function$;

create or replace function public.get_leaderboard()
returns table(rank bigint, nickname text, points integer)
language sql stable security definer set search_path = 'public' as $function$
  select
    row_number() over (order by coalesce(ps.points, p.points, 0) desc, p.created_at asc) as rank,
    p.display_name as nickname,
    coalesce(ps.points, p.points, 0)::integer as points
  from public.profiles p
  left join public.player_state ps on ps.player_id = p.id
  where p.display_name is not null and length(trim(p.display_name)) > 0
  order by coalesce(ps.points, p.points, 0) desc, p.created_at asc
  limit 100;
$function$;

create or replace function public.get_recent_players()
returns table(nickname text)
language sql stable security definer set search_path = 'public' as $function$
    SELECT p.display_name AS nickname
    FROM public.profiles p
    WHERE p.display_name IS NOT NULL
      AND length(trim(p.display_name)) > 0
    ORDER BY p.created_at DESC
    LIMIT 5;
$function$;

create or replace function zh_identity_private.newest_identity()
returns jsonb language sql stable security definer set search_path = '' as $function$
    select coalesce((
        select pg_catalog.jsonb_build_object(
            'display_name', zh_identity_private.valid_display_name(p.display_name),
            'created_at', u.created_at
        )
        from auth.users u left join public.profiles p on p.id = u.id
        where not coalesce(u.is_anonymous, false) and u.deleted_at is null
        order by u.created_at desc, u.id desc limit 1
    ), pg_catalog.jsonb_build_object('display_name', null, 'created_at', null));
$function$;

create or replace function zh_community_private.get_stats()
returns jsonb language sql security definer set search_path = '' as $function$
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
$function$;

create or replace function public.get_registered_player_count()
returns bigint language sql stable security definer set search_path = 'public' as $function$
  select count(*)::bigint
  from public.profiles;
$function$;

drop function public.get_zh_account_ready(uuid);
drop function public.complete_zh_account_setup(text, boolean, text, text);
drop function zh_legal_private.complete_account_setup(text, boolean, text, text);
drop function zh_legal_private.consent_pending(uuid);
drop table zh_legal_private.pending_consents;

commit;
