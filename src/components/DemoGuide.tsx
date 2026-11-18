'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { CalendarDays, Check, CircleCheck } from 'lucide-react'
import { getUtm, track } from '../lib/analytics'
import { AGENDA_URL, CONTACT_EMAIL } from '../lib/site'
import { FREE_MAIL, sendSolicitud } from './DemoForm'
import { Button, Eyebrow, Evidence, cx } from './ui'

/**
 * Primer minuto en la demo pública (/solaris/demo), adonde llega el tráfico de las
 * publicaciones. Se avanza haciendo la acción del producto, no pulsando «Siguiente».
 */
export type GuideStep = 'bienvenida' | 1 | 2 | 3 | 'hecho' | 'libre'

export const GUIDE_STEPS = [
  {
    title: 'Encuentra la regla',
    hint: 'La respuesta cita el párrafo de la política que exige la firma. Míralo y pulsa «Abrir en Revisar».',
  },
  {
    title: 'Intenta aprobarlo',
    hint: 'Estás como Solicitante, sin permiso de firma, y la regla no te deja aprobar. Cambia el rol a Dirección financiera.',
  },
  {
    title: 'Apruébalo',
    hint: 'Ahora sí. Revisa el borrador y pulsa «Aprobar».',
  },
] as const

/** Ancla del cierre con el formulario corto. */
export const QUICK_REQUEST_ID = 'demo-pedir'

/** Bienvenida: el problema del caso, lo que va a pasar y cuánto tarda. */
export function GuideWelcome({
  step,
  onStart,
  onSkip,
}: {
  step: GuideStep
  onStart: () => void
  onSkip: () => void
}) {
  return (
    <div className="max-w-[820px]">
      <Eyebrow className="mb-5">Demo · datos de muestra</Eyebrow>
      <h1 className="headline text-[38px] text-ink md:text-[56px]">
        Un pedido de 18.450&nbsp;€, a punto de salir <Evidence italic>sin la firma.</Evidence>
      </h1>
      <p className="mt-5 max-w-[640px] text-[16px] leading-relaxed text-ink/70 md:text-[18px]">
        Tu política exige la firma de Dirección financiera por encima de 15.000&nbsp;€. En dos minutos
        verás cómo Solaris lo para, enseña de qué párrafo sale la regla y deja que lo apruebe solo
        quien debe.
      </p>
      {step === 'bienvenida' && (
        <>
          <ol className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
            {GUIDE_STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2 rounded-xl bg-white p-3 ring-1 ring-ink/8 sm:flex-row sm:items-center sm:gap-3 sm:p-3.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-solar-soft font-mono text-[12px] text-solar-ink">
                  {i + 1}
                </span>
                <span className="text-[13.5px] leading-snug font-medium sm:text-[14.5px]">{s.title}</span>
              </li>
            ))}
          </ol>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={onStart}>
              Empezar, son tres pasos
            </Button>
            <button
              type="button"
              onClick={onSkip}
              className="h-11 px-2 text-left text-[14.5px] text-ink/65 underline-offset-4 hover:text-ink hover:underline"
            >
              Prefiero explorar por mi cuenta
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/** Riel de progreso: el paso actual y qué hacer, junto a la demo. */
export function GuideRail({ step, onSkip }: { step: GuideStep; onSkip: () => void }) {
  if (typeof step !== 'number' && step !== 'hecho') return null
  const current = step === 'hecho' ? GUIDE_STEPS.length : step - 1
  return (
    <div
      className={cx(
        'mb-4 rounded-xl bg-white p-4 ring-1 ring-solar/50 md:p-5',
        // Fijo mientras guía; al terminar deja libre el formulario de debajo.
        step !== 'hecho' && 'sticky top-2 z-20 shadow-[0_12px_30px_-18px_rgba(13,15,20,.45)]',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ol className="flex gap-1.5" aria-label="Progreso del recorrido">
          {GUIDE_STEPS.map((s, i) => (
            <li
              key={s.title}
              aria-current={i === current ? 'step' : undefined}
              className={cx(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px]',
                i < current && 'bg-salvia text-salvia-ink',
                i === current && 'bg-ink text-white',
                i > current && 'bg-ink/5 text-ink/60',
              )}
            >
              {i < current ? <Check className="size-3" aria-hidden="true" /> : <span className="font-mono">{i + 1}</span>}
              <span className="hidden sm:inline">{s.title}</span>
            </li>
          ))}
        </ol>
        {step !== 'hecho' && (
          <button type="button" onClick={onSkip} className="text-[13px] text-ink/60 hover:text-ink hover:underline">
            Saltar recorrido
          </button>
        )}
      </div>
      <p className="mt-3 text-[15px] leading-relaxed" role="status" aria-live="polite">
        {step === 'hecho' ? (
          <>
            <span className="font-medium">Hecho.</span> El pedido sale con la firma que exige la política,
            y queda registrado quién lo aprobó, con qué rol y por qué párrafo.
          </>
        ) : (
          <>
            <span className="font-medium">
              {step}. {GUIDE_STEPS[step - 1].title}.
            </span>{' '}
            {GUIDE_STEPS[step - 1].hint}
          </>
        )}
      </p>
    </div>
  )
}

/** Anillo que señala dónde actuar en el paso actual. */
export const HINT_RING = 'ring-2 ring-solar ring-offset-2 motion-safe:animate-pulse'

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
 * Cierre con formulario corto: tres campos y la casilla de privacidad. El proceso
 * (Compras) y el perfil (cliente) los pone la demo; la API los exige igual que al largo.
 */
export function QuickRequest({ done }: { done: boolean }) {
  const [f, setF] = useState<Quick>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Quick, string>>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [started, setStarted] = useState(false)
  const section = done ? 'demo-corto-guiado' : 'demo-corto'

  const set = <K extends keyof Quick>(k: K, v: Quick[K]) => {
    if (!started) {
      setStarted(true)
      track('form_abierto', { section, perfil: 'cliente' })
    }
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
      comentario: 'Solicitud desde el cierre de la demo de compras (formulario corto).',
      origen: section,
      ...getUtm(),
    })
    setState(ok ? 'sent' : 'error')
    track(ok ? 'form_enviado' : 'form_error', { section, perfil: 'cliente', proceso: 'Compras' })
  }

  return (
    <section
      id={QUICK_REQUEST_ID}
      tabIndex={-1}
      aria-labelledby="q-title"
      className={cx(
        'mt-10 scroll-mt-6 rounded-2xl p-6 outline-none md:p-8',
        done ? 'bg-ink text-white' : 'bg-white ring-1 ring-ink/8',
      )}
    >
      {state === 'sent' ? (
        <div aria-live="polite">
          <CircleCheck className={cx('size-9', done ? 'text-solar' : 'text-salvia-ink')} strokeWidth={1.5} />
          <h2 id="q-title" className="headline mt-4 text-[30px] md:text-[36px]">
            Recibido, {f.nombre.trim().split(' ')[0]}.
          </h2>
          <p className={cx('mt-3 max-w-[560px] text-[16px] leading-relaxed', done ? 'text-white/70' : 'text-ink/70')}>
            Te escribimos a <strong className="font-medium">{f.correo}</strong> en un día laborable con una
            propuesta de fecha.{AGENDA_URL && ' Si lo prefieres, reserva ya la llamada.'}
          </p>
          {AGENDA_URL && (
            <Button
              as="a"
              href={AGENDA_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="mt-6 w-fit"
            >
              <CalendarDays className="size-4" /> Reservar llamada
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          <div>
            <h2 id="q-title" className="headline text-[30px] md:text-[40px]">
              {done ? (
                <>
                  ¿Lo vemos con <Evidence italic onDark>tu política</Evidence> de compras?
                </>
              ) : (
                <>
                  ¿Lo vemos con <Evidence italic>tu proceso</Evidence>?
                </>
              )}
            </h2>
            <p className={cx('mt-4 text-[16px] leading-relaxed', done ? 'text-white/70' : 'text-ink/70')}>
              Una llamada de 30 minutos con tu caso. Déjanos tres datos y te respondemos en un día
              laborable.
            </p>
          </div>
          <form noValidate onSubmit={submit} className="grid gap-3.5 text-ink">
            {(
              [
                ['nombre', 'Nombre', 'text', 'name'],
                ['empresa', 'Empresa', 'text', 'organization'],
                ['correo', 'Correo de empresa', 'email', 'email'],
              ] as const
            ).map(([k, label, type, auto]) => (
              <div key={k}>
                <label htmlFor={`q-${k}`} className={cx('mb-1.5 block text-[13.5px] font-medium', done && 'text-white')}>
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
                  <p id={`q-${k}-error`} className={cx('mt-1.5 text-[13px]', done ? 'text-[#f3b9a8]' : 'text-arcilla-ink')}>
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
              <label className={cx('flex items-start gap-3 text-[14px] leading-snug', done ? 'text-white/75' : 'text-ink/75')}>
                <input
                  id="q-privacidad"
                  type="checkbox"
                  checked={f.privacidad}
                  onChange={(e) => set('privacidad', e.target.checked)}
                  aria-invalid={!!errors.privacidad}
                  aria-describedby={errors.privacidad ? 'q-privacidad-error' : undefined}
                  className="mt-0.5 size-4 shrink-0 accent-solar"
                />
                <span>
                  Acepto la{' '}
                  <a
                    href="/solaris/privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('underline underline-offset-2', done ? 'text-solar' : 'text-solar-ink')}
                  >
                    política de privacidad
                  </a>
                  .
                </span>
              </label>
              {errors.privacidad && (
                <p id="q-privacidad-error" className={cx('mt-1.5 text-[13px]', done ? 'text-[#f3b9a8]' : 'text-arcilla-ink')}>
                  {errors.privacidad}
                </p>
              )}
            </div>
            <Button type="submit" size="lg" disabled={state === 'sending'} className="mt-1 w-full sm:w-fit">
              {state === 'sending' ? 'Enviando…' : 'Pedir demostración'}
            </Button>
            {state === 'error' && (
              <p role="alert" className={cx('text-[14px]', done ? 'text-white/80' : 'text-ink/75')}>
                No se ha podido enviar. Escríbenos a{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}
          </form>
        </div>
      )}
    </section>
  )
}
