'use client'

import { Check, Cloud, HardDrive } from 'lucide-react'
import { useDemoRequest } from '../lib/demoRequest'
import { Button, Container, Evidence, Reveal, SectionTitle } from './ui'

const WAYS = [
  {
    icon: Cloud,
    tag: '30 minutos',
    title: 'Demostración',
    body: 'Su sector con datos de muestra, en la nube, en una reunión de 30 minutos.',
    items: [
      'Pack de su sector con datos de muestra',
      'Preguntas, huecos y aprobaciones en vivo',
      'Sin subir ningún documento suyo',
    ],
    cta: 'Solicitar demostración',
    origin: 'formas-demo',
    variant: 'solar' as const,
  },
  {
    icon: HardDrive,
    tag: 'Sus documentos',
    title: 'Instalación en su equipo',
    body: 'Sus documentos reales, sin salir de su organización. Se prepara con el primer piloto.',
    items: [
      'Diagnóstico de un proceso y sus reglas',
      'Piloto con sus documentos reales',
      'Instalación y acompañamiento',
    ],
    cta: 'Hablar de una instalación',
    origin: 'formas-instalacion',
    variant: 'ghost-dark' as const,
  },
]

export function TwoWays() {
  const { requestDemo } = useDemoRequest()
  return (
    <section id="empezar" className="bg-ink py-24 text-white md:py-32">
      <Container>
        <SectionTitle eyebrow="Para empezar" tone="light">
          Dos formas de{' '}
          <Evidence italic onDark>
            empezar
          </Evidence>
          .
        </SectionTitle>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {WAYS.map((w, i) => (
            <Reveal
              key={w.title}
              delay={i * 80}
              className="flex flex-col rounded-3xl bg-ink-2 p-7 ring-1 ring-white/8 md:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <w.icon className="size-5 text-solar" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="font-mono text-[11px] text-white/50">{w.tag}</span>
              </div>
              <h3 className="mt-8 text-[28px] font-semibold tracking-[-0.02em]">{w.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-white/65">{w.body}</p>
              <ul className="mt-7 space-y-3 border-t border-white/8 pt-6">
                {w.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[15px] text-white/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-solar" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
              <Button
                variant={w.variant}
                className="mt-9 w-full sm:w-fit"
                onClick={() => requestDemo(w.origin)}
              >
                {w.cta}
              </Button>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
