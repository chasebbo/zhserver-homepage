-- PREPARED ONLY. Not applied by the security audit.
-- Removes the one permissive policy that exposes unapproved guestbook messages.
-- Does not delete/update rows, touch approval triggers or change admin access.
begin;
do $guard$
begin
    if (select count(*) from pg_catalog.pg_policies
        where schemaname='public' and tablename='guestbook'
          and cmd in ('SELECT','ALL')) <> 3 or not exists (
        select 1 from pg_catalog.pg_policies
        where schemaname='public' and tablename='guestbook'
          and policyname='Enable read access for all users'
          and cmd='SELECT' and permissive='PERMISSIVE' and qual='true'
          and roles=array['public']::name[]
    ) or not exists (
        select 1 from pg_catalog.pg_policies
        where schemaname='public' and tablename='guestbook'
          and policyname='Allow public read approved entries'
          and cmd='SELECT' and qual='(approved = true)'
          and roles @> array['anon','authenticated']::name[]
    ) or not exists (
        select 1 from pg_catalog.pg_policies
        where schemaname='public' and tablename='guestbook'
          and policyname='Admin can read all guestbook entries'
          and cmd='SELECT' and qual='( SELECT is_zh_admin() AS is_zh_admin)'
    ) then
        raise exception 'Guestbook policies differ from audited state; stop and review';
    end if;
end;
$guard$;
drop policy "Enable read access for all users" on public.guestbook;
commit;

-- Verification after separately approved application (read-only):
-- select policyname, roles, cmd, qual from pg_catalog.pg_policies
-- where schemaname='public' and tablename='guestbook';
-- Check an unapproved fixture with anon/member: invisible; admin: visible.
-- Rollback is possible without data recovery, but reopens the disclosure:
-- create policy "Enable read access for all users" on public.guestbook
--     as permissive for select to public using (true);
-- Prefer investigating missing access instead of restoring that unsafe policy.
