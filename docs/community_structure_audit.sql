-- Gemeinsamer Auth-/Profil-/Presence-Bestand, 07.10.2026.
-- Eine einzige rein lesende Abfrage; Ergebnis ist ein JSON-Objekt.
-- Rein lesend ausgeführt am 07.10.2026. Keine Registrierung oder Datenänderung.
-- Keine Passwörter, Tokenwerte, E-Mail-Adressen oder Profildatensätze ausgeben.
with known_admin as (
    select '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid as user_id
), candidate_tables as (
    select c.oid, n.nspname as schema_name, c.relname as table_name,
           c.relrowsecurity as rls_enabled, c.relforcerowsecurity as rls_forced
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r', 'p', 'v', 'm', 'f')
      and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
      and n.nspname not like 'pg_temp_%'
      and n.nspname not like 'pg_toast_temp_%'
      and (
          (n.nspname = 'auth' and c.relname in ('users', 'identities', 'sessions'))
          or (n.nspname = 'public' and c.relname in ('guestbook', 'gallery', 'community_feedback'))
          or (n.nspname = 'storage' and c.relname in ('objects', 'buckets'))
          or c.relname ~* '(presence|online|community_session|visitor|profile|account|member|(^|_)user(_|$)|(^|_)role(s|_|$)|permission|admin)'
          or exists (
              select 1 from pg_catalog.pg_constraint fk
              where fk.conrelid = c.oid and fk.contype = 'f'
                and fk.confrelid = 'auth.users'::regclass
          )
          or exists (
              select 1 from pg_catalog.pg_attribute a
              where a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
                and a.attname in ('role', 'roles', 'user_role', 'is_admin', 'auth_user_id', 'last_seen', 'last_seen_at', 'heartbeat_at')
          )
      )
), candidate_functions as (
    select p.oid, n.nspname as schema_name, p.proname as function_name,
           p.prosecdef as security_definer, p.proconfig as settings
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where p.prokind = 'f'
      and n.nspname not in ('pg_catalog', 'information_schema')
      and (
          n.nspname = 'zh_community_private'
          or p.proname ~* '(presence|online|community_stats|community_heartbeat|registered.*count|visitor_period|visitor_stats|is_admin|has_role|user_role|authorize|permission|handle_new_user|create_profile)'
          or exists (
              select 1 from pg_catalog.pg_trigger t
              join candidate_tables ct on ct.oid = t.tgrelid
              where t.tgfoid = p.oid and not t.tgisinternal
          )
      )
)
select jsonb_build_object(
    'checked_at', now(),
    'account_counts', (
        select jsonb_build_object(
            'registered_nonanonymous_not_deleted', count(*) filter (
                where coalesce((to_jsonb(u) ->> 'is_anonymous')::boolean, false) = false
                  and to_jsonb(u) ->> 'deleted_at' is null),
            'public_profile_mapping', 'Determine from schema and RLS; do not assume display names are globally public'
        ) from auth.users u
    ),
    'known_admin', (
        select jsonb_build_object(
            'found', u.id is not null,
            'id', u.id,
            'sql_role', u.role,
            'email_confirmed', u.email_confirmed_at is not null,
            'app_metadata_keys', (
                select coalesce(jsonb_agg(metadata_key.key order by metadata_key.key), '[]'::jsonb)
                from jsonb_object_keys(coalesce(u.raw_app_meta_data, '{}'::jsonb)) as metadata_key(key)
            ),
            'trusted_application_fields', jsonb_build_object(
                'role', u.raw_app_meta_data -> 'role',
                'roles', u.raw_app_meta_data -> 'roles',
                'user_role', u.raw_app_meta_data -> 'user_role',
                'is_admin', u.raw_app_meta_data -> 'is_admin'
            ),
            'user_metadata_keys', (
                select coalesce(jsonb_agg(metadata_key.key order by metadata_key.key), '[]'::jsonb)
                from jsonb_object_keys(coalesce(u.raw_user_meta_data, '{}'::jsonb)) as metadata_key(key)
            ),
            'identity_providers', (
                select coalesce(jsonb_agg(distinct i.provider), '[]'::jsonb)
                from auth.identities i where i.user_id = u.id
            )
        )
        from known_admin ka left join auth.users u on u.id = ka.user_id
    ),
    'tables', (
        select coalesce(jsonb_agg(jsonb_build_object(
            'schema', ct.schema_name, 'name', ct.table_name,
            'rls_enabled', ct.rls_enabled, 'rls_forced', ct.rls_forced,
            'columns', (
                select coalesce(jsonb_agg(jsonb_build_object(
                    'name', a.attname,
                    'type', pg_catalog.format_type(a.atttypid, a.atttypmod),
                    'not_null', a.attnotnull,
                    'default', pg_catalog.pg_get_expr(d.adbin, d.adrelid)
                ) order by a.attnum), '[]'::jsonb)
                from pg_catalog.pg_attribute a
                left join pg_catalog.pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
                where a.attrelid = ct.oid and a.attnum > 0 and not a.attisdropped
            ),
            'constraints', (
                select coalesce(jsonb_agg(jsonb_build_object(
                    'name', con.conname,
                    'definition', pg_catalog.pg_get_constraintdef(con.oid)
                ) order by con.conname), '[]'::jsonb)
                from pg_catalog.pg_constraint con where con.conrelid = ct.oid
            )
        ) order by ct.schema_name, ct.table_name), '[]'::jsonb)
        from candidate_tables ct
    ),
    'policies', (
        select coalesce(jsonb_agg(jsonb_build_object(
            'schema', pol.schemaname, 'table', pol.tablename,
            'name', pol.policyname, 'roles', pol.roles,
            'command', pol.cmd, 'permissive', pol.permissive,
            'using', pol.qual, 'with_check', pol.with_check
        ) order by pol.schemaname, pol.tablename, pol.policyname), '[]'::jsonb)
        from pg_catalog.pg_policies pol
        join candidate_tables ct on ct.schema_name = pol.schemaname and ct.table_name = pol.tablename
    ),
    'api_grants', (
        select coalesce(jsonb_agg(jsonb_build_object(
            'schema', g.table_schema, 'table', g.table_name,
            'grantee', g.grantee, 'privilege', g.privilege_type
        ) order by g.table_schema, g.table_name, g.grantee, g.privilege_type), '[]'::jsonb)
        from information_schema.role_table_grants g
        join candidate_tables ct on ct.schema_name = g.table_schema and ct.table_name = g.table_name
        where g.grantee in ('anon', 'authenticated', 'PUBLIC')
    ),
    'account_triggers', (
        select coalesce(jsonb_agg(jsonb_build_object(
            'schema', ct.schema_name, 'table', ct.table_name,
            'name', t.tgname,
            'definition', pg_catalog.pg_get_triggerdef(t.oid),
            'function', t.tgfoid::regprocedure::text
        ) order by ct.schema_name, ct.table_name, t.tgname), '[]'::jsonb)
        from pg_catalog.pg_trigger t
        join candidate_tables ct on ct.oid = t.tgrelid
        where not t.tgisinternal
    ),
    'role_profile_helpers', (
        select coalesce(jsonb_agg(jsonb_build_object(
            'schema', f.schema_name, 'name', f.function_name,
            'signature', f.oid::regprocedure::text,
             'security_definer', f.security_definer, 'settings', f.settings,
            'definition', case when f.schema_name = 'zh_community_private'
                or f.function_name ~* '(presence|online|community_stats|community_heartbeat|registered.*count)'
                then pg_catalog.pg_get_functiondef(f.oid) else null end
        ) order by f.schema_name, f.function_name, f.oid), '[]'::jsonb)
        from candidate_functions f
    )
) as community_structure_audit;
