import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Payment } from 'mercadopago'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

const MONTO = 2000

const client = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 },
})

const payment = new Payment(client)

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellido, email, telefono, token, installments, payment_method_id } = await req.json()

    if (!nombre || !apellido || !email || !telefono || !token) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''

    const result = await payment.create({
      body: {
        payer: { email },
        token,
        transaction_amount: MONTO,
        installments: installments ?? 1,
        notification_url: `${baseUrl}/api/webhook/mp`,
      },
    })

    const status = result.status

    // Guardar en Supabase
    if (isSupabaseConfigured()) {
      const donationStatus =
        status === 'approved' ? 'approved' :
        status === 'rejected' ? 'rejected' : 'pending'

      const { error: dbError } = await getSupabase().from('donations').insert({
        nombre,
        apellido,
        email,
        telefono,
        monto: MONTO,
        mp_payment_id: String(result.id),
        status: donationStatus,
      })
      if (dbError) console.error('[create-donation] Supabase error:', dbError)
    }

    if (status === 'rejected') {
      return NextResponse.json(
        { error: 'El pago fue rechazado. Verificá los datos de tu tarjeta.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, id: result.id, status })
  } catch (err: unknown) {
    let message = 'Error desconocido'
    if (err instanceof Error) message = err.message
    else if (err && typeof err === 'object') message = JSON.stringify(err)
    console.error('[create-donation] full error:', JSON.stringify(err, null, 2))
    return NextResponse.json({ error: message, detail: err }, { status: 500 })
  }
}
