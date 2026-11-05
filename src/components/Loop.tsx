'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ONTOLOGY_PACKS } from '../data/content'
import type { OntologyPackId } from '../data/content'
import { track } from '../lib/analytics'
import { usePrefersReducedMotion } from '../lib/hooks'
import { Container, Evidence, SectionTitle, cx } from './ui'

/**
 * «Cómo funciona»: el bucle con la primitiva de la ontología bajo cada paso, en
 * Compras o Jurídico. Diagrama ligado al scroll: un punto solar recorre la línea
 * y enciende cada nodo al llegar. Con movimiento reducido, todos encendidos.
 */
export function Loop() {
  const reduced = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [progress, setProgress] = useState(0)
  const [packId, setPackId] = useState<OntologyPackId>('compras')
  const pack = ONTOLOGY_PACKS.find((x) => x.id === packId) ?? ONTOLOGY_PACKS[0]

  const choose = (id: OntologyPackId) => {
    if (id === packId) return
    setPackId(id)
    track('ontologia_pack', { pack: id })
  }

  // Pestañas WAI-ARIA: flechas, Inicio y Fin mueven el foco y seleccionan.
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = ONTOLOGY_PACKS.length - 1
    const next =
      e.key === 'ArrowRight'
        ? i === last
          ? 0
          : i + 1
        : e.key === 'ArrowLeft'
          ? i === 0
            ? last
            : i - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1
    if (next < 0) return
    e.preventDefault()
    choose(ONTOLOGY_PACKS[next].id)
    tabRefs.current[next]?.focus()
  }

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = trackRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the track's top hits 80 % of the viewport, 1 when its bottom hits 40 %.
      const start = vh * 0.8
      const end = vh * 0.4
      const total = r.height + (start - end)
      const p = (start - r.top) / total
      setProgress(Math.max(0, Math.min(1, p)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  const p = reduced ? 1 : progress
  const n = pack.nodes.length
  const litCount = reduced ? n : Math.floor(p * (n - 1) + 0.15) + (p > 0.02 ? 1 : 0)

  return (
    <section id="producto" className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <Container>
        <SectionTitle
          eyebrow="La ontología de procesos"
          tone="light"
          sub="Siete piezas conectadas: Proceso, Objeto, Relación, Evidencia, Regla, Acción y Revisión. La IA redacta y explica, el código evalúa las reglas y las personas deciden. El motor es el mismo en cada sector; cada proceso define sus tipos."
        >
          Cómo{' '}
          <Evidence italic onDark>
            funciona
          </Evidence>
          .
        </SectionTitle>

        <div
          role="tablist"
          aria-label="Proceso de ejemplo"
          className="mt-10 inline-flex rounded-full bg-ink-2 p-1 ring-1 ring-white/10"
        >
          {ONTOLOGY_PACKS.map((x, i) => {
            const selected = x.id === packId
            return (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`ontologia-tab-${x.id}`}
                aria-selected={selected}
                aria-controls="ontologia-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(x.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cx(
                  'rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors duration-180',
                  selected ? 'bg-solar text-ink' : 'text-white/70 hover:text-white',
                )}
              >
                {x.label}
              </button>
            )
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          Ejemplo: {pack.label}
        </p>

        <div
          ref={trackRef}
          id="ontologia-panel"
          role="tabpanel"
          aria-labelledby={`ontologia-tab-${pack.id}`}
          className="relative mt-12 md:mt-14"
        >
          {/* Line: horizontal on desktop, vertical on mobile */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[15px] w-px bg-white/12 lg:top-[15px] lg:right-[calc(100%/6-28px)] lg:bottom-auto lg:left-[15px] lg:h-px lg:w-auto"
          >
            <div
              className="absolute top-0 left-0 w-px bg-solar lg:h-px lg:w-[var(--p)] max-lg:h-[var(--p)]"
              style={{ ['--p' as string]: `${p * 100}%` }}
            />
            <div
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-solar shadow-[0_0_16px_4px_rgba(242,181,68,.6)] max-lg:left-0 max-lg:top-[var(--p)] lg:top-0 lg:left-[var(--p)]"
              style={{
                ['--p' as string]: `${p * 100}%`,
                opacity: p > 0 && p < 1 ? 1 : 0,
              }}
            />
          </div>

          <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-4">
            {pack.nodes.map((node, i) => {
              const lit = i < litCount
              return (
                <li key={node.step} className="flex gap-5 lg:flex-col lg:gap-5">
                  <span
                    className={cx(
                      'relative z-10 grid size-[31px] shrink-0 place-items-center rounded-full font-mono text-[11px] transition-[background-color,color,box-shadow] duration-300',
                      lit
                        ? 'bg-solar text-ink shadow-[0_0_0_6px_rgba(242,181,68,.14)]'
                        : 'bg-ink-2 text-white/50 ring-1 ring-white/15',
                    )}
                  >
                    {i + 1}
                  </span>
                  <div
                    className={cx(
                      // Sin opacidad en la tarjeta apagada: el texto debe seguir pasando AA (4,5:1).
                      'flex-1 rounded-xl p-4 ring-1 transition-[background-color,box-shadow] duration-300',
                      lit ? 'bg-ink-2 ring-solar/35' : 'bg-ink-2/60 ring-white/8',
                    )}
                  >
                    <p className="text-[16px] font-semibold">{node.step}</p>
                    <p
                      className={cx(
                        'mt-1 font-mono text-[10.5px] leading-snug',
                        lit ? 'text-solar' : 'text-white/50',
                      )}
                    >
                      {node.code}
                    </p>
                    <p
                      className={cx(
                        'mt-3 text-[13.5px] leading-snug text-white/70',
                        node.step === 'Cita' && 'font-serif text-[14.5px] italic',
                      )}
                    >
                      {node.example}
                    </p>
                    <dl className="mt-4 space-y-2 border-t border-white/8 pt-3">
                      {node.primitives.map((pr) => (
                        <div key={pr.name}>
                          <dt className="font-mono text-[10.5px] tracking-[0.08em] text-lavanda uppercase">
                            {pr.name}
                          </dt>
                          <dd className="text-[12.5px] leading-snug text-white/70">{pr.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}
