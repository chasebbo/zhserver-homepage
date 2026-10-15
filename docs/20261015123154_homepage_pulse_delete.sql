-- Prepared admin-only deletion. Applying this migration itself deletes no data.
begin;
create function zh_pulse_private.delete_poll(p_poll_id uuid,p_expected_at timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_user uuid := zh_pulse_private.member_id(); v_poll zh_pulse_private.polls;
begin
    if not zh_identity_private.current_is_admin() then
        raise exception 'pulse.forbidden' using errcode='42501';
    end if;
    select * into v_poll from zh_pulse_private.polls where id=p_poll_id for update;
    if not found then raise exception 'pulse.notFound'; end if;
    if p_expected_at is distinct from v_poll.updated_at then raise exception 'pulse.editConflict'; end if;
    -- Existing foreign keys cascade only this poll's options and individual votes.
    -- Lock order matches manage_poll/cast_vote: poll first, then its options/votes.
    delete from zh_pulse_private.polls where id=p_poll_id;
    return zh_pulse_private.read_polls(true)||jsonb_build_object('deleted_poll_id',p_poll_id,'delete_version',1);
end $$;
create function public.delete_zh_community_pulse(p_poll_id uuid,p_expected_at timestamptz)
returns jsonb language sql set search_path='' as $$
    select zh_pulse_private.delete_poll(p_poll_id,p_expected_at);
$$;
revoke all on function zh_pulse_private.delete_poll(uuid,timestamptz),public.delete_zh_community_pulse(uuid,timestamptz) from public,anon,authenticated;
grant execute on function zh_pulse_private.delete_poll(uuid,timestamptz),public.delete_zh_community_pulse(uuid,timestamptz) to authenticated;
create or replace function public.get_zh_community_pulse(p_admin boolean default false)
returns jsonb language sql stable set search_path='' as $$
    select zh_pulse_private.read_polls(coalesce(p_admin,false))||jsonb_build_object('delete_version',1);
$$;
commit;
