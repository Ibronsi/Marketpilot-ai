-- Completes the profiles baseline migration without rewriting its history.
-- Safe to reapply: policies/triggers are replaced and existing profiles are kept.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default pg_catalog.now()
);

alter table public.profiles
  alter column created_at set default pg_catalog.now(),
  alter column created_at set not null;

alter table public.profiles enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create or replace function public.marketpilot_handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$function$;

alter function public.marketpilot_handle_new_user_profile() owner to postgres;

revoke all on function public.marketpilot_handle_new_user_profile()
  from public, anon, authenticated, service_role;

drop trigger if exists marketpilot_profile_after_auth_user_insert
  on auth.users;

create trigger marketpilot_profile_after_auth_user_insert
  after insert on auth.users
  for each row
  execute function public.marketpilot_handle_new_user_profile();

-- Backfill Auth users who existed before the trigger was installed.
-- Existing profile rows and their timestamps are left untouched.
insert into public.profiles (id)
select auth_user.id
from auth.users as auth_user
on conflict (id) do nothing;
