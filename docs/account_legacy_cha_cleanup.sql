-- Explicitly authorized legacy account deletion, 09.10.2026.
-- Production project: yawadxzeyyrozmlrokun (zhserver).
-- One transaction; exact UUIDs; no schema changes or gameplay transfer.
-- Not idempotent: if the reviewed preconditions changed, abort without writes.
-- WARNING: a committed Auth/gameplay deletion is not undoable by git revert.
-- Before COMMIT every failed assertion rolls the whole transaction back.
-- Existing safe own-name RPC is reused in a privileged database context.
-- Archived copy omits the private central email equality check used at execution.
-- The central UUID was independently verified; its complete Auth row is preserved.
BEGIN;
SET LOCAL statement_timeout = '25s';
SET LOCAL lock_timeout = '5s';

DO $cleanup$
DECLARE
    legacy CONSTANT uuid := 'c00a3f4e-862c-4e10-bb38-31f2e62a2ac7';
    central CONSTANT uuid := '7ba1fad4-d113-4526-8873-3e3b97e9be7e';
    owned_groups uuid[];
    snapshot_before jsonb := '{}'::jsonb;
    snapshot_after jsonb := '{}'::jsonb;
    fingerprint jsonb;
    policy_before text;
    policy_after text;
    central_auth_before text;
    rpc_result jsonb;
    table_spec record;
    column_spec record;
    deleted_count bigint;
    remaining bigint;
    phase integer;
BEGIN
    -- Lock only the two reviewed Auth accounts, never change their UUIDs.
    PERFORM 1 FROM auth.users
        WHERE id IN (legacy, central) ORDER BY id FOR UPDATE;
    IF (SELECT count(*) FROM auth.users
        WHERE id = legacy AND email = 'cha@island-survival.local'
          AND deleted_at IS NULL) <> 1 THEN
        RAISE EXCEPTION 'Legacy account precondition changed; no cleanup';
    END IF;
    IF (SELECT count(*) FROM auth.users
        WHERE id = central AND email IS NOT NULL
          AND deleted_at IS NULL AND NOT coalesce(is_anonymous, false)) <> 1 THEN
        RAISE EXCEPTION 'Central account precondition changed; no cleanup';
    END IF;
    IF (SELECT count(*) FROM public.profiles
        WHERE id = legacy AND display_name = 'cHa') <> 1
       OR EXISTS (SELECT 1 FROM public.profiles WHERE id = central)
       OR (SELECT count(*) FROM public.profiles WHERE lower(display_name) = 'cha') <> 1 THEN
        RAISE EXCEPTION 'Profile/name precondition changed; no cleanup';
    END IF;
    SELECT md5(row(u.*)::text) INTO central_auth_before
        FROM auth.users u WHERE u.id = central;
    SELECT md5(coalesce(jsonb_agg(to_jsonb(p)
        ORDER BY schemaname, tablename, policyname)::text, ''))
        INTO policy_before FROM pg_policies p;

    SELECT array_agg(id ORDER BY id) INTO owned_groups
        FROM public.player_groups WHERE owner_id = legacy;
    IF cardinality(owned_groups) <> 2
       OR owned_groups <> ARRAY[
            '11af54e5-ed13-43f9-93cc-279c1276e0f0'::uuid,
            '57ea1900-56c9-46ff-a3c4-3e5011ee03e4'::uuid
          ] THEN
        RAISE EXCEPTION 'Legacy-owned groups changed; no cleanup';
    END IF;
    IF (SELECT count(*) FROM public.group_members
        WHERE player_id = legacy) <> 4
       OR (SELECT count(*) FROM public.group_members
        WHERE player_id = legacy OR group_id = ANY(owned_groups)) <> 6
       OR EXISTS (SELECT 1 FROM public.group_members
        WHERE group_id = ANY(owned_groups)
          AND player_id <> legacy AND status <> 'invited')
       OR EXISTS (SELECT 1 FROM public.group_members
        WHERE invited_by = legacy AND NOT (group_id = ANY(owned_groups))) THEN
        RAISE EXCEPTION 'Group cascade differs from reviewed six references';
    END IF;
    IF (SELECT count(*) FROM public.clan_members WHERE player_id = legacy) <> 1
       OR EXISTS (SELECT 1 FROM public.clan_members
        WHERE player_id = legacy AND status <> 'invited')
       OR EXISTS (SELECT 1 FROM public.clans WHERE leader_id = legacy) THEN
        RAISE EXCEPTION 'Clan references changed; no cleanup';
    END IF;
    IF (SELECT count(*) FROM public.player_state WHERE player_id = legacy) <> 1
       OR (SELECT count(*) FROM public.player_inventory WHERE player_id = legacy) <> 1
       OR (SELECT count(*) FROM public.player_presence WHERE player_id = legacy) <> 1 THEN
        RAISE EXCEPTION 'Legacy gameplay row counts changed; no cleanup';
    END IF;
    IF EXISTS (SELECT 1 FROM public.player_bases WHERE owner_id = legacy)
       OR EXISTS (SELECT 1 FROM public.world_vehicles WHERE owner_id = legacy)
       OR EXISTS (SELECT 1 FROM public.death_drops WHERE owner_id = legacy)
       OR EXISTS (SELECT 1 FROM storage.objects WHERE owner = legacy OR owner_id = legacy::text)
       OR EXISTS (SELECT 1 FROM public.zh_community_presence WHERE user_id = legacy)
       OR EXISTS (SELECT 1 FROM zh_identity_private.content_authors WHERE user_id = legacy)
       OR EXISTS (SELECT 1 FROM zh_legal_private.account_consents WHERE user_id = legacy) THEN
        RAISE EXCEPTION 'Additional legacy ownership exists; stop for scoped review';
    END IF;
    IF EXISTS (SELECT 1 FROM auth.refresh_tokens r
        JOIN auth.sessions s ON s.id = r.session_id
        WHERE (r.user_id = legacy::text AND s.user_id <> legacy)
           OR (r.user_id <> legacy::text AND s.user_id = legacy)) THEN
        RAISE EXCEPTION 'Refresh token crosses account boundary; no cleanup';
    END IF;

    FOR phase IN 1..2 LOOP
        -- Compare every non-target application row, Storage object and Auth user.
        -- Only hashes/counts are returned; credentials and row contents stay in DB.
        FOR table_spec IN
            SELECT 'public.clan_members' AS relation,
                   format('player_id <> %L::uuid', legacy) AS predicate
            UNION ALL SELECT 'public.clans', 'true'
            UNION ALL SELECT 'public.community_feedback', 'true'
            UNION ALL SELECT 'public.community_votes', 'true'
            UNION ALL SELECT 'public.death_drops', 'true'
            UNION ALL SELECT 'public.gallery', 'true'
            UNION ALL SELECT 'public.group_members',
                format('player_id <> %L::uuid AND NOT (group_id = ANY(%L::uuid[]))', legacy, owned_groups)
            UNION ALL SELECT 'public.guestbook', 'true'
            UNION ALL SELECT 'public.homepage_visitor_days', 'true'
            UNION ALL SELECT 'public.homepage_visitor_tracking', 'true'
            UNION ALL SELECT 'public.player_bases', 'true'
            UNION ALL SELECT 'public.player_groups', format('owner_id <> %L::uuid', legacy)
            UNION ALL SELECT 'public.player_inventory', format('player_id <> %L::uuid', legacy)
            UNION ALL SELECT 'public.player_presence', format('player_id <> %L::uuid', legacy)
            UNION ALL SELECT 'public.player_state', format('player_id <> %L::uuid', legacy)
            UNION ALL SELECT 'public.profiles', format('id NOT IN (%L::uuid, %L::uuid)', legacy, central)
            UNION ALL SELECT 'public.visitor_stats', 'true'
            UNION ALL SELECT 'public.world_vehicles', 'true'
            UNION ALL SELECT 'public.zh_community_presence', 'true'
            UNION ALL SELECT 'zh_identity_private.content_authors', 'true'
            UNION ALL SELECT 'zh_legal_private.account_consents', 'true'
            UNION ALL SELECT 'storage.objects', 'true'
            UNION ALL SELECT 'auth.users', format('id <> %L::uuid', legacy)
            UNION ALL SELECT 'auth.identities', format('user_id <> %L::uuid', legacy)
            UNION ALL SELECT 'auth.sessions', format('user_id <> %L::uuid', legacy)
            UNION ALL SELECT 'auth.refresh_tokens', format('user_id IS DISTINCT FROM %L', legacy::text)
        LOOP
            EXECUTE format(
                'SELECT jsonb_build_object(''count'', count(*), ''hash'', md5(coalesce(string_agg(row_hash, '''' ORDER BY row_hash), ''''))) FROM (SELECT md5(row(t.*)::text) AS row_hash FROM %s t WHERE %s) stable_rows',
                table_spec.relation, table_spec.predicate)
                INTO fingerprint;
            IF phase = 1 THEN
                snapshot_before := snapshot_before || jsonb_build_object(table_spec.relation, fingerprint);
            ELSE
                snapshot_after := snapshot_after || jsonb_build_object(table_spec.relation, fingerprint);
            END IF;
        END LOOP;

        IF phase = 1 THEN
            -- Refresh tokens are user_id text, not directly FK-bound to auth.users.
            -- Explicit target cleanup also covers any sessionless legacy tokens.
            DELETE FROM auth.refresh_tokens WHERE user_id = legacy::text;
            -- Reviewed FK cascades remove profile, save, inventory, presence,
            -- two owned groups, six related group rows and one clan invitation.
            -- Sessions and Auth identities are also removed by their existing FKs.
            DELETE FROM auth.users
                WHERE id = legacy AND email = 'cha@island-survival.local';
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            IF deleted_count <> 1 THEN
                RAISE EXCEPTION 'Expected exactly one legacy Auth deletion';
            END IF;

            -- Privileged SQL maintenance context, scoped to existing central UUID.
            -- Reuse the installed own-profile validator and uniqueness enforcement.
            PERFORM set_config('request.jwt.claim.sub', central::text, true);
            PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
            PERFORM set_config('request.jwt.claims',
                jsonb_build_object('sub', central::text, 'role', 'authenticated')::text, true);
            SELECT public.set_zh_own_display_name('cHa') INTO rpc_result;
            IF rpc_result->>'display_name' IS DISTINCT FROM 'cHa' THEN
                RAISE EXCEPTION 'Own-name RPC did not confirm cHa';
            END IF;
        END IF;
    END LOOP;

    IF snapshot_after IS DISTINCT FROM snapshot_before THEN
        RAISE EXCEPTION 'Non-target rows changed; rolling whole transaction back';
    END IF;
    IF (SELECT md5(row(u.*)::text) FROM auth.users u WHERE u.id = central)
        IS DISTINCT FROM central_auth_before THEN
        RAISE EXCEPTION 'Central Auth record changed; rolling back';
    END IF;
    SELECT md5(coalesce(jsonb_agg(to_jsonb(p)
        ORDER BY schemaname, tablename, policyname)::text, ''))
        INTO policy_after FROM pg_policies p;
    IF policy_after IS DISTINCT FROM policy_before THEN
        RAISE EXCEPTION 'Authorization policies changed; rolling back';
    END IF;
    IF (SELECT count(*) FROM public.profiles WHERE id = central AND display_name = 'cHa') <> 1
       OR (SELECT count(*) FROM public.profiles WHERE lower(display_name) = 'cha') <> 1
       OR EXISTS (SELECT 1 FROM auth.users WHERE id = legacy) THEN
        RAISE EXCEPTION 'Final identity assertion failed';
    END IF;

    -- Verify every direct UUID reference, including non-FK application fields.
    FOR column_spec IN
        SELECT n.nspname, c.relname, a.attname
        FROM pg_attribute a
        JOIN pg_class c ON c.oid = a.attrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE a.attnum > 0 AND NOT a.attisdropped AND c.relkind = 'r'
          AND n.nspname IN ('public','zh_identity_private','zh_community_private','zh_legal_private','auth','storage')
          AND (a.atttypid = 'uuid'::regtype OR
               (a.atttypid IN ('text'::regtype,'character varying'::regtype)
                AND a.attname IN ('owner_id','player_id','user_id','invited_by','leader_id')))
    LOOP
        EXECUTE format('SELECT count(*) FROM %I.%I WHERE %I::text = %L',
            column_spec.nspname, column_spec.relname, column_spec.attname, legacy::text)
            INTO remaining;
        IF remaining <> 0 THEN
            RAISE EXCEPTION 'Remaining legacy reference in %.%.%; rollback',
                column_spec.nspname, column_spec.relname, column_spec.attname;
        END IF;
    END LOOP;

    PERFORM set_config('request.jwt.claim.sub', '', true);
    PERFORM set_config('request.jwt.claim.role', '', true);
    PERFORM set_config('request.jwt.claims', '{}', true);
END;
$cleanup$;

SELECT jsonb_build_object(
    'legacy_auth_absent', NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'c00a3f4e-862c-4e10-bb38-31f2e62a2ac7'),
    'central_account_preserved', EXISTS (SELECT 1 FROM auth.users WHERE id = '7ba1fad4-d113-4526-8873-3e3b97e9be7e' AND deleted_at IS NULL),
    'central_display_name', (SELECT display_name FROM public.profiles WHERE id = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'),
    'central_player_state_count', (SELECT count(*) FROM public.player_state WHERE player_id = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'),
    'central_inventory_count', (SELECT count(*) FROM public.player_inventory WHERE player_id = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'),
    'non_target_rows_preserved', true,
    'admin_policies_preserved', true
) AS verified_cleanup;
COMMIT;
