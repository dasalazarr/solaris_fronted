import { Bento } from '../components/Bento'
import { Closing } from '../components/Closing'
import { Demo } from '../components/Demo'
import { DemoForm } from '../components/DemoForm'
import { Faq } from '../components/Faq'
import { Figure } from '../components/Figure'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { HowWeWork } from '../components/HowWeWork'
import { Loop } from '../components/Loop'
import { Nav } from '../components/Nav'
import { Packs } from '../components/Packs'
import { Thesis } from '../components/Thesis'
import { TwoWays } from '../components/TwoWays'
import { PageEffects } from '../components/PageEffects'
import { DemoRequestProvider } from '../lib/demoRequest'

export function Landing({ formOpen = false }: { formOpen?: boolean }) {
  return (
    <DemoRequestProvider initialOpen={formOpen}>
      <PageEffects />
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-solar px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Nav />
      <main id="contenido">
        <Hero />
        <Thesis />
        <Loop />
        <Bento />
        <Figure />
        <Demo />
        <Packs />
        <TwoWays />
        <HowWeWork />
        <Faq />
        <Closing />
      </main>
      <Footer />
      <DemoForm />
    </DemoRequestProvider>
  )
}
