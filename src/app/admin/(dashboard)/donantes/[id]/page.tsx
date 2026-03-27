import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  authorized: { label: 'Activo',    className: 'bg-green-100 text-green-700' },
  pending:    { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
  paused:     { label: 'Pausado',   className: 'bg-orange-100 text-orange-700' },
  cancelled:  { label: 'Cancelado', className: 'bg-gray-100 text-gray-500' },
}

const PAYMENT_LABEL: Record<string, { label: string; className: string }> = {
  processed:  { label: 'Acreditado', className: 'bg-green-100 text-green-700' },
  in_process: { label: 'En proceso', className: 'bg-yellow-100 text-yellow-700' },
  rejected:   { label: 'Rechazado',  className: 'bg-red-100 text-red-600' },
  cancelled:  { label: 'Cancelado',  className: 'bg-gray-100 text-gray-500' },
}

export default async function DonanteDetallePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: donante }, { data: pagos }, { data: comprobantes }] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('payments')
      .select('*')
      .eq('subscription_id', params.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('receipts')
      .select('*')
      .eq('subscription_id', params.id)
      .order('created_at', { ascending: false }),
  ])

  if (!donante) notFound()

  const badge = STATUS_LABEL[donante.status] ?? { label: donante.status, className: 'bg-gray-100 text-gray-500' }

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#9ca3af] mb-6">
        <Link href="/admin/donantes" className="hover:text-[#2563a8]">Donantes</Link>
        <span>/</span>
        <span className="text-[#1a3a5c] font-medium">{donante.nombre} {donante.apellido}</span>
      </div>

      {/* Info del donante */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1a3a5c]">
              {donante.nombre} {donante.apellido}
            </h1>
            <p className="text-[#6b7280] text-sm">{donante.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-[#9ca3af] mb-1">Teléfono</p>
            <p className="text-sm font-medium text-[#1f2937]">{donante.telefono}</p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] mb-1">Plan</p>
            <p className="text-sm font-medium text-[#1f2937]">{donante.plan}</p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] mb-1">Monto mensual</p>
            <p className="text-sm font-medium text-[#2563a8]">
              ${Number(donante.monto).toLocaleString('es-AR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] mb-1">Suscripto desde</p>
            <p className="text-sm font-medium text-[#1f2937]">
              {new Date(donante.created_at).toLocaleDateString('es-AR')}
            </p>
          </div>
        </div>
      </div>

      {/* Historial de pagos */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-base font-semibold text-[#1a3a5c] mb-4">Historial de pagos</h2>
        {(pagos ?? []).length === 0 ? (
          <p className="text-sm text-[#9ca3af]">Todavía no se registraron pagos.</p>
        ) : (
          <div className="space-y-3">
            {(pagos ?? []).map((p) => {
              const pb = PAYMENT_LABEL[p.status] ?? { label: p.status, className: 'bg-gray-100 text-gray-500' }
              return (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm text-[#1f2937]">
                      {new Date(p.created_at).toLocaleDateString('es-AR')}
                    </p>
                    <p className="text-xs text-[#9ca3af]">ID: {p.mp_payment_id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-[#1a3a5c]">
                      ${Number(p.amount).toLocaleString('es-AR')}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pb.className}`}>
                      {pb.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Comprobantes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-[#1a3a5c] mb-4">Comprobantes recibidos</h2>
        {(comprobantes ?? []).length === 0 ? (
          <p className="text-sm text-[#9ca3af]">No se recibieron comprobantes todavía.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(comprobantes ?? []).map((c) => (
              <a
                key={c.id}
                href={c.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-200 rounded-xl p-3 hover:border-[#2563a8] transition-colors text-center"
              >
                <div className="text-3xl mb-2">📄</div>
                <p className="text-xs text-[#6b7280]">
                  {new Date(c.created_at).toLocaleDateString('es-AR')}
                </p>
                <p className="text-xs text-[#2563a8] mt-1">Ver comprobante →</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
