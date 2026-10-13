-- PREPARED ONLY. Requires separate approval before execution in production.
-- No existing data is deleted by applying this migration. DELETE statements
-- inside moderate_v2 run only on a later explicit authenticated admin action.
begin;
do $guard$ begin
    if md5(pg_get_functiondef('zh_forum_private.write_post(text,uuid,uuid,text,text,text,uuid,timestamp with time zone)'::regprocedure))<>'39caee2bd54ff90b3e5c6f022e32ab84' then
        raise exception 'Backend function changed; audit before migration: zh_forum_private.write_post';
    end if;
    if md5(pg_get_functiondef('public.get_zh_forum(text,uuid,integer,integer)'::regprocedure))<>'a7306f3349c2d4de6ff0fe05f6635bfb' then
        raise exception 'Backend function changed; audit before migration: public.get_zh_forum';
    end if;
    if md5(pg_get_functiondef('zh_forum_private.is_admin()'::regprocedure))<>'3910a07f5a74721ddfb278cb55574eca' then
        raise exception 'Backend function changed; audit before migration: zh_forum_private.is_admin';
    end if;
    if md5(pg_get_functiondef('zh_identity_private.current_is_admin()'::regprocedure))<>'d5fc0d745ae4bbe4bdae24c9069cf3ef' then
        raise exception 'Backend function changed; audit before migration: zh_identity_private.current_is_admin';
    end if;
    if md5(pg_get_functiondef('zh_identity_private.system_role(uuid)'::regprocedure))<>'be093779ec15968cc4a565964f2a331c' then
        raise exception 'Backend function changed; audit before migration: zh_identity_private.system_role';
    end if;
    if md5(pg_get_functiondef('zh_forum_private.member_id()'::regprocedure))<>'f533c78410dd57b07df2e9505b476612' then
        raise exception 'Backend function changed; audit before migration: zh_forum_private.member_id';
    end if;
    if md5(pg_get_functiondef('zh_forum_private.read_forum(text,uuid,integer,integer)'::regprocedure))<>'67250a108ac0474325344eff1495c30e' then
        raise exception 'Backend function changed; audit before migration: zh_forum_private.read_forum';
    end if;
    if md5(pg_get_functiondef('zh_forum_private.topic_json(zh_forum_private.topics)'::regprocedure))<>'49fee2479b683415d38b1a16f43a1768' then
        raise exception 'Backend function changed; audit before migration: zh_forum_private.topic_json';
    end if;
    if to_regprocedure('public.moderate_zh_forum_topic_v2(uuid,text,boolean,uuid,text)') is not null
        or to_regprocedure('zh_forum_private.moderate_v2(uuid,text,boolean,uuid,text)') is not null then
        raise exception 'Moderation v2 already exists; audit before migration';
    end if;
    if not exists(select 1 from pg_constraint where conrelid='zh_forum_private.posts'::regclass
        and conname='posts_topic_id_fkey' and contype='f' and confdeltype='c'
        and confrelid='zh_forum_private.topics'::regclass) then
        raise exception 'Topic/post cascade changed; audit before migration';
    end if;
end $guard$;

-- Preparation only: included by the guarded migration. DO NOT run separately.
-- The public wrapper is an invoker; only the private, UUID/role-checked function
-- can touch the existing private forum tables. No new table or policy is needed.
create function zh_forum_private.moderate_v2(
    p_topic_id uuid, p_action text, p_value boolean, p_post_id uuid, p_category text
) returns jsonb language plpgsql security definer set search_path='' as $function$
declare
    v_actor uuid := zh_forum_private.member_id();
    v_topic zh_forum_private.topics;
    v_posts integer;
    v_now timestamptz := clock_timestamp();
begin
    if not coalesce(zh_forum_private.is_admin(),false) then
        raise exception 'forum.forbidden' using errcode='42501';
    end if;
    if p_action is null or p_action not in ('pinned','closed','move','delete_topic','delete_reply') then
        raise exception 'forum.invalid';
    end if;
    -- All writers lock the topic before its posts. This also serializes deletion
    -- with new replies, reopening/closing and moving to an admin-only category.
    select * into v_topic from zh_forum_private.topics where id=p_topic_id for update;
    if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;

    if p_action in ('pinned','closed') then
        if p_value is null or p_post_id is not null or p_category is not null then raise exception 'forum.invalid'; end if;
        if p_action='pinned' then
            update zh_forum_private.topics set pinned=p_value,updated_at=v_now where id=p_topic_id;
        else
            update zh_forum_private.topics set closed=p_value,updated_at=v_now where id=p_topic_id;
        end if;
    elsif p_action='move' then
        if p_value is not null or p_post_id is not null or p_category is null or p_category not in
            ('announcements','general','bugs','ideas','guides','groups','trading','offtopic') then
            raise exception 'forum.invalid';
        end if;
        update zh_forum_private.topics set category=p_category,updated_at=v_now where id=p_topic_id;
    elsif p_action='delete_topic' then
        if p_value is distinct from true or p_post_id is not null or p_category is not null then raise exception 'forum.invalid'; end if;
        select count(*) into v_posts from zh_forum_private.posts where topic_id=p_topic_id;
        -- Existing posts_topic_id_fkey has ON DELETE CASCADE, verified by the guard.
        -- Includes opener, replies and previously hidden posts, only of this topic.
        delete from zh_forum_private.topics where id=p_topic_id;
        return jsonb_build_object('topic_id',p_topic_id,'category',v_topic.category,
            'action',p_action,'deleted_topics',1,'deleted_posts',v_posts);
    elsif p_action='delete_reply' then
        if p_value is distinct from true or p_post_id is null or p_category is not null then raise exception 'forum.invalid'; end if;
        -- An opening post cannot be removed as an individual reply. A mismatched
        -- topic/post UUID cannot delete content from another topic.
        delete from zh_forum_private.posts where id=p_post_id and topic_id=p_topic_id and not opener;
        if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;
        update zh_forum_private.topics set updated_at=v_now,
            last_activity_at=coalesce((select max(p.created_at) from zh_forum_private.posts p
                where p.topic_id=p_topic_id and not p.hidden),created_at)
            where id=p_topic_id;
        return jsonb_build_object('topic_id',p_topic_id,'category',v_topic.category,
            'action',p_action,'deleted_posts',1);
    end if;
    return jsonb_build_object('topic_id',p_topic_id,'category',coalesce(p_category,v_topic.category),'action',p_action);
end $function$;
revoke all on function zh_forum_private.moderate_v2(uuid,text,boolean,uuid,text) from public,anon;
grant execute on function zh_forum_private.moderate_v2(uuid,text,boolean,uuid,text) to authenticated;

create function public.moderate_zh_forum_topic_v2(
    p_topic_id uuid, p_action text, p_value boolean default null,
    p_post_id uuid default null, p_category text default null
) returns jsonb language sql security invoker set search_path='' as $function$
    select zh_forum_private.moderate_v2(p_topic_id,p_action,p_value,p_post_id,p_category);
$function$;
revoke all on function public.moderate_zh_forum_topic_v2(uuid,text,boolean,uuid,text) from public,anon;
grant execute on function public.moderate_zh_forum_topic_v2(uuid,text,boolean,uuid,text) to authenticated;

-- Preserve author/session checks; only establish one locking order.
CREATE OR REPLACE FUNCTION zh_forum_private.write_post(p_mode text, p_request_id uuid, p_topic_id uuid, p_category text, p_title text, p_body text, p_post_id uuid, p_expected_at timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_user uuid := zh_forum_private.member_id(); v_topic zh_forum_private.topics; v_post zh_forum_private.posts;
    v_admin boolean := coalesce(zh_forum_private.is_admin(),false); v_id uuid; v_now timestamptz := clock_timestamp();
begin
    perform pg_advisory_xact_lock(hashtextextended(v_user::text,0));
    if p_mode='create' then
        if p_request_id is null then raise exception 'forum.invalid'; end if;
        select * into v_topic from zh_forum_private.topics where id=p_request_id;
        if found then
            if v_topic.author_id is distinct from v_user then raise exception 'forum.forbidden' using errcode='42501'; end if;
            return jsonb_build_object('topic_id',v_topic.id,'reused',true);
        end if;
        if p_category='announcements' and not v_admin then raise exception 'forum.announcementsAdmin' using errcode='42501'; end if;
        if char_length(btrim(coalesce(p_title,''))) not between 3 and 120 or char_length(btrim(coalesce(p_body,''))) not between 10 and 8000 then raise exception 'forum.invalid'; end if;
        if exists (select 1 from zh_forum_private.topics where author_id=v_user and created_at>v_now-interval '20 seconds') then raise exception 'forum.rateLimit'; end if;
        insert into zh_forum_private.topics(id,category,title,author_id,created_at,updated_at,last_activity_at)
            values(p_request_id,p_category,btrim(p_title),v_user,v_now,v_now,v_now);
        insert into zh_forum_private.posts(id,topic_id,author_id,body,opener,created_at,updated_at)
            values(gen_random_uuid(),p_request_id,v_user,btrim(p_body),true,v_now,v_now);
        return jsonb_build_object('topic_id',p_request_id,'reused',false);
    elsif p_mode='reply' then
        if p_request_id is null then raise exception 'forum.invalid'; end if;
        select * into v_post from zh_forum_private.posts where id=p_request_id;
        if found then
            if v_post.author_id is distinct from v_user or v_post.topic_id is distinct from p_topic_id then raise exception 'forum.forbidden' using errcode='42501'; end if;
            return jsonb_build_object('topic_id',v_post.topic_id,'post_id',v_post.id,'reused',true);
        end if;
        select * into v_topic from zh_forum_private.topics where id=p_topic_id for update;
        if not found or v_topic.hidden then raise exception 'forum.notFound' using errcode='P0002'; end if;
        if v_topic.closed then raise exception 'forum.topicClosed' using errcode='42501'; end if;
        if v_topic.category='announcements' and not v_admin then raise exception 'forum.announcementsAdmin' using errcode='42501'; end if;
        if char_length(btrim(coalesce(p_body,''))) not between 10 and 8000 then raise exception 'forum.invalid'; end if;
        if exists (select 1 from zh_forum_private.posts where author_id=v_user and created_at>v_now-interval '3 seconds') then raise exception 'forum.rateLimit'; end if;
        insert into zh_forum_private.posts(id,topic_id,author_id,body,created_at,updated_at) values(p_request_id,p_topic_id,v_user,btrim(p_body),v_now,v_now);
        update zh_forum_private.topics set last_activity_at=v_now where id=p_topic_id;
        return jsonb_build_object('topic_id',p_topic_id,'post_id',p_request_id,'reused',false);
    elsif p_mode='edit' then
        -- Match reply/moderation locking: topic first, then the target post.
        select t.* into v_topic from zh_forum_private.topics t
            join zh_forum_private.posts p on p.topic_id=t.id where p.id=p_post_id for update of t;
        if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;
        select * into v_post from zh_forum_private.posts where id=p_post_id and topic_id=v_topic.id for update;
        if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;
        if v_post.author_id is distinct from v_user and not v_admin then raise exception 'forum.forbidden' using errcode='42501'; end if;
        if (v_topic.hidden or v_post.hidden or v_topic.closed) and not v_admin then raise exception 'forum.topicClosed' using errcode='42501'; end if;
        if p_expected_at is distinct from v_post.updated_at then raise exception 'forum.editConflict'; end if;
        if char_length(btrim(coalesce(p_body,''))) not between 10 and 8000 then raise exception 'forum.invalid'; end if;
        if v_post.opener then
            if char_length(btrim(coalesce(p_title,''))) not between 3 and 120 then raise exception 'forum.invalid'; end if;
            update zh_forum_private.topics set title=btrim(p_title),updated_at=v_now where id=v_post.topic_id;
        end if;
        update zh_forum_private.posts set body=btrim(p_body),updated_at=v_now where id=p_post_id;
        return jsonb_build_object('topic_id',v_post.topic_id,'post_id',p_post_id);
    end if;
    raise exception 'forum.invalid';
end $function$;

-- Advertise v2 only after all functions exist successfully.
CREATE OR REPLACE FUNCTION public.get_zh_forum(p_category text DEFAULT NULL::text, p_topic_id uuid DEFAULT NULL::uuid, p_offset integer DEFAULT 0, p_post_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
    select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset)
        || jsonb_build_object('role_version',1,'moderation_version',2);
$function$;

notify pgrst, 'reload schema';
commit;
