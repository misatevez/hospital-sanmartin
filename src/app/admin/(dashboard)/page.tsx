import { createClient } from '@/lib/supabase-server'

async function getStats() {
  const supabase = createClient()

  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString()

  const [totalResult, activosResult, nuevosResult, recaudacionResult] = await Promise.all([
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }).in('status', ['authorized']),
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }).gte('created_at', inicioMes),
    supabase.from('subscriptions').select('monto').eq('status', 'authorized'),
  ])

  const recaudacionMensual = (recaudacionResult.data ?? []).reduce(
    (acc, s) => acc + Number(s.monto),
    0
  )

  return {
    total: totalResult.count ?? 0,
    activos: activosResult.count ?? 0,
    nuevosMes: nuevosResult.count ?? 0,
    recaudacionMensual,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const kpis = [
    {
      label: 'Donantes activos',
      value: stats.activos.toString(),
      sub: `${stats.total} históricos`,
      color: 'text-[#2563a8]',
    },
    {
      label: 'Nuevos este mes',
      value: stats.nuevosMes.toString(),
      sub: 'suscripciones iniciadas',
      color: 'text-[#2e8b57]',
    },
    {
      label: 'Recaudación mensual estimada',
      value: `$${stats.recaudacionMensual.toLocaleString('es-AR')}`,
      sub: 'basado en suscripciones activas',
      color: 'text-[#1a3a5c]',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a3a5c] mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-[#6b7280] mb-2">{kpi.label}</p>
            <p className={`text-4xl font-bold ${kpi.color} mb-1`}>{kpi.value}</p>
            <p className="text-xs text-[#9ca3af]">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-[#1a3a5c] mb-1">Estado de suscripciones</h2>
        <p className="text-sm text-[#6b7280] mb-4">Distribución actual</p>
        <StatusBreakdown />
      </div>
    </div>
  )
}

async function StatusBreakdown() {
  const supabase = createClient()
  const { data } = await supabase.from('subscriptions').select('status')

  const counts = (data ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1
    return acc
  }, {})

  const items = [
    { status: 'authorized', label: 'Activos', color: 'bg-[#2e8b57]' },
    { status: 'pending', label: 'Pendientes', color: 'bg-yellow-400' },
    { status: 'paused', label: 'Pausados', color: 'bg-orange-400' },
    { status: 'cancelled', label: 'Cancelados', color: 'bg-gray-300' },
  ]

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.status} className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          <span className="text-sm text-[#1f2937] w-24">{item.label}</span>
          <span className="text-sm font-semibold text-[#1a3a5c]">
            {counts[item.status] ?? 0}
          </span>
        </div>
      ))}
    </div>
  )
}
