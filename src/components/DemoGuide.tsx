'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CalendarDays, CircleCheck, MessageSquare, X } from 'lucide-react'
import { getUtm, track } from '../lib/analytics'
import { AGENDA_URL, CONTACT_EMAIL } from '../lib/site'
import { usePrefersReducedMotion } from '../lib/hooks'
import { FREE_MAIL, sendSolicitud } from './DemoForm'
import { SolarisMascota } from './SolarisMascota'
import { Button, Evidence, cx } from './ui'

/**
 * Primer minuto en la demo pública (/solaris/demo), adonde llevan las publicaciones.
 * Cada momento aparece con el evento que le toca: bienvenida al llegar, un globo junto
 * a lo que hay que hacer en cada paso, y el formulario solo tras aprobar o al pedirlo.
 */
export type GuideStep = 'bienvenida' | 1 | 2 | 3 | 'hecho' | 'libre'

/** Elementos de la demo a los que se ancla cada paso. */
export const ANCHORS = { 1: 'demo-abrir-revisar', 2: 'demo-rol', 3: 'demo-aprobar' } as const

export const GUIDE_STEPS = [
  { title: 'Encuentra la regla', hint: 'La respuesta cita el párrafo de la política que exige la firma. Ábrela en Revisar.' },
  { title: 'Intenta aprobarlo', hint: 'Estás como Solicitante, sin permiso de firma: la regla no te deja aprobar. Cambia el rol a Dirección financiera.' },
  { title: 'Apruébalo', hint: 'Ahora sí. Revisa el borrador y apruébalo.' },
] as const

/** Anillo que señala dónde actuar en el paso actual. */
export const HINT_RING = 'ring-2 ring-solar ring-offset-2 motion-safe:animate-pulse'

const SEEN_KEY = 'solaris-demo-guia'
/** Quien ya vio la bienvenida en esta sesión no la vuelve a ver al recargar. */
export function guideSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
export function markGuideSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* sin almacenamiento */
  }
}

/* ---------- Ventana modal nativa: foco atrapado, Esc y fondo inerte ---------- */

function Modal({
  open,
  onClose,
  labelledBy,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        // Clic en el fondo: cierra.
        if (e.target === ref.current) onClose()
      }}
      className={cx(
        'm-auto w-[calc(100%-32px)] max-w-[560px] rounded-2xl bg-paper p-0 text-ink shadow-[0_40px_120px_-30px_rgba(13,15,20,.6)] backdrop:bg-ink/55 backdrop:backdrop-blur-[2px]',
        'open:motion-safe:animate-[word-in_400ms_var(--ease-solar)]',
        className,
      )}
    >
      {open && children}
    </dialog>
  )
}

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink"
    >
      <X className="size-4" />
    </button>
  )
}

/* ---------- Bienvenida ---------- */

export function WelcomeDialog({
  open,
  onStart,
  onSkip,
}: {
  open: boolean
  onStart: () => void
  onSkip: () => void
}) {
  return (
    <Modal open={open} onClose={onSkip} labelledBy="bienvenida-titulo">
      <div className="relative p-6 md:p-8">
        <CloseButton onClick={onSkip} label="Cerrar y explorar por mi cuenta" />
        <SolarisMascota size={56} flota />
        <p className="mt-5 font-mono text-[11px] tracking-[0.08em] text-ink/60 uppercase">
          Demo · datos de muestra
        </p>
        <h2 id="bienvenida-titulo" className="headline mt-3 text-[30px] md:text-[38px]">
          Un pedido de 18.450&nbsp;€, a punto de salir{' '}
          <Evidence italic giro>
            sin la firma.
          </Evidence>
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-ink/70">
          Tu política exige la firma de Dirección financiera por encima de 15.000&nbsp;€. En tres pasos
          verás cómo Solaris lo para y deja que lo apruebe solo quien debe.
        </p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* El primer foco va a la acción recomendada. */}
          <Button size="lg" onClick={onStart} autoFocus>
            Empezar · 2 minutos
          </Button>
          <button
            type="button"
            onClick={onSkip}
            className="h-11 px-3 text-[14.5px] text-ink/65 underline-offset-4 hover:text-ink hover:underline"
          >
            Explorar por mi cuenta
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ---------- Globo anclado al elemento del paso ---------- */

type Pos = { top: number; left: number; side: 'below' | 'above' | 'right' } | null
const GAP = 12
const WIDTH = 320

export function CoachMark({ step, onSkip }: { step: GuideStep; onSkip: () => void }) {
  const reduced = usePrefersReducedMotion()
  const [pos, setPos] = useState<Pos>(null)
  const [narrow, setNarrow] = useState(false)
  const anchorId = typeof step === 'number' ? ANCHORS[step] : null

  // Al cambiar de paso, el elemento señalado entra en pantalla.
  useEffect(() => {
    if (!anchorId) return
    const t = window.setTimeout(() => {
      const el = document.getElementById(anchorId)
      if (!el) return
      // En el tercio superior: en móvil, la hoja del paso ocupa la parte de abajo.
      const r = el.getBoundingClientRect()
      const at = window.innerWidth < 768 ? 0.28 : 0.4
      window.scrollTo({
        top: window.scrollY + r.top - window.innerHeight * at,
        behavior: reduced ? 'auto' : 'smooth',
      })
    }, 120)
    return () => window.clearTimeout(t)
  }, [anchorId, reduced])

  useLayoutEffect(() => {
    if (!anchorId) return
    let raf = 0
    const place = () => {
      const isNarrow = window.innerWidth < 768
      setNarrow(isNarrow)
      const el = document.getElementById(anchorId)
      if (!el || isNarrow) return setPos(null)
      const r = el.getBoundingClientRect()
      // Al lado si cabe, para no tapar lo que hay debajo; si no, debajo o encima.
      if (window.innerWidth >= 1024 && r.right + GAP + WIDTH + 16 < window.innerWidth)
        return setPos({ top: Math.max(16, r.top + r.height / 2 - 70), left: r.right + GAP, side: 'right' })
      const below = r.bottom + GAP + 170 < window.innerHeight || r.top < 190
      const left = Math.min(Math.max(16, r.left + r.width / 2 - WIDTH / 2), window.innerWidth - WIDTH - 16)
      setPos({ top: below ? r.bottom + GAP : r.top - GAP, left, side: below ? 'below' : 'above' })
    }
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(place)
    }
    place()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [anchorId])

  if (typeof step !== 'number') return null
  const s = GUIDE_STEPS[step - 1]
  const card = (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="guia-paso"
      className="rounded-2xl bg-ink p-4 text-white shadow-[0_24px_60px_-20px_rgba(13,15,20,.7)] motion-safe:animate-[word-in_350ms_var(--ease-solar)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.08em] text-solar uppercase">
          Paso {step} de {GUIDE_STEPS.length}
        </p>
        <div className="flex gap-1" aria-hidden="true">
          {GUIDE_STEPS.map((_, i) => (
            <span key={i} className={cx('h-1 w-5 rounded-full', i < step ? 'bg-solar' : 'bg-white/20')} />
          ))}
        </div>
      </div>
      <p id="guia-paso" className="mt-2 text-[16px] font-medium">
        {s.title}
      </p>
      <p className="mt-1 text-[14px] leading-relaxed text-white/75" aria-live="polite">
        {s.hint}
      </p>
      <button type="button" onClick={onSkip} className="mt-3 text-[13px] text-white/60 hover:text-white hover:underline">
        Saltar recorrido
      </button>
    </div>
  )
  if (narrow) return <div className="fixed inset-x-3 bottom-3 z-40">{card}</div>
  if (!pos) return null
  return (
    <div
      className="fixed z-40"
      style={{
        top: pos.top,
        left: pos.left,
        width: WIDTH,
        transform: pos.side === 'above' ? 'translateY(-100%)' : undefined,
      }}
    >
      {card}
    </div>
  )
}

/* ---------- Formulario corto ---------- */

type Quick = { nombre: string; empresa: string; correo: string; privacidad: boolean; web: string }
const EMPTY: Quick = { nombre: '', empresa: '', correo: '', privacidad: false, web: '' }

function validate(f: Quick) {
  const e: Partial<Record<keyof Quick, string>> = {}
  if (!f.nombre.trim()) e.nombre = 'Falta tu nombre.'
  if (!f.empresa.trim()) e.empresa = 'Falta la empresa.'
  if (!f.correo.trim()) e.correo = 'Falta el correo.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)) e.correo = 'Revisa el correo: nombre@empresa.com.'
  else if (FREE_MAIL.test(f.correo)) e.correo = 'Usa el correo de tu empresa, no uno personal.'
  if (!f.privacidad) e.privacidad = 'Acepta la política de privacidad para enviarlo.'
  return e
}

const input = (err?: string) =>
  cx(
    'w-full rounded-xl bg-white px-3.5 py-2.5 text-[15px] ring-1 outline-none focus:ring-2 focus:ring-solar',
    err ? 'ring-arcilla-ink/60' : 'ring-ink/12',
  )

/**
 * Tres campos y la casilla de privacidad. Proceso (Compras) y perfil (cliente) los pone
 * la demo; la API (`/api/solicitud`) los exige igual que al formulario largo.
 */
function QuickForm({ section, onSent }: { section: string; onSent: () => void }) {
  const [f, setF] = useState<Quick>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Quick, string>>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = <K extends keyof Quick>(k: K, v: Quick[K]) => {
    setF((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(f)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      document.getElementById(`q-${first}`)?.focus()
      return
    }
    setState('sending')
    const ok = await sendSolicitud({
      ...f,
      perfil: 'cliente',
      proceso: 'Compras',
      comentario: 'Solicitud desde la demo pública de compras (formulario corto).',
      origen: section,
      ...getUtm(),
    })
    setState(ok ? 'sent' : 'error')
    track(ok ? 'form_enviado' : 'form_error', { section, perfil: 'cliente', proceso: 'Compras' })
    if (ok) onSent()
  }

  if (state === 'sent')
    return (
      <div aria-live="polite">
        <CircleCheck className="size-9 text-salvia-ink" strokeWidth={1.5} />
        <h3 className="headline mt-4 text-[28px]">Recibido, {f.nombre.trim().split(' ')[0]}.</h3>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink/70">
          Te escribimos a <strong className="font-medium text-ink">{f.correo}</strong> en un día laborable
          con una propuesta de fecha.{AGENDA_URL && ' Si lo prefieres, reserva ya la llamada.'}
        </p>
        {AGENDA_URL && (
          <Button as="a" href={AGENDA_URL} target="_blank" rel="noopener noreferrer" size="lg" className="mt-6 w-fit">
            <CalendarDays className="size-4" /> Reservar llamada
          </Button>
        )}
      </div>
    )

  return (
    <form noValidate onSubmit={submit} className="grid gap-3.5">
      {(
        [
          ['nombre', 'Nombre', 'text', 'name'],
          ['empresa', 'Empresa', 'text', 'organization'],
          ['correo', 'Correo de empresa', 'email', 'email'],
        ] as const
      ).map(([k, label, type, auto]) => (
        <div key={k}>
          <label htmlFor={`q-${k}`} className="mb-1.5 block text-[13.5px] font-medium">
            {label}
          </label>
          <input
            id={`q-${k}`}
            name={k}
            type={type}
            autoComplete={auto}
            value={f[k]}
            onChange={(e) => set(k, e.target.value)}
            aria-invalid={!!errors[k]}
            aria-describedby={errors[k] ? `q-${k}-error` : undefined}
            className={input(errors[k])}
          />
          {errors[k] && (
            <p id={`q-${k}-error`} className="mt-1.5 text-[13px] text-arcilla-ink">
              {errors[k]}
            </p>
          )}
        </div>
      ))}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="q-web">No rellenar</label>
        <input id="q-web" tabIndex={-1} autoComplete="off" value={f.web} onChange={(e) => set('web', e.target.value)} />
      </div>
      <div>
        <label className="flex items-start gap-3 text-[14px] leading-snug text-ink/75">
          <input
            id="q-privacidad"
            type="checkbox"
            checked={f.privacidad}
            onChange={(e) => set('privacidad', e.target.checked)}
            aria-invalid={!!errors.privacidad}
            aria-describedby={errors.privacidad ? 'q-privacidad-error' : undefined}
            className="mt-0.5 size-4 shrink-0 accent-ink"
          />
          <span>
            Acepto la{' '}
            <a
              href="/solaris/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-solar-ink underline underline-offset-2"
            >
              política de privacidad
            </a>
            .
          </span>
        </label>
        {errors.privacidad && (
          <p id="q-privacidad-error" className="mt-1.5 text-[13px] text-arcilla-ink">
            {errors.privacidad}
          </p>
        )}
      </div>
      <Button type="submit" size="lg" disabled={state === 'sending'} className="mt-1 w-full">
        {state === 'sending' ? 'Enviando…' : 'Pedir demostración'}
      </Button>
      {state === 'error' && (
        <p role="alert" className="text-[14px] text-ink/75">
          No se ha podido enviar. Escríbenos a{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}
    </form>
  )
}

/** Cierre: tras aprobar, «hecho» y el formulario; desde el botón flotante, solo el formulario. */
export function RequestDialog({
  open,
  done,
  onClose,
  onSent,
}: {
  open: boolean
  done: boolean
  onClose: () => void
  onSent: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="pedir-titulo" className="max-h-[calc(100dvh-32px)] overflow-y-auto">
      <div className="relative p-6 md:p-8">
        <CloseButton onClick={onClose} label="Cerrar y seguir explorando" />
        {done && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-salvia p-3.5 text-salvia-ink">
            <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="text-[14.5px] leading-relaxed">
              <span className="font-medium">Hecho.</span> El pedido sale con la firma que exige la política, y
              queda registrado quién lo aprobó, con qué rol y por qué párrafo.
            </p>
          </div>
        )}
        <h2 id="pedir-titulo" className="headline pr-8 text-[28px] md:text-[34px]">
          ¿Lo vemos{' '}
          <Evidence italic giro>
            con tu política?
          </Evidence>
        </h2>
        <p className="mt-3 mb-6 text-[15.5px] leading-relaxed text-ink/70">
          Una llamada de 30 minutos con tu caso. Déjanos tres datos y te respondemos en un día laborable.
        </p>
        <QuickForm section={done ? 'demo-corto-guiado' : 'demo-corto'} onSent={onSent} />
      </div>
    </Modal>
  )
}

/** Acceso permanente al formulario cuando no hay recorrido en marcha. */
export function RequestPill({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed right-4 bottom-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-[14.5px] font-medium text-white shadow-[0_18px_40px_-14px_rgba(13,15,20,.7)] hover:bg-ink-3 motion-safe:animate-[word-in_400ms_var(--ease-solar)]"
    >
      <MessageSquare className="size-4 text-solar" aria-hidden="true" />
      Pedir demostración
    </button>
  )
}
