import { useEffect } from 'react'
import { Bento } from '../components/Bento'
import { BuildInPublic } from '../components/BuildInPublic'
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
import { getUtm, track } from '../lib/analytics'
import { DemoRequestProvider } from '../lib/demoRequest'

function useScrollDepth() {
  useEffect(() => {
    getUtm()
    const seen = new Set<number>()
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = (window.scrollY / max) * 100
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark - 1 && !seen.has(mark)) {
          seen.add(mark)
          track('scroll', { profundidad: mark })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/** Deep links: /#packs or /?seccion=packs scroll to that section once rendered. */
function useInitialSection() {
  useEffect(() => {
    const id =
      new URLSearchParams(window.location.search).get('seccion') || window.location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      // Let scroll-driven UI (nav background, loop) update in the same frame.
      window.dispatchEvent(new Event('scroll'))
    })
  }, [])
}

export function Landing({ formOpen = false }: { formOpen?: boolean }) {
  useScrollDepth()
  useInitialSection()
  return (
    <DemoRequestProvider initialOpen={formOpen}>
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
        <BuildInPublic />
        <Faq />
        <Closing />
      </main>
      <Footer />
      <DemoForm />
    </DemoRequestProvider>
  )
}
