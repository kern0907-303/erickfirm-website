-- NAS monthly-letter subscribers.
-- Live schema applied to ErickFirm_DB on 2026-10-25 and verified read-only.
-- This table stores signup consent and delivery state; browser clients receive no table grants.

create table if not exists public.nas_monthly_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  solar_birth date not null,
  lunar_birth text,
  birth_time time,
  focus text not null,
  source text not null default '',
  source_path text not null default '',
  consent_at timestamptz not null,
  unsub_token uuid not null unique default gen_random_uuid(),
  status text not null default 'active',
  unsubscribed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default now(),
  last_sent_at timestamptz,
  last_sent_cycle_start date,
  constraint nas_monthly_subscribers_email_normalized
    check (email = lower(btrim(email)) and email !~ '[[:space:]]' and length(email) <= 320),
  constraint nas_monthly_subscribers_name_nonempty
    check (length(btrim(name)) between 1 and 100),
  constraint nas_monthly_subscribers_solar_birth_range
    check (solar_birth between date '1900-01-31' and date '2100-12-31'),
  constraint nas_monthly_subscribers_lunar_birth_format
    check (lunar_birth is null or lunar_birth ~ '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|30)$'),
  constraint nas_monthly_subscribers_focus_allowed
    check (focus in (
      '工作或方向感，一直抓不準',
      '關係裡常常委屈，或覺得耗損',
      '想知道自己到底適合什麼',
      '卡在某個階段，想不出下一步'
    )),
  constraint nas_monthly_subscribers_status_check
    check (status in ('active', 'unsubscribed', 'bounced', 'complained'))
);

create index if not exists nas_monthly_subscribers_active_birth_idx
  on public.nas_monthly_subscribers (status, solar_birth)
  where status = 'active';

alter table public.nas_monthly_subscribers enable row level security;
alter table public.nas_monthly_subscribers force row level security;

revoke all on table public.nas_monthly_subscribers from public, anon, authenticated;
grant all on table public.nas_monthly_subscribers to service_role;
