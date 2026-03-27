'use client'

import { useEffect, useState } from 'react'

const WA_SERVICE_URL = process.env.NEXT_PUBLIC_WA_SERVICE_URL ?? ''

type Status = 'loading' | 'disconnected' | 'qr' | 'connected' | 'error'

export default function WhatsAppPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [qr, setQr] = useState<string | null>(null)

  useEffect(() => {
    if (!WA_SERVICE_URL) {
      setStatus('error')
      return
    }

    let cancelled = false

    async function poll() {
      try {
        const res = await fetch(`${WA_SERVICE_URL}/qr`)
        if (!res.ok) throw new Error('No response')
        const data = await res.json()

        if (cancelled) return

        if (data.status === 'connected') {
          setStatus('connected')
          setQr(null)
        } else if (data.status === 'qr' && data.qr) {
          setStatus('qr')
          setQr(data.qr)
        } else {
          setStatus('disconnected')
          setQr(null)
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    poll()
    const interval = setInterval(poll, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-[#1a3a5c] mb-2">Conexión WhatsApp</h1>
      <p className="text-sm text-gray-500 mb-8">
        Escaneá el código QR con el WhatsApp del hospital para activar la recepción automática de comprobantes.
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

        {status === 'loading' && (
          <p className="text-gray-400 animate-pulse">Conectando con el servicio...</p>
        )}

        {status === 'error' && (
          <div className="text-red-500">
            <p className="font-semibold mb-1">Servicio no disponible</p>
            <p className="text-sm text-gray-500">Verificá que el servicio de WhatsApp esté corriendo y configurado.</p>
          </div>
        )}

        {status === 'disconnected' && (
          <div className="text-gray-400">
            <p className="font-semibold mb-1">Generando QR...</p>
            <p className="text-sm">Esperando al servicio. Se actualiza automáticamente.</p>
          </div>
        )}

        {status === 'qr' && qr && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Abrí WhatsApp en el celular del hospital → <strong>Dispositivos vinculados</strong> → <strong>Vincular dispositivo</strong> → escaneá este QR
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR WhatsApp" className="mx-auto w-56 h-56 rounded-xl border border-gray-200" />
            <p className="text-xs text-gray-400 mt-3 animate-pulse">El QR expira cada 60 segundos. Se renueva automáticamente.</p>
          </div>
        )}

        {status === 'connected' && (
          <div className="text-green-600">
            <div className="text-5xl mb-3">✅</div>
            <p className="font-bold text-lg">¡WhatsApp conectado!</p>
            <p className="text-sm text-gray-500 mt-1">El servicio está activo y recibiendo comprobantes.</p>
          </div>
        )}

      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Estado: <span className="font-mono">{status}</span> · Se actualiza cada 5 segundos
      </p>
    </div>
  )
}
