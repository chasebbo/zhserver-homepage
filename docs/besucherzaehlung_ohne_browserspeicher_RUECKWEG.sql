-- RÜCKWEG zu docs/besucherzaehlung_ohne_browserspeicher.sql (Stand 08.11.2026).
-- Stellt zh_forum_private.register_view in der Live-Fassung vor dem Umbau wieder her
-- (wörtlich aus pg_get_functiondef vom 08.11.2026) und entfernt die neuen Teile.
-- Zählerstände bleiben unverändert: visitor_stats, homepage_visitor_days,
-- homepage_visitor_tracking und zh_forum_private.view_totals werden nicht angefasst.
-- register_visitor(), register_visitor_period(text), get_visitor_stats(),
-- get_visitor_period_stats() und register_zh_forum_view(uuid, uuid) werden vom Umbau
-- nicht geändert und brauchen keinen Rückweg.
-- Danach die Homepage auf den Commit vor dem Umbau zurücksetzen (visitor-counter.js,
-- forum-views.js, Datenschutz Abschnitt 5 und 6).

begin;

CREATE OR REPLACE FUNCTION zh_forum_private.register_view(p_topic_id uuid, p_browser_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_user uuid := auth.uid(); v_keys text[] := array[]::text[]; v_now timestamptz := clock_timestamp();
    v_last timestamptz; v_count bigint; v_counted boolean; begin
    -- Match the existing writer lock order: topic first. Never change its activity timestamps.
    perform 1 from zh_forum_private.topics where id=p_topic_id and (not hidden or zh_forum_private.is_admin()) for update;
    if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;
    if v_user is not null and exists(select 1 from auth.users where id=v_user and not coalesce(is_anonymous,false) and deleted_at is null) then
        v_keys:=array_append(v_keys,encode(sha256(convert_to('account:'||v_user::text,'UTF8')),'hex'));
    end if;
    if p_browser_id is not null then v_keys:=array_append(v_keys,encode(sha256(convert_to('browser:'||p_browser_id::text,'UTF8')),'hex')); end if;
    if cardinality(v_keys)=0 then raise exception 'forum.viewIdentityUnavailable'; end if;
    select max(last_counted_at) into v_last from zh_forum_private.view_windows where topic_id=p_topic_id and actor_hash=any(v_keys);
    v_counted:=v_last is null or v_last<=v_now-interval '24 hours';
    if v_counted then v_last:=v_now; end if;
    insert into zh_forum_private.view_totals(topic_id,views_count) values(p_topic_id,case when v_counted then 1 else 0 end)
        on conflict(topic_id) do update set views_count=zh_forum_private.view_totals.views_count+case when v_counted then 1 else 0 end
        returning views_count into v_count;
    insert into zh_forum_private.view_windows(topic_id,actor_hash,last_counted_at)
        select p_topic_id,k,v_last from unnest(v_keys) k
        on conflict(topic_id,actor_hash) do update set last_counted_at=greatest(zh_forum_private.view_windows.last_counted_at,excluded.last_counted_at);
    return jsonb_build_object('topic_id',p_topic_id,'views_count',v_count,'counted',v_counted,'window_seconds',86400);
end $function$;

drop function if exists public.register_visitor_today();
drop function if exists zh_count_private.day_key(text);
drop table if exists zh_count_private.day_secret;
drop schema if exists zh_count_private;

-- Falls Schritt 4 (alte Schreibwege schließen) schon gelaufen ist:
grant execute on function public.register_visitor_period(text) to anon, authenticated;
grant execute on function public.register_visitor() to anon, authenticated;

notify pgrst, 'reload schema';
commit;

-- Prüfung danach, nur lesend:
-- select * from public.get_visitor_period_stats();
-- select * from public.get_visitor_stats();
-- select count(*), sum(views_count) from zh_forum_private.view_totals;
