'use client'

import { ArrowDown } from 'lucide-react'
import { useDemoRequest } from '../lib/demoRequest'
import { track } from '../lib/analytics'
import { HeroCapture } from './HeroCapture'
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

export function Hero() {
  const { requestDemo } = useDemoRequest()
  return (
    <section id="top" className="relative overflow-hidden bg-ink pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="sunbeam" aria-hidden="true" />
      <Container className="relative text-center">
        <Eyebrow tone="light">IA privada para procesos</Eyebrow>
        <h1 className="headline mx-auto mt-6 max-w-[980px] text-[44px] text-white sm:text-[64px] lg:text-[88px]">
          <Words text="Sus procesos," />
          <span className="word" style={{ animationDelay: '80ms' }}>
            <Evidence italic onDark>
              con contrato
            </Evidence>
            .
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-[640px] text-[17px] leading-relaxed text-white/68 md:text-[19px]">
          Solaris cruza sus documentos con sus reglas: responde con la cita exacta, señala lo que
          incumple o falta y prepara la acción, que no se ejecuta sin la aprobación del responsable.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => requestDemo('hero')}>
            Solicitar demostración
          </Button>
          <Button
            as="a"
            href="#demo"
            size="lg"
            variant="ghost-dark"
            onClick={() => track('ver_como_funciona', { section: 'hero' })}
          >
            Ver cómo funciona <ArrowDown className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="relative mx-auto mt-16 max-w-[1200px] md:mt-20">
          <HeroCapture />
        </div>
      </Container>
    </section>
  )
}
