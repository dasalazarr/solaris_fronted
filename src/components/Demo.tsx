'use client'

import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { AlertTriangle, ArrowUpRight, Check, CircleCheck, KeyRound, OctagonX, RotateCcw, X } from 'lucide-react'
import {
  DEMO_DRAFT,
  DEMO_GAPS,
  DEMO_LOG_SEED,
  DEMO_OBJECT,
  DEMO_PENDING_DATA,
  DEMO_QA,
  DEMO_REQUIRED_ROLE,
  DEMO_ROLES,
} from '../data/content'
import type { Gap } from '../data/content'
import { track } from '../lib/analytics'
import { useDemoRequest } from '../lib/demoRequest'
import { EvidenceQuote, ProductWindow, WithCites } from './ProductWindow'
import { Button, Container, Evidence, SectionTitle, cx } from './ui'

const TABS = ['Preguntar', 'Explorar', 'Huecos', 'Revisar'] as const
const OPEN_GAPS = DEMO_GAPS.filter((g) => g.severity !== 'cumplido').length
type Tab = (typeof TABS)[number]

function nowHHMM() {
  return new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* ---------- Preguntar ---------- */

function AskTab({ onReview }: { onReview: () => void }) {
  const [qi, setQi] = useState<number | null>(0)
  const [cite, setCite] = useState<number | null>(1)
  const qa = qi === null ? null : DEMO_QA[qi]
  const active = qa?.citations.find((c) => c.n === cite) ?? null

  return (
    <div className="flex min-h-[460px] flex-col lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col p-5 md:p-7">
        <p className="font-mono text-[10.5px] tracking-[0.08em] text-ink/60 uppercase">
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
              {qa.action && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-solar-soft px-3 py-2.5 text-[13px]">
                  <span>
                    <span className="font-mono text-[12px]">Regla {qa.action.rule}</span> ·{' '}
                    {qa.action.text}
                  </span>
                  {qa.action.review && (
                    <button
                      type="button"
                      onClick={onReview}
                      className="inline-flex items-center gap-1 rounded-full bg-solar px-3 py-1 text-[12.5px] font-medium hover:brightness-95"
                    >
                      Abrir en Revisar <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
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
              <p className="font-mono text-[10.5px] tracking-[0.08em] text-ink/60 uppercase">
                Evidencia · cita {active.n}
              </p>
              <button
                type="button"
                onClick={() => setCite(null)}
                className="grid size-6 place-items-center rounded text-ink/60 hover:bg-ink/5"
                aria-label="Cerrar evidencia"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <p className="mt-3 text-[14px] font-medium">{active.doc}</p>
            <p className="font-mono text-[11px] text-ink/60">
              pág. {active.page} · {active.section}
            </p>
            <div className="mt-4 rounded-lg bg-sheet p-4 ring-1 ring-ink/6">
              <EvidenceQuote key={`${qi}-${active.n}`} quote={active.quote} mark={active.mark} />
            </div>
          </>
        ) : (
          <p className="text-[13.5px] text-ink/60">
            Pulsa una cita para ver el párrafo exacto del documento.
          </p>
        )}
      </aside>
    </div>
  )
}

/* ---------- Explorar ---------- */

function ExploreTab() {
  return (
    <div className="min-h-[460px] p-5 md:p-7">
      <p className="font-mono text-[11px] text-ink/60">
        {DEMO_OBJECT.type} · {DEMO_OBJECT.id}
      </p>
      <p className="mt-1 text-[17px] font-semibold">{DEMO_OBJECT.title}</p>
      <p className="mt-1 text-[13.5px] text-ink/70">{DEMO_OBJECT.relation}</p>

      <ul className="mt-5 divide-y divide-ink/8 rounded-xl bg-white ring-1 ring-ink/8">
        {DEMO_OBJECT.attributes.map((a) => (
          <li key={a.label} className="grid gap-1 p-4 text-[13.5px] sm:grid-cols-[1fr_1fr_1fr] sm:gap-4">
            <span className="text-ink/60">{a.label}</span>
            <span className="font-medium">{a.value}</span>
            <span className="text-[12.5px] text-ink/70">
              {a.source} · {a.rule}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-mono text-[10.5px] tracking-[0.08em] text-ink/60 uppercase">
        Cruce con el contrato
      </p>
      <ul className="mt-3 flex flex-wrap gap-2 text-[13px]">
        {DEMO_OBJECT.crossCheck.map((c) => (
          <li key={c.rule} className="rounded-md bg-white px-3 py-1.5 ring-1 ring-ink/8">
            <span className="font-mono text-[12px]">{c.rule}</span> · {c.state}
          </li>
        ))}
      </ul>
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
  aprobacion: {
    label: 'Requiere aprobación',
    cls: 'bg-solar-soft text-solar-ink',
    Icon: AlertTriangle,
  },
  sin_evidencia: {
    label: 'Sin evidencia',
    cls: 'bg-niebla text-niebla-ink',
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
        <p className="font-mono text-[11px] text-ink/60">
          3 reglas evaluadas por el motor en 2 pedidos
        </p>
      </div>
      <ul className="mt-5 divide-y divide-ink/8 rounded-xl bg-white ring-1 ring-ink/8">
        {DEMO_GAPS.map((g) => {
          const isReview = g.id === 'PC-0412' && g.rule === 'R-03'
          const resolved = approved && isReview
          const sev = SEVERITY[resolved ? 'cumplido' : g.severity]
          return (
            <li
              key={`${g.id}-${g.rule}`}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
            >
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
                  <span className="font-mono text-[12px] text-ink/60">{g.id}</span> ·{' '}
                  {resolved ? 'Aprobado por Dirección financiera' : g.title}
                </p>
                <p className="mt-0.5 font-mono text-[10.5px] text-ink/60">
                  {g.rule} · {g.ref}
                </p>
              </div>
              {isReview && !resolved && (
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
      <p className="mt-4 rounded-lg bg-lavanda/50 p-3 text-[13px] leading-relaxed">
        <span className="font-medium">Dato por validar.</span> {DEMO_PENDING_DATA}
      </p>
    </div>
  )
}

/* ---------- Revisar ---------- */

function ReviewTab({
  status,
  log,
  role,
  draft,
  onRole,
  onDraft,
  onDecide,
  onReset,
}: {
  status: 'pendiente' | 'aprobado' | 'rechazado'
  log: { time: string; text: string; fresh?: boolean }[]
  role: string
  draft: string
  onRole: (role: string) => void
  onDraft: (draft: string) => void
  onDecide: (d: 'aprobado' | 'rechazado') => void
  onReset: () => void
}) {
  const canSign = role === DEMO_REQUIRED_ROLE
  return (
    <div className="grid min-h-[460px] gap-0 lg:grid-cols-[1fr_340px]">
      <div className="p-5 md:p-7">
        <div className="mb-4 flex max-w-[520px] flex-wrap items-center gap-2 rounded-lg bg-solar-soft/70 p-2.5 text-[13px] ring-1 ring-solar/40">
          <KeyRound className="size-3.5 text-solar-ink" aria-hidden="true" />
          <label htmlFor="demo-role" className="font-medium">
            Actuar como (rol simulado):
          </label>
          <select
            id="demo-role"
            value={role}
            disabled={status !== 'pendiente'}
            onChange={(e) => onRole(e.target.value)}
            className="max-w-full rounded-md bg-white px-2 py-1 ring-1 ring-ink/12"
          >
            {DEMO_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
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
            <span className="font-mono text-[11px] text-ink/60">PC-0412</span>
          </div>
          <p className="mt-4 text-[16px] font-medium">
            Válvulas DN80 INOX · Suministros Industriales del Norte
          </p>
          <p className="mt-1 text-[26px] font-semibold tracking-[-0.02em]">18.450,00 €</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
            <dt className="text-ink/60">Regla</dt>
            <dd className="font-mono text-[12px]">R-03</dd>
            <dt className="text-ink/60">Ofertas</dt>
            <dd>3 verificadas (R-02 conforme)</dd>
            <dt className="text-ink/60">Aprobador</dt>
            <dd>Dirección financiera</dd>
            <dt className="text-ink/60">Fuente</dt>
            <dd className="font-mono text-[12px]">Pol. compras v3.2 · pág. 4 · § 2.1</dd>
          </dl>
          <label htmlFor="demo-draft" className="mt-5 block text-[13px] font-medium">
            Borrador editable de la acción
          </label>
          <textarea
            id="demo-draft"
            rows={5}
            value={draft}
            readOnly={status !== 'pendiente'}
            onChange={(e) => onDraft(e.target.value)}
            className="mt-2 w-full rounded-lg bg-sheet p-3 font-mono text-[12px] leading-relaxed ring-1 ring-ink/10"
          />
          {status === 'pendiente' && !canSign && (
            <p id="demo-role-reason" role="status" className="mt-3 rounded-lg bg-arcilla p-3 text-[13px] text-arcilla-ink">
              La regla R-03 exige el rol «{DEMO_REQUIRED_ROLE}» para aprobar o rechazar. Rol activo: «{role}».
            </p>
          )}
          <div className="mt-6 flex gap-2">
            {status === 'pendiente' ? (
              <>
                <button
                  type="button"
                  onClick={() => onDecide('aprobado')}
                  disabled={!canSign}
                  aria-describedby={canSign ? undefined : 'demo-role-reason'}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-ink text-[14px] font-medium text-white hover:bg-ink-3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="size-4" /> Aprobar
                </button>
                <button
                  type="button"
                  onClick={() => onDecide('rechazado')}
                  disabled={!canSign}
                  aria-describedby={canSign ? undefined : 'demo-role-reason'}
                  className="inline-flex h-10 items-center rounded-full px-5 text-[14px] text-ink/70 ring-1 ring-ink/12 hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50"
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
        <p className="font-mono text-[10.5px] tracking-[0.08em] text-ink/60 uppercase">Registro de esta demostración</p>
        <ol className="mt-4 space-y-3" aria-live="polite">
          {log.map((l, i) => (
            <li
              key={`${l.time}-${i}-${l.text}`}
              className={cx(
                'flex gap-3 rounded-md text-[12.5px] leading-snug',
                l.fresh && 'animate-[word-in_500ms_var(--ease-solar)] bg-solar-soft/60 p-2 -m-2',
              )}
            >
              <span className="shrink-0 font-mono text-[11px] text-ink/60">{l.time}</span>
              <span className="text-ink/75">{l.text}</span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  )
}

/* ---------- Section ---------- */

function DemoCta() {
  const { requestDemo } = useDemoRequest()
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <p className="text-[16px] text-ink/75">¿Lo vemos con un proceso como el tuyo?</p>
      <Button size="lg" onClick={() => requestDemo('demo', 'cliente', 'Compras')}>
        Solicitar demostración
      </Button>
    </div>
  )
}

export function Demo({ standalone = false }: { standalone?: boolean }) {
  const [tab, setTab] = useState<Tab>('Preguntar')
  const [status, setStatus] = useState<'pendiente' | 'aprobado' | 'rechazado'>('pendiente')
  const [log, setLog] = useState<{ time: string; text: string; fresh?: boolean }[]>(DEMO_LOG_SEED)
  const [role, setRole] = useState<string>(DEMO_REQUIRED_ROLE)
  const [draft, setDraft] = useState(DEMO_DRAFT)
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

  const changeRole = (next: string) => {
    setRole(next)
    if (next !== DEMO_REQUIRED_ROLE) track('demo_rol_bloqueado')
  }

  const decide = (d: 'aprobado' | 'rechazado') => {
    if (role !== DEMO_REQUIRED_ROLE) return
    const edited = draft !== DEMO_DRAFT ? ' · borrador editado' : ''
    setStatus(d)
    if (d === 'aprobado') track('demo_aprobacion')
    setLog((prev) => [
      {
        time: nowHHMM(),
        text:
          d === 'aprobado'
            ? `PC-0412 aprobado por ${role} (rol simulado) · R-03 · evidencia enlazada${edited}`
            : `PC-0412 rechazado por ${role} (rol simulado)${edited}`,
        fresh: true,
      },
      ...prev.map((l) => ({ ...l, fresh: false })),
    ])
  }

  const reset = () => {
    setStatus('pendiente')
    setLog(DEMO_LOG_SEED)
    setRole(DEMO_REQUIRED_ROLE)
    setDraft(DEMO_DRAFT)
  }

  return (
    <section
      id="demo"
      className={cx('bg-paper', standalone ? 'min-h-screen py-16' : 'py-24 md:py-32')}
    >
      <Container>
        <SectionTitle
          eyebrow="Demostración interactiva"
          sub="Empresa ficticia, datos de muestra. Prueba a preguntar, explorar el pedido, revisar los huecos y aprobarlo con el rol que exige el contrato."
        >
          Míralo en un proceso que <Evidence italic>todos</Evidence> tienen.
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
                    {OPEN_GAPS - (status === 'aprobado' ? 1 : 0)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <ProductWindow
              active={tab}
              sidebar={false}
              className="ring-ink/10 shadow-[0_30px_80px_-30px_rgba(13,15,20,.35)]"
            >
              <div
                role="tabpanel"
                id={`demo-panel-${tab}`}
                aria-labelledby={`demo-tab-${tab}`}
                tabIndex={0}
              >
                {tab === 'Preguntar' && <AskTab onReview={() => select('Revisar')} />}
                {tab === 'Explorar' && <ExploreTab />}
                {tab === 'Huecos' && (
                  <GapsTab approved={status === 'aprobado'} onReview={() => select('Revisar')} />
                )}
                {tab === 'Revisar' && (
                  <ReviewTab
                    status={status}
                    log={log}
                    role={role}
                    draft={draft}
                    onRole={changeRole}
                    onDraft={setDraft}
                    onDecide={decide}
                    onReset={reset}
                  />
                )}
              </div>
            </ProductWindow>
            <p className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-ink px-3 py-1 font-mono text-[10.5px] text-white/80 shadow-lg">
              Demostración con datos de muestra
            </p>
          </div>
          {!standalone && <DemoCta />}
        </div>
      </Container>
    </section>
  )
}
