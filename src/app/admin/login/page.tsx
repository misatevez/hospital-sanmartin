'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    })

    if (error) {
      setError('No se pudo enviar el link. Verificá el email e intentá de nuevo.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#f4f8fc] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">

        <div className="flex justify-center mb-6">
          <Image
            src="/logo-asociacion.png"
            alt="Hospital San Martín"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <h1 className="text-xl font-bold text-[#1a3a5c] text-center mb-1">
          Panel de administración
        </h1>
        <p className="text-[#6b7280] text-sm text-center mb-8">
          Hospital San Martín
        </p>

        {sent ? (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5 text-center">
            <p className="text-[#166534] font-semibold text-sm mb-1">
              ¡Link enviado!
            </p>
            <p className="text-[#166534] text-sm">
              Revisá tu bandeja de entrada en <strong>{email}</strong> y hacé click en el link para ingresar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1">
                Email institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hospitalsanmartin.org"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3a5c] hover:bg-[#142d4a] disabled:bg-[#9ca3af] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar link de acceso'}
            </button>

            <p className="text-center text-xs text-[#9ca3af]">
              Recibirás un link seguro en tu email para ingresar sin contraseña.
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
