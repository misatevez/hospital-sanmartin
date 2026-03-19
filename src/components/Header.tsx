import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a3a5c] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-asociacion.png"
            alt="Logo ACASO - Asociación Civil Hospital San Martín"
            width={48}
            height={48}
            className="object-contain bg-white rounded p-1"
          />
          <div>
            <p className="text-white font-semibold text-sm tracking-wide uppercase leading-tight">
              Asociación Civil
            </p>
            <p className="text-blue-300 text-xs leading-tight">Hospital San Martín · Paraná</p>
          </div>
        </div>

        <Link
          href="#planes"
          className="bg-[#2e8b57] hover:bg-[#256b44] text-white font-semibold px-5 py-2 rounded-md text-sm transition-colors duration-200"
        >
          Ser Socio
        </Link>
      </div>
    </header>
  )
}
