import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Tjanster from '@/components/Tjanster'
import Galleri from '@/components/Galleri'
import Om from '@/components/Om'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Tjanster />
      <Galleri />
      <Om />
      <Footer />
    </main>
  )
}
