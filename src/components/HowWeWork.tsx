'use client'

import { STEPS } from '../data/content'
import { useDemoRequest } from '../lib/demoRequest'
import { Button, Container, Evidence, Reveal, SectionTitle } from './ui'

export function HowWeWork() {
  const { requestDemo } = useDemoRequest()
  return (
    <section id="como-trabajamos" className="bg-ink pb-24 text-white md:pb-32">
      <Container>
        <div className="border-t border-white/8 pt-24 md:pt-32">
          <SectionTitle
            eyebrow="Cómo trabajamos · Illarium"
            tone="light"
            sub="Illarium implanta Solaris con usted o con su consultora. Cada pack se adapta a sus documentos y a sus reglas."
          >
            Cuatro pasos, con{' '}
            <Evidence italic onDark>
              sus
            </Evidence>{' '}
            documentos.
          </SectionTitle>
          <div className="relative mt-16">
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[19px] w-px bg-white/12 md:top-[19px] md:right-[calc(25%-24px)] md:bottom-auto md:left-[19px] md:h-px md:w-auto"
            />
            <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
              {STEPS.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.title}
                  delay={i * 80}
                  className="relative flex gap-5 md:flex-col"
                >
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-ink font-mono text-[13px] text-solar ring-1 ring-solar/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/60">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              size="lg"
              variant="ghost-dark"
              onClick={() => requestDemo('como-trabajamos', 'aliado')}
            >
              Implantar Solaris con Illarium
            </Button>
            <p className="text-[14px] text-white/60">Para consultoras y socios de canal.</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
