-- ZHServer forum: additive extension of the existing UUID / display_name identity.
-- No existing Auth/profile/game rows, roles, policies or RPCs are rewritten.
-- Public RPC wrappers are SECURITY INVOKER; privileged code lives outside the Data API.
create schema zh_forum_private;
revoke all on schema zh_forum_private from public;
grant usage on schema zh_forum_private to anon, authenticated;

create table zh_forum_private.topics (
    id uuid primary key,
    category text not null check (category in ('announcements','general','bugs','ideas','guides','groups','trading','offtopic')),
    title text not null check (char_length(btrim(title)) between 3 and 120),
    author_id uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default clock_timestamp(),
    updated_at timestamptz not null default clock_timestamp(),
    last_activity_at timestamptz not null default clock_timestamp(),
    pinned boolean not null default false,
    closed boolean not null default false,
    hidden boolean not null default false
);
create table zh_forum_private.posts (
    id uuid primary key,
    topic_id uuid not null references zh_forum_private.topics(id) on delete cascade,
    author_id uuid references auth.users(id) on delete set null,
    body text not null check (char_length(btrim(body)) between 10 and 8000),
    opener boolean not null default false,
    created_at timestamptz not null default clock_timestamp(),
    updated_at timestamptz not null default clock_timestamp(),
    hidden boolean not null default false
);
create unique index zh_forum_one_opener on zh_forum_private.posts(topic_id) where opener;
create index zh_forum_topic_listing on zh_forum_private.topics(category, pinned desc, last_activity_at desc, id);
create index zh_forum_author_topics on zh_forum_private.topics(author_id, created_at desc);
create index zh_forum_post_listing on zh_forum_private.posts(topic_id, created_at, id);
create index zh_forum_author_posts on zh_forum_private.posts(author_id, created_at desc);
-- Presentation-only extension; no duplicate name, login, role or identity fields.
create table zh_forum_private.profile_extras (
    user_id uuid primary key references auth.users(id) on delete cascade,
    bio text not null default '' check (char_length(bio) <= 400),
    avatar_path text,
    updated_at timestamptz not null default clock_timestamp(),
    constraint zh_avatar_owner_path check (avatar_path is null or
        (split_part(avatar_path,'/',1) = user_id::text and avatar_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(webp|png|jpg)$'))
);
alter table zh_forum_private.topics enable row level security;
alter table zh_forum_private.posts enable row level security;
alter table zh_forum_private.profile_extras enable row level security;
revoke all on all tables in schema zh_forum_private from public, anon, authenticated;
-- Default-deny RLS and no table grants: only the narrowly checked RPCs can write/read.

create function zh_forum_private.is_admin() returns boolean language sql stable set search_path='' as $$
    select auth.uid() = '7ba1fad4-d113-4526-8873-3e3b97e9be7e'::uuid;
$$;
create function zh_forum_private.member_id() returns uuid language plpgsql stable security definer set search_path='' as $$
declare v_id uuid := auth.uid();
begin
    if v_id is null or not exists (select 1 from auth.users u where u.id=v_id and not coalesce(u.is_anonymous,false) and u.deleted_at is null) then
        raise exception 'identity.signInRequired' using errcode='42501';
    end if;
    if not exists (select 1 from public.profiles p where p.id=v_id and zh_identity_private.valid_display_name(p.display_name) is not null) then
        raise exception 'identity.nameRequired' using errcode='42501';
    end if;
    return v_id;
end $$;
create function zh_forum_private.public_profile(p_id uuid) returns jsonb language sql stable security definer set search_path='' as $$
    select jsonb_build_object('user_id',u.id,'display_name',zh_identity_private.valid_display_name(p.display_name),
        'created_at',u.created_at,'bio',coalesce(e.bio,''),'avatar_path',e.avatar_path)
    from auth.users u join public.profiles p on p.id=u.id
    left join zh_forum_private.profile_extras e on e.user_id=u.id
    where u.id=p_id and not coalesce(u.is_anonymous,false) and u.deleted_at is null
        and zh_identity_private.valid_display_name(p.display_name) is not null;
$$;
create function zh_forum_private.topic_json(t zh_forum_private.topics) returns jsonb language sql stable security definer set search_path='' as $$
    select jsonb_build_object('id',t.id,'category',t.category,'title',t.title,
        'author',zh_forum_private.public_profile(t.author_id),'created_at',t.created_at,'updated_at',t.updated_at,
        'last_activity_at',t.last_activity_at,'pinned',t.pinned,'closed',t.closed,'hidden',t.hidden,
        'can_moderate',coalesce(zh_forum_private.is_admin(),false),
        'replies',(select count(*) from zh_forum_private.posts p where p.topic_id=t.id and not p.opener and not p.hidden));
$$;
create function zh_forum_private.read_forum(p_category text,p_topic uuid,p_offset integer,p_post_offset integer)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_topic zh_forum_private.topics; v_admin boolean := coalesce(zh_forum_private.is_admin(),false); v_result jsonb;
begin
    if p_offset<0 or p_post_offset<0 or p_offset>100000 or p_post_offset>100000 then raise exception 'forum.invalid'; end if;
    if p_topic is not null then
        select * into v_topic from zh_forum_private.topics where id=p_topic and (not hidden or v_admin);
        if not found then raise exception 'forum.notFound' using errcode='P0002'; end if;
        select coalesce(jsonb_agg(x.data order by x.created_at,x.id),'[]'::jsonb) into v_result from (
            select p.id,p.created_at,jsonb_build_object('id',p.id,'body',p.body,'opener',p.opener,'hidden',p.hidden,
                'created_at',p.created_at,'updated_at',p.updated_at,'author',zh_forum_private.public_profile(p.author_id),
                'can_edit',coalesce(p.author_id=auth.uid() or v_admin,false),'can_moderate',v_admin) as data
            from zh_forum_private.posts p where p.topic_id=p_topic and (not p.hidden or v_admin)
            order by p.created_at,p.id limit 30 offset p_post_offset
        ) x;
        return jsonb_build_object('topic',zh_forum_private.topic_json(v_topic),'posts',v_result,'post_count',
            (select count(*) from zh_forum_private.posts where topic_id=p_topic and (not hidden or v_admin)));
    end if;
    select coalesce(jsonb_agg(x.data order by x.pinned desc,x.last_activity_at desc,x.id),'[]'::jsonb) into v_result from (
        select t.id,t.pinned,t.last_activity_at,zh_forum_private.topic_json(t) as data from zh_forum_private.topics t
        where (p_category is null or t.category=p_category) and (not t.hidden or v_admin)
        order by t.pinned desc,t.last_activity_at desc,t.id limit 20 offset p_offset
    ) x;
    return jsonb_build_object('topics',v_result,'total',(select count(*) from zh_forum_private.topics where
        (p_category is null or category=p_category) and (not hidden or v_admin)),
        'can_announce',v_admin,'can_moderate',v_admin,'categories',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (
            select category,count(*) as topics,max(last_activity_at) as last_activity_at from zh_forum_private.topics
            where not hidden group by category
        ) x));
end $$;
create function zh_forum_private.write_post(p_mode text,p_request_id uuid,p_topic_id uuid,p_category text,p_title text,p_body text,p_post_id uuid,p_expected_at timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
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
end $$;
create function zh_forum_private.moderate(p_topic_id uuid,p_action text,p_value boolean,p_post_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
    perform zh_forum_private.member_id();
    if not coalesce(zh_forum_private.is_admin(),false) then raise exception 'forum.forbidden' using errcode='42501'; end if;
    if p_value is null or not exists(select 1 from zh_forum_private.topics where id=p_topic_id) then raise exception 'forum.invalid'; end if;
    if p_action='closed' then update zh_forum_private.topics set closed=p_value where id=p_topic_id;
    elsif p_action='pinned' then update zh_forum_private.topics set pinned=p_value where id=p_topic_id;
    elsif p_action='hidden' then update zh_forum_private.topics set hidden=p_value where id=p_topic_id;
    elsif p_action='post_hidden' then
        update zh_forum_private.posts set hidden=p_value where id=p_post_id and topic_id=p_topic_id and not opener;
        if not found then raise exception 'forum.invalid'; end if;
    else raise exception 'forum.invalid'; end if;
    return jsonb_build_object('topic_id',p_topic_id);
end $$;
create function zh_forum_private.read_profile(p_user_id uuid) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_profile jsonb := zh_forum_private.public_profile(coalesce(p_user_id,auth.uid()));
begin
    if v_profile is null then raise exception 'forum.profileNotFound' using errcode='P0002'; end if;
    return jsonb_build_object('profile',v_profile,'topics',(select coalesce(jsonb_agg(x.data order by x.created_at desc),'[]'::jsonb) from (
        select t.created_at,zh_forum_private.topic_json(t) as data from zh_forum_private.topics t
        where t.author_id=(v_profile->>'user_id')::uuid and not t.hidden order by t.created_at desc limit 20) x),
        'posts',(select coalesce(jsonb_agg(x.data order by x.created_at desc),'[]'::jsonb) from (
        select p.created_at,jsonb_build_object('id',p.id,'topic_id',t.id,'title',t.title,'category',t.category,'created_at',p.created_at,'excerpt',left(p.body,180)) as data
        from zh_forum_private.posts p join zh_forum_private.topics t on t.id=p.topic_id
        where p.author_id=(v_profile->>'user_id')::uuid and not p.hidden and not t.hidden
        order by p.created_at desc limit 20) x));
end $$;
create function zh_forum_private.save_profile(p_bio text,p_avatar_path text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_user uuid := zh_forum_private.member_id();
begin
    if p_bio is null or char_length(p_bio)>400 then raise exception 'forum.invalid'; end if;
    if p_avatar_path is not null and (split_part(p_avatar_path,'/',1)<>v_user::text or
        not exists(select 1 from storage.objects o where o.bucket_id='zh-avatars' and o.name=p_avatar_path
            and lower(o.metadata->>'mimetype') in ('image/png','image/jpeg','image/webp')
            and (o.metadata->>'size')::bigint between 1 and 262144)) then raise exception 'forum.avatarInvalid'; end if;
    insert into zh_forum_private.profile_extras(user_id,bio,avatar_path) values(v_user,btrim(p_bio),p_avatar_path)
        on conflict(user_id) do update set bio=excluded.bio,avatar_path=excluded.avatar_path,updated_at=clock_timestamp();
    return zh_forum_private.public_profile(v_user);
end $$;

create function public.get_zh_forum(p_category text default null,p_topic_id uuid default null,p_offset integer default 0,p_post_offset integer default 0)
returns jsonb language sql stable set search_path='' as $$ select zh_forum_private.read_forum(p_category,p_topic_id,p_offset,p_post_offset); $$;
create function public.create_zh_forum_topic(p_request_id uuid,p_category text,p_title text,p_body text)
returns jsonb language sql set search_path='' as $$ select zh_forum_private.write_post('create',p_request_id,null,p_category,p_title,p_body,null,null); $$;
create function public.reply_zh_forum_topic(p_request_id uuid,p_topic_id uuid,p_body text)
returns jsonb language sql set search_path='' as $$ select zh_forum_private.write_post('reply',p_request_id,p_topic_id,null,null,p_body,null,null); $$;
create function public.edit_zh_forum_post(p_post_id uuid,p_body text,p_title text,p_expected_at timestamptz)
returns jsonb language sql set search_path='' as $$ select zh_forum_private.write_post('edit',null,null,null,p_title,p_body,p_post_id,p_expected_at); $$;
create function public.moderate_zh_forum_topic(p_topic_id uuid,p_action text,p_value boolean,p_post_id uuid default null)
returns jsonb language sql set search_path='' as $$ select zh_forum_private.moderate(p_topic_id,p_action,p_value,p_post_id); $$;
create function public.get_zh_forum_profile(p_user_id uuid default null)
returns jsonb language sql stable set search_path='' as $$ select zh_forum_private.read_profile(p_user_id); $$;
create function public.save_zh_forum_profile(p_bio text,p_avatar_path text default null)
returns jsonb language sql set search_path='' as $$ select zh_forum_private.save_profile(p_bio,p_avatar_path); $$;

revoke all on all functions in schema zh_forum_private from public, anon, authenticated;
grant execute on function zh_forum_private.read_forum(text,uuid,integer,integer),zh_forum_private.read_profile(uuid) to anon,authenticated;
grant execute on function zh_forum_private.write_post(text,uuid,uuid,text,text,text,uuid,timestamptz),zh_forum_private.moderate(uuid,text,boolean,uuid),zh_forum_private.save_profile(text,text) to authenticated;
revoke all on function public.get_zh_forum(text,uuid,integer,integer),public.get_zh_forum_profile(uuid),
    public.create_zh_forum_topic(uuid,text,text,text),public.reply_zh_forum_topic(uuid,uuid,text),
    public.edit_zh_forum_post(uuid,text,text,timestamptz),public.moderate_zh_forum_topic(uuid,text,boolean,uuid),public.save_zh_forum_profile(text,text) from public,anon,authenticated;
grant execute on function public.get_zh_forum(text,uuid,integer,integer),public.get_zh_forum_profile(uuid) to anon,authenticated;
grant execute on function public.create_zh_forum_topic(uuid,text,text,text),public.reply_zh_forum_topic(uuid,uuid,text),
    public.edit_zh_forum_post(uuid,text,text,timestamptz),public.moderate_zh_forum_topic(uuid,text,boolean,uuid),public.save_zh_forum_profile(text,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
    values('zh-avatars','zh-avatars',true,262144,array['image/png','image/jpeg','image/webp']);
create policy "ZH avatar own upload" on storage.objects for insert to authenticated with check (
    bucket_id='zh-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
    and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(webp|png|jpg)$'
    and lower(metadata->>'mimetype') in ('image/png','image/jpeg','image/webp')
    and (metadata->>'size')::bigint between 1 and 262144
    and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)
);
create policy "ZH avatar own read" on storage.objects for select to authenticated using (
    bucket_id='zh-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
);
create policy "ZH avatar own cleanup" on storage.objects for delete to authenticated using (
    bucket_id='zh-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
);
notify pgrst, 'reload schema';
