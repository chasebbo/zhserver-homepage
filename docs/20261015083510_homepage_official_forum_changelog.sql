-- Authorized by user 2026-10-15; migration dates explicitly assigned by user.
-- Generated filename by official Supabase CLI; source hashes guard the reviewed functions.
begin;
do $$begin
 if to_regclass('zh_forum_private.post_reactions') is null then raise exception 'Installed reactions required'; end if;
 if md5(pg_get_functiondef('public.get_zh_forum(text,uuid,integer,integer)'::regprocedure))<>'33e887d36860b4aa375d865b41f4b66c' then raise exception 'Forum read wrapper drift'; end if;
 if md5(pg_get_functiondef('zh_forum_private.read_forum(text,uuid,integer,integer)'::regprocedure))<>'67250a108ac0474325344eff1495c30e' then raise exception 'Forum reader drift'; end if;
 if md5(pg_get_functiondef('zh_forum_private.topic_json(zh_forum_private.topics)'::regprocedure))<>'ef0d417c08b111dc752f2412f43a357b' then raise exception 'Topic serializer drift'; end if;
 if exists(select 1 from zh_forum_private.topics where category='changelog') then raise exception 'Existing changelog content requires audit'; end if;
end $$;

-- Replaces only the validated category allow-list, never a table or data rows.
alter table zh_forum_private.topics drop constraint topics_category_check;
alter table zh_forum_private.topics add constraint topics_category_check check(category in
 ('announcements','general','bugs','ideas','guides','groups','trading','offtopic','changelog'));
alter table zh_forum_private.topics add column changelog_version text,
 add column changelog_source_key text, add column changelog_source_hash text;
alter table zh_forum_private.topics add constraint topics_changelog_metadata_check check(
 (category='changelog' and (changelog_version is not null or changelog_source_key is not null)
   and (changelog_version is null or changelog_version ~ '^[0-9]{1,4}([.][0-9]{1,4}){1,3}$')
   and ((changelog_source_key is null and changelog_source_hash is null) or
        (changelog_source_key is not null and changelog_source_hash is not null and char_length(changelog_source_key) between 1 and 200 and changelog_source_hash ~ '^[0-9a-f]{64}$')))
 or (category<>'changelog' and changelog_version is null and changelog_source_key is null and changelog_source_hash is null));
create unique index topics_changelog_version_unique on zh_forum_private.topics(changelog_version) where category='changelog';
create unique index topics_changelog_source_unique on zh_forum_private.topics(changelog_source_key) where changelog_source_key is not null;

create function zh_forum_private.changelog_publisher() returns boolean language sql stable security definer set search_path='' as $$
 select coalesce(auth.uid()='7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid
    and zh_identity_private.system_role(auth.uid())='admin',false);
$$;

create function zh_forum_private.guard_changelog() returns trigger language plpgsql security definer set search_path='' as $$
declare v_category text; v_publisher boolean := zh_forum_private.changelog_publisher();
begin
 if tg_table_name='topics' then
  if tg_op='DELETE' then
   if old.category='changelog' and not coalesce(zh_forum_private.is_admin(),false) then raise exception 'forum.forbidden' using errcode='42501'; end if;
   return old;
  end if;
  if tg_op='UPDATE' and (old.category='changelog' or new.category='changelog') then
   if old.category is distinct from new.category then raise exception 'forum.changelogMove' using errcode='42501'; end if;
   if (new.title,new.author_id,new.created_at,new.changelog_version,new.changelog_source_key,new.changelog_source_hash)
      is distinct from (old.title,old.author_id,old.created_at,old.changelog_version,old.changelog_source_key,old.changelog_source_hash)
      and not v_publisher then raise exception 'forum.changelogPublisher' using errcode='42501'; end if;
  end if;
  if new.category='changelog' then
   if tg_op='INSERT' and not v_publisher then raise exception 'forum.changelogPublisher' using errcode='42501'; end if;
   if new.author_id is distinct from '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid then raise exception 'forum.changelogPublisher' using errcode='42501'; end if;
   if tg_op='UPDATE' and new.last_activity_at is distinct from old.last_activity_at and new.last_activity_at is distinct from new.created_at then raise exception 'forum.invalid'; end if;
  end if;
 elsif tg_table_name='posts' then
  select category into v_category from zh_forum_private.topics where id=new.topic_id;
  if v_category='changelog' then
   if not new.opener then raise exception 'forum.changelogNoReplies' using errcode='42501'; end if;
   if not v_publisher then raise exception 'forum.changelogPublisher' using errcode='42501'; end if;
   if new.author_id is distinct from '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid then raise exception 'forum.changelogPublisher' using errcode='42501'; end if;
   if tg_op='INSERT' and exists(select 1 from zh_forum_private.posts where topic_id=new.topic_id and opener) then raise exception 'forum.invalid'; end if;
  end if;
  if tg_op='UPDATE' and new.topic_id is distinct from old.topic_id then
   select category into v_category from zh_forum_private.topics where id=old.topic_id;
   if v_category='changelog' then raise exception 'forum.changelogMove' using errcode='42501'; end if;
  end if;
 elsif tg_table_name='post_reactions' then
  select t.category into v_category from zh_forum_private.posts p join zh_forum_private.topics t on t.id=p.topic_id where p.id=new.post_id;
  if v_category='changelog' and new.reaction<>1 then raise exception 'forum.changelogLikeOnly' using errcode='42501'; end if;
 end if;
 return new;
end $$;
create trigger topics_official_changelog_guard before insert or update or delete on zh_forum_private.topics for each row execute function zh_forum_private.guard_changelog();
create trigger posts_official_changelog_guard before insert or update on zh_forum_private.posts for each row execute function zh_forum_private.guard_changelog();
create trigger reactions_official_changelog_guard before insert or update on zh_forum_private.post_reactions for each row execute function zh_forum_private.guard_changelog();

create function zh_forum_private.publish_changelog(p_request_id uuid,p_version text,p_title text,p_date date,p_body text,p_topic_id uuid,p_expected_at timestamptz,p_source_key text,p_source_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_topic zh_forum_private.topics; v_post zh_forum_private.posts; v_id uuid; v_stamp timestamptz; v_now timestamptz:=clock_timestamp();
begin
 if not zh_forum_private.changelog_publisher() then raise exception 'forum.changelogPublisher' using errcode='42501'; end if;
 if (p_version is not null and p_version !~ '^[0-9]{1,4}([.][0-9]{1,4}){1,3}$') or p_date is null or p_date<date '2013-01-01'
  or p_date>(v_now at time zone 'Europe/Berlin')::date or char_length(btrim(coalesce(p_title,''))) not between 3 and 120
  or char_length(btrim(coalesce(p_body,''))) not between 10 and 8000 then raise exception 'forum.invalid'; end if;
 if (p_source_key is null)<>(p_source_hash is null) or (p_source_key is not null and
   (char_length(p_source_key) not between 1 and 200 or p_source_hash !~ '^[0-9a-f]{64}$')) then raise exception 'forum.invalid'; end if;
 v_stamp:=p_date::timestamp at time zone 'Europe/Berlin';
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if p_topic_id is not null then
  select * into v_topic from zh_forum_private.topics where id=p_topic_id and category='changelog' for update;
  if not found then raise exception 'forum.notFound'; end if;
  select * into v_post from zh_forum_private.posts where topic_id=p_topic_id and opener for update;
  if not found or p_expected_at is distinct from v_post.updated_at then raise exception 'forum.editConflict'; end if;
  if p_source_key is not null or p_source_hash is not null then raise exception 'forum.editConflict'; end if;
  update zh_forum_private.topics set title=btrim(p_title),changelog_version=p_version,created_at=v_stamp,
      last_activity_at=v_stamp,updated_at=v_now where id=p_topic_id;
  update zh_forum_private.posts set body=btrim(p_body),created_at=v_stamp,updated_at=v_now where id=v_post.id;
  return jsonb_build_object('topic_id',p_topic_id,'post_id',v_post.id,'reused',false);
 end if;
 if p_request_id is null then raise exception 'forum.invalid'; end if;
 v_id:=case when p_source_key is null then p_request_id else md5('zhserver-changelog:'||p_source_key)::uuid end;
 select * into v_topic from zh_forum_private.topics where id=v_id or (p_source_key is not null and changelog_source_key=p_source_key) for update;
 if found then
  select * into v_post from zh_forum_private.posts where topic_id=v_topic.id and opener;
  if v_topic.category<>'changelog' or v_topic.author_id is distinct from auth.uid() or v_topic.title<>btrim(p_title)
    or v_topic.changelog_version is distinct from p_version or v_topic.created_at<>v_stamp or v_post.body<>btrim(p_body)
    or (v_topic.changelog_source_key,v_topic.changelog_source_hash) is distinct from (p_source_key,p_source_hash)
    then raise exception 'forum.editConflict'; end if;
  return jsonb_build_object('topic_id',v_topic.id,'post_id',v_post.id,'reused',true);
 end if;
 insert into zh_forum_private.topics(id,category,title,author_id,created_at,updated_at,last_activity_at,changelog_version,changelog_source_key,changelog_source_hash)
  values(v_id,'changelog',btrim(p_title),auth.uid(),v_stamp,v_stamp,v_stamp,p_version,p_source_key,p_source_hash);
 insert into zh_forum_private.posts(id,topic_id,author_id,body,opener,created_at,updated_at)
  values(gen_random_uuid(),v_id,auth.uid(),btrim(p_body),true,v_stamp,v_stamp);
 return jsonb_build_object('topic_id',v_id,'reused',false);
end $$;
create function public.publish_zh_changelog(p_request_id uuid,p_version text,p_title text,p_date date,p_body text,p_topic_id uuid default null,p_expected_at timestamptz default null,p_source_key text default null,p_source_hash text default null)
returns jsonb language sql set search_path='' as $$
 select zh_forum_private.publish_changelog(p_request_id,p_version,p_title,p_date,p_body,p_topic_id,p_expected_at,p_source_key,p_source_hash);
$$;
revoke all on function zh_forum_private.changelog_publisher(),zh_forum_private.guard_changelog(),zh_forum_private.publish_changelog(uuid,text,text,date,text,uuid,timestamptz,text,text),public.publish_zh_changelog(uuid,text,text,date,text,uuid,timestamptz,text,text) from public,anon,authenticated;
grant execute on function zh_forum_private.publish_changelog(uuid,text,text,date,text,uuid,timestamptz,text,text),public.publish_zh_changelog(uuid,text,text,date,text,uuid,timestamptz,text,text) to authenticated;

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
        'replies',(select count(*) from zh_forum_private.posts p where p.topic_id=t.id and not p.opener and not p.hidden),
        'views_count',coalesce((select v.views_count from zh_forum_private.view_totals v where v.topic_id=t.id),0))
    ||case when t.category='changelog' then jsonb_build_object('changelog',jsonb_build_object(
        'version',t.changelog_version,'date',(t.created_at at time zone 'Europe/Berlin')::date,
        'imported',t.changelog_source_key is not null,'likes',(select count(*) from zh_forum_private.post_reactions r
            join zh_forum_private.posts p on p.id=r.post_id where p.topic_id=t.id and p.opener and r.reaction=1))) else '{}'::jsonb end;
$function$;
CREATE OR REPLACE FUNCTION zh_forum_private.read_forum(p_category text, p_topic uuid, p_offset integer, p_post_offset integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_topic zh_forum_private.topics; v_admin boolean := coalesce(zh_forum_private.is_admin(),false); v_result jsonb;
begin
    if p_offset<0 or p_post_offset<0 or p_offset>100000 or p_post_offset>100000 then raise exception 'forum.invalid'; end if;
    if p_topic is not null then
        select * into v_topic from zh_forum_private.topics where id=p_topic and (not hidden or v_admin);
        if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;
        select coalesce(jsonb_agg(x.data order by x.created_at,x.id),'[]'::jsonb) into v_result from (
            select p.id,p.created_at,jsonb_build_object('id',p.id,'body',p.body,'opener',p.opener,'hidden',p.hidden,
                'created_at',p.created_at,'updated_at',p.updated_at,'author',zh_forum_private.public_profile(p.author_id),
                'can_edit',case when v_topic.category='changelog' then zh_forum_private.changelog_publisher() else coalesce(p.author_id=auth.uid() or v_admin,false) end,'can_moderate',v_admin) as data
            from zh_forum_private.posts p where p.topic_id=p_topic and (not p.hidden or v_admin)
            order by p.created_at,p.id limit 30 offset p_post_offset
        ) x;
        return jsonb_build_object('topic',zh_forum_private.topic_json(v_topic),'posts',v_result,'post_count',
            (select count(*) from zh_forum_private.posts where topic_id=p_topic and (not hidden or v_admin)),'can_publish_changelog',zh_forum_private.changelog_publisher());
    end if;
    select coalesce(jsonb_agg(x.data order by case when p_category='changelog' then false else x.pinned end desc,x.last_activity_at desc,case when p_category='changelog' then string_to_array(x.changelog_version,'.')::int[] end desc,x.id),'[]'::jsonb) into v_result from (
        select t.id,t.pinned,t.last_activity_at,t.changelog_version,zh_forum_private.topic_json(t) as data from zh_forum_private.topics t
        where ((p_category is null and t.category<>'changelog') or t.category=p_category) and (not t.hidden or v_admin)
        order by case when p_category='changelog' then false else t.pinned end desc,case when p_category='changelog' then t.created_at else t.last_activity_at end desc,case when p_category='changelog' then string_to_array(t.changelog_version,'.')::int[] end desc,t.id limit 20 offset p_offset
    ) x;
    return jsonb_build_object('topics',v_result,'total',(select count(*) from zh_forum_private.topics where
        ((p_category is null and category<>'changelog') or category=p_category) and (not hidden or v_admin)),
        'can_announce',v_admin,'can_moderate',v_admin,'can_publish_changelog',zh_forum_private.changelog_publisher(),'categories',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (
            select category,count(*) as topics,max(last_activity_at) as last_activity_at,
                case when category='changelog' then (select zh_forum_private.topic_json(c) from zh_forum_private.topics c
                    where c.category='changelog' and not c.hidden order by c.created_at desc,c.id limit 1) end as latest_topic
            from zh_forum_private.topics
            where not hidden group by category
        ) x));
end $function$;
create or replace function public.get_zh_forum(p_category text default null,p_topic_id uuid default null,p_offset integer default 0,p_post_offset integer default 0)
returns jsonb language sql stable set search_path='' as $$
 select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset)
  ||jsonb_build_object('role_version',1,'moderation_version',2,'views_version',1,'reactions_version',1,'changelog_version',1);
$$;
commit;
