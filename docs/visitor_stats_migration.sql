-- Additive migration for visitor periods. Run only when deployment is authorised.
-- The existing register_visitor/get_visitor_stats functions and their data remain unchanged.
-- No historical visitors or fabricated daily totals are inserted.
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
    legacy jsonb;
    counts record;
begin
    select t.started_at into started from public.homepage_visitor_tracking t where t.singleton;
    select to_jsonb(existing) into legacy from public.get_visitor_stats() existing limit 1;
    select
        count(distinct v.visitor_key) filter (where v.visitor_day = day_start) as today,
        count(distinct v.visitor_key) filter (where v.visitor_day = day_start - 1) as yesterday,
        count(distinct v.visitor_key) filter (where v.visitor_day >= week_start) as week,
        count(distinct v.visitor_key) filter (where v.visitor_day >= month_start) as month
    into counts
    from public.homepage_visitor_days v
    where v.visitor_day between least(day_start - 1, week_start, month_start) and day_start;

    return query select
        (legacy ->> 'total_visitors')::bigint,
        case
            when started <= (day_start::timestamp at time zone 'Europe/Berlin') then counts.today
            when (legacy ->> 'today_date')::date = day_start then (legacy ->> 'today_visitors')::bigint
            else null::bigint
        end,
        case when started <= ((day_start - 1)::timestamp at time zone 'Europe/Berlin') then counts.yesterday else null::bigint end,
        case when started <= (week_start::timestamp at time zone 'Europe/Berlin') then counts.week else null::bigint end,
        case when started <= (month_start::timestamp at time zone 'Europe/Berlin') then counts.month else null::bigint end,
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
begin
    if p_device_id is null or length(p_device_id) not between 8 and 128
       or p_device_id !~ '^[A-Za-z0-9_-]+$' then
        raise exception 'Invalid browser identifier' using errcode = '22023';
    end if;

    -- Start only on the first real registration, rather than the SQL installation date.
    update public.homepage_visitor_tracking
    set started_at = current_timestamp
    where singleton and started_at is null;

    -- The key is derived only from an anonymous random browser ID, never an IP/name.
    insert into public.homepage_visitor_days (visitor_day, visitor_key)
    values ((current_timestamp at time zone 'Europe/Berlin')::date, md5(p_device_id))
    on conflict (visitor_day, visitor_key) do nothing;

    return query select * from public.get_visitor_period_stats();
end;
$$;

revoke all on function public.get_visitor_period_stats() from public;
revoke all on function public.register_visitor_period(text) from public;
grant execute on function public.get_visitor_period_stats() to anon, authenticated;
grant execute on function public.register_visitor_period(text) to anon, authenticated;

notify pgrst, 'reload schema';
commit;
