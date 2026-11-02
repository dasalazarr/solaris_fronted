import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Container, Logo } from './ui'

/** Dato que debe aportar el responsable. Si falta, se ve; nunca se rellena con un valor inventado. */
export function Dato({ value, label }: { value: string; label: string }) {
  if (value) return <>{value}</>
  return (
    <mark className="rounded bg-arcilla px-1.5 text-arcilla-ink">[Pendiente: {label}]</mark>
  )
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="headline text-[26px] md:text-[30px]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-ink/80">{children}</div>
    </section>
  )
}

export const LIST = 'list-disc space-y-2 pl-5 marker:text-ink/40'

/** Estructura común de las páginas legales: cabecera, contenido a 720 px y pie. */
export function LegalShell({ draft, children }: { draft: boolean; children: ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-solar px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <header className="bg-ink py-5">
        <Container>
          <a href="/" aria-label="Solaris, volver al inicio" className="inline-block">
            <Logo tone="light" withBy />
          </a>
        </Container>
      </header>
      <main id="contenido" className="bg-sheet pt-14 pb-24 md:pt-20">
        <Container>
          <article className="mx-auto max-w-[720px]">
            {draft && (
              <p
                role="note"
                className="mb-8 rounded-xl bg-solar-soft px-4 py-3 text-[14px] leading-snug text-solar-ink"
              >
                Borrador sin revisión jurídica. No es el texto definitivo.
              </p>
            )}
            {children}
          </article>
        </Container>
      </main>
      <Footer />
    </>
  )
}
