import { useEffect, useRef, useState } from 'react'
import { LOOP_NODES } from '../data/content'
import { usePrefersReducedMotion } from '../lib/hooks'
import { Container, Evidence, SectionTitle, cx } from './ui'

/**
 * Scroll-scrubbed diagram: a solar dot travels the line and lights each node as
 * it arrives. With reduced motion every node is shown lit.
 */
export function Loop() {
  const reduced = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

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
  const n = LOOP_NODES.length
  const litCount = reduced ? n : Math.floor(p * (n - 1) + 0.15) + (p > 0.02 ? 1 : 0)

  return (
    <section id="producto" className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <Container>
        <SectionTitle eyebrow="El bucle · pack Compras" tone="light">
          De la pregunta a la{' '}
          <Evidence italic onDark>
            decisión
          </Evidence>
          , con registro.
        </SectionTitle>

        <div ref={trackRef} className="relative mt-16 md:mt-20">
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
            {LOOP_NODES.map((node, i) => {
              const lit = i < litCount
              return (
                <li key={node.step} className="flex gap-5 lg:flex-col lg:gap-5">
                  <span
                    className={cx(
                      'relative z-10 grid size-[31px] shrink-0 place-items-center rounded-full font-mono text-[11px] transition-[background-color,color,box-shadow] duration-300',
                      lit
                        ? 'bg-solar text-ink shadow-[0_0_0_6px_rgba(242,181,68,.14)]'
                        : 'bg-ink-2 text-white/45 ring-1 ring-white/15',
                    )}
                  >
                    {i + 1}
                  </span>
                  <div
                    className={cx(
                      'flex-1 rounded-xl p-4 ring-1 transition-[background-color,box-shadow,opacity] duration-300',
                      lit
                        ? 'bg-ink-2 opacity-100 ring-solar/35'
                        : 'bg-ink-2/60 opacity-55 ring-white/8',
                    )}
                  >
                    <p className="text-[16px] font-semibold">{node.step}</p>
                    <p
                      className={cx(
                        'mt-1 font-mono text-[10.5px] leading-snug',
                        lit ? 'text-solar' : 'text-white/40',
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
