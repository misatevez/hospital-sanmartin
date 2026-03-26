-- ============================================================
-- Hospital San Martín — Schema inicial
-- ============================================================

-- Tabla de suscriptores / donantes
create table if not exists subscriptions (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  apellido        text not null,
  email           text not null,
  telefono        text not null,
  plan            text not null,
  monto           numeric(10, 2) not null,
  preapproval_id  text not null unique,
  status          text not null default 'pending'
                  check (status in ('pending', 'authorized', 'paused', 'cancelled')),
  created_at      timestamptz not null default now()
);

-- Tabla de pagos (historial de cobros mensuales)
create table if not exists payments (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references subscriptions(id) on delete cascade,
  mp_payment_id   text not null unique,
  amount          numeric(10, 2) not null,
  status          text not null
                  check (status in ('processed', 'in_process', 'rejected', 'cancelled')),
  created_at      timestamptz not null default now()
);

-- Tabla de comprobantes (enviados por WhatsApp)
create table if not exists receipts (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid references subscriptions(id) on delete set null,
  telefono        text not null,
  file_url        text not null,
  matched         boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Índices para búsquedas frecuentes
create index if not exists idx_subscriptions_email     on subscriptions(email);
create index if not exists idx_subscriptions_telefono  on subscriptions(telefono);
create index if not exists idx_subscriptions_status    on subscriptions(status);
create index if not exists idx_payments_subscription   on payments(subscription_id);
create index if not exists idx_receipts_telefono       on receipts(telefono);
create index if not exists idx_receipts_matched        on receipts(matched);

-- Índice único parcial: un solo email activo a la vez
-- Permite re-suscripciones después de cancelar (status 'cancelled' queda fuera)
create unique index if not exists idx_unique_email_activo
  on subscriptions(email)
  where status in ('pending', 'authorized');
