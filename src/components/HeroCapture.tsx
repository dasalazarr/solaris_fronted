'use client'

import { useEffect, useState } from 'react'
import { Pause, Play, Sparkles, X } from 'lucide-react'
import { DEMO_QA } from '../data/content'
import { useInView, usePageVisible, usePrefersReducedMotion } from '../lib/hooks'
import { EvidenceQuote, ProductWindow, WithCites } from './ProductWindow'
import { cx } from './ui'

const LOOP_MS = 9000
const QA = DEMO_QA[0]

/**
 * Looping reproduction of the "Preguntar" screen: the question types itself,
 * the answer appears with citations and citation 1 opens the evidence panel.
 * Paused off-screen, with the tab hidden, by the user, or with reduced motion.
 */
export function HeroCapture() {
  const reduced = usePrefersReducedMotion()
  const visible = usePageVisible()
  const [ref, inView] = useInView<HTMLDivElement>({
    threshold: 0.15,
    once: false,
  })
  const [paused, setPaused] = useState(false)
  const [t, setT] = useState(LOOP_MS - 1)
  const running = !reduced && !paused && inView && visible

  useEffect(() => {
    if (!running) return
    const start = performance.now() - (t % LOOP_MS)
    const id = window.setInterval(() => {
      setT((performance.now() - start) % LOOP_MS)
    }, 60)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const time = reduced ? LOOP_MS - 1 : t
  const typed = Math.min(QA.question.length, Math.floor(((time - 300) / 1600) * QA.question.length))
  const thinking = time > 2100 && time < 2800
  const showAnswer = time >= 2800
  const answerChars = showAnswer
    ? Math.min(QA.answer.length, Math.floor(((time - 2800) / 1300) * QA.answer.length))
    : 0
  const panelOpen = time >= 4900
  const lit = time >= 5500

  return (
    <div ref={ref} className="relative">
      <div
        role="img"
        aria-label="Captura de Solaris: la pregunta «¿Por qué está retenido el pedido PC-0412?» recibe una respuesta con dos citas, a la Política de compras y a la solicitud del pedido; la cita 1 abre el panel de evidencia con el párrafo de la página 4 resaltado."
      >
        <ProductWindow className="text-left" active="Preguntar">
          <div aria-hidden="true" className="flex h-[440px] md:h-[500px]">
            <div className="flex min-w-0 flex-1 flex-col p-5 md:p-7">
              {/* La pregunta completa e invisible reserva el tamaño final: escribir no mueve el layout (CLS). */}
              <div className="relative ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[14px] text-white">
                <span className="invisible">{QA.question}</span>
                <span className="absolute inset-x-4 top-2.5">
                  <span className={cx(typed < QA.question.length && !reduced && 'caret')}>
                    {QA.question.slice(0, Math.max(0, typed))}
                  </span>
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-solar-soft">
                  <span className="size-3 rounded-full bg-solar" />
                </span>
                <div className="min-w-0 flex-1">
                  {thinking && (
                    <p className="flex items-center gap-2 pt-1 font-mono text-[12px] text-ink/60">
                      <Sparkles className="size-3.5" /> Buscando en 4 documentos…
                    </p>
                  )}
                  {showAnswer && (
                    <>
                      <p className="text-[14.5px] leading-[1.65] text-ink/90">
                        <WithCites
                          text={QA.answer.slice(0, answerChars)}
                          active={panelOpen ? 1 : null}
                        />
                      </p>
                      <div
                        className={cx(
                          'mt-4 flex flex-wrap gap-2 transition-opacity duration-500',
                          answerChars >= QA.answer.length ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        {QA.citations.map((c) => (
                          <span
                            key={c.n}
                            className={cx(
                              'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10.5px] transition-colors',
                              panelOpen && c.n === 1
                                ? 'border-solar bg-solar-soft text-solar-ink'
                                : 'border-ink/10 bg-white text-ink/60',
                            )}
                          >
                            [{c.n}] {c.doc} · pág. {c.page} · {c.section}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-[13px] text-ink/60">
                Pregunte sobre sus documentos…
                <span className="ml-auto rounded-md bg-ink/5 px-2 py-0.5 font-mono text-[10.5px]">
                  ⏎
                </span>
              </div>
            </div>

            <div
              className={cx(
                'hidden shrink-0 overflow-hidden border-l border-ink/8 bg-white transition-[width,opacity] duration-500 ease-[var(--ease-solar)] sm:block',
                panelOpen ? 'w-[300px] opacity-100 lg:w-[360px]' : 'w-0 opacity-0',
              )}
            >
              <div className="w-[300px] p-5 lg:w-[360px]">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10.5px] tracking-[0.08em] text-ink/60 uppercase">
                    Evidencia · cita 1
                  </p>
                  <X className="size-3.5 text-ink/60" />
                </div>
                <p className="mt-3 text-[13.5px] font-medium">{QA.citations[0].doc}</p>
                <p className="font-mono text-[11px] text-ink/60">
                  pág. {QA.citations[0].page} · {QA.citations[0].section}
                </p>
                <div className="mt-4 rounded-lg bg-sheet p-4 ring-1 ring-ink/6">
                  <p className="mb-2 font-mono text-[10px] text-ink/60">
                    2 · Autorizaciones previas
                  </p>
                  <div className="mb-3 space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-ink/8" />
                    <div className="h-1.5 w-4/5 rounded bg-ink/8" />
                  </div>
                  <p className="mb-1.5 font-mono text-[10px] text-ink/60">2.1 · Umbrales</p>
                  <EvidenceQuote
                    quote={QA.citations[0].quote}
                    mark={QA.citations[0].mark}
                    lit={lit}
                    className="text-[13.5px]"
                  />
                  <div className="mt-3 space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-ink/8" />
                    <div className="h-1.5 w-2/3 rounded bg-ink/8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ProductWindow>
      </div>
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full bg-ink/80 text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-ink"
          aria-label={paused ? 'Reanudar animación' : 'Pausar animación'}
        >
          {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
        </button>
      )}
    </div>
  )
}
