import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-10 text-center">

        {/* Ícono */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#1a3a5c] mb-3">
          No se completó la suscripción
        </h1>
        <p className="text-[#4b5563] mb-8">
          El pago fue cancelado o no pudo procesarse. Podés intentarlo de nuevo cuando quieras,
          no se realizó ningún cargo.
        </p>

        <Link
          href="/#planes"
          className="inline-block w-full bg-[#1a3a5c] hover:bg-[#142d4a] text-white font-semibold py-3 rounded-xl transition-colors duration-200 mb-4"
        >
          Volver a los planes
        </Link>

        <Link
          href="/"
          className="block text-[#2563a8] hover:text-[#1a3a5c] text-sm underline"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}
