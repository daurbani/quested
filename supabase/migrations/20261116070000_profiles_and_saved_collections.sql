-- Profiles and saved curated collections. Apply before enabling the profile/save UI.
-- A profile is public only after its owner explicitly creates it.
create table if not exists public.user_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 handle text not null unique check (handle ~ '^[a-z0-9][a-z0-9_-]{2,29}$'),
 display_name text not null check (char_length(btrim(display_name)) between 1 and 60),
 bio text not null default '' check (char_length(bio) <= 280),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.user_saved_collections (
 user_id uuid not null references auth.users(id) on delete cascade,
 collection_slug text not null check (length(collection_slug) between 1 and 200),
 created_at timestamptz not null default now(),
 primary key(user_id,collection_slug)
);
-- Store ownership of future community collections now, but do not publish them
-- until share rules, editor and moderation UX ship together.
create table if not exists public.user_collections (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(btrim(title)) between 1 and 100),
 description text not null default '' check (char_length(description) <= 1000),
 category text not null default 'Other' check (char_length(category) <= 60),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists user_collections_owner_idx on public.user_collections(owner_id);
create table if not exists public.user_collection_items (
 collection_id uuid not null references public.user_collections(id) on delete cascade,
 discovery_slug text not null check (length(discovery_slug) between 1 and 200),
 sort_order int not null default 0 check (sort_order >= 0),
 primary key(collection_id,discovery_slug)
);

alter table public.user_profiles enable row level security;
alter table public.user_saved_collections enable row level security;
alter table public.user_collections enable row level security;
alter table public.user_collection_items enable row level security;

revoke all on public.user_profiles, public.user_saved_collections, public.user_collections, public.user_collection_items from public,anon,authenticated;
grant select on public.user_profiles to anon;
grant select,insert,update,delete on public.user_profiles to authenticated;
grant select,insert,delete on public.user_saved_collections to authenticated;
grant select,insert,update,delete on public.user_collections to authenticated;
grant select,insert,update,delete on public.user_collection_items to authenticated;

create policy "Public profiles can be viewed" on public.user_profiles for select to anon,authenticated using (true);
create policy "Create own profile" on public.user_profiles for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own profile" on public.user_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Delete own profile" on public.user_profiles for delete to authenticated using ((select auth.uid())=user_id);

create policy "Read own saved collections" on public.user_saved_collections for select to authenticated using ((select auth.uid())=user_id);
create policy "Save own collection" on public.user_saved_collections for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Remove own saved collection" on public.user_saved_collections for delete to authenticated using ((select auth.uid())=user_id);

create policy "Read own community collection drafts" on public.user_collections for select to authenticated using ((select auth.uid())=owner_id);
create policy "Create own community collection draft" on public.user_collections for insert to authenticated with check ((select auth.uid())=owner_id);
create policy "Edit own community collection draft" on public.user_collections for update to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "Delete own community collection draft" on public.user_collections for delete to authenticated using ((select auth.uid())=owner_id);

create policy "Read items in own community collections" on public.user_collection_items for select to authenticated
 using (exists(select 1 from public.user_collections c where c.id=collection_id and c.owner_id=(select auth.uid())));
create policy "Add items to own community collections" on public.user_collection_items for insert to authenticated
 with check (exists(select 1 from public.user_collections c where c.id=collection_id and c.owner_id=(select auth.uid())));
create policy "Edit items in own community collections" on public.user_collection_items for update to authenticated
 using (exists(select 1 from public.user_collections c where c.id=collection_id and c.owner_id=(select auth.uid())))
 with check (exists(select 1 from public.user_collections c where c.id=collection_id and c.owner_id=(select auth.uid())));
create policy "Remove items from own community collections" on public.user_collection_items for delete to authenticated
 using (exists(select 1 from public.user_collections c where c.id=collection_id and c.owner_id=(select auth.uid())));
