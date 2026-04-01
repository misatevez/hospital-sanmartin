import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { PreApproval, Payment } from 'mercadopago'
import { getSupabase } from '@/lib/supabase'
import type { SubscriptionStatus, DonationStatus } from '@/types/database'

const client = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

const preApproval = new PreApproval(client)
const payment = new Payment(client)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    // Cambios en suscripciones (authorized, paused, cancelled)
    if (type === 'subscription_preapproval' && data?.id) {
      const subscription = await preApproval.get({ id: data.id })

      const status = subscription.status as SubscriptionStatus

      await getSupabase()
        .from('subscriptions')
        .update({ status })
        .eq('preapproval_id', data.id)

      console.log('[webhook/mp] suscripción actualizada:', {
        preapproval_id: data.id,
        status,
      })
    }

    // Cobros mensuales procesados
    if (type === 'subscription_authorized_payment' && data?.id) {
      // Buscar la suscripción asociada por preapproval_id
      const { data: sub } = await getSupabase()
        .from('subscriptions')
        .select('id, monto')
        .eq('preapproval_id', data.preapproval_id)
        .single()

      if (sub) {
        await getSupabase().from('payments').insert({
          subscription_id: sub.id,
          mp_payment_id: String(data.id),
          amount: sub.monto,
          status: 'processed',
        })

        console.log('[webhook/mp] pago registrado:', {
          subscription_id: sub.id,
          mp_payment_id: data.id,
        })
      }
    }

    // Pagos únicos (donaciones)
    if (type === 'payment' && data?.id) {
      const p = await payment.get({ id: data.id })
      const meta = p.metadata as Record<string, string> | undefined

      if (meta?.tipo === 'donacion') {
        const statusMap: Record<string, DonationStatus> = {
          approved: 'approved',
          rejected: 'rejected',
          cancelled: 'rejected',
        }
        const donationStatus: DonationStatus = statusMap[p.status ?? ''] ?? 'pending'
        const email = p.payer?.email ?? ''

        await getSupabase()
          .from('donations')
          .update({ mp_payment_id: String(data.id), status: donationStatus })
          .eq('email', email)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)

        console.log('[webhook/mp] donación actualizada:', { mp_payment_id: data.id, status: donationStatus })
      }
    }

    // Siempre responder 200 para que MP no reintente
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err: unknown) {
    console.error('[webhook/mp]', err)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
