import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#1a3a5c] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <Image
            src="/logo-asociacion.png"
            alt="Logo ACASO - Asociación Civil Hospital San Martín"
            width={64}
            height={64}
            className="object-contain bg-white rounded p-1"
          />
          <div>
            <p className="font-bold text-base leading-snug">
              Asociación Civil de Ayuda al Sector de Oncología y Otros
            </p>
            <p className="text-blue-300 text-sm mt-0.5">Hospital San Martín · Paraná, Entre Ríos</p>
          </div>
        </div>

        <div className="border-t border-[#2a4f78] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-blue-200 text-sm">
          <div className="space-y-1.5">
            <p>
              <span className="font-semibold text-white">CUIT:</span> 30-71510651-1
            </p>
            <p>
              <span className="font-semibold text-white">Domicilio:</span> Gualeguaychú 177, Paraná, Entre Ríos
            </p>
            <p>
              <span className="font-semibold text-white">Personería Jurídica:</span> N° 200, Expte. N° 4296
            </p>
          </div>
          <div className="sm:text-right space-y-1.5">
            <p className="font-semibold text-white">Campaña Oficial Digital</p>
            <p>@hospitalsanmartin</p>
          </div>
        </div>

        <div className="border-t border-[#2a4f78] mt-6 pt-6 text-center text-blue-400 text-xs">
          © 2026 Asociación Civil · Hospital San Martín. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
