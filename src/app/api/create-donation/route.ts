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
    const { nombre, apellido, email, telefono, token, installments } = await req.json()

    if (!nombre || !apellido || !email || !telefono || !token) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const result = await payment.create({
      body: {
        transaction_amount: MONTO,
        token,
        installments: installments ?? 1,
        payer: { email },
        metadata: { tipo: 'donacion', nombre, apellido, telefono },
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
    console.error('[create-donation]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
