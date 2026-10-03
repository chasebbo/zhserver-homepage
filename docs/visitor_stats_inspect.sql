-- Optional READ-ONLY inspection in the existing Supabase SQL Editor.
-- It reveals the legacy RPC implementation and the tables referenced there.
-- No anonymous browser key grants access to these administrator-only definitions.
select p.oid::regprocedure as function_signature,
       p.prosecdef as security_definer,
       pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('register_visitor', 'get_visitor_stats',
                   'register_visitor_period', 'get_visitor_period_stats')
order by p.proname, p.oid;

select c.table_name, c.column_name, c.data_type, c.is_nullable
from information_schema.columns c
where c.table_schema = 'public' and c.table_name ilike '%visitor%'
order by c.table_name, c.ordinal_position;

-- After migration: returned timestamp is the exact start of the retained history.
-- select * from public.get_visitor_period_stats();
