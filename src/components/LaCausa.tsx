const stats = [
  { num: '100+', label: 'nuevos pacientes oncológicos por mes' },
  { num: '100%', label: 'de los fondos van al sector de Oncología' },
  { num: '25+', label: 'años de historia del Hospital San Martín' },
]

export default function LaCausa() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1a3a5c] tracking-wide uppercase">
            Por qué importa tu aporte
          </h2>
          <div className="w-14 h-1 bg-[#2e8b57] mx-auto mt-3" />
        </div>

        <div className="space-y-5 text-[#1f2937] text-lg leading-relaxed">
          <p>
            El Hospital San Martín es el principal centro de referencia oncológica de Entre Ríos.
            Cada año, <strong>cientos de familias entrerrianas</strong> depositan en él la esperanza
            de un diagnóstico a tiempo y un tratamiento digno.
          </p>
          <p>
            El presupuesto público cubre lo esencial, pero no alcanza para sostener el ritmo que la
            demanda exige: equipamiento moderno, insumos específicos y mejoras edilicias que hacen
            la diferencia entre un tratamiento básico y uno <strong>verdaderamente digno</strong>.
          </p>
          <p>
            La Asociación Civil existe para cubrir esa brecha. Cada aporte mensual se convierte en
            insumos reales, en equipos funcionando, en pacientes que no tienen que esperar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {stats.map(({ num, label }) => (
            <div key={num} className="text-center p-6 bg-[#f4f8fc] rounded-2xl">
              <p className="text-4xl font-bold text-[#2563a8]">{num}</p>
              <p className="text-[#6b7280] text-sm mt-2 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
