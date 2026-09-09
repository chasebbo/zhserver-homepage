-- ========================================================
-- Community Feature-Voting (Echte Stimmen in Supabase)
-- Im Supabase Dashboard unter "SQL Editor" ausführen
-- ========================================================

-- 1. Tabelle für die Feature-Stimmen anlegen
create table if not exists public.community_votes (
    id text primary key,
    title text not null,
    votes integer not null default 0,
    updated_at timestamptz default now()
);

-- 2. Initiale Features mit 0 Stimmen einfügen (100% echt, keine Vorbelegung)
insert into public.community_votes (id, title, votes) values
    ('weapons', 'Schrotflinte & Jagdgewehr', 0),
    ('weather', 'Dynamisches Wetter & Nebel', 0),
    ('hordes', 'Zombie-Horden bei Nacht', 0),
    ('vehicles', 'Fahrzeug-Tuning & Kofferraum', 0)
on conflict (id) do nothing;

-- 3. Row-Level-Security aktivieren
alter table public.community_votes enable row level security;

-- 4. Öffentlicher Lesezugriff für alle Besucher
drop policy if exists "Oeffentlicher Lesezugriff auf Votes" on public.community_votes;
create policy "Oeffentlicher Lesezugriff auf Votes"
    on public.community_votes for select
    to anon, authenticated
    using (true);

-- 5. Sichere Stimmabgabe per RPC-Funktion
create or replace function public.vote_for_feature(feature_id text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
    updated_votes integer;
begin
    update public.community_votes
    set votes = votes + 1,
        updated_at = now()
    where id = feature_id
    returning votes into updated_votes;

    if not found then
        return json_build_object('success', false, 'error', 'Feature nicht gefunden');
    end if;

    return json_build_object('success', true, 'feature_id', feature_id, 'votes', updated_votes);
end;
$$;

-- 6. Berechtigung zum Aufrufen der Funktion an anonyme und angemeldete Besucher
revoke all on function public.vote_for_feature(text) from public;
grant execute on function public.vote_for_feature(text) to anon, authenticated;
