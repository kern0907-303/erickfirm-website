-- NAS monthly-letter delivery tracking and conservative shared Resend quota.
-- Apply after nas-monthly-subscribers.sql.
-- Usage is checked against Resend GET /usage (account-wide), not only NAS sends.
-- Free plan caps: 100/day and 3,000/month. Initial NAS ceilings reserve half
-- for the existing ABL workflows; Erick can adjust the single config row later.

alter table public.nas_monthly_subscribers
  add column if not exists last_delivery_status text not null default 'not_sent',
  add column if not exists last_delivery_attempt_count integer not null default 0,
  add column if not exists last_delivery_error text,
  add column if not exists last_delivery_email_id text,
  add column if not exists last_delivery_attempt_at timestamptz,
  add column if not exists last_delivery_event_at timestamptz;

alter table public.nas_monthly_subscribers
  drop constraint if exists nas_monthly_subscribers_last_delivery_status_check;

alter table public.nas_monthly_subscribers
  add constraint nas_monthly_subscribers_last_delivery_status_check
  check (last_delivery_status in (
    'not_sent', 'queued', 'sent', 'delivered', 'failed',
    'bounced', 'complained', 'quota_deferred'
  ));

alter table public.nas_monthly_subscribers
  drop constraint if exists nas_monthly_subscribers_last_delivery_attempt_count_check;

alter table public.nas_monthly_subscribers
  add constraint nas_monthly_subscribers_last_delivery_attempt_count_check
  check (last_delivery_attempt_count >= 0);

create table if not exists public.nas_monthly_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.nas_monthly_subscribers(id) on delete restrict,
  delivery_kind text not null,
  cycle_start date not null,
  scheduled_at timestamptz not null,
  status text not null default 'queued',
  attempt_count integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  accepted_at timestamptz,
  delivered_at timestamptz,
  resend_email_id text,
  idempotency_key text not null,
  last_error text,
  quota_daily_used integer,
  quota_daily_limit integer,
  quota_daily_resets_at timestamptz,
  quota_monthly_used integer,
  quota_monthly_limit integer,
  quota_monthly_resets_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint nas_monthly_email_deliveries_kind_check
    check (delivery_kind in ('initial', 'monthly')),
  constraint nas_monthly_email_deliveries_status_check
    check (status in (
      'queued', 'quota_deferred', 'sending', 'sent', 'delivered',
      'failed', 'bounced', 'complained'
    )),
  constraint nas_monthly_email_deliveries_attempt_count_check
    check (attempt_count >= 0),
  constraint nas_monthly_email_deliveries_idempotency_key_unique
    unique (idempotency_key),
  constraint nas_monthly_email_deliveries_resend_email_id_unique
    unique (resend_email_id),
  constraint nas_monthly_email_deliveries_subscriber_cycle_unique
    unique (subscriber_id, delivery_kind, cycle_start)
);

create index if not exists nas_monthly_email_deliveries_due_idx
  on public.nas_monthly_email_deliveries (next_attempt_at, scheduled_at)
  where status in ('queued', 'quota_deferred', 'failed');

create index if not exists nas_monthly_email_deliveries_resend_id_idx
  on public.nas_monthly_email_deliveries (resend_email_id)
  where resend_email_id is not null;

create table if not exists public.nas_monthly_resend_quota_policy (
  singleton boolean primary key default true check (singleton),
  daily_used_ceiling integer not null default 50,
  monthly_used_ceiling integer not null default 1500,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint nas_monthly_resend_daily_ceiling_check
    check (daily_used_ceiling between 1 and 100),
  constraint nas_monthly_resend_monthly_ceiling_check
    check (monthly_used_ceiling between 1 and 3000)
);

insert into public.nas_monthly_resend_quota_policy
  (singleton, daily_used_ceiling, monthly_used_ceiling)
values (true, 50, 1500)
on conflict (singleton) do nothing;

comment on table public.nas_monthly_email_deliveries is
  'One durable row per subscriber and monthly cycle. Stores queue state, Resend result, quota snapshot, retry schedule, and idempotency key.';

comment on column public.nas_monthly_resend_quota_policy.daily_used_ceiling is
  'Account-wide Resend emails.daily.used ceiling for NAS sends; initial value 50 leaves at least half of Free daily quota for ABL and other flows.';

comment on column public.nas_monthly_resend_quota_policy.monthly_used_ceiling is
  'Account-wide Resend emails.monthly.used ceiling for NAS sends; initial value 1500 leaves at least half of Free monthly quota for ABL and other flows.';

alter table public.nas_monthly_email_deliveries enable row level security;
alter table public.nas_monthly_email_deliveries force row level security;
alter table public.nas_monthly_resend_quota_policy enable row level security;
alter table public.nas_monthly_resend_quota_policy force row level security;

revoke all on table public.nas_monthly_email_deliveries from public, anon, authenticated;
revoke all on table public.nas_monthly_resend_quota_policy from public, anon, authenticated;
grant all on table public.nas_monthly_email_deliveries to service_role;
grant all on table public.nas_monthly_resend_quota_policy to service_role;
