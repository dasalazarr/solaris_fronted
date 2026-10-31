import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { AlertTriangle, Check, CircleCheck, OctagonX, RotateCcw, X } from 'lucide-react'
import { DEMO_GAPS, DEMO_LOG_SEED, DEMO_QA } from '../data/content'
import type { Gap } from '../data/content'
import { track } from '../lib/analytics'
import { EvidenceQuote, ProductWindow, WithCites } from './ProductWindow'
import { Container, Evidence, SectionTitle, cx } from './ui'

const TABS = ['Preguntar', 'Huecos', 'Revisar'] as const
type Tab = (typeof TABS)[number]

function nowHHMM() {
  return new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* ---------- Preguntar ---------- */

function AskTab() {
  const [qi, setQi] = useState<number | null>(0)
  const [cite, setCite] = useState<number | null>(1)
  const qa = qi === null ? null : DEMO_QA[qi]
  const active = qa?.citations.find((c) => c.n === cite) ?? null

  return (
    <div className="flex min-h-[460px] flex-col lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col p-5 md:p-7">
        <p className="font-mono text-[10.5px] tracking-[0.08em] text-ink/45 uppercase">
          Preguntas sugeridas
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_QA.map((q, i) => (
            <button
              key={q.question}
              type="button"
              aria-pressed={qi === i}
              onClick={() => {
                setQi(i)
                setCite(1)
                track('demo_pregunta', { index: i })
              }}
              className={cx(
                'rounded-full px-3.5 py-2 text-left text-[13px] transition-colors duration-180',
                qi === i
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink/75 ring-1 ring-ink/10 hover:ring-ink/25',
              )}
            >
              {q.question}
            </button>
          ))}
        </div>

        {qa && (
          <div className="mt-6 flex gap-3" aria-live="polite">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-solar-soft">
              <span className="size-3 rounded-full bg-solar" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] leading-[1.65]">
                <WithCites text={qa.answer} active={cite} onCite={setCite} />
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {qa.citations.map((c) => (
                  <button
                    type="button"
                    key={c.n}
                    onClick={() => setCite(c.n)}
                    aria-pressed={cite === c.n}
                    className={cx(
                      'rounded-md border px-2 py-1 text-left font-mono text-[10.5px] transition-colors',
                      cite === c.n
                        ? 'border-solar bg-solar-soft text-solar-ink'
                        : 'border-ink/10 bg-white text-ink/60 hover:border-ink/25',
                    )}
                  >
                    [{c.n}] {c.doc} · pág. {c.page} · {c.section}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <aside
        className="border-t border-ink/8 bg-white p-5 md:p-6 lg:w-[360px] lg:shrink-0 lg:border-t-0 lg:border-l"
        aria-label="Panel de evidencia"
      >
        {active ? (
          <>
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10.5px] tracking-[0.08em] text-ink/50 uppercase">
                Evidencia · cita {active.n}
              </p>
              <button
                type="button"
                onClick={() => setCite(null)}
                className="grid size-6 place-items-center rounded text-ink/40 hover:bg-ink/5"
                aria-label="Cerrar evidencia"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <p className="mt-3 text-[14px] font-medium">{active.doc}</p>
            <p className="font-mono text-[11px] text-ink/50">
              pág. {active.page} · {active.section}
            </p>
            <div className="mt-4 rounded-lg bg-sheet p-4 ring-1 ring-ink/6">
              <EvidenceQuote key={`${qi}-${active.n}`} quote={active.quote} mark={active.mark} />
            </div>
          </>
        ) : (
          <p className="text-[13.5px] text-ink/50">
            Pulse una cita para ver el párrafo exacto del documento.
          </p>
        )}
      </aside>
    </div>
  )
}

/* ---------- Huecos ---------- */

const SEVERITY: Record<Gap['severity'], { label: string; cls: string; Icon: typeof OctagonX }> = {
  bloqueo: {
    label: 'Bloqueo',
    cls: 'bg-arcilla text-arcilla-ink',
    Icon: OctagonX,
  },
  aviso: {
    label: 'Aviso',
    cls: 'bg-solar-soft text-solar-ink',
    Icon: AlertTriangle,
  },
  cumplido: {
    label: 'Cumplido',
    cls: 'bg-salvia text-salvia-ink',
    Icon: CircleCheck,
  },
}

function GapsTab({ approved, onReview }: { approved: boolean; onReview: () => void }) {
  return (
    <div className="min-h-[460px] p-5 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[15px] font-semibold">Huecos detectados · Compras</p>
        <p className="font-mono text-[11px] text-ink/45">
          4 reglas evaluadas en 14 pedidos y 22 facturas
        </p>
      </div>
      <ul className="mt-5 divide-y divide-ink/8 rounded-xl bg-white ring-1 ring-ink/8">
        {DEMO_GAPS.map((g) => {
          const resolved = approved && g.id === 'PC-0412'
          const sev = SEVERITY[resolved ? 'cumplido' : g.severity]
          return (
            <li key={g.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <span
                className={cx(
                  'inline-flex w-fit items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10.5px]',
                  sev.cls,
                )}
              >
                <sev.Icon className="size-3" /> {sev.label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px]">
                  <span className="font-mono text-[12px] text-ink/50">{g.id}</span> ·{' '}
                  {resolved ? 'Aprobado con tres ofertas' : g.title}
                </p>
                <p className="mt-0.5 font-mono text-[10.5px] text-ink/45">
                  {g.rule} · {g.ref}
                </p>
              </div>
              {g.id === 'PC-0412' && !resolved && (
                <button
                  type="button"
                  onClick={onReview}
                  className="w-fit rounded-full bg-ink px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-ink-3"
                >
                  Revisar
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---------- Revisar ---------- */

function ReviewTab({
  status,
  log,
  onDecide,
  onReset,
}: {
  status: 'pendiente' | 'aprobado' | 'rechazado'
  log: { time: string; text: string; fresh?: boolean }[]
  onDecide: (d: 'aprobado' | 'rechazado') => void
  onReset: () => void
}) {
  return (
    <div className="grid min-h-[460px] gap-0 lg:grid-cols-[1fr_340px]">
      <div className="p-5 md:p-7">
        <div className="max-w-[520px] rounded-xl bg-white p-5 ring-1 ring-ink/8 md:p-6">
          <div className="flex items-center justify-between">
            <span
              className={cx(
                'rounded px-2 py-0.5 font-mono text-[10.5px] transition-colors',
                status === 'pendiente' && 'bg-arcilla text-arcilla-ink',
                status === 'aprobado' && 'bg-salvia text-salvia-ink',
                status === 'rechazado' && 'bg-ink/8 text-ink/60',
              )}
            >
              {status === 'pendiente'
                ? 'Requiere aprobación'
                : status === 'aprobado'
                  ? 'Aprobado'
                  : 'Rechazado'}
            </span>
            <span className="font-mono text-[11px] text-ink/45">PC-0412</span>
          </div>
          <p className="mt-4 text-[16px] font-medium">Envases metálicos · Metalúrgica Duero</p>
          <p className="mt-1 text-[26px] font-semibold tracking-[-0.02em]">18.400 €</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
            <dt className="text-ink/50">Regla</dt>
            <dd className="font-mono text-[12px]">R-COMP-07</dd>
            <dt className="text-ink/50">Ofertas</dt>
            <dd>3 de 3 (tercera añadida hoy)</dd>
            <dt className="text-ink/50">Aprobador</dt>
            <dd>Dirección Financiera</dd>
            <dt className="text-ink/50">Fuente</dt>
            <dd className="font-mono text-[12px]">Pol. compras · pág. 4 · §3.2</dd>
          </dl>
          <div className="mt-6 flex gap-2">
            {status === 'pendiente' ? (
              <>
                <button
                  type="button"
                  onClick={() => onDecide('aprobado')}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-ink text-[14px] font-medium text-white hover:bg-ink-3"
                >
                  <Check className="size-4" /> Aprobar
                </button>
                <button
                  type="button"
                  onClick={() => onDecide('rechazado')}
                  className="inline-flex h-10 items-center rounded-full px-5 text-[14px] text-ink/70 ring-1 ring-ink/12 hover:bg-ink/5"
                >
                  Rechazar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13.5px] text-ink/65 ring-1 ring-ink/12 hover:bg-ink/5"
              >
                <RotateCcw className="size-3.5" /> Reiniciar demostración
              </button>
            )}
          </div>
        </div>
      </div>
      <aside
        className="border-t border-ink/8 bg-white p-5 md:p-6 lg:border-t-0 lg:border-l"
        aria-label="Registro"
      >
        <p className="font-mono text-[10.5px] tracking-[0.08em] text-ink/50 uppercase">Registro</p>
        <ol className="mt-4 space-y-3" aria-live="polite">
          {log.map((l, i) => (
            <li
              key={`${l.time}-${i}-${l.text}`}
              className={cx(
                'flex gap-3 rounded-md text-[12.5px] leading-snug',
                l.fresh && 'animate-[word-in_500ms_var(--ease-solar)] bg-solar-soft/60 p-2 -m-2',
              )}
            >
              <span className="shrink-0 font-mono text-[11px] text-ink/45">{l.time}</span>
              <span className="text-ink/75">{l.text}</span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  )
}

/* ---------- Section ---------- */

export function Demo({ standalone = false }: { standalone?: boolean }) {
  const [tab, setTab] = useState<Tab>('Preguntar')
  const [status, setStatus] = useState<'pendiente' | 'aprobado' | 'rechazado'>('pendiente')
  const [log, setLog] = useState<{ time: string; text: string; fresh?: boolean }[]>(DEMO_LOG_SEED)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (t: Tab) => {
    setTab(t)
    track('demo_pestana', { tab: t })
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.indexOf(tab)
    let next = i
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    else return
    e.preventDefault()
    select(TABS[next])
    tabRefs.current[next]?.focus()
  }

  const decide = (d: 'aprobado' | 'rechazado') => {
    setStatus(d)
    if (d === 'aprobado') track('demo_aprobacion')
    setLog((prev) => [
      {
        time: nowHHMM(),
        text:
          d === 'aprobado'
            ? 'PC-0412 aprobado por usted · evidencia enlazada'
            : 'PC-0412 rechazado por usted · motivo pendiente',
        fresh: true,
      },
      ...prev.map((l) => ({ ...l, fresh: false })),
    ])
  }

  const reset = () => {
    setStatus('pendiente')
    setLog(DEMO_LOG_SEED)
  }

  return (
    <section
      id="demo"
      className={cx('bg-paper', standalone ? 'min-h-screen py-16' : 'py-24 md:py-32')}
    >
      <Container>
        <SectionTitle
          eyebrow="Demostración interactiva"
          sub="Empresa ficticia, datos de muestra. Pruebe a preguntar, revisar los huecos y aprobar un pedido."
        >
          Véalo en un proceso que <Evidence italic>todos</Evidence> tienen.
        </SectionTitle>

        <div className="mt-12">
          <div
            role="tablist"
            aria-label="Pantallas de la demostración"
            onKeyDown={onKey}
            className="no-scrollbar mb-4 flex gap-1 overflow-x-auto"
          >
            {TABS.map((t, i) => (
              <button
                key={t}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`demo-tab-${t}`}
                aria-selected={tab === t}
                aria-controls={`demo-panel-${t}`}
                tabIndex={tab === t ? 0 : -1}
                onClick={() => select(t)}
                className={cx(
                  'shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-180',
                  tab === t ? 'bg-ink text-white' : 'text-ink/60 hover:bg-ink/5 hover:text-ink',
                )}
              >
                {t}
                {t === 'Huecos' && (
                  <span
                    className={cx(
                      'ml-2 rounded px-1.5 py-px font-mono text-[10.5px]',
                      tab === t ? 'bg-white/15' : 'bg-arcilla text-arcilla-ink',
                    )}
                  >
                    {status === 'aprobado' ? 1 : 2}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <ProductWindow
              active={tab}
              className="ring-ink/10 shadow-[0_30px_80px_-30px_rgba(13,15,20,.35)]"
            >
              <div
                role="tabpanel"
                id={`demo-panel-${tab}`}
                aria-labelledby={`demo-tab-${tab}`}
                tabIndex={0}
              >
                {tab === 'Preguntar' && <AskTab />}
                {tab === 'Huecos' && (
                  <GapsTab approved={status === 'aprobado'} onReview={() => select('Revisar')} />
                )}
                {tab === 'Revisar' && (
                  <ReviewTab status={status} log={log} onDecide={decide} onReset={reset} />
                )}
              </div>
            </ProductWindow>
            <p className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-ink px-3 py-1 font-mono text-[10.5px] text-white/80 shadow-lg">
              Demostración con datos de muestra
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
