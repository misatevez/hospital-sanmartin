import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  authorized: { label: 'Activo', className: 'bg-green-100 text-green-700' },
  pending:    { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
  paused:     { label: 'Pausado', className: 'bg-orange-100 text-orange-700' },
  cancelled:  { label: 'Cancelado', className: 'bg-gray-100 text-gray-500' },
}

export default async function DonantesPage() {
  const supabase = createClient()

  const { data: donantes } = await supabase
    .from('subscriptions')
    .select('id, nombre, apellido, email, telefono, plan, monto, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a3a5c] mb-8">Donantes</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f8fafc]">
                <th className="text-left px-6 py-4 text-[#6b7280] font-medium">Donante</th>
                <th className="text-left px-6 py-4 text-[#6b7280] font-medium">Plan</th>
                <th className="text-left px-6 py-4 text-[#6b7280] font-medium">Monto</th>
                <th className="text-left px-6 py-4 text-[#6b7280] font-medium">Estado</th>
                <th className="text-left px-6 py-4 text-[#6b7280] font-medium">Fecha</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {(donantes ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#9ca3af]">
                    Todavía no hay donantes registrados.
                  </td>
                </tr>
              )}
              {(donantes ?? []).map((d) => {
                const badge = STATUS_LABEL[d.status] ?? { label: d.status, className: 'bg-gray-100 text-gray-500' }
                return (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1a3a5c]">{d.nombre} {d.apellido}</p>
                      <p className="text-[#9ca3af] text-xs">{d.email}</p>
                    </td>
                    <td className="px-6 py-4 text-[#1f2937]">{d.plan}</td>
                    <td className="px-6 py-4 text-[#1f2937] font-medium">
                      ${Number(d.monto).toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#9ca3af]">
                      {new Date(d.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/donantes/${d.id}`}
                        className="text-[#2563a8] hover:underline text-xs font-medium"
                      >
                        Ver detalle →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
