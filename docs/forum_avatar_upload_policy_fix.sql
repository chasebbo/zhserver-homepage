-- Repair only the newly approved avatar INSERT policy.
-- Storage reserves an object before its final MIME/size metadata exists.
-- MIME and 256 KiB size remain enforced by storage.buckets and save_zh_forum_profile;
-- account ownership, authenticated-only access and the UUID path remain unchanged.
alter policy "ZH avatar own upload" on storage.objects with check (
    bucket_id='zh-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
    and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(webp|png|jpg)$'
    and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)
);
