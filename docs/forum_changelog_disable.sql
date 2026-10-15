-- Data-preserving deactivation; separate production approval required.
begin;
do $$begin if md5(pg_get_functiondef('public.get_zh_forum(text,uuid,integer,integer)'::regprocedure))<>'5ef51addc3f5d00c78137347f1281d9a' then raise exception 'Forum wrapper drift';end if;end $$;
create or replace function public.get_zh_forum(p_category text default null,p_topic_id uuid default null,p_offset integer default 0,p_post_offset integer default 0) returns jsonb language sql stable set search_path='' as $$select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset)||jsonb_build_object('role_version',1,'moderation_version',2,'views_version',1,'reactions_version',1);$$;
revoke all on function public.publish_zh_changelog(uuid,text,text,date,text,uuid,timestamptz,text,text),zh_forum_private.publish_changelog(uuid,text,text,date,text,uuid,timestamptz,text,text) from public,anon,authenticated;
commit;
