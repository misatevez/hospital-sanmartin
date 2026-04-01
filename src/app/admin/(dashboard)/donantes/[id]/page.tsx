import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DonanteDetallePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: donante } = await supabase
    .from('donations')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!donante) notFound()

  // Cross-reference: check if this person is also a subscriber
  const { data: suscripciones } = await supabase
    .from('subscriptions')
    .select('id, plan, monto, status, created_at')
    .eq('email', donante.email)
    .order('created_at', { ascending: false })

  const statusBadge = {
    approved: { label: 'Acreditada', className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rechazada',  className: 'bg-red-100 text-red-600' },
    pending:  { label: 'Pendiente',  className: 'bg-yellow-100 text-yellow-700' },
  }[donante.status as string] ?? { label: donante.status, className: 'bg-gray-100 text-gray-500' }

  const subStatusLabel: Record<string, string> = {
    authorized: 'Activo',
    pending:    'Pendiente',
    paused:     'Pausado',
    cancelled:  'Cancelado',
  }

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#9ca3af] mb-6">
        <Link href="/admin/donantes" className="hover:text-[#2563a8]">Donantes</Link>
        <span>/</span>
        <span className="text-[#1a3a5c] font-medium">{donante.nombre} {donante.apellido}</span>
      </div>

      {/* Info de la donación */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1a3a5c]">
              {donante.nombre} {donante.apellido}
            </h1>
            <p className="text-[#6b7280] text-sm">{donante.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
            {statusBadge.label}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-[#9ca3af] mb-1">Teléfono</p>
            <p className="text-sm font-medium text-[#1f2937]">{donante.telefono}</p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] mb-1">Monto donado</p>
            <p className="text-sm font-medium text-[#2563a8]">
              ${Number(donante.monto).toLocaleString('es-AR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] mb-1">Fecha</p>
            <p className="text-sm font-medium text-[#1f2937]">
              {new Date(donante.created_at).toLocaleDateString('es-AR')}
            </p>
          </div>
          {donante.mp_payment_id && (
            <div className="col-span-2 md:col-span-3">
              <p className="text-xs text-[#9ca3af] mb-1">ID de pago Mercado Pago</p>
              <p className="text-sm font-medium text-[#1f2937] font-mono">{donante.mp_payment_id}</p>
            </div>
          )}
        </div>
      </div>

      {/* Suscripciones (cross-reference) */}
      {(suscripciones ?? []).length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-[#1a3a5c] mb-1">También es socio</h2>
          <p className="text-xs text-[#9ca3af] mb-4">Este donante también tiene una suscripción activa.</p>
          <div className="space-y-3">
            {(suscripciones ?? []).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1f2937]">{s.plan}</p>
                  <p className="text-xs text-[#9ca3af]">desde {new Date(s.created_at).toLocaleDateString('es-AR')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-[#1a3a5c]">
                    ${Number(s.monto).toLocaleString('es-AR')}/mes
                  </span>
                  <Link href={`/admin/socios/${s.id}`} className="text-[#2563a8] hover:underline text-xs font-medium">
                    Ver socio →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
