-- PREPARED ONLY. Restores RPC behavior, NOT permanently deleted data.
-- Re-audit function definitions before execution; never use DROP ... CASCADE.
begin;
CREATE OR REPLACE FUNCTION public.get_zh_forum(p_category text DEFAULT NULL::text, p_topic_id uuid DEFAULT NULL::uuid, p_offset integer DEFAULT 0, p_post_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
    select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset)
        || jsonb_build_object('role_version',1);
$function$;
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
        select * into v_post from zh_forum_private.posts where id=p_post_id for update;
        if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;
        if v_post.author_id is distinct from v_user and not v_admin then raise exception 'forum.forbidden' using errcode='42501'; end if;
        select * into v_topic from zh_forum_private.topics where id=v_post.topic_id for update;
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

drop function public.moderate_zh_forum_topic_v2(uuid,text,boolean,uuid,text);
drop function zh_forum_private.moderate_v2(uuid,text,boolean,uuid,text);
notify pgrst, 'reload schema';
commit;
