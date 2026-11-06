-- MarketPilot AI workspace data.
-- Apply only after confirming the target Supabase project and reviewing this file.
-- All records are private to the authenticated user through row-level security.
-- No seed/demo records are inserted by this migration.

begin;

create table if not exists public.marketpilot_leads (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  name text not null
    check (pg_catalog.length(pg_catalog.btrim(name)) > 0),
  company text,
  email text,
  phone text,
  source text not null default 'manual',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'customer', 'archived')),
  notes text not null default '',
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table if not exists public.marketpilot_marketing_drafts (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  title text not null
    check (pg_catalog.length(pg_catalog.btrim(title)) > 0),
  channel text not null default 'other',
  objective text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'planned')),
  planned_for timestamptz,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table if not exists public.marketpilot_campaigns (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  name text not null
    check (pg_catalog.length(pg_catalog.btrim(name)) > 0),
  channel text not null default 'other',
  objective text not null default '',
  audience text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'planned', 'paused', 'archived')),
  starts_at timestamptz,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table if not exists public.marketpilot_follow_ups (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  lead_id uuid,
  subject text not null
    check (pg_catalog.length(pg_catalog.btrim(subject)) > 0),
  notes text not null default '',
  follow_up_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'done')),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  constraint marketpilot_follow_ups_lead_fkey
    foreign key (lead_id)
    references public.marketpilot_leads (id)
    on delete set null
);

create table if not exists public.marketpilot_workspace_settings (
  user_id uuid primary key default auth.uid()
    references auth.users (id) on delete cascade,
  business_name text not null default '',
  target_audience text not null default '',
  primary_offer text not null default '',
  business_goal text not null default '',
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists marketpilot_leads_user_updated_idx
  on public.marketpilot_leads (user_id, updated_at desc);
create index if not exists marketpilot_leads_user_status_idx
  on public.marketpilot_leads (user_id, status);
create index if not exists marketpilot_drafts_user_updated_idx
  on public.marketpilot_marketing_drafts (user_id, updated_at desc);
create index if not exists marketpilot_campaigns_user_updated_idx
  on public.marketpilot_campaigns (user_id, updated_at desc);
create index if not exists marketpilot_follow_ups_user_updated_idx
  on public.marketpilot_follow_ups (user_id, updated_at desc);
create index if not exists marketpilot_follow_ups_user_lead_idx
  on public.marketpilot_follow_ups (user_id, lead_id);

alter table public.marketpilot_leads enable row level security;
alter table public.marketpilot_marketing_drafts enable row level security;
alter table public.marketpilot_campaigns enable row level security;
alter table public.marketpilot_follow_ups enable row level security;
alter table public.marketpilot_workspace_settings enable row level security;

create or replace function public.marketpilot_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$function$;

alter function public.marketpilot_touch_updated_at() owner to postgres;
revoke all on function public.marketpilot_touch_updated_at()
  from public, anon, authenticated, service_role;

drop trigger if exists marketpilot_leads_touch_updated_at
  on public.marketpilot_leads;
create trigger marketpilot_leads_touch_updated_at
  before update on public.marketpilot_leads
  for each row execute function public.marketpilot_touch_updated_at();

drop trigger if exists marketpilot_drafts_touch_updated_at
  on public.marketpilot_marketing_drafts;
create trigger marketpilot_drafts_touch_updated_at
  before update on public.marketpilot_marketing_drafts
  for each row execute function public.marketpilot_touch_updated_at();

drop trigger if exists marketpilot_campaigns_touch_updated_at
  on public.marketpilot_campaigns;
create trigger marketpilot_campaigns_touch_updated_at
  before update on public.marketpilot_campaigns
  for each row execute function public.marketpilot_touch_updated_at();

drop trigger if exists marketpilot_follow_ups_touch_updated_at
  on public.marketpilot_follow_ups;
create trigger marketpilot_follow_ups_touch_updated_at
  before update on public.marketpilot_follow_ups
  for each row execute function public.marketpilot_touch_updated_at();

drop trigger if exists marketpilot_settings_touch_updated_at
  on public.marketpilot_workspace_settings;
create trigger marketpilot_settings_touch_updated_at
  before update on public.marketpilot_workspace_settings
  for each row execute function public.marketpilot_touch_updated_at();

revoke all on table
  public.marketpilot_leads,
  public.marketpilot_marketing_drafts,
  public.marketpilot_campaigns,
  public.marketpilot_follow_ups,
  public.marketpilot_workspace_settings
from public, anon, authenticated;

grant select, delete on table
  public.marketpilot_leads,
  public.marketpilot_marketing_drafts,
  public.marketpilot_campaigns,
  public.marketpilot_follow_ups
to authenticated;

grant insert (name, company, email, phone, source, status, notes)
  on table public.marketpilot_leads to authenticated;
grant update (name, company, email, phone, source, status, notes)
  on table public.marketpilot_leads to authenticated;

grant insert (title, channel, objective, content, status, planned_for)
  on table public.marketpilot_marketing_drafts to authenticated;
grant update (title, channel, objective, content, status, planned_for)
  on table public.marketpilot_marketing_drafts to authenticated;

grant insert (name, channel, objective, audience, status, starts_at)
  on table public.marketpilot_campaigns to authenticated;
grant update (name, channel, objective, audience, status, starts_at)
  on table public.marketpilot_campaigns to authenticated;

grant insert (lead_id, subject, notes, follow_up_at, status)
  on table public.marketpilot_follow_ups to authenticated;
grant update (lead_id, subject, notes, follow_up_at, status)
  on table public.marketpilot_follow_ups to authenticated;

grant select on table
  public.marketpilot_workspace_settings
to authenticated;
grant insert (business_name, target_audience, primary_offer, business_goal)
  on table public.marketpilot_workspace_settings to authenticated;
grant update (business_name, target_audience, primary_offer, business_goal)
  on table public.marketpilot_workspace_settings to authenticated;

drop policy if exists "marketpilot_leads_select_own"
  on public.marketpilot_leads;
drop policy if exists "marketpilot_leads_insert_own"
  on public.marketpilot_leads;
drop policy if exists "marketpilot_leads_update_own"
  on public.marketpilot_leads;
drop policy if exists "marketpilot_leads_delete_own"
  on public.marketpilot_leads;
create policy "marketpilot_leads_select_own"
  on public.marketpilot_leads for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "marketpilot_leads_insert_own"
  on public.marketpilot_leads for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "marketpilot_leads_update_own"
  on public.marketpilot_leads for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "marketpilot_leads_delete_own"
  on public.marketpilot_leads for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "marketpilot_drafts_select_own"
  on public.marketpilot_marketing_drafts;
drop policy if exists "marketpilot_drafts_insert_own"
  on public.marketpilot_marketing_drafts;
drop policy if exists "marketpilot_drafts_update_own"
  on public.marketpilot_marketing_drafts;
drop policy if exists "marketpilot_drafts_delete_own"
  on public.marketpilot_marketing_drafts;
create policy "marketpilot_drafts_select_own"
  on public.marketpilot_marketing_drafts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "marketpilot_drafts_insert_own"
  on public.marketpilot_marketing_drafts for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "marketpilot_drafts_update_own"
  on public.marketpilot_marketing_drafts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "marketpilot_drafts_delete_own"
  on public.marketpilot_marketing_drafts for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "marketpilot_campaigns_select_own"
  on public.marketpilot_campaigns;
drop policy if exists "marketpilot_campaigns_insert_own"
  on public.marketpilot_campaigns;
drop policy if exists "marketpilot_campaigns_update_own"
  on public.marketpilot_campaigns;
drop policy if exists "marketpilot_campaigns_delete_own"
  on public.marketpilot_campaigns;
create policy "marketpilot_campaigns_select_own"
  on public.marketpilot_campaigns for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "marketpilot_campaigns_insert_own"
  on public.marketpilot_campaigns for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "marketpilot_campaigns_update_own"
  on public.marketpilot_campaigns for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "marketpilot_campaigns_delete_own"
  on public.marketpilot_campaigns for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "marketpilot_follow_ups_select_own"
  on public.marketpilot_follow_ups;
drop policy if exists "marketpilot_follow_ups_insert_own"
  on public.marketpilot_follow_ups;
drop policy if exists "marketpilot_follow_ups_update_own"
  on public.marketpilot_follow_ups;
drop policy if exists "marketpilot_follow_ups_delete_own"
  on public.marketpilot_follow_ups;
create policy "marketpilot_follow_ups_select_own"
  on public.marketpilot_follow_ups for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "marketpilot_follow_ups_insert_own"
  on public.marketpilot_follow_ups for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and (
      lead_id is null
      or exists (
        select 1
        from public.marketpilot_leads as lead
        where lead.id = lead_id
          and lead.user_id = (select auth.uid())
      )
    )
  );
create policy "marketpilot_follow_ups_update_own"
  on public.marketpilot_follow_ups for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (
      lead_id is null
      or exists (
        select 1
        from public.marketpilot_leads as lead
        where lead.id = lead_id
          and lead.user_id = (select auth.uid())
      )
    )
  );
create policy "marketpilot_follow_ups_delete_own"
  on public.marketpilot_follow_ups for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "marketpilot_settings_select_own"
  on public.marketpilot_workspace_settings;
drop policy if exists "marketpilot_settings_insert_own"
  on public.marketpilot_workspace_settings;
drop policy if exists "marketpilot_settings_update_own"
  on public.marketpilot_workspace_settings;
create policy "marketpilot_settings_select_own"
  on public.marketpilot_workspace_settings for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "marketpilot_settings_insert_own"
  on public.marketpilot_workspace_settings for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "marketpilot_settings_update_own"
  on public.marketpilot_workspace_settings for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

commit;
