-- Tabla de donaciones únicas (pago único, no suscripción)
CREATE TABLE IF NOT EXISTS donations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       TEXT NOT NULL,
  apellido     TEXT NOT NULL,
  email        TEXT NOT NULL,
  telefono     TEXT NOT NULL,
  monto        INTEGER NOT NULL DEFAULT 2000,
  mp_payment_id TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin puede ver donaciones"
  ON donations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role puede insertar donaciones"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role puede actualizar donaciones"
  ON donations FOR UPDATE
  USING (true);
