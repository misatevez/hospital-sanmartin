-- Actualizar índice único: solo bloquear emails con suscripción authorized
-- pending = preapproval creada pero no pagada, no debe bloquear reintentos

drop index if exists idx_unique_email_activo;

create unique index idx_unique_email_activo
  on subscriptions(email)
  where status = 'authorized';
