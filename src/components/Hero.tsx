import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white pt-16">
      {/* Background image */}
      <Image
        src="/hospital-hero.jpg"
        alt="Hospital San Martín"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#081d36]/75" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <p className="text-[#2e8b57] text-xs font-bold tracking-widest uppercase mb-6">
          Campaña Oficial Digital
        </p>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
          Sumate a la red de sostén del{' '}
          <span className="text-[#4ade80]">Sector de Oncología</span>
          {' '}del San Martín
        </h1>

        <p className="text-blue-200 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          Tu aporte mensual permite que cientos de pacientes entrerrianos reciban su
          tratamiento con la dignidad y el equipamiento que merecen.
        </p>

        <Link
          href="#planes"
          className="inline-block bg-[#2e8b57] hover:bg-[#256b44] active:scale-95 text-white font-bold text-lg px-12 py-4 rounded-xl transition-all duration-200 shadow-xl animate-pulse-cta"
        >
          Sumarme como Socio Benefactor
        </Link>

        <p className="text-blue-400 text-sm mt-5">
          Desde $3.000 / mes &nbsp;·&nbsp; Cancelás cuando quieras
        </p>
      </div>
    </section>
  )
}
