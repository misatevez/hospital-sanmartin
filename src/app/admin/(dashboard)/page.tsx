import { createClient } from '@/lib/supabase-server'

async function getStats() {
  const supabase = createClient()

  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString()

  const [
    sociosTotal,
    sociosActivos,
    sociosNuevosMes,
    recaudacionSubs,
    planBreakdown,
    statusBreakdown,
    donacionesAprobadas,
    donacionesTotal,
    donacionesMes,
  ] = await Promise.all([
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'authorized'),
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }).gte('created_at', inicioMes),
    supabase.from('subscriptions').select('monto').eq('status', 'authorized'),
    supabase.from('subscriptions').select('plan, status'),
    supabase.from('subscriptions').select('status'),
    supabase.from('donations').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('donations').select('monto').eq('status', 'approved'),
    supabase.from('donations').select('id', { count: 'exact', head: true }).eq('status', 'approved').gte('created_at', inicioMes),
  ])

  const recaudacionMensual = (recaudacionSubs.data ?? []).reduce((acc, s) => acc + Number(s.monto), 0)
  const totalDonado = (donacionesTotal.data ?? []).reduce((acc, d) => acc + Number(d.monto), 0)

  const planes = ['Socio Amigo', 'Socio Protector', 'Socio Esperanza']
  const planCounts = planes.map((plan) => ({
    plan,
    total: (planBreakdown.data ?? []).filter((s) => s.plan === plan).length,
    activos: (planBreakdown.data ?? []).filter((s) => s.plan === plan && s.status === 'authorized').length,
  }))

  const statusCounts = (statusBreakdown.data ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1
    return acc
  }, {})

  return {
    socios: {
      total: sociosTotal.count ?? 0,
      activos: sociosActivos.count ?? 0,
      nuevosMes: sociosNuevosMes.count ?? 0,
      recaudacionMensual,
      planCounts,
      statusCounts,
    },
    donaciones: {
      aprobadas: donacionesAprobadas.count ?? 0,
      totalDonado,
      estesMes: donacionesMes.count ?? 0,
    },
  }
}

export default async function AdminDashboard() {
  const { socios, donaciones } = await getStats()

  const totalRecaudado = socios.recaudacionMensual + donaciones.totalDonado

  const statusItems = [
    { status: 'authorized', label: 'Activos', color: 'bg-[#2e8b57] text-[#2e8b57]' },
    { status: 'pending', label: 'Pendientes', color: 'bg-yellow-400 text-yellow-600' },
    { status: 'paused', label: 'Pausados', color: 'bg-orange-400 text-orange-500' },
    { status: 'cancelled', label: 'Cancelados', color: 'bg-gray-300 text-gray-500' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#1a3a5c]">Dashboard</h1>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Socios activos"
          value={socios.activos.toString()}
          sub={`${socios.total} históricos`}
          color="text-[#2563a8]"
        />
        <StatCard
          label="Donaciones aprobadas"
          value={donaciones.aprobadas.toString()}
          sub={`$${donaciones.totalDonado.toLocaleString('es-AR')} recaudado total`}
          color="text-[#2e8b57]"
        />
        <StatCard
          label="Recaudación mensual estimada"
          value={`$${socios.recaudacionMensual.toLocaleString('es-AR')}`}
          sub="basado en socios activos"
          color="text-[#1a3a5c]"
        />
      </div>

      {/* Socios */}
      <section>
        <h2 className="text-base font-semibold text-[#1a3a5c] mb-4">Socios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Estado de socios */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-[#1a3a5c] mb-4">Estado</p>
            <div className="space-y-3">
              {statusItems.map((item) => {
                const count = socios.statusCounts[item.status] ?? 0
                const pct = socios.total > 0 ? Math.round((count / socios.total) * 100) : 0
                const [bgClass] = item.color.split(' ')
                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${bgClass}`} />
                        <span className="text-sm text-[#1f2937]">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#1a3a5c]">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${bgClass}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Breakdown por plan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-[#1a3a5c] mb-4">Por plan</p>
            <div className="space-y-4">
              {socios.planCounts.map((p) => (
                <div key={p.plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#1f2937]">{p.plan}</span>
                    <span className="text-sm font-semibold text-[#1a3a5c]">
                      {p.activos} activos / {p.total} total
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-[#2563a8]"
                      style={{ width: socios.total > 0 ? `${Math.round((p.total / socios.total) * 100)}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Nuevos este mes */}
        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6b7280]">Nuevos socios este mes</p>
            <p className="text-3xl font-bold text-[#2563a8] mt-1">{socios.nuevosMes}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6b7280]">Recaudación mensual</p>
            <p className="text-3xl font-bold text-[#1a3a5c] mt-1">
              ${socios.recaudacionMensual.toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </section>

      {/* Donaciones */}
      <section>
        <h2 className="text-base font-semibold text-[#1a3a5c] mb-4">Donaciones únicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Aprobadas"
            value={donaciones.aprobadas.toString()}
            sub="pagos confirmados"
            color="text-[#2e8b57]"
          />
          <StatCard
            label="Este mes"
            value={donaciones.estesMes.toString()}
            sub="donaciones aprobadas"
            color="text-[#2563a8]"
          />
          <StatCard
            label="Total recaudado"
            value={`$${donaciones.totalDonado.toLocaleString('es-AR')}`}
            sub="donaciones únicas"
            color="text-[#1a3a5c]"
          />
        </div>
      </section>

      {/* Total combinado */}
      <div className="bg-[#1a3a5c] rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-200">Total recaudado (socios + donaciones)</p>
          <p className="text-4xl font-bold mt-1">${totalRecaudado.toLocaleString('es-AR')}</p>
        </div>
        <div className="text-right text-sm text-blue-200 space-y-1">
          <p>Socios: ${socios.recaudacionMensual.toLocaleString('es-AR')} /mes</p>
          <p>Donaciones: ${donaciones.totalDonado.toLocaleString('es-AR')}</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub: string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-[#6b7280] mb-2">{label}</p>
      <p className={`text-4xl font-bold ${color} mb-1`}>{value}</p>
      <p className="text-xs text-[#9ca3af]">{sub}</p>
    </div>
  )
}
