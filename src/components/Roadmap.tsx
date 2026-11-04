import { ROADMAP, ROADMAP_UPDATED } from '../data/content'
import { Container, Evidence, Reveal, SectionTitle, cx } from './ui'

const TONES = {
  hoy: 'bg-salvia text-salvia-ink',
  siguiente: 'bg-solar-soft text-solar-ink',
  vision: 'bg-lavanda text-lavanda-ink',
}

/** Qué existe hoy, qué viene para el piloto y qué es hipótesis (ADR-0009). */
export function Roadmap() {
  return (
    <section id="vision" className="scroll-mt-10 border-t border-ink/6 bg-sheet py-24 md:py-32">
      <Container>
        <SectionTitle
          eyebrow="Hoy · Siguiente · Visión"
          sub="Separamos lo que ya funciona de lo que viene y de lo que todavía es una hipótesis."
        >
          Lo que hay, lo que viene y lo que <Evidence italic>imaginamos</Evidence>.
        </SectionTitle>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {ROADMAP.map((col, i) => (
            <Reveal
              key={col.id}
              delay={i * 80}
              className={cx(
                'flex flex-col rounded-3xl p-7 md:p-8',
                // La visión se dibuja con borde discontinuo: aún no es producto.
                col.id === 'vision'
                  ? 'border border-dashed border-ink/25'
                  : 'bg-white ring-1 ring-ink/6',
              )}
            >
              <h3>
                <span
                  className={cx(
                    'inline-block rounded-full px-3 py-1 font-mono text-[12px] tracking-[0.04em]',
                    TONES[col.id],
                  )}
                >
                  {col.id === 'vision' ? 'Visión · hipótesis' : col.label}
                </span>
              </h3>
              <p className="mt-3 text-[13.5px] text-ink/60">{col.note}</p>
              <ul className="mt-6 space-y-3">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink/80">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] size-1.5 shrink-0 rounded-full bg-ink/30"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 font-mono text-[12px] text-ink/60">Actualizado: {ROADMAP_UPDATED}</p>
      </Container>
    </section>
  )
}
