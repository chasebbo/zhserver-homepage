-- One read-only query. One result cell: copy its entire JSON value.
-- Only the existing statistics getters are executed.
-- The registration function's definition is inspected, never executed.
WITH calendar AS (
    SELECT current_timestamp AS inspected_at,
           (current_timestamp AT TIME ZONE 'Europe/Berlin')::date AS today,
           date_trunc('week', current_timestamp AT TIME ZONE 'Europe/Berlin')::date AS week_start,
           date_trunc('month', current_timestamp AT TIME ZONE 'Europe/Berlin')::date AS month_start
), tracking AS (
    SELECT t.started_at, t.initial_day, t.initial_day_visitors
    FROM public.homepage_visitor_tracking t WHERE t.singleton
), legacy AS MATERIALIZED (
    SELECT to_jsonb(s) AS value FROM public.get_visitor_stats() s LIMIT 1
), ledger AS (
    SELECT v.visitor_day, count(*)::bigint AS visitors
    FROM public.homepage_visitor_days v GROUP BY v.visitor_day
), dates AS (
    SELECT l.visitor_day FROM ledger l
    UNION
    SELECT t.initial_day FROM tracking t WHERE t.initial_day IS NOT NULL
    UNION
    SELECT day::date
    FROM calendar c CROSS JOIN tracking t
    CROSS JOIN LATERAL generate_series(
        (t.started_at AT TIME ZONE 'Europe/Berlin')::date::timestamp,
        c.today::timestamp, interval '1 day'
    ) day
), daily AS (
    SELECT d.visitor_day,
           extract(isodow FROM d.visitor_day)::integer AS weekday_monday_1_sunday_7,
           coalesce(l.visitors, 0) AS stored_ledger_visitors,
           CASE WHEN d.visitor_day = t.initial_day
                THEN t.initial_day_visitors END AS saved_legacy_minimum,
           CASE WHEN d.visitor_day = t.initial_day THEN greatest(
                    coalesce(l.visitors, 0), coalesce(t.initial_day_visitors, 0),
                    CASE WHEN t.initial_day = c.today
                         AND (old.value ->> 'today_date')::date = c.today
                         THEN (old.value ->> 'today_visitors')::bigint ELSE 0 END
                ) ELSE coalesce(l.visitors, 0) END AS observed_day_visitors,
           coalesce(t.started_at <= (d.visitor_day::timestamp AT TIME ZONE 'Europe/Berlin')
                    AND d.visitor_day <= c.today, false) AS full_day_covered,
           d.visitor_day BETWEEN c.week_start AND c.today AS included_in_current_week,
           d.visitor_day BETWEEN c.month_start AND c.today AS included_in_current_month
    FROM dates d CROSS JOIN calendar c
    LEFT JOIN tracking t ON true
    LEFT JOIN legacy old ON true
    LEFT JOIN ledger l ON l.visitor_day = d.visitor_day
), expected AS (
    SELECT
        coalesce(sum(d.observed_day_visitors) FILTER (WHERE d.visitor_day = c.today), 0)::bigint AS today,
        coalesce(sum(d.observed_day_visitors) FILTER (WHERE d.visitor_day = c.today - 1), 0)::bigint AS yesterday,
        coalesce(sum(d.observed_day_visitors) FILTER (WHERE d.included_in_current_week), 0)::bigint AS week,
        coalesce(sum(d.observed_day_visitors) FILTER (WHERE d.included_in_current_month), 0)::bigint AS month
    FROM daily d CROSS JOIN calendar c
), rpc AS MATERIALIZED (
    SELECT to_jsonb(s) AS value FROM public.get_visitor_period_stats() s LIMIT 1
)
SELECT jsonb_pretty(jsonb_build_object(
    'inspected_at', c.inspected_at,
    'timezone', 'Europe/Berlin',
    'berlin_today', c.today,
    'weekday_monday_1_sunday_7', extract(isodow FROM c.today)::integer,
    'week_start', c.week_start,
    'month_start', c.month_start,
    'tracking_started_at', (SELECT t.started_at FROM tracking t),
    'initial_day', (SELECT t.initial_day FROM tracking t),
    'initial_day_saved_minimum', (SELECT t.initial_day_visitors FROM tracking t),
    'stored_daily_visitors', (SELECT coalesce(jsonb_agg(to_jsonb(d) ORDER BY d.visitor_day), '[]'::jsonb) FROM daily d),
    'expected_today_visitors', (SELECT e.today FROM expected e),
    'expected_yesterday_visitors', (SELECT e.yesterday FROM expected e),
    'expected_week_visitors', (SELECT e.week FROM expected e),
    'expected_month_visitors', (SELECT e.month FROM expected e),
    'raw_period_rpc', (SELECT r.value FROM rpc r),
    'raw_legacy_rpc', (SELECT old.value FROM legacy old),
    'period_getter_definition', pg_get_functiondef(to_regprocedure('public.get_visitor_period_stats()')),
    'period_registration_definition', pg_get_functiondef(to_regprocedure('public.register_visitor_period(text)')),
    'ledger_primary_key', (
        SELECT pg_get_constraintdef(k.oid)
        FROM pg_constraint k
        WHERE k.conrelid = 'public.homepage_visitor_days'::regclass AND k.contype = 'p'
    )
)) AS visitor_diagnosis
FROM calendar c;
