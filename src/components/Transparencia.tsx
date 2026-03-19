const puntos = [
  'Los fondos ingresan directamente a la cuenta bancaria de la Asociación Civil.',
  'Publicamos un informe de gestión cada 90 días, disponible para todos los socios.',
  'Personería Jurídica N° 200 — entidad legalmente constituida en Entre Ríos.',
  'Podés darte de baja cuando quieras, sin trámites, solo avisándonos por WhatsApp.',
]

export default function Transparencia() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1a3a5c] tracking-wide uppercase">
            Tu dinero va directo a donde importa
          </h2>
          <div className="w-14 h-1 bg-[#2e8b57] mx-auto mt-3" />
        </div>

        <ul className="space-y-4">
          {puntos.map((punto, i) => (
            <li key={i} className="flex items-start gap-4 bg-[#f4f8fc] rounded-xl p-5">
              <span className="text-[#2e8b57] text-xl font-bold leading-snug">✓</span>
              <p className="text-[#1f2937] text-base leading-relaxed">{punto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
