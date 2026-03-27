-- Habilitar RLS en todas las tablas
alter table subscriptions enable row level security;
alter table payments enable row level security;
alter table receipts enable row level security;

-- Solo usuarios autenticados (admins) pueden leer
create policy "admins can read subscriptions"
  on subscriptions for select
  to authenticated
  using (true);

create policy "admins can read payments"
  on payments for select
  to authenticated
  using (true);

create policy "admins can read receipts"
  on receipts for select
  to authenticated
  using (true);

-- El service role (usado por la API y el webhook) puede hacer todo sin restricciones
-- (el service role bypasea RLS automáticamente, no necesita políticas)
