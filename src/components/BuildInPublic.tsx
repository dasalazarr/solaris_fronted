import { ArrowUpRight } from 'lucide-react'
import { DIARY } from '../data/content'
import { Container, Evidence, Reveal, SectionTitle } from './ui'

const DIARY_URL = 'https://dasalazarr.com/diario'

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function BuildInPublic() {
  return (
    <section id="diario" className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle
            eyebrow="Construcción en público"
            sub="Decisiones, errores y avances, contados en el diario mientras ocurren."
          >
            Lo construimos <Evidence italic>en público</Evidence>.
          </SectionTitle>
          <a
            href={DIARY_URL}
            className="inline-flex shrink-0 items-center gap-1.5 text-[15px] font-medium text-solar-ink underline-offset-4 hover:underline"
          >
            Leer el diario completo <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {DIARY.map((d, i) => (
            <Reveal key={d.title} delay={i * 80}>
              <a
                href={DIARY_URL}
                className="group flex h-full flex-col rounded-2xl bg-white p-7 ring-1 ring-ink/6 transition-shadow duration-180 hover:shadow-[0_12px_40px_-16px_rgba(13,15,20,.18)]"
              >
                <time dateTime={d.date} className="font-mono text-[12px] text-ink/50">
                  {formatDate(d.date)}
                </time>
                <h3 className="mt-6 text-[20px] leading-snug font-semibold tracking-[-0.01em]">
                  {d.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/62">{d.line}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-[13.5px] text-solar-ink">
                  Leer entrada
                  <ArrowUpRight className="size-3.5 transition-transform duration-180 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
