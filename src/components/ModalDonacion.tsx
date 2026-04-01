'use client'

import { useState } from 'react'

interface Props {
  onClose: () => void
}

export default function ModalDonacion({ onClose }: Props) {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.nombre || !form.apellido || !form.email || !form.telefono) {
      setError('Por favor completá todos los campos.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/create-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error. Intentá de nuevo.')
        setLoading(false)
        return
      }
      window.location.href = data.init_point
    } catch {
      setError('No se pudo conectar. Verificá tu conexión e intentá de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1a3a5c]">Donación única</h2>
            <p className="text-[#2563a8] font-semibold text-lg">
              $2.000
              <span className="text-sm font-normal text-[#6b7280]"> · pago único</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#1a3a5c] text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1">Nombre</label>
              <input
                type="text" name="nombre" value={form.nombre} onChange={handleChange}
                placeholder="Juan" disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1">Apellido</label>
              <input
                type="text" name="apellido" value={form.apellido} onChange={handleChange}
                placeholder="García" disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f2937] mb-1">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="juan@email.com" disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f2937] mb-1">Teléfono de WhatsApp</label>
            <input
              type="tel" name="telefono" value={form.telefono} onChange={handleChange}
              placeholder="+54 9 341 000 0000" disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#2e8b57] hover:bg-[#256b44] disabled:bg-[#9ca3af] text-white font-semibold py-3 rounded-xl transition-colors duration-200"
          >
            {loading ? 'Redirigiendo a Mercado Pago...' : 'Donar $2.000'}
          </button>

          <p className="text-center text-xs text-[#9ca3af]">
            Serás redirigido a Mercado Pago para completar el pago de forma segura.
          </p>
        </form>
      </div>
    </div>
  )
}
