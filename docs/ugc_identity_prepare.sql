-- Builds on public_identity_prepare.sql. Existing guest behavior/moderation remain.
-- Author UUIDs are stored privately, so public guestbook/gallery API shapes stay
-- compatible and SELECT * never exposes a new account identifier.
create table zh_identity_private.content_authors (
    id uuid primary key default pg_catalog.gen_random_uuid(),
    guestbook_id bigint unique references public.guestbook(id) on delete cascade,
    gallery_id bigint unique references public.gallery(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    check (pg_catalog.num_nonnulls(guestbook_id, gallery_id) = 1)
);
create index zh_content_authors_user_id_idx on zh_identity_private.content_authors(user_id);
alter table zh_identity_private.content_authors enable row level security;
revoke all on zh_identity_private.content_authors from public, anon, authenticated;

create function zh_identity_private.bind_content_name()
returns trigger language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); canonical_name text;
begin
    if actor is not null then
        canonical_name := zh_identity_private.own_identity()->>'display_name';
        if canonical_name is null then raise exception 'identity.nameRequired' using errcode = '22023'; end if;
        if tg_table_name = 'guestbook' then new.name := canonical_name;
        elsif tg_table_name = 'gallery' then new.uploader := canonical_name;
        end if;
    end if;
    -- Existing admin approval uses UPDATE; inserts remain moderated.
    new.approved := false;
    return new;
end $$;
revoke all on function zh_identity_private.bind_content_name() from public, anon, authenticated;

create function zh_identity_private.record_content_author()
returns trigger language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid();
begin
    if actor is not null then
        if tg_table_name = 'guestbook' then
            insert into zh_identity_private.content_authors(guestbook_id, user_id) values(new.id, actor);
        elsif tg_table_name = 'gallery' then
            insert into zh_identity_private.content_authors(gallery_id, user_id) values(new.id, actor);
        end if;
    end if;
    return new;
end $$;
revoke all on function zh_identity_private.record_content_author() from public, anon, authenticated;

create trigger zh_guestbook_bind_name before insert on public.guestbook
    for each row execute function zh_identity_private.bind_content_name();
create trigger zh_guestbook_record_author after insert on public.guestbook
    for each row execute function zh_identity_private.record_content_author();
create trigger zh_gallery_bind_name before insert on public.gallery
    for each row execute function zh_identity_private.bind_content_name();
create trigger zh_gallery_record_author after insert on public.gallery
    for each row execute function zh_identity_private.record_content_author();
create policy "ZH members can submit moderated guestbook entries" on public.guestbook
    for insert to authenticated with check (approved = false);
-- No forum tables, new accounts, roles, visitor logic, storage policies or
-- retrospective assignment of existing guest entries are introduced.
