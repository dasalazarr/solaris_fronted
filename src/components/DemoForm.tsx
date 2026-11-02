'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CalendarDays, CircleCheck, X } from 'lucide-react'
import { PROCESSES } from '../data/content'
import { getUtm, track } from '../lib/analytics'
import { AGENDA_URL, CONTACT_EMAIL, SOLICITUD_URL } from '../lib/site'
import { useDemoRequest } from '../lib/demoRequest'
import { Button, Logo, cx } from './ui'

type Fields = {
  nombre: string
  empresa: string
  correo: string
  proceso: string
  comentario: string
  privacidad: boolean
  web: string // honeypot
}

const EMPTY: Fields = {
  nombre: '',
  empresa: '',
  correo: '',
  proceso: '',
  comentario: '',
  privacidad: false,
  web: '',
}

const FREE_MAIL = /@(gmail|hotmail|outlook|yahoo|icloud|live|proton)\./i

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (!f.nombre.trim()) e.nombre = 'Falta su nombre. Escriba cómo quiere que nos dirijamos a usted.'
  if (!f.empresa.trim()) e.empresa = 'Falta la empresa. Indique el nombre de su organización.'
  if (!f.correo.trim()) e.correo = 'Falta el correo. Use su correo profesional.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo))
    e.correo = 'El correo no parece válido. Revise que tenga el formato nombre@empresa.com.'
  else if (FREE_MAIL.test(f.correo))
    e.correo =
      'Use un correo de su empresa, no uno personal, para preparar la demostración de su sector.'
  if (!f.proceso)
    e.proceso = 'Elija el proceso que le interesa; si no está en la lista, elija «Otro».'
  if (!f.privacidad) e.privacidad = 'Para enviar el formulario, acepte la política de privacidad.'
  return e
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex justify-between text-[13.5px] font-medium">
        {label}
        {optional && <span className="font-normal text-ink/60">Opcional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-arcilla-ink">
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls = (err?: string) =>
  cx(
    'w-full rounded-xl bg-white px-3.5 py-2.5 text-[15px] ring-1 transition-shadow outline-none placeholder:text-ink/60 focus:ring-2 focus:ring-solar',
    err ? 'ring-arcilla-ink/60' : 'ring-ink/12',
  )

/** Envía la solicitud al producto (`/api/solicitud`). Nunca simula un envío. */
async function sendSolicitud(payload: Record<string, unknown>): Promise<boolean> {
  if (!SOLICITUD_URL) {
    if (process.env.NODE_ENV === 'development') console.debug('[form] sin NEXT_PUBLIC_SOLICITUD_URL', payload)
    return false
  }
  try {
    const res = await fetch(SOLICITUD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}

function mailtoHref(f: Fields) {
  const body = `Nombre: ${f.nombre}\nEmpresa: ${f.empresa}\nProceso: ${f.proceso}\n\n${f.comentario}`
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Solicitud de demostración de Solaris')}&body=${encodeURIComponent(body)}`
}

export function DemoForm() {
  const { open, origin, close } = useDemoRequest()
  const [f, setF] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(
      () => panelRef.current?.querySelector<HTMLElement>('input')?.focus(),
      50,
    )
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && panelRef.current) {
        const els = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea',
        )
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      ;(lastFocus.current as HTMLElement | null)?.focus?.()
    }
  }, [open, close])

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    setF((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (f.web) return // bot
    const errs = validate(f)
    setErrors(errs)
    if (Object.keys(errs).length) {
      track('form_error', { campos: Object.keys(errs).join(',') })
      panelRef.current?.querySelector<HTMLElement>(`#f-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setSending(true)
    setSendError(false)
    const payload = { ...f, origen: origin, ...getUtm() }
    const ok = await sendSolicitud(payload)
    setSending(false)
    if (!ok) {
      track('form_fallo', { section: origin })
      setSendError(true)
      return
    }
    track('form_enviado', { proceso: f.proceso, section: origin })
    setSent(true)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col overflow-y-auto bg-sheet text-ink shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4 md:px-8">
          <Logo tone="dark" withBy />
          <button
            type="button"
            onClick={close}
            className="grid size-9 place-items-center rounded-full ring-1 ring-ink/12 hover:bg-ink/5"
            aria-label="Cerrar formulario"
          >
            <X className="size-4" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-1 flex-col px-6 py-10 md:px-8" aria-live="polite">
            <CircleCheck className="size-10 text-salvia-ink" strokeWidth={1.5} />
            <h2 id="form-title" className="headline mt-6 text-[36px]">
              Recibido, {f.nombre.split(' ')[0]}.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink/68">
              Le escribiremos a <strong className="font-medium text-ink">{f.correo}</strong> en un
              día laborable con una propuesta de fecha.
              {AGENDA_URL && ' Si lo prefiere, reserve ya la llamada de 30 minutos.'}
            </p>
            {AGENDA_URL && (
              <Button as="a" href={AGENDA_URL} target="_blank" rel="noopener noreferrer" variant="ink" size="lg" className="mt-8 w-fit">
                <CalendarDays className="size-4" /> Reservar llamada
              </Button>
            )}
            <button
              type="button"
              onClick={() => {
                setSent(false)
                setF(EMPTY)
                close()
              }}
              className="mt-auto w-fit pt-10 text-[14px] text-solar-ink underline underline-offset-4"
            >
              Volver a la página
            </button>
          </div>
        ) : (
          <form
            onSubmit={submit}
            noValidate
            className="flex flex-1 flex-col gap-5 px-6 py-8 md:px-8"
          >
            <div>
              <h2 id="form-title" className="headline text-[34px]">
                Solicitar demostración
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/62">
                30 minutos, su sector, datos de muestra. Le respondemos en un día laborable.
              </p>
            </div>

            <Field id="f-nombre" label="Nombre" error={errors.nombre}>
              <input
                id="f-nombre"
                autoComplete="name"
                value={f.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'f-nombre-error' : undefined}
                className={inputCls(errors.nombre)}
              />
            </Field>
            <Field id="f-empresa" label="Empresa" error={errors.empresa}>
              <input
                id="f-empresa"
                autoComplete="organization"
                value={f.empresa}
                onChange={(e) => set('empresa', e.target.value)}
                aria-invalid={!!errors.empresa}
                aria-describedby={errors.empresa ? 'f-empresa-error' : undefined}
                className={inputCls(errors.empresa)}
              />
            </Field>
            <Field id="f-correo" label="Correo profesional" error={errors.correo}>
              <input
                id="f-correo"
                type="email"
                autoComplete="email"
                placeholder="nombre@empresa.com"
                value={f.correo}
                onChange={(e) => set('correo', e.target.value)}
                aria-invalid={!!errors.correo}
                aria-describedby={errors.correo ? 'f-correo-error' : undefined}
                className={inputCls(errors.correo)}
              />
            </Field>
            <fieldset>
              <legend className="mb-2 text-[13.5px] font-medium">Proceso que le interesa</legend>
              <div className="flex flex-wrap gap-2" id="f-proceso" tabIndex={-1}>
                {PROCESSES.map((p) => (
                  <label
                    key={p}
                    className={cx(
                      'cursor-pointer rounded-full px-3.5 py-1.5 text-[14px] ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-solar',
                      f.proceso === p
                        ? 'bg-ink text-white ring-ink'
                        : 'bg-white ring-ink/12 hover:ring-ink/30',
                    )}
                  >
                    <input
                      type="radio"
                      name="proceso"
                      value={p}
                      checked={f.proceso === p}
                      onChange={() => set('proceso', p)}
                      className="sr-only"
                    />
                    {p}
                  </label>
                ))}
              </div>
              {errors.proceso && (
                <p className="mt-1.5 text-[13px] text-arcilla-ink">{errors.proceso}</p>
              )}
            </fieldset>
            <Field id="f-comentario" label="Comentario" optional>
              <textarea
                id="f-comentario"
                rows={3}
                value={f.comentario}
                onChange={(e) => set('comentario', e.target.value)}
                placeholder="Cuéntenos brevemente su caso"
                className={cx(inputCls(), 'resize-none')}
              />
            </Field>

            {/* Honeypot: hidden from people, filled by bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="f-web">Web</label>
              <input
                id="f-web"
                tabIndex={-1}
                autoComplete="off"
                value={f.web}
                onChange={(e) => set('web', e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-start gap-3 text-[14px] leading-snug text-ink/75">
                <input
                  id="f-privacidad"
                  type="checkbox"
                  checked={f.privacidad}
                  onChange={(e) => set('privacidad', e.target.checked)}
                  aria-invalid={!!errors.privacidad}
                  className="mt-0.5 size-4 shrink-0 accent-ink"
                />
                <span>
                  He leído y acepto la{' '}
                  <a href="#" className="text-solar-ink underline underline-offset-2">
                    política de privacidad
                  </a>
                  .
                </span>
              </label>
              {errors.privacidad && (
                <p className="mt-1.5 text-[13px] text-arcilla-ink">{errors.privacidad}</p>
              )}
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={sending}>
              {sending ? 'Enviando…' : 'Solicitar demostración'}
            </Button>
            {sendError && (
              <p role="alert" className="text-[13.5px] leading-relaxed text-arcilla-ink">
                No hemos podido enviar su solicitud.{' '}
                {CONTACT_EMAIL ? (
                  <>
                    Escríbanos a{' '}
                    <a href={mailtoHref(f)} className="underline underline-offset-4">
                      {CONTACT_EMAIL}
                    </a>{' '}
                    y le responderemos igual.
                  </>
                ) : (
                  'Inténtelo de nuevo en unos minutos.'
                )}
              </p>
            )}
            <p className="text-center font-mono text-[11px] text-ink/60">
              Sin cookies de seguimiento. Sus datos solo se usan para responderle.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
