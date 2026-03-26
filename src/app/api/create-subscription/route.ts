import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { PreApproval } from 'mercadopago'
import { getSupabase } from '@/lib/supabase'

const client = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 },
})

const preApproval = new PreApproval(client)

// Fuente de verdad de los planes — nunca viene del cliente
const PLANES: Record<string, number> = {
  'Socio Amigo': 3000,
  'Socio Protector': 7000,
  'Socio Esperanza': 15000,
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellido, email, telefono, planNombre } = await req.json()

    if (!nombre || !apellido || !email || !telefono || !planNombre) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // 1. Validar que el plan existe y resolver el monto en el servidor
    const montoARS = PLANES[planNombre as string]
    if (!montoARS) {
      return NextResponse.json(
        { error: 'Plan no válido' },
        { status: 400 }
      )
    }

    // 2. Verificar duplicados — un email no puede tener dos suscripciones activas
    const { data: existing } = await getSupabase()
      .from('subscriptions')
      .select('id')
      .eq('email', email)
      .in('status', ['pending', 'authorized'])
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una suscripción activa para este email' },
        { status: 409 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''

    // 3. Crear preapproval en Mercado Pago con el monto del servidor
    const subscription = await preApproval.create({
      body: {
        reason: `${planNombre} — Hospital San Martín`,
        payer_email: email,
        back_url: `${baseUrl}/suscripcion/gracias`,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: montoARS,
          currency_id: 'ARS',
        },
      },
    })

    // 4. Guardar suscriptor en Supabase
    const { error: dbError } = await getSupabase().from('subscriptions').insert({
      nombre,
      apellido,
      email,
      telefono,
      plan: planNombre,
      monto: montoARS,
      preapproval_id: subscription.id!,
      status: 'pending',
    })

    if (dbError) {
      console.error('[create-subscription] Supabase error:', dbError)
      // 23505 = violación de índice único parcial (email activo duplicado)
      if (dbError.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una suscripción activa para este email' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json({
      init_point: subscription.init_point,
      preapproval_id: subscription.id,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[create-subscription]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
