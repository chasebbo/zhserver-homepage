-- FUNCTIONAL ROLLBACK ONLY. Separate approval before any productive execution.
-- Set both community-features.js flags to false and reload first.
-- Retains all polls, votes, view counters and windows. No DROP/DELETE/TRUNCATE.
-- Keeps the guarded legacy vote RPC and its restricted option policy deliberately.
begin;
do $guard$ begin
    if md5(pg_get_functiondef('zh_forum_private.topic_json(zh_forum_private.topics)'::regprocedure)) <> 'ef0d417c08b111dc752f2412f43a357b'
       or md5(pg_get_functiondef('public.get_zh_forum(text,uuid,integer,integer)'::regprocedure)) <> '3c08fea3ffd26e3e919c2049ffd9936a' then
        raise exception 'Affected backend changed; re-audit before rollback';
    end if;
end $guard$;

CREATE OR REPLACE FUNCTION zh_forum_private.topic_json(t zh_forum_private.topics)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
    select jsonb_build_object('id',t.id,'category',t.category,'title',t.title,
        'author',zh_forum_private.public_profile(t.author_id),'created_at',t.created_at,'updated_at',t.updated_at,
        'last_activity_at',t.last_activity_at,'pinned',t.pinned,'closed',t.closed,'hidden',t.hidden,
        'can_moderate',coalesce(zh_forum_private.is_admin(),false),
        'replies',(select count(*) from zh_forum_private.posts p where p.topic_id=t.id and not p.opener and not p.hidden));
$function$;

CREATE OR REPLACE FUNCTION public.get_zh_forum(p_category text DEFAULT NULL::text, p_topic_id uuid DEFAULT NULL::uuid, p_offset integer DEFAULT 0, p_post_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
    select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset)
        || jsonb_build_object('role_version',1,'moderation_version',2);
$function$;

revoke all on function public.get_zh_community_pulse(boolean),
    public.cast_zh_community_pulse_vote(uuid,text),
    public.manage_zh_community_pulse(uuid,jsonb,jsonb,boolean,text,integer,timestamptz),
    public.register_zh_forum_view(uuid,uuid) from public,anon,authenticated,service_role;
revoke all on function zh_pulse_private.read_polls(boolean),
    zh_pulse_private.cast_vote(uuid,text),
    zh_pulse_private.manage_poll(uuid,jsonb,jsonb,boolean,text,integer,timestamptz),
    zh_forum_private.register_view(uuid,uuid) from public,anon,authenticated,service_role;
-- option_visible + legacy_vote stay executable: the retained SELECT policy and
-- vote_for_feature wrapper still require them. No private table grants added.
notify pgrst,'reload schema';
commit;
