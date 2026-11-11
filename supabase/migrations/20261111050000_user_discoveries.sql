-- User-owned discovery accomplishments; canonical catalog is maintained as JSON.
create table public.user_discoveries (
 user_id uuid not null references auth.users(id) on delete cascade,
 discovery_slug text not null check (length(discovery_slug) between 1 and 200),
 completion_type text not null check (completion_type in ('new','historical')),
 visited_on date,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 primary key(user_id,discovery_slug),
 constraint new_visit_requires_date check (completion_type = 'historical' or visited_on is not null),
 constraint no_future_visits check (visited_on is null or visited_on <= current_date)
);
alter table public.user_discoveries enable row level security;
revoke all on public.user_discoveries from anon;
grant select,insert,update,delete on public.user_discoveries to authenticated;
create policy "Read own visits" on public.user_discoveries for select to authenticated using ((select auth.uid())=user_id);
create policy "Create own visits" on public.user_discoveries for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Edit own visits" on public.user_discoveries for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Delete own visits" on public.user_discoveries for delete to authenticated using ((select auth.uid())=user_id);
create function public.touch_user_discovery() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now(); return new; end; $$;
revoke execute on function public.touch_user_discovery() from public,anon,authenticated;
create trigger user_discoveries_updated before update on public.user_discoveries for each row execute function public.touch_user_discovery();
