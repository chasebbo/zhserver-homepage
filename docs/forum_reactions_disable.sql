-- DATA-PRESERVING DEACTIVATION ONLY; requires separate production approval.
begin;
do $$begin if md5(pg_get_functiondef('public.get_zh_forum(text,uuid,integer,integer)'::regprocedure))<>'33e887d36860b4aa375d865b41f4b66c' then raise exception 'Read RPC changed; audit before deactivation'; end if; end $$;
CREATE OR REPLACE FUNCTION public.get_zh_forum(p_category text DEFAULT NULL::text, p_topic_id uuid DEFAULT NULL::uuid, p_offset integer DEFAULT 0, p_post_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
    select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset)
        ||jsonb_build_object('role_version',1,'moderation_version',2,'views_version',1);
$function$
;
revoke all on function public.get_zh_forum_reactions(uuid[]),public.set_zh_forum_reaction(uuid,integer),zh_forum_private.read_reactions(uuid[]),zh_forum_private.set_reaction(uuid,integer) from public,anon,authenticated;
commit;
