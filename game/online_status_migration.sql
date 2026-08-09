-- Oeffentliche, datensparsame Live-Anzeige fuer die Spielseite.
-- Zaehlt nur Spieler, deren Praesenz in den letzten 15 Sekunden aktualisiert wurde.
create or replace function public.get_online_player_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer
  from player_presence
  where updated_at > now() - interval '15 seconds';
$$;

revoke all on function public.get_online_player_count() from public;
grant execute on function public.get_online_player_count() to anon, authenticated;
-- Datensparsame öffentliche Gesamtzahl registrierter Spielaccounts.
-- Gibt ausschließlich die Anzahl zurück, niemals Profil- oder Kontodaten.
create or replace function public.get_registered_player_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.profiles
  where display_name is not null and length(trim(display_name)) > 0;
$$;

revoke all on function public.get_registered_player_count() from public;
grant execute on function public.get_registered_player_count() to anon, authenticated;