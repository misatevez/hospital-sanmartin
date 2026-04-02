'use client'

import { useState, useEffect, useRef } from 'react'
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'

interface Props {
  onClose: () => void
}

const MONTO = 2000
type Metodo = 'mercadopago' | 'tarjeta' | null

export default function ModalDonacion({ onClose }: Props) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [metodo, setMetodo] = useState<Metodo>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!)
      initialized.current = true
    }
    return () => {
      // @ts-ignore
      window?.cardPaymentBrickController?.unmount()
    }
  }, [])

  function validarDatos() {
    if (!nombre || !apellido || !email || !telefono) {
      setError('Por favor completá todos los campos.')
      return false
    }
    setError('')
    return true
  }

  function elegirMetodo(m: Metodo) {
    if (!validarDatos()) return
    setMetodo(m)
  }

  async function handleMercadoPago() {
    setLoading(true)
    try {
      const res = await fetch('/api/create-donation-mp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, telefono }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleTarjeta(data: any) {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/create-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          telefono,
          email: data.payer.email,
          token: data.token,
          installments: data.installments,
          payment_method_id: data.payment_method_id,
        }),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        setError(result.error ?? 'Ocurrió un error. Intentá de nuevo.')
        setLoading(false)
        return
      }
      setSuccess(true)
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Éxito */}
        {success ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="text-lg font-bold text-[#1a3a5c] mb-2">¡Muchas gracias!</h3>
            <p className="text-[#4b5563] text-sm">
              Tu donación fue procesada con éxito. Tu aporte ayuda a los pacientes del Hospital San Martín.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-[#2563a8] hover:bg-[#1a4f8f] text-white font-semibold px-6 py-2 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Datos personales */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan"
                  disabled={loading || !!metodo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8] disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="García"
                  disabled={loading || !!metodo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8] disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com"
                disabled={loading || !!metodo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8] disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1">Teléfono de WhatsApp</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 9 341 000 0000"
                disabled={loading || !!metodo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8] disabled:bg-gray-50"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Selector de método */}
            {!metodo && (
              <>
                <p className="text-sm font-medium text-[#1f2937] pt-1">¿Cómo querés pagar?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => elegirMetodo('mercadopago')}
                    className="flex flex-col items-center gap-2 border-2 border-gray-200 hover:border-[#009ee3] rounded-xl p-4 transition-colors"
                  >
                    <img src="/mp-logo.png" alt="Mercado Pago" className="h-8 object-contain" />
                    <span className="text-xs text-[#6b7280]">Mercado Pago</span>
                  </button>
                  <button
                    onClick={() => elegirMetodo('tarjeta')}
                    className="flex flex-col items-center gap-2 border-2 border-gray-200 hover:border-[#2563a8] rounded-xl p-4 transition-colors"
                  >
                    <span className="text-2xl">💳</span>
                    <span className="text-xs text-[#6b7280]">Tarjeta de crédito / débito</span>
                  </button>
                </div>
              </>
            )}

            {/* Volver a elegir método */}
            {metodo && (
              <button
                onClick={() => { setMetodo(null); setError('') }}
                className="text-xs text-[#2563a8] hover:underline"
              >
                ← Cambiar método de pago
              </button>
            )}

            {/* Mercado Pago */}
            {metodo === 'mercadopago' && (
              <button
                onClick={handleMercadoPago}
                disabled={loading}
                className="w-full bg-[#009ee3] hover:bg-[#0088c7] disabled:bg-[#9ca3af] text-white font-semibold py-3 rounded-xl transition-colors duration-200"
              >
                {loading ? 'Redirigiendo...' : 'Continuar con Mercado Pago →'}
              </button>
            )}

            {/* Tarjeta embebida */}
            {metodo === 'tarjeta' && (
              <CardPayment
                initialization={{ amount: MONTO }}
                customization={{ paymentMethods: { maxInstallments: 1, minInstallments: 1 } }}
                onSubmit={handleTarjeta}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
