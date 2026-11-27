import { CalendarX, PenOff, ScanLine } from 'lucide-react'
import { THESIS_CARDS } from '../data/content'
import { Container, Evidence, Reveal, SectionTitle } from './ui'

const ICONS = { firma: PenOff, caducado: CalendarX, escaneo: ScanLine }

export function Thesis() {
  return (
    <section id="tesis" className="bg-paper py-24 md:py-32">
      <Container>
        <SectionTitle eyebrow="El problema">
          El pedido está bien.{' '}
          <Evidence italic giro>
            El fallo, en otro documento.
          </Evidence>
        </SectionTitle>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {THESIS_CARDS.map((c, i) => {
            const Icon = ICONS[c.icon]
            return (
              <Reveal
                key={c.title}
                delay={i * 80}
                className="rounded-2xl bg-white p-7 ring-1 ring-ink/6"
              >
                <Icon className="size-6 text-ink/70" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="mt-10 text-[19px] font-semibold tracking-[-0.01em]">{c.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink/65">{c.body}</p>
              </Reveal>
            )
          })}
        </div>
        <Reveal className="mt-12 max-w-[640px] text-[19px] leading-relaxed text-ink/75">
          Con un <span className="font-serif italic">contrato</span> del proceso, cada norma es una
          regla que el código comprueba en cada expediente, con su página al lado. Y nada sale sin
          la firma de quien debe darla.
        </Reveal>
      </Container>
    </section>
  )
}
