-- Run in the SQL Editor of the EXISTING Supabase project yawadxzeyyrozmlrokun.
-- Additive and rerunnable: no legacy counters/functions, rows or start times are reset.
-- Week/month are sums of daily visitor counts, NOT distinct visitors over the period.
begin;

do $$
begin
    if to_regprocedure('public.get_visitor_stats()') is null then
        raise exception 'The existing public.get_visitor_stats() function is required.';
    end if;
end;
$$;

create table if not exists public.homepage_visitor_tracking (
    singleton boolean primary key default true check (singleton),
    started_at timestamptz
);

-- The first day may already have visitors whose browser keys are unavailable.
-- Keep its genuine observed legacy count as a lower bound; never add overlapping counts.
alter table public.homepage_visitor_tracking
    add column if not exists initial_day date,
    add column if not exists initial_day_visitors bigint not null default 0
        check (initial_day_visitors >= 0);

insert into public.homepage_visitor_tracking (singleton)
values (true) on conflict (singleton) do nothing;

create table if not exists public.homepage_visitor_days (
    visitor_day date not null,
    visitor_key text not null check (length(visitor_key) = 32),
    primary key (visitor_day, visitor_key)
);

alter table public.homepage_visitor_tracking enable row level security;
alter table public.homepage_visitor_days enable row level security;
revoke all on public.homepage_visitor_tracking, public.homepage_visitor_days from public, anon, authenticated;

-- Capture only today's existing, actually observed count, never invented older days.
-- The installation time is recorded so fully observed zero-visitor days also persist.
do $$
declare
    local_day date := (current_timestamp at time zone 'Europe/Berlin')::date;
    legacy jsonb;
begin
    select to_jsonb(existing) into legacy from public.get_visitor_stats() existing limit 1;
    if legacy is null or not (legacy ?& array['total_visitors', 'today_visitors', 'today_date']) then
        raise exception 'Unexpected legacy visitor response; migration aborted without changes.';
    end if;

    update public.homepage_visitor_tracking t
    set started_at = coalesce(t.started_at, current_timestamp),
        initial_day = coalesce(t.initial_day,
            (coalesce(t.started_at, current_timestamp) at time zone 'Europe/Berlin')::date);

    if (legacy ->> 'today_date')::date = local_day then
        update public.homepage_visitor_tracking t
        set initial_day_visitors = greatest(t.initial_day_visitors, (legacy ->> 'today_visitors')::bigint)
        where t.singleton and t.initial_day = local_day;
    end if;
end;
$$;

create or replace function public.get_visitor_period_stats()
returns table (
    total_visitors bigint,
    today_visitors bigint,
    yesterday_visitors bigint,
    week_visitors bigint,
    month_visitors bigint,
    today_date date,
    tracking_started_at timestamptz,
    yesterday_complete boolean,
    week_complete boolean,
    month_complete boolean
)
language plpgsql
stable
security definer
-- A fixed public path also supports the inherited RPC's unqualified table references.
set search_path = pg_catalog, public, pg_temp
as $$
declare
    local_now timestamp := current_timestamp at time zone 'Europe/Berlin';
    day_start date := local_now::date;
    week_start date := date_trunc('week', local_now)::date;
    month_start date := date_trunc('month', local_now)::date;
    started timestamptz;
    first_day date;
    first_count bigint;
    legacy jsonb;
    counts record;
begin
    select t.started_at, t.initial_day, t.initial_day_visitors
    into started, first_day, first_count
    from public.homepage_visitor_tracking t where t.singleton;
    select to_jsonb(existing) into legacy from public.get_visitor_stats() existing limit 1;

    if first_day = day_start and (legacy ->> 'today_date')::date = day_start then
        first_count := greatest(first_count, (legacy ->> 'today_visitors')::bigint);
    end if;

    -- A browser contributes one row per calendar day. Sum those DAILY counts:
    -- a returning browser on Tuesday and Wednesday contributes once on each day.
    -- MAX on the first day prevents adding its unknown overlapping legacy identities.
    with daily as (
        select v.visitor_day, count(*)::bigint as visitors
        from public.homepage_visitor_days v
        where v.visitor_day between least(day_start - 1, week_start, month_start) and day_start
        group by v.visitor_day
    ), observed as (
        select d.visitor_day, d.visitors from daily d where d.visitor_day is distinct from first_day
        union all
        select first_day, greatest(coalesce(d.visitors, 0), coalesce(first_count, 0))
        from (select 1) seed left join daily d on d.visitor_day = first_day
        where first_day between least(day_start - 1, week_start, month_start) and day_start
    )
    select
        coalesce(sum(o.visitors) filter (where o.visitor_day = day_start), 0)::bigint as today,
        coalesce(sum(o.visitors) filter (where o.visitor_day = day_start - 1), 0)::bigint as yesterday,
        coalesce(sum(o.visitors) filter (where o.visitor_day >= week_start), 0)::bigint as week,
        coalesce(sum(o.visitors) filter (where o.visitor_day >= month_start), 0)::bigint as month
    into counts from observed o;

    return query select
        (legacy ->> 'total_visitors')::bigint,
        case when started is not null then counts.today else null::bigint end,
        case when (started at time zone 'Europe/Berlin')::date <= day_start - 1
            then counts.yesterday else null::bigint end,
        case when started is not null then counts.week else null::bigint end,
        case when started is not null then counts.month else null::bigint end,
        day_start,
        started,
        coalesce(started <= ((day_start - 1)::timestamp at time zone 'Europe/Berlin'), false),
        coalesce(started <= (week_start::timestamp at time zone 'Europe/Berlin'), false),
        coalesce(started <= (month_start::timestamp at time zone 'Europe/Berlin'), false);
end;
$$;

create or replace function public.register_visitor_period(p_device_id text)
returns table (
    total_visitors bigint,
    today_visitors bigint,
    yesterday_visitors bigint,
    week_visitors bigint,
    month_visitors bigint,
    today_date date,
    tracking_started_at timestamptz,
    yesterday_complete boolean,
    week_complete boolean,
    month_complete boolean
)
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
    local_day date := (current_timestamp at time zone 'Europe/Berlin')::date;
    legacy jsonb;
begin
    if p_device_id is null or length(p_device_id) not between 8 and 128
       or p_device_id !~ '^[A-Za-z0-9_-]+$' then
        raise exception 'Invalid browser identifier' using errcode = '22023';
    end if;

    -- Preserve the first partial day's genuine legacy value before that counter rolls over.
    select to_jsonb(existing) into legacy from public.get_visitor_stats() existing limit 1;
    if (legacy ->> 'today_date')::date = local_day then
        update public.homepage_visitor_tracking t
        set initial_day_visitors = greatest(t.initial_day_visitors, (legacy ->> 'today_visitors')::bigint)
        where t.singleton and t.initial_day = local_day;
    end if;

    -- The key is derived only from an anonymous random browser ID, never an IP/name.
    insert into public.homepage_visitor_days (visitor_day, visitor_key)
    values (local_day, md5(p_device_id))
    on conflict (visitor_day, visitor_key) do nothing;

    return query select * from public.get_visitor_period_stats();
end;
$$;

revoke all on function public.get_visitor_period_stats() from public;
revoke all on function public.register_visitor_period(text) from public;
grant execute on function public.get_visitor_period_stats() to anon, authenticated;
grant execute on function public.register_visitor_period(text) to anon, authenticated;

-- Delivered after COMMIT: expose the RPCs through PostgREST's schema cache.
notify pgrst, 'reload schema';
commit;

-- Read-only confirmation: exact start, counts and coverage of the installed solution.
select * from public.get_visitor_period_stats();
