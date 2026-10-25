-- NAS monthly-letter signup, quota-aware queue, delivery status and retry controls.
-- Apply after nas-monthly-delivery-queue.sql.

alter table public.nas_monthly_subscribers
  drop constraint if exists nas_monthly_subscribers_last_delivery_status_check;

alter table public.nas_monthly_subscribers
  add constraint nas_monthly_subscribers_last_delivery_status_check
  check (last_delivery_status in (
    'not_sent', 'queued', 'sending', 'sent', 'delivered', 'failed',
    'bounced', 'complained', 'quota_deferred'
  ));

alter table public.nas_monthly_email_deliveries
  alter column next_attempt_at drop not null;

alter table public.nas_monthly_email_deliveries
  drop constraint if exists nas_monthly_email_deliveries_status_check;

alter table public.nas_monthly_email_deliveries
  add constraint nas_monthly_email_deliveries_status_check
  check (status in (
    'queued', 'quota_deferred', 'sending', 'sent', 'delivered',
    'failed', 'bounced', 'complained', 'cancelled'
  ));

create or replace function public.nas_monthly_register_subscription(
  p_email text,
  p_name text,
  p_solar_birth date,
  p_lunar_birth text,
  p_birth_time time,
  p_focus text,
  p_source text,
  p_source_path text,
  p_consent boolean,
  p_cycle_start date,
  p_next_change date
)
returns table (subscriber_id uuid, unsubscribe_token uuid, subscriber_status text)
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_id uuid;
  v_unsub_token uuid;
  v_status text;
  v_now timestamptz := now();
  v_next_send_at timestamptz;
begin
  if p_consent is distinct from true then
    raise exception using errcode = '22023', message = 'consent_required';
  end if;
  if length(btrim(coalesce(p_name, ''))) not between 1 and 100 then
    raise exception using errcode = '22023', message = 'invalid_name';
  end if;
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception using errcode = '22023', message = 'invalid_email';
  end if;
  if p_cycle_start is null or p_next_change is null or p_next_change <= p_cycle_start then
    raise exception using errcode = '22023', message = 'invalid_flow_month_window';
  end if;

  v_next_send_at := (((p_next_change - 1)::timestamp + time '09:00') at time zone 'Asia/Taipei');

  insert into public.nas_monthly_subscribers as existing (
    email, name, solar_birth, lunar_birth, birth_time, focus,
    source, source_path, consent_at, status, unsubscribed_at, updated_at
  ) values (
    v_email, btrim(coalesce(p_name, '')), p_solar_birth,
    nullif(btrim(coalesce(p_lunar_birth, '')), ''), p_birth_time,
    p_focus, coalesce(p_source, ''), coalesce(p_source_path, ''),
    v_now, 'active', null, v_now
  )
  on conflict (email) do update set
    name = excluded.name,
    solar_birth = excluded.solar_birth,
    lunar_birth = excluded.lunar_birth,
    birth_time = excluded.birth_time,
    focus = excluded.focus,
    source = excluded.source,
    source_path = excluded.source_path,
    consent_at = excluded.consent_at,
    status = case
      when existing.status in ('bounced', 'complained') then existing.status
      else 'active'
    end,
    unsubscribed_at = case
      when existing.status in ('bounced', 'complained') then existing.unsubscribed_at
      else null
    end,
    updated_at = excluded.updated_at
  returning existing.id, existing.unsub_token, existing.status
    into v_id, v_unsub_token, v_status;

  if v_status in ('bounced', 'complained') then
    raise exception using errcode = '22023', message = 'address_suppressed';
  end if;

  insert into public.nas_monthly_email_deliveries (
    subscriber_id, delivery_kind, cycle_start, scheduled_at,
    status, next_attempt_at, idempotency_key
  ) values (
    v_id, 'initial', p_cycle_start, v_now,
    'queued', v_now, 'nas-initial/' || v_id::text || '/' || p_cycle_start::text
  )
  on conflict on constraint nas_monthly_email_deliveries_subscriber_cycle_unique do nothing;

  insert into public.nas_monthly_email_deliveries (
    subscriber_id, delivery_kind, cycle_start, scheduled_at,
    status, next_attempt_at, idempotency_key
  ) values (
    v_id, 'monthly', p_next_change, v_next_send_at,
    'queued', v_next_send_at, 'nas-monthly/' || v_id::text || '/' || p_next_change::text
  )
  on conflict on constraint nas_monthly_email_deliveries_subscriber_cycle_unique do nothing;

  update public.nas_monthly_subscribers
  set last_delivery_status = 'queued', updated_at = v_now
  where id = v_id and last_delivery_status = 'not_sent';

  return query select v_id, v_unsub_token, v_status;
end;
$$;

create or replace function public.nas_monthly_claim_delivery(
  p_daily_used integer,
  p_daily_limit integer,
  p_daily_resets_at timestamptz,
  p_monthly_used integer,
  p_monthly_limit integer,
  p_monthly_resets_at timestamptz
)
returns table (
  delivery_id uuid,
  subscriber_id uuid,
  email text,
  name text,
  solar_birth date,
  lunar_birth text,
  birth_time time,
  focus text,
  delivery_kind text,
  cycle_start date,
  idempotency_key text,
  unsubscribe_token uuid,
  attempt_count integer
)
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_policy record;
  v_job record;
  v_daily_ceiling integer;
  v_monthly_ceiling integer;
  v_retry_at timestamptz;
  v_now timestamptz := now();
begin
  if p_daily_used is null or p_monthly_used is null
    or p_daily_used < 0 or p_monthly_used < 0 then
    raise exception using errcode = '22023', message = 'resend_usage_unavailable';
  end if;

  perform pg_advisory_xact_lock(914202610251);

  with expired as (
    update public.nas_monthly_email_deliveries as d
    set status = 'failed',
        next_attempt_at = null,
        last_error = 'Retry limit reached after an expired sending lease.',
        updated_at = v_now
    where d.status = 'sending'
      and d.next_attempt_at <= v_now
      and d.attempt_count >= 5
    returning d.subscriber_id
  )
  update public.nas_monthly_subscribers s
  set last_delivery_status = 'failed',
      last_delivery_error = 'Retry limit reached after an expired sending lease.',
      last_delivery_event_at = v_now,
      updated_at = v_now
  from expired
  where s.id = expired.subscriber_id;

  select daily_used_ceiling, monthly_used_ceiling
  into v_policy
  from public.nas_monthly_resend_quota_policy
  where singleton = true;

  if not found then
    raise exception using errcode = '55000', message = 'resend_quota_policy_missing';
  end if;

  v_daily_ceiling := least(v_policy.daily_used_ceiling, coalesce(p_daily_limit, v_policy.daily_used_ceiling));
  v_monthly_ceiling := least(v_policy.monthly_used_ceiling, coalesce(p_monthly_limit, v_policy.monthly_used_ceiling));

  select d.id, d.subscriber_id, d.delivery_kind, d.cycle_start,
         d.idempotency_key, d.attempt_count, s.email, s.name,
         s.solar_birth, s.lunar_birth, s.birth_time, s.focus, s.unsub_token
  into v_job
  from public.nas_monthly_email_deliveries d
  join public.nas_monthly_subscribers s on s.id = d.subscriber_id
  where s.status = 'active'
    and d.status in ('queued', 'quota_deferred', 'failed', 'sending')
    and d.next_attempt_at is not null
    and d.next_attempt_at <= v_now
    and d.attempt_count < 5
  order by d.next_attempt_at, d.scheduled_at, d.created_at
  limit 1
  for update of d skip locked;

  if not found then
    return;
  end if;

  if p_daily_used >= v_daily_ceiling or p_monthly_used >= v_monthly_ceiling then
    v_retry_at := v_now + interval '15 minutes';
    if p_daily_used >= v_daily_ceiling and p_daily_resets_at > v_now then
      v_retry_at := p_daily_resets_at;
    end if;
    if p_monthly_used >= v_monthly_ceiling and p_monthly_resets_at > v_now then
      v_retry_at := greatest(v_retry_at, p_monthly_resets_at);
    end if;

    update public.nas_monthly_email_deliveries
    set status = 'quota_deferred',
        next_attempt_at = v_retry_at,
        quota_daily_used = p_daily_used,
        quota_daily_limit = p_daily_limit,
        quota_daily_resets_at = p_daily_resets_at,
        quota_monthly_used = p_monthly_used,
        quota_monthly_limit = p_monthly_limit,
        quota_monthly_resets_at = p_monthly_resets_at,
        last_error = 'Account-wide Resend usage reached the NAS send ceiling.',
        updated_at = v_now
    where id = v_job.id;

    update public.nas_monthly_subscribers
    set last_delivery_status = 'quota_deferred',
        last_delivery_attempt_count = v_job.attempt_count,
        last_delivery_error = 'Account-wide Resend usage reached the NAS send ceiling.',
        last_delivery_event_at = v_now,
        updated_at = v_now
    where id = v_job.subscriber_id;
    return;
  end if;

  update public.nas_monthly_email_deliveries as d
  set status = 'sending',
      attempt_count = d.attempt_count + 1,
      last_attempt_at = v_now,
      next_attempt_at = v_now + interval '30 minutes',
      quota_daily_used = p_daily_used,
      quota_daily_limit = p_daily_limit,
      quota_daily_resets_at = p_daily_resets_at,
      quota_monthly_used = p_monthly_used,
      quota_monthly_limit = p_monthly_limit,
      quota_monthly_resets_at = p_monthly_resets_at,
      last_error = null,
      updated_at = v_now
  where id = v_job.id;

  update public.nas_monthly_subscribers
  set last_delivery_status = 'sending',
      last_delivery_attempt_count = v_job.attempt_count + 1,
      last_delivery_error = null,
      last_delivery_attempt_at = v_now,
      last_delivery_event_at = v_now,
      updated_at = v_now
  where id = v_job.subscriber_id;

  return query
  select v_job.id, v_job.subscriber_id, v_job.email, v_job.name,
         v_job.solar_birth, v_job.lunar_birth, v_job.birth_time,
         v_job.focus, v_job.delivery_kind, v_job.cycle_start,
         v_job.idempotency_key, v_job.unsub_token, v_job.attempt_count + 1;
end;
$$;

create or replace function public.nas_monthly_finish_delivery(
  p_delivery_id uuid,
  p_status text,
  p_resend_email_id text default null,
  p_error text default null,
  p_retry_at timestamptz default null,
  p_next_change date default null,
  p_next_send_date date default null
)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_delivery record;
  v_next_send_at timestamptz;
  v_retry_at timestamptz;
  v_now timestamptz := now();
begin
  if p_status is null or p_status not in ('sent', 'delivered', 'failed', 'quota_deferred', 'bounced', 'complained') then
    raise exception using errcode = '22023', message = 'invalid_delivery_status';
  end if;

  select d.id, d.subscriber_id, d.delivery_kind, d.cycle_start,
         d.attempt_count, d.accepted_at, d.resend_email_id, d.last_attempt_at
  into v_delivery
  from public.nas_monthly_email_deliveries d
  where d.id = p_delivery_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'delivery_not_found';
  end if;

  v_retry_at := p_retry_at;
  if p_status = 'failed' and v_delivery.attempt_count < 5 and v_retry_at is null then
    v_retry_at := v_now + least(24, power(4, greatest(v_delivery.attempt_count - 1, 0))::integer) * interval '1 hour';
  end if;
  if p_status = 'quota_deferred' and v_retry_at is null then
    raise exception using errcode = '22023', message = 'quota_retry_time_required';
  end if;
  if p_status = 'sent' and v_delivery.delivery_kind = 'monthly' then
    if p_next_change is null or p_next_send_date is null
      or p_next_change <= v_delivery.cycle_start
      or p_next_send_date <> p_next_change - 1 then
      raise exception using errcode = '22023', message = 'next_cycle_window_required';
    end if;
    v_next_send_at := ((p_next_send_date::timestamp + time '09:00') at time zone 'Asia/Taipei');
  end if;

  update public.nas_monthly_email_deliveries
  set status = p_status,
      resend_email_id = coalesce(p_resend_email_id, resend_email_id),
      accepted_at = case when p_status in ('sent', 'delivered') then coalesce(accepted_at, v_now) else accepted_at end,
      delivered_at = case when p_status = 'delivered' then coalesce(delivered_at, v_now) else delivered_at end,
      next_attempt_at = case
        when p_status in ('sent', 'delivered', 'bounced', 'complained') then null
        when p_status in ('failed', 'quota_deferred') then v_retry_at
        else next_attempt_at
      end,
      last_error = case when p_status in ('sent', 'delivered') then null else left(coalesce(p_error, p_status), 2000) end,
      updated_at = v_now
  where id = p_delivery_id;

  update public.nas_monthly_subscribers
  set last_delivery_status = p_status,
      last_delivery_attempt_count = v_delivery.attempt_count,
      last_delivery_error = case when p_status in ('sent', 'delivered') then null else left(coalesce(p_error, p_status), 2000) end,
      last_delivery_email_id = coalesce(p_resend_email_id, v_delivery.resend_email_id, last_delivery_email_id),
      last_delivery_attempt_at = v_delivery.last_attempt_at,
      last_delivery_event_at = v_now,
      last_sent_at = case when p_status in ('sent', 'delivered') then coalesce(v_delivery.accepted_at, v_now) else last_sent_at end,
      last_sent_cycle_start = case when p_status in ('sent', 'delivered') then v_delivery.cycle_start else last_sent_cycle_start end,
      status = case
        when p_status = 'bounced' then 'bounced'
        when p_status = 'complained' then 'complained'
        else status
      end,
      unsubscribed_at = case when p_status in ('bounced', 'complained') then v_now else unsubscribed_at end,
      updated_at = v_now
  where id = v_delivery.subscriber_id;

  if p_status in ('bounced', 'complained') then
    update public.nas_monthly_email_deliveries
    set status = 'cancelled',
        next_attempt_at = null,
        last_error = 'Subscriber suppressed after a provider delivery event.',
        updated_at = v_now
    where subscriber_id = v_delivery.subscriber_id
      and id <> p_delivery_id
      and status in ('queued', 'quota_deferred', 'failed');
  end if;

  if p_status = 'sent' and v_delivery.delivery_kind = 'monthly' then
    insert into public.nas_monthly_email_deliveries (
      subscriber_id, delivery_kind, cycle_start, scheduled_at,
      status, next_attempt_at, idempotency_key
    ) values (
      v_delivery.subscriber_id, 'monthly', p_next_change,
      v_next_send_at, 'queued', v_next_send_at,
      'nas-monthly/' || v_delivery.subscriber_id::text || '/' || p_next_change::text
    )
    on conflict (subscriber_id, delivery_kind, cycle_start) do nothing;
  end if;
end;
$$;

create or replace function public.nas_monthly_unsubscribe(p_unsubscribe_token uuid)
returns boolean
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_subscriber_id uuid;
begin
  update public.nas_monthly_subscribers
  set status = 'unsubscribed',
      unsubscribed_at = now(),
      updated_at = now()
  where unsub_token = p_unsubscribe_token
    and status = 'active'
  returning id into v_subscriber_id;

  if v_subscriber_id is null then
    return false;
  end if;

  update public.nas_monthly_email_deliveries
  set status = 'cancelled',
      next_attempt_at = null,
      updated_at = now()
  where subscriber_id = v_subscriber_id
    and status in ('queued', 'quota_deferred', 'failed');

  return true;
end;
$$;

create or replace function public.nas_monthly_retry_delivery(p_delivery_id uuid)
returns boolean
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_subscriber_id uuid;
begin
  update public.nas_monthly_email_deliveries d
  set status = 'queued',
      attempt_count = 0,
      next_attempt_at = now(),
      last_error = null,
      updated_at = now()
  from public.nas_monthly_subscribers s
  where d.id = p_delivery_id
    and d.subscriber_id = s.id
    and s.status = 'active'
    and d.status = 'failed'
  returning d.subscriber_id into v_subscriber_id;

  if v_subscriber_id is null then
    return false;
  end if;

  update public.nas_monthly_subscribers
  set last_delivery_status = 'queued',
      last_delivery_attempt_count = 0,
      last_delivery_error = null,
      updated_at = now()
  where id = v_subscriber_id;

  return true;
end;
$$;

revoke all on function public.nas_monthly_register_subscription(text, text, date, text, time, text, text, text, boolean, date, date) from public, anon, authenticated;
revoke all on function public.nas_monthly_claim_delivery(integer, integer, timestamptz, integer, integer, timestamptz) from public, anon, authenticated;
revoke all on function public.nas_monthly_finish_delivery(uuid, text, text, text, timestamptz, date, date) from public, anon, authenticated;
revoke all on function public.nas_monthly_unsubscribe(uuid) from public, anon, authenticated;
revoke all on function public.nas_monthly_retry_delivery(uuid) from public, anon, authenticated;
grant execute on function public.nas_monthly_register_subscription(text, text, date, text, time, text, text, text, boolean, date, date) to service_role;
grant execute on function public.nas_monthly_claim_delivery(integer, integer, timestamptz, integer, integer, timestamptz) to service_role;
grant execute on function public.nas_monthly_finish_delivery(uuid, text, text, text, timestamptz, date, date) to service_role;
grant execute on function public.nas_monthly_unsubscribe(uuid) to service_role;
grant execute on function public.nas_monthly_retry_delivery(uuid) to service_role;
