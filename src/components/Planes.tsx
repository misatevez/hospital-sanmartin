import Link from 'next/link'

const planes = [
  {
    nombre: 'Socio Amigo',
    monto: '$3.000',
    beneficios: [
      'Acceso a informes de gestión',
      'Certificado de socio digital',
      'Gratitud del equipo',
    ],
    destacado: false,
  },
  {
    nombre: 'Socio Protector',
    monto: '$7.000',
    beneficios: [
      'Todo lo anterior',
      'Mención en redes sociales',
      'Informe personalizado trimestral',
    ],
    destacado: true,
  },
  {
    nombre: 'Socio Esperanza',
    monto: '$15.000',
    beneficios: [
      'Todo lo anterior',
      'Reconocimiento institucional',
      'Visita guiada al sector de Oncología',
    ],
    destacado: false,
  },
]

export default function Planes() {
  return (
    <section id="planes" className="bg-[#f4f8fc] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#1a3a5c] tracking-wide uppercase">
            Elegí tu forma de colaborar
          </h2>
          <div className="w-14 h-1 bg-[#2e8b57] mx-auto mt-3 mb-4" />
          <p className="text-[#6b7280]">Aporte mensual · Cancelás cuando quieras</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {planes.map((plan) => (
            <div
              key={plan.nombre}
              className={`relative bg-white rounded-2xl p-8 flex flex-col ${
                plan.destacado
                  ? 'border-2 border-[#2563a8] shadow-2xl md:-translate-y-4'
                  : 'border border-gray-200 shadow-md'
              }`}
            >
              {plan.destacado && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#2563a8] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Recomendado
                  </span>
                </div>
              )}

              <h3 className="text-[#1a3a5c] font-bold text-xl mb-2">{plan.nombre}</h3>
              <p className="text-5xl font-bold text-[#2563a8] mb-1">
                {plan.monto}
                <span className="text-base font-normal text-[#6b7280]"> / mes</span>
              </p>

              <ul className="mt-6 mb-8 space-y-3 flex-1">
                {plan.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[#1f2937] text-sm">
                    <span className="text-[#2e8b57] font-bold text-base leading-snug">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className={`text-center font-semibold py-3 rounded-xl transition-colors duration-200 ${
                  plan.destacado
                    ? 'bg-[#2e8b57] hover:bg-[#256b44] text-white'
                    : 'bg-[#1a3a5c] hover:bg-[#142d4a] text-white'
                }`}
              >
                Quiero ser {plan.nombre}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-2">
          <p className="text-[#6b7280] text-sm">
            ¿Querés colaborar con otro monto?{' '}
            <Link href="#" className="text-[#2563a8] underline hover:text-[#1a3a5c]">
              Escribinos por WhatsApp
            </Link>
          </p>
          <p className="text-[#9ca3af] text-xs">
            El aporte es mensual. Podés cancelar cuando quieras avisándonos por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  )
}
