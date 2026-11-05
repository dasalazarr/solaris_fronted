'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CalendarDays, CircleCheck, X } from 'lucide-react'
import { PROCESSES, PROFILES } from '../data/content'
import type { Profile } from '../data/content'
import { getUtm, track } from '../lib/analytics'
import { AGENDA_URL, CONTACT_EMAIL, SOLICITUD_URL } from '../lib/site'
import { composeComment, FORM_PAINS } from '../data/formPains'
import { useDemoRequest } from '../lib/demoRequest'
import { Button, Logo, cx } from './ui'

type Fields = {
  perfil: Profile | ''
  nombre: string
  empresa: string
  correo: string
  proceso: string
  comentario: string
  privacidad: boolean
  web: string // honeypot
}

const EMPTY: Omit<Fields, 'perfil' | 'proceso'> = {
  nombre: '',
  empresa: '',
  correo: '',
  comentario: '',
  privacidad: false,
  web: '',
}

const COPY: Record<Profile, { title: string; sub: string; submit: string }> = {
  cliente: {
    title: 'Solicitar demostración',
    sub: '30 minutos, tu sector, datos de muestra. Te respondemos en un día laborable.',
    submit: 'Solicitar demostración',
  },
  aliado: {
    title: 'Implantar Solaris con Illarium',
    sub: 'Cuéntanos qué procesos y sectores trabajas. Te respondemos en un día laborable.',
    submit: 'Enviar',
  },
  inversor: {
    title: 'Hablemos',
    sub: 'Cuéntanos qué te interesa del proyecto. Te respondemos en un día laborable.',
    submit: 'Enviar',
  },
}

// La API corta en 2000 y las fricciones ocupan hasta 383: así nunca se pierde lo escrito.
const COMMENT_MAX = 1600

const FREE_MAIL = /@(gmail|hotmail|outlook|yahoo|icloud|live|proton)\./i

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (!f.perfil) e.perfil = 'Indica si escribes como cliente, aliado o inversor.'
  if (!f.nombre.trim()) e.nombre = 'Falta tu nombre. Escribe cómo quieres que nos dirijamos a ti.'
  if (!f.empresa.trim()) e.empresa = 'Falta la empresa. Indica el nombre de tu organización.'
  if (!f.correo.trim()) e.correo = 'Falta el correo. Usa tu correo profesional.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo))
    e.correo = 'El correo no parece válido. Revisa que tenga el formato nombre@empresa.com.'
  else if (FREE_MAIL.test(f.correo))
    e.correo =
      'Usa un correo de tu empresa, no uno personal, para preparar la demostración de tu sector.'
  if (f.perfil === 'cliente' && !f.proceso)
    e.proceso = 'Elige el proceso que te interesa; si no está en la lista, elige «Otro».'
  if (!f.privacidad) e.privacidad = 'Para enviar el formulario, acepta la política de privacidad.'
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
    if (process.env.NODE_ENV === 'development')
      console.debug('[form] sin NEXT_PUBLIC_SOLICITUD_URL', payload)
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
  const body = `Perfil: ${f.perfil}\nNombre: ${f.nombre}\nEmpresa: ${f.empresa}\nProceso: ${f.proceso}\n\n${f.comentario}`
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Solicitud de demostración de Solaris')}&body=${encodeURIComponent(body)}`
}

export function DemoForm() {
  const { open, origin, perfil, setPerfil, proceso, setProceso, close } = useDemoRequest()
  const [rest, setF] = useState(EMPTY)
  // El perfil vive en el contexto: lo fija el botón de audiencia que abre el formulario.
  // Aliados e inversores no eligen proceso; la API lo exige, así que se envía «Otro».
  const f: Fields = {
    ...rest,
    perfil,
    proceso: perfil && perfil !== 'cliente' ? 'Otro' : proceso,
  }
  const [pains, setPains] = useState<string[]>([])
  const isClient = !f.perfil || f.perfil === 'cliente'
  const painOptions = isClient ? (FORM_PAINS[f.proceso] ?? []) : []
  // Las fricciones de otro proceso no viajan: al cambiar de proceso dejan de valer.
  const chosenPains = pains.filter((p) => painOptions.includes(p))
  const togglePain = (p: string) =>
    setPains((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  const outgoing: Fields = { ...f, comentario: composeComment(chosenPains, f.comentario) }
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
      () =>
        (
          panelRef.current?.querySelector<HTMLElement>('input[name="perfil"]:checked') ??
          panelRef.current?.querySelector<HTMLElement>('input')
        )?.focus(),
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

  const chooseProceso = (p: string) => {
    setProceso(p)
    if (errors.proceso) setErrors((e) => ({ ...e, proceso: undefined }))
  }
  const set = <K extends keyof typeof EMPTY>(k: K, v: Fields[K]) => {
    setF((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }
  const choosePerfil = (p: Profile) => {
    setPerfil(p)
    if (errors.perfil) setErrors((e) => ({ ...e, perfil: undefined }))
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
    const payload = { ...outgoing, origen: origin, ...getUtm() }
    const ok = await sendSolicitud(payload)
    setSending(false)
    if (!ok) {
      track('form_fallo', { section: origin })
      setSendError(true)
      return
    }
    track('form_enviado', { perfil: f.perfil, proceso: f.proceso, section: origin })
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
              Te escribiremos a <strong className="font-medium text-ink">{f.correo}</strong> en un
              día laborable con una propuesta de fecha.
              {AGENDA_URL && ' Si lo prefiere, reserve ya la llamada de 30 minutos.'}
            </p>
            {AGENDA_URL && (
              <Button
                as="a"
                href={AGENDA_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="ink"
                size="lg"
                className="mt-8 w-fit"
              >
                <CalendarDays className="size-4" /> Reservar llamada
              </Button>
            )}
            <button
              type="button"
              onClick={() => {
                setSent(false)
                setF(EMPTY)
                setPains([])
                setProceso('')
                setPerfil('')
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
                {COPY[f.perfil || 'cliente'].title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/62">
                {COPY[f.perfil || 'cliente'].sub}
              </p>
              {isClient && f.proceso && f.proceso !== 'Otro' && (
                <p className="mt-2 text-[14px] font-medium text-solar-ink">
                  Para el proceso de {f.proceso}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="mb-2 text-[13.5px] font-medium">Escribe como</legend>
              <div className="flex flex-wrap gap-2" id="f-perfil" tabIndex={-1}>
                {PROFILES.map((p) => (
                  <label
                    key={p.id}
                    className={cx(
                      'cursor-pointer rounded-full px-3.5 py-1.5 text-[14px] ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-solar',
                      f.perfil === p.id
                        ? 'bg-ink text-white ring-ink'
                        : 'bg-white ring-ink/12 hover:ring-ink/30',
                    )}
                  >
                    <input
                      type="radio"
                      name="perfil"
                      value={p.id}
                      checked={f.perfil === p.id}
                      onChange={() => choosePerfil(p.id)}
                      aria-invalid={!!errors.perfil}
                      aria-describedby={errors.perfil ? 'f-perfil-error' : undefined}
                      className="sr-only"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
              {errors.perfil && (
                <p id="f-perfil-error" className="mt-1.5 text-[13px] text-arcilla-ink">
                  {errors.perfil}
                </p>
              )}
            </fieldset>

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
            {(!f.perfil || f.perfil === 'cliente') && (
              <fieldset>
                <legend className="mb-2 text-[13.5px] font-medium">Proceso que te interesa</legend>
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
                        onChange={() => chooseProceso(p)}
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
            )}
            {painOptions.length > 0 && (
              <fieldset>
                <legend className="mb-2 text-[13.5px] font-medium">
                  ¿Qué te gustaría resolver primero? <span className="font-normal text-ink/60">Opcional</span>
                </legend>
                <div className="flex flex-col gap-2">
                  {painOptions.map((p) => (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={chosenPains.includes(p)}
                      onClick={() => togglePain(p)}
                      className={cx(
                        'rounded-xl px-3.5 py-2 text-left text-[14px] leading-snug ring-1 transition-colors',
                        chosenPains.includes(p)
                          ? 'bg-ink text-white ring-ink'
                          : 'bg-white ring-ink/12 hover:ring-ink/30',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <Field id="f-comentario" label={isClient ? 'Algo más' : 'Comentario'} optional>
              <textarea
                id="f-comentario"
                rows={3}
                maxLength={COMMENT_MAX}
                value={f.comentario}
                onChange={(e) => set('comentario', e.target.value)}
                placeholder="Cuéntanos brevemente tu caso"
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
                  <a
                    href="/privacidad"
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
                <p className="mt-1.5 text-[13px] text-arcilla-ink">{errors.privacidad}</p>
              )}
            </div>

            {isClient && (
              <div className="rounded-xl bg-paper p-4 text-[13.5px] leading-relaxed ring-1 ring-ink/8">
                <p className="font-medium">Qué ocurre en los 30 minutos</p>
                <ul className="mt-1.5 text-ink/70">
                  <li>10 min · tu proceso, tus reglas y tus documentos</li>
                  <li>15 min · demostración con datos de muestra: citas, huecos y aprobación</li>
                  <li>5 min · siguientes pasos: piloto e instalación local</li>
                </ul>
              </div>
            )}

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={sending}>
              {sending ? 'Enviando…' : COPY[f.perfil || 'cliente'].submit}
            </Button>
            {sendError && (
              <p role="alert" className="text-[13.5px] leading-relaxed text-arcilla-ink">
                No hemos podido enviar tu solicitud.{' '}
                {CONTACT_EMAIL ? (
                  <>
                    Escríbenos a{' '}
                    <a href={mailtoHref(outgoing)} className="underline underline-offset-4">
                      {CONTACT_EMAIL}
                    </a>{' '}
                    y te responderemos igual.
                  </>
                ) : (
                  'Inténtelo de nuevo en unos minutos.'
                )}
              </p>
            )}
            <p className="text-center font-mono text-[11px] text-ink/60">
              Sin cookies de seguimiento. Tus datos solo se usan para responderte.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
