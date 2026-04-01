'use client'

import { useState } from 'react'
import ModalDonacion from './ModalDonacion'

export default function SeccionDonacion() {
  const [open, setOpen] = useState(false)

  return (
    <section className="bg-[#f0f7ff] py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[#2563a8] text-sm font-semibold uppercase tracking-wide mb-3">
          Otra forma de ayudar
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a5c] mb-4">
          ¿No podés comprometerte mensualmente?
        </h2>
        <p className="text-[#4b5563] mb-8 max-w-xl mx-auto">
          Con una donación única de <strong>$2.000</strong> también hacés una diferencia real
          para los pacientes del Hospital San Martín. Cada aporte cuenta.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2563a8] hover:bg-[#1a4f8f] text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200 shadow-md"
        >
          ❤️ Donar $2.000
        </button>
      </div>

      {open && <ModalDonacion onClose={() => setOpen(false)} />}
    </section>
  )
}
