-- Narrow own-profile editor. Existing Auth IDs, name validator and unique index.
-- No grants on profiles, no role changes and no writes to gameplay tables.
-- Already installed as homepage_own_display_name_editor, version 20261008142028.
-- Keep this RPC. No rollback or account/name transfer is authorized.
-- cHa remains on the existing legacy game account; no name/data migration here.

CREATE OR REPLACE FUNCTION zh_identity_private.set_own_display_name(p_display_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

REVOKE ALL ON FUNCTION zh_identity_private.set_own_display_name(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION zh_identity_private.set_own_display_name(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_zh_own_display_name(p_display_name text)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
    SELECT zh_identity_private.set_own_display_name(p_display_name);
$$;

REVOKE ALL ON FUNCTION public.set_zh_own_display_name(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_zh_own_display_name(text) TO authenticated;
