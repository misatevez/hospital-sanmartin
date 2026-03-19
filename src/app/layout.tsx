import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import './globals.css'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  title: 'Ser Socio Benefactor — Hospital San Martín',
  description:
    'Tu aporte mensual permite que cientos de pacientes entrerrianos reciban su tratamiento oncológico con la dignidad que merecen.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${raleway.variable} font-raleway antialiased`}>{children}</body>
    </html>
  )
}
