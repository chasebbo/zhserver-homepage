-- RECOVERY PREPARATION ONLY. Do not execute without a separate explicit request.
-- Restore exactly the audited original functions/policies; retain all role records.
CREATE OR REPLACE FUNCTION public.get_zh_forum(p_category text DEFAULT NULL::text, p_topic_id uuid DEFAULT NULL::uuid, p_offset integer DEFAULT 0, p_post_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$ select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset); $function$;

CREATE OR REPLACE FUNCTION zh_identity_private.own_identity()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare result jsonb;
begin
    select pg_catalog.jsonb_build_object(
        'display_name', zh_identity_private.valid_display_name(p.display_name),
        'created_at', u.created_at
    ) into result
    from auth.users u left join public.profiles p on p.id = u.id
    where u.id = auth.uid() and not coalesce(u.is_anonymous, false) and u.deleted_at is null;
    if result is null then raise exception 'identity.signInRequired' using errcode = '42501'; end if;
    return result;
end $function$;

CREATE OR REPLACE FUNCTION zh_forum_private.public_profile(p_id uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
    select jsonb_build_object('user_id',u.id,'display_name',zh_identity_private.valid_display_name(p.display_name),
        'created_at',u.created_at,'bio',coalesce(e.bio,''),'avatar_path',e.avatar_path)
    from auth.users u join public.profiles p on p.id=u.id
    left join zh_forum_private.profile_extras e on e.user_id=u.id
    where u.id=p_id and not coalesce(u.is_anonymous,false) and u.deleted_at is null
        and zh_identity_private.valid_display_name(p.display_name) is not null;
$function$;

CREATE OR REPLACE FUNCTION zh_forum_private.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
    select auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid;
$function$;

alter policy "Admin can read gallery" on "public"."gallery" to authenticated
    using ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid));
alter policy "Admin can update gallery" on "public"."gallery" to authenticated
    using ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid))
    with check ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid));
alter policy "Admin can delete gallery" on "public"."gallery" to authenticated
    using ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid));
alter policy "Admin can read all guestbook entries" on "public"."guestbook" to authenticated
    using ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid));
alter policy "Admin can update guestbook" on "public"."guestbook" to authenticated
    using ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid))
    with check ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid));
alter policy "Admin can delete guestbook" on "public"."guestbook" to authenticated
    using ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid));
alter policy "Admin can update community feedback" on "public"."community_feedback" to authenticated
    using ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid))
    with check ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid));
alter policy "Admin can delete community feedback" on "public"."community_feedback" to authenticated
    using ((auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid));
alter policy "Admin can delete feedback screenshots" on "storage"."objects" to authenticated
    using (((bucket_id = 'community-feedback'::text) AND (auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid)));
revoke execute on function public.set_zh_account_role(uuid,text),public.is_zh_admin(),
    zh_identity_private.set_account_role(uuid,text),zh_identity_private.current_is_admin() from anon,authenticated;
-- No DROP/DELETE. The harmless default-member signup hook and private role records remain.
