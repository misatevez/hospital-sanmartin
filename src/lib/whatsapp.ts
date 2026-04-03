const BAILEYS_URL = process.env.BAILEYS_SERVICE_URL

export async function sendWhatsAppReceipt({
  telefono,
  nombre,
  monto,
  paymentId,
}: {
  telefono: string
  nombre: string
  monto: number
  paymentId: string
}) {
  if (!BAILEYS_URL) return

  const phone = telefono.replace(/\D/g, '')
  if (!phone) return

  const message =
    `¡Muchas gracias por tu donación, ${nombre}! 🏥❤️\n\n` +
    `*Donación al Hospital San Martín*\n` +
    `Monto: $${monto.toLocaleString('es-AR')}\n` +
    `N° de pago: ${paymentId}\n\n` +
    `Tu aporte ayuda a los pacientes de nuestra institución. ¡Gracias!`

  try {
    await fetch(`${BAILEYS_URL}/api/v1/sendSessionMessage/${phone}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageText: message }),
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    // No bloquear el flujo de pago si falla el envío
  }
}
