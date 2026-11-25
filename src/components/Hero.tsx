'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'
import { useDemoRequest } from '../lib/demoRequest'
import { track } from '../lib/analytics'
import { HeroCapture } from './HeroCapture'
import { SolarisMascota } from './SolarisMascota'
import { Button, Container, Evidence, Eyebrow } from './ui'

function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word" style={{ animationDelay: `${start + i * 40}ms` }}>
          {w}&nbsp;
        </span>
      ))}
    </>
  )
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const suave = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
// SUAVE de la skill direccion-visual: bezier(.65, 0, .35, 1), aproximada.
const enOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Solaris sube del hero a la cabecera y se convierte en el sol del logo.
 * Una sola aparición por pantalla (ADR-0023): mientras está en el hero, el logo se aparta;
 * al llegar, la mascota se funde y el logo vuelve. Ligado al scroll, reversible.
 * Con movimiento reducido no hay viaje: el logo se queda y la mascota también.
 */
function SolViajero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    const ancla = el?.parentElement
    const root = document.documentElement
    if (!el || !ancla) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const pinta = () => {
      const logo = document.querySelector('header .logo-respira')
      if (!logo) return
      const a = ancla.getBoundingClientRect()
      const l = logo.getBoundingClientRect()
      const nx = a.left + a.width / 2
      const ny = a.top + a.height / 2
      const tx = l.left + l.width / 2
      const ty = l.top + l.height / 2
      // Recorrido: la distancia inicial a la cabecera, con un poco de holgura.
      const recorrido = Math.max(120, (ny + window.scrollY - ty) * 1.5)
      const p = clamp01(window.scrollY / recorrido)
      const ex = enOut(p)
      const ey = enOut(clamp01(p * 1.15))
      const escala = 1 - 0.62 * enOut(p)
      el.style.transform = `translate3d(${(tx - nx) * ex}px, ${(ty - ny) * ey}px, 0) scale(${escala})`
      el.style.opacity = String(1 - suave(0.78, 1, p))
      root.style.setProperty('--sol-ausente', String(1 - suave(0.82, 1, p)))
    }
    const alScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(pinta)
    }
    pinta()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
      root.style.removeProperty('--sol-ausente')
    }
  }, [])
  return (
    <div ref={ref} className="sol-viajero">
      {/* Antes de hidratar, el logo ya cede su sitio: así no hay dos soles un instante. */}
      <style>{'@media (prefers-reduced-motion: no-preference){:root{--sol-ausente:1}}'}</style>
      {children}
    </div>
  )
}

export function Hero() {
  const { requestDemo } = useDemoRequest()
  return (
    <section id="top" className="relative overflow-hidden bg-ink pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="sunbeam" aria-hidden="true" />
      <Container className="relative text-center">
        {/* Solaris donde nace la luz del hero: presencia, no protagonismo (ADR-0023). */}
        {/* El viajero va fuera de .sol-entra: su filtro crearía un contexto de apilado y la
            cabecera taparía a la mascota al subir. */}
        <div className="mb-5 flex justify-center">
          <SolViajero>
            <div className="sol-entra">
              <SolarisMascota size={72} flota sigue />
            </div>
          </SolViajero>
        </div>
        <Eyebrow tone="light">Para Compras y Dirección financiera</Eyebrow>
        <h1 className="headline mx-auto mt-6 max-w-[980px] text-[44px] text-white sm:text-[64px] lg:text-[88px]">
          <Words text="Lo que tu política exige," />
          {/* Tras las cinco palabras de arriba (40 ms cada una). */}
          <span className="word" style={{ animationDelay: '200ms' }}>
            <Evidence italic onDark>
              comprobado
            </Evidence>{' '}
            antes de que salga.
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-[640px] text-[17px] leading-relaxed text-white/68 md:text-[19px]">
          Firmas que faltan, certificados caducados, datos sin confirmar. Cada uno con la página que lo
          exige, y retenido hasta que firma quien debe.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            as="a"
            href="#demo"
            size="lg"
            onClick={() => track('ver_como_funciona', { section: 'hero' })}
          >
            Ver un caso en 2 minutos <ArrowDown className="size-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="ghost-dark" onClick={() => requestDemo('hero')}>
            Solicitar demostración
          </Button>
        </div>
        {/* Prueba tangible del mismo caso que enseña la captura de abajo (DEMO_QA[0], content.ts). */}
        <p className="mt-6 font-mono text-[12px] tracking-[0.04em] text-balance text-white/60">
          <span className="text-solar">●</span> Caso de muestra · Pedido PC-0412 · 18.450 € · falta
          la firma · pág. 4
        </p>
        <div className="relative mx-auto mt-10 max-w-[1200px] md:mt-12">
          <HeroCapture />
        </div>
      </Container>
    </section>
  )
}
