'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

interface Props {
  userEmail: string
}

const links = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/donantes', label: 'Donantes', icon: '👥' },
  { href: '/admin/whatsapp', label: 'WhatsApp', icon: '📱' },
]

export default function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-60 bg-[#1a3a5c] min-h-screen flex flex-col py-8 px-4">
      {/* Logo */}
      <div className="mb-10 px-2">
        <p className="text-white font-bold text-sm leading-tight">Hospital San Martín</p>
        <p className="text-[#93c5fd] text-xs mt-1">Panel de administración</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-[#93c5fd] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Usuario y logout */}
      <div className="border-t border-white/10 pt-4 mt-4">
        <p className="text-[#93c5fd] text-xs px-3 truncate mb-3">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-[#93c5fd] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
