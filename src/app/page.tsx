import Header from '@/components/Header'
import Hero from '@/components/Hero'
import LaCausa from '@/components/LaCausa'
import Transparencia from '@/components/Transparencia'
import Planes from '@/components/Planes'
import SeccionDonacion from '@/components/SeccionDonacion'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <LaCausa />
      <Planes />
      <SeccionDonacion />
      <Transparencia />
      <Footer />
    </main>
  )
}
