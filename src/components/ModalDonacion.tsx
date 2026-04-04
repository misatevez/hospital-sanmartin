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
      initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, { locale: 'es-AR' })
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
          <div className="text-center py-4">
            <div className="text-5xl mb-3">❤️</div>
            <h3 className="text-lg font-bold text-[#1a3a5c] mb-2">¡Muchas gracias!</h3>
            <p className="text-[#4b5563] text-sm mb-4">
              Tu donación fue procesada con éxito. Tu aporte ayuda a los pacientes del Hospital San Martín.
            </p>
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-4 text-left">
              <p className="text-[#166534] font-semibold text-xs mb-1">Último paso importante</p>
              <p className="text-[#166534] text-xs">
                Envianos el comprobante de tu donación por WhatsApp para registrarla y hacerte llegar tu certificado.
              </p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=${encodeURIComponent('Hola! Acabo de hacer una donación al Hospital San Martín. Te adjunto el comprobante de mi pago.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1ebe5d] text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 mb-3 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar comprobante por WhatsApp
            </a>
            <button
              onClick={onClose}
              className="text-sm text-[#6b7280] hover:text-[#1a3a5c] underline"
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
