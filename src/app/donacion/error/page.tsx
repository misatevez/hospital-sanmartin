import Link from 'next/link'

export default function DonacionError() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-[#1a3a5c] mb-3">No se pudo completar la donación</h1>
        <p className="text-[#4b5563] mb-6">
          Hubo un problema al procesar tu pago. No se realizó ningún cobro.
          Por favor intentá nuevamente.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#2563a8] hover:bg-[#1a4f8f] text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
