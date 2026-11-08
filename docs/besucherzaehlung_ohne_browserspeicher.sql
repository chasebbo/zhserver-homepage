-- Besucherzählung und Forum-Aufrufzahlen ohne Speicherung im Browser.
-- Freigabe Sebastian 08.11.2026. Rückweg: docs/besucherzaehlung_ohne_browserspeicher_RUECKWEG.sql
-- Abgeglichen mit den Live-Funktionen vom 08.11.2026 (pg_get_functiondef).
-- Das Tagesgeheimnis entsteht in der Datenbank und steht nirgends in Dateien oder Git.
--
-- Schritt 0 (erledigt 08.11.2026, Prüffunktion danach gelöscht):
-- x-forwarded-for, x-real-ip und true-client-ip kann der Besucher selbst setzen.
-- cf-connecting-ip setzt Cloudflare selbst; eine gefälschte Angabe lehnt Cloudflare
-- mit Fehler 1000 ab. Der Wert stimmt mit der eigenen öffentlichen IPv4 überein
-- (verglichen nur über einen Hash). Deshalb zählt nur cf-connecting-ip.
-- pgcrypto liegt im Schema extensions (hmac, gen_random_bytes).

begin;

------------------------------------------------------------------------------
-- Schritt 1: Tagesgeheimnis und Einweg-Wert
------------------------------------------------------------------------------
create schema if not exists zh_count_private;
revoke all on schema zh_count_private from public, anon, authenticated;

create table if not exists zh_count_private.day_secret (
    day date primary key,
    secret bytea not null check (length(secret) = 32)
);
alter table zh_count_private.day_secret enable row level security;
revoke all on zh_count_private.day_secret from public, anon, authenticated;

-- Einweg-Wert aus Zweck, IP-Adresse, Browserangabe und Tagesgeheimnis (HMAC-SHA-256).
-- Die IP-Adresse wird nur im Speicher verwendet und nie geschrieben.
-- Fehlt die IP im Request, gibt es keinen Wert und es wird nicht gezählt.
create or replace function zh_count_private.day_key(p_scope text)
returns text language plpgsql volatile security definer set search_path = '' as $$
declare
    v_day date := (current_timestamp at time zone 'Europe/Berlin')::date;
    v_headers json := nullif(current_setting('request.headers', true), '')::json;
    v_ip text;
    v_ua text;
    v_secret bytea;
begin
    -- Nur cf-connecting-ip (siehe Schritt 0), keine frei setzbare Kopfzeile.
    v_ip := btrim(coalesce(v_headers ->> 'cf-connecting-ip', ''));
    v_ua := left(coalesce(v_headers ->> 'user-agent', ''), 512);
    if v_ip !~ '^[0-9A-Fa-f:.]{2,45}$' then return null; end if;

    -- Geheimnisse früherer Tage löschen: ab dann sind deren Werte niemandem mehr zuzuordnen.
    delete from zh_count_private.day_secret where day < v_day;
    insert into zh_count_private.day_secret (day, secret)
        values (v_day, extensions.gen_random_bytes(32))
        on conflict (day) do nothing;
    select secret into v_secret from zh_count_private.day_secret where day = v_day;

    return encode(extensions.hmac(convert_to(p_scope || '|' || v_ip || '|' || v_ua, 'UTF8'), v_secret, 'sha256'), 'hex');
end;
$$;
revoke all on function zh_count_private.day_key(text) from public, anon, authenticated;

------------------------------------------------------------------------------
-- Schritt 2: Besucherzählung
-- Neue Schreibfunktion ohne Parameter. Zählt je Besucher und Kalendertag einmal
-- (Europe/Berlin) in homepage_visitor_days und erhöht beim ersten Besuch des Tages
-- auch den alten Gesamtzähler über register_visitor().
-- Gelesen wird weiter über get_visitor_stats() und get_visitor_period_stats().
------------------------------------------------------------------------------
create or replace function public.register_visitor_today()
returns void language plpgsql volatile security definer set search_path = '' as $$
declare
    v_day date := (current_timestamp at time zone 'Europe/Berlin')::date;
    v_key text := zh_count_private.day_key('visitor');
    v_new integer;
begin
    if v_key is null then return; end if;
    -- visitor_key hat in der bestehenden Tabelle genau 32 Zeichen.
    insert into public.homepage_visitor_days (visitor_day, visitor_key)
        values (v_day, left(v_key, 32))
        on conflict (visitor_day, visitor_key) do nothing;
    get diagnostics v_new = row_count;
    if v_new = 1 then
        perform public.register_visitor();
    end if;
end;
$$;
revoke all on function public.register_visitor_today() from public;
grant execute on function public.register_visitor_today() to anon, authenticated;

------------------------------------------------------------------------------
-- Schritt 3: Forum-Aufrufzahlen
-- Angemeldet: wie bisher je Konto einmal in 24 Stunden.
-- Ohne Anmeldung: Tageswert statt Browserkennung. p_browser_id bleibt in der
-- Signatur, damit alte Seiten im Cache nicht scheitern, wird aber nicht mehr benutzt.
-- Fenster, die älter als 24 Stunden sind, haben keine Wirkung mehr und werden gelöscht.
------------------------------------------------------------------------------
create or replace function zh_forum_private.register_view(p_topic_id uuid, p_browser_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_keys text[] := array[]::text[]; v_now timestamptz := clock_timestamp();
    v_last timestamptz; v_count bigint; v_counted boolean; v_day_key text; begin
    perform 1 from zh_forum_private.topics where id = p_topic_id and (not hidden or zh_forum_private.is_admin()) for update;
    if not found then raise exception 'forum.notFound' using errcode = 'P0002'; end if;
    if v_user is not null and exists(select 1 from auth.users where id = v_user and not coalesce(is_anonymous, false) and deleted_at is null) then
        v_keys := array_append(v_keys, encode(sha256(convert_to('account:' || v_user::text, 'UTF8')), 'hex'));
    else
        v_day_key := zh_count_private.day_key('forum-view');
        if v_day_key is not null then v_keys := array_append(v_keys, v_day_key); end if;
    end if;
    if cardinality(v_keys) = 0 then raise exception 'forum.viewIdentityUnavailable'; end if;
    delete from zh_forum_private.view_windows where topic_id = p_topic_id and last_counted_at <= v_now - interval '24 hours';
    select max(last_counted_at) into v_last from zh_forum_private.view_windows where topic_id = p_topic_id and actor_hash = any(v_keys);
    v_counted := v_last is null or v_last <= v_now - interval '24 hours';
    if v_counted then v_last := v_now; end if;
    insert into zh_forum_private.view_totals(topic_id, views_count) values (p_topic_id, case when v_counted then 1 else 0 end)
        on conflict (topic_id) do update set views_count = zh_forum_private.view_totals.views_count + case when v_counted then 1 else 0 end
        returning views_count into v_count;
    insert into zh_forum_private.view_windows(topic_id, actor_hash, last_counted_at)
        select p_topic_id, k, v_last from unnest(v_keys) k
        on conflict (topic_id, actor_hash) do update set last_counted_at = greatest(zh_forum_private.view_windows.last_counted_at, excluded.last_counted_at);
    return jsonb_build_object('topic_id', p_topic_id, 'views_count', v_count, 'counted', v_counted, 'window_seconds', 86400);
end $$;

notify pgrst, 'reload schema';
commit;

------------------------------------------------------------------------------
-- Schritt 4 (etwa eine Woche nach dem Umbau der Seiten, wenn keine alten Seiten
-- mehr im Cache sind): alte Schreibwege schließen. Lesefunktionen bleiben.
------------------------------------------------------------------------------
-- revoke execute on function public.register_visitor_period(text) from anon, authenticated;
-- revoke execute on function public.register_visitor() from anon, authenticated;
