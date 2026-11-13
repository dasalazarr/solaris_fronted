'use client'

import { useEffect, useRef, useState } from 'react'
import type { FocusEvent, PointerEvent } from 'react'
import { Pause, Play, Sparkles, X } from 'lucide-react'
import { DEMO_QA } from '../data/content'
import { track } from '../lib/analytics'
import { DEMO_APP_ID, DEMO_EVIDENCE_ID, DEMO_SIDE_BY_SIDE, openDemo } from '../lib/demoIntent'
import type { DemoIntent } from '../lib/demoIntent'
import { useInView, useMediaQuery, usePageVisible, usePrefersReducedMotion } from '../lib/hooks'
import { EvidenceQuote, ProductWindow, WithCites } from './ProductWindow'
import { cx } from './ui'

const LOOP_MS = 9000
const QA = DEMO_QA[0]
const DEMO_HREF = `#${DEMO_APP_ID}`
/** La respuesta sin los marcadores [n], para quien no ve la animación. */
const ANSWER_PLAIN = QA.answer.replace(/\s*\[\d+\]/g, '')

/**
 * Looping reproduction of the "Preguntar" screen: the question types itself,
 * the answer appears with citations and citation 1 opens the evidence panel.
 * Paused off-screen, with the tab hidden, by the user, or with reduced motion.
 *
 * Las citas y «Abrir en Revisar» son enlaces: llevan a la demostración en ese
 * mismo estado. Con el puntero encima o el foco dentro, el bucle llega al
 * final y espera, para que nada desaparezca bajo el cursor.
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
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const held = hovered || focused
  const startRef = useRef(0)
  // Una cita lleva a su párrafo: al lado de la respuesta o, en estrecho, debajo de ella.
  const citeHref = useMediaQuery(DEMO_SIDE_BY_SIDE, true) ? DEMO_HREF : `#${DEMO_EVIDENCE_ID}`
  const running = !reduced && !paused && inView && visible

  useEffect(() => {
    if (!running) return
    startRef.current = performance.now() - t
    const id = window.setInterval(() => {
      const elapsed = performance.now() - startRef.current
      setT(held ? Math.min(elapsed, LOOP_MS - 1) : elapsed % LOOP_MS)
    }, 60)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, held])

  // Solo el ratón «se queda encima»: en táctil el toque ya actúa sobre lo que se ve.
  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') setHovered(true)
  }
  // Con el teclado no se espera a la animación: el enlace enfocado tiene que verse ya.
  const onFocus = () => {
    setFocused(true)
    setT(LOOP_MS - 1)
    startRef.current = performance.now() - (LOOP_MS - 1)
  }
  const onBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
  }
  // El enlace navega solo, también sin JavaScript y con «atrás» de vuelta al hero.
  // Aquí solo se pide el estado de la demo y que esta vez la página baje en vez de saltar:
  // mover el scroll a mano junto a `history.pushState` lo corta el enrutador de Next.
  const go = (intent: DemoIntent, target: string) => () => {
    track('hero_captura', { target })
    openDemo(intent)
    if (reduced) return
    const root = document.documentElement
    const restore = () => {
      root.style.scrollBehavior = ''
      window.removeEventListener('scrollend', restore)
      window.clearTimeout(fallback)
    }
    const fallback = window.setTimeout(restore, 2000)
    root.style.scrollBehavior = 'smooth'
    window.addEventListener('scrollend', restore)
  }

  const time = reduced ? LOOP_MS - 1 : t
  const typed = Math.min(QA.question.length, Math.floor(((time - 300) / 1600) * QA.question.length))
  const thinking = time > 2100 && time < 2800
  const showAnswer = time >= 2800
  const answerChars = showAnswer
    ? Math.min(QA.answer.length, Math.floor(((time - 2800) / 1300) * QA.answer.length))
    : 0
  const chipsOn = answerChars >= QA.answer.length
  const panelOpen = time >= 4900
  const lit = time >= 5500
  const actionOn = time >= 6300

  return (
    <div ref={ref} className="relative">
      <div
        role="group"
        aria-label="Vista previa de Solaris con datos de muestra"
        onPointerEnter={onPointerEnter}
        onPointerLeave={() => setHovered(false)}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {/* La animación se oculta a los lectores de pantalla; esto dice lo mismo de una vez. */}
        <p className="sr-only">
          Pregunta: {QA.question} Respuesta: {ANSWER_PLAIN} La cita 1 abre el párrafo exacto de la
          página {QA.citations[0].page} de la política. Las citas y la aprobación se pueden abrir en
          la demostración.
        </p>
        <ProductWindow className="text-left" active="Preguntar">
          <div className="flex h-[480px] md:h-[500px]">
            <div className="flex min-w-0 flex-1 flex-col p-5 md:p-7">
              {/* La pregunta completa e invisible reserva el tamaño final: escribir no mueve el layout (CLS). */}
              <div
                aria-hidden="true"
                className="relative ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[14px] text-white"
              >
                <span className="invisible">{QA.question}</span>
                <span className="absolute inset-x-4 top-2.5">
                  <span className={cx(typed < QA.question.length && !reduced && 'caret')}>
                    {QA.question.slice(0, Math.max(0, typed))}
                  </span>
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-solar-soft"
                >
                  <span className="size-3 rounded-full bg-solar" />
                </span>
                <div className="min-w-0 flex-1">
                  {thinking && (
                    <p
                      aria-hidden="true"
                      className="flex items-center gap-2 pt-1 font-mono text-[12px] text-ink/60"
                    >
                      <Sparkles className="size-3.5" /> Buscando en 5 documentos…
                    </p>
                  )}
                  {showAnswer && (
                    <p aria-hidden="true" className="text-[14.5px] leading-[1.65] text-ink/90">
                      <WithCites
                        text={QA.answer.slice(0, answerChars)}
                        active={panelOpen ? 1 : null}
                        href={citeHref}
                        onCite={(n) => go({ tab: 'Preguntar', cite: n }, `cita-${n}`)()}
                      />
                    </p>
                  )}
                  {/* Siempre en el documento: el teclado llega a las citas en cualquier punto del bucle. */}
                  <div
                    className={cx(
                      'mt-4 mb-3 flex flex-wrap gap-2 transition-opacity duration-500',
                      chipsOn ? 'opacity-100' : 'pointer-events-none opacity-0',
                    )}
                  >
                    {QA.citations.map((c) => (
                      <a
                        key={c.n}
                        href={citeHref}
                        onClick={go({ tab: 'Preguntar', cite: c.n }, `cita-${c.n}`)}
                        aria-label={`Abrir la cita ${c.n} en la demostración: ${c.doc}, página ${c.page}, ${c.section}`}
                        className={cx(
                          'inline-flex min-h-6 items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10.5px] transition-colors',
                          panelOpen && c.n === 1
                            ? 'border-solar bg-solar-soft text-solar-ink'
                            : 'border-ink/10 bg-white text-ink/60 hover:border-ink/25',
                        )}
                      >
                        [{c.n}] {c.doc} · pág. {c.page} · {c.section}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ocupa su sitio desde el principio: aparecer no mueve el layout (CLS). */}
              <div
                className={cx(
                  'mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-lg bg-solar-soft px-3 py-2 text-[12.5px] leading-snug transition-opacity duration-500',
                  actionOn ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                <span>
                  <span className="font-mono text-[11.5px]">Regla R-03</span> · requiere aprobación
                  de Dirección financiera
                </span>
                <a
                  href={DEMO_HREF}
                  onClick={go({ tab: 'Revisar' }, 'revisar')}
                  aria-label="Abrir el pedido PC-0412 en Revisar, en la demostración"
                  className="inline-flex min-h-8 items-center rounded-full bg-solar px-3 py-1 text-[12px] sm:min-h-6 font-medium whitespace-nowrap transition-[filter] hover:brightness-95"
                >
                  Abrir en Revisar →
                </a>
              </div>

              <div
                aria-hidden="true"
                className="mt-3 hidden items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-[13px] text-ink/60 sm:flex"
              >
                Pregunta sobre tus documentos…
                <span className="ml-auto rounded-md bg-ink/5 px-2 py-0.5 font-mono text-[10.5px]">
                  ⏎
                </span>
              </div>
            </div>

            <div
              aria-hidden="true"
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
