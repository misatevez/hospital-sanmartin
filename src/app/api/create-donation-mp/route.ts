import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Preference } from 'mercadopago'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

const MONTO = 100

const client = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 },
})

const preference = new Preference(client)

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellido, email, telefono } = await req.json()

    if (!nombre || !apellido || !email || !telefono) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'donacion-unica',
            title: 'Donación — Hospital San Martín',
            quantity: 1,
            unit_price: MONTO,
            currency_id: 'ARS',
          },
        ],
        payer: { name: nombre, surname: apellido, email },
        back_urls: {
          success: `${baseUrl}/donacion/gracias`,
          failure: `${baseUrl}/donacion/error`,
          pending: `${baseUrl}/donacion/gracias`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhook/mp`,
        metadata: { tipo: 'donacion', telefono, nombre },
      },
    })

    if (isSupabaseConfigured()) {
      const { error: dbError } = await getSupabase().from('donations').insert({
        nombre,
        apellido,
        email,
        telefono,
        monto: MONTO,
        status: 'pending',
      })
      if (dbError) console.error('[create-donation-mp] Supabase error:', dbError)
    }

    return NextResponse.json({ init_point: result.init_point })
  } catch (err: unknown) {
    let message = 'Error desconocido'
    if (err instanceof Error) message = err.message
    else if (err && typeof err === 'object') message = JSON.stringify(err)
    console.error('[create-donation-mp]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
