import type { ReactNode } from 'react'
import { Building2, Check, FileSignature, Layers, ScanSearch } from 'lucide-react'
import { DEMO_QA } from '../data/content'
import { EvidenceQuote } from './ProductWindow'
import { Container, Evidence, Reveal, SectionTitle, cx } from './ui'

function Cell({
  className,
  title,
  body,
  children,
  delay = 0,
}: {
  className?: string
  title: string
  body: string
  children?: ReactNode
  delay?: number
}) {
  return (
    <Reveal
      delay={delay}
      tabIndex={0}
      className={cx(
        'group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/6 transition-shadow duration-180 ease-out hover:shadow-[0_12px_40px_-16px_rgba(13,15,20,.18)] focus-visible:shadow-[0_12px_40px_-16px_rgba(13,15,20,.18)]',
        className,
      )}
    >
      {children}
      <div className="mt-auto p-6 md:p-7">
        <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{title}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink/62">{body}</p>
      </div>
    </Reveal>
  )
}

function SmallIcon({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 pt-6 md:px-7 md:pt-7">
      <span className="grid size-11 place-items-center rounded-xl bg-paper text-ink/75 ring-1 ring-ink/6">
        {children}
      </span>
    </div>
  )
}

const CITE = DEMO_QA[0].citations[0]

export function Bento() {
  return (
    <section id="capacidades" className="bg-paper pt-24 pb-24 md:pt-32 md:pb-32">
      <Container>
        <SectionTitle eyebrow="Capacidades">
          Lo que hace <Evidence>Solaris</Evidence>
        </SectionTitle>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
          <Cell
            className="md:col-span-2 xl:col-span-7"
            title="Responde con cita"
            body="Cada respuesta enseña documento, página y párrafo. Si no puede citarlo, no lo afirma."
          >
            <div className="relative m-3 mb-0 flex gap-4 rounded-xl bg-sheet p-5 ring-1 ring-ink/6 md:p-6">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10.5px] tracking-[0.08em] text-ink/60 uppercase">
                  Evidencia · cita 1
                </p>
                <p className="mt-2 text-[14px] font-medium">{CITE.doc}</p>
                <p className="font-mono text-[11px] text-ink/60">
                  pág. {CITE.page} · {CITE.section}
                </p>
                <div className="mt-4 rounded-lg bg-white p-4 ring-1 ring-ink/6">
                  <EvidenceQuote
                    quote={CITE.quote}
                    mark={CITE.mark}
                    lit={false}
                    className="text-[14.5px] [.group:hover_&_mark]:bg-[length:100%_100%] [.group:focus-visible_&_mark]:bg-[length:100%_100%]"
                  />
                </div>
              </div>
              <div className="hidden w-[150px] shrink-0 flex-col gap-2 sm:flex" aria-hidden="true">
                {[4, 5, 6].map((pg) => (
                  <div
                    key={pg}
                    className={cx(
                      'rounded-md bg-white p-2.5 ring-1 transition-colors duration-180',
                      pg === 4 ? 'ring-ink/10 group-hover:ring-solar' : 'ring-ink/6',
                    )}
                  >
                    <p className="font-mono text-[9.5px] text-ink/60">pág. {pg}</p>
                    <div className="mt-1.5 space-y-1">
                      <div className="h-1 w-full rounded bg-ink/8" />
                      <div
                        className={cx(
                          'h-1 w-4/5 rounded transition-colors duration-180',
                          pg === 4 ? 'bg-ink/8 group-hover:bg-solar' : 'bg-ink/8',
                        )}
                      />
                      <div className="h-1 w-3/5 rounded bg-ink/8" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Cell>

          <Cell
            delay={80}
            className="md:col-span-2 xl:col-span-5"
            title="Tú apruebas"
            body="Solaris propone; una persona decide. Nada se ejecuta sin aprobación y todo queda registrado."
          >
            <div className="m-3 mb-0 rounded-xl bg-sheet p-5 ring-1 ring-ink/6 md:p-6">
              <div className="flex items-center justify-between">
                <span className="rounded bg-arcilla px-2 py-0.5 font-mono text-[10.5px] text-arcilla-ink">
                  Requiere aprobación
                </span>
                <span className="font-mono text-[11px] text-ink/60">PC-0412</span>
              </div>
              <p className="mt-4 text-[15px] font-medium">
                Válvulas DN80 INOX · Suministros Industriales del Norte
              </p>
              <p className="mt-1 text-[22px] font-semibold tracking-[-0.02em]">18.450,00 €</p>
              <ul className="mt-3 space-y-1.5 text-[13px] text-ink/65">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-salvia-ink" /> Tres ofertas comparativas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-salvia-ink" /> Regla R-03 evaluada
                </li>
              </ul>
              <div className="mt-5 flex gap-2">
                <span className="relative inline-flex h-9 flex-1 items-center justify-center overflow-hidden rounded-full bg-ink text-[13.5px] font-medium text-white transition-colors duration-180 group-hover:bg-salvia-ink group-focus-visible:bg-salvia-ink">
                  <span className="transition-transform duration-180 group-hover:-translate-y-8 group-focus-visible:-translate-y-8">
                    Aprobar
                  </span>
                  <span className="absolute inset-0 flex translate-y-8 items-center justify-center gap-1.5 transition-transform duration-180 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    <Check className="size-3.5" /> Aprobado
                  </span>
                </span>
                <span className="inline-flex h-9 items-center rounded-full px-4 text-[13.5px] text-ink/60 ring-1 ring-ink/12">
                  Rechazar
                </span>
              </div>
            </div>
          </Cell>

          <Cell
            delay={0}
            className="xl:col-span-3"
            title="Señala lo que falta"
            body="Cruza tus reglas con cada expediente y marca el hueco antes de que llegue a auditoría."
          >
            <SmallIcon>
              <ScanSearch className="size-5" strokeWidth={1.5} />
            </SmallIcon>
          </Cell>
          <Cell
            delay={80}
            className="xl:col-span-3"
            title="El contrato del proceso"
            body="Tus reglas, escritas una vez y evaluadas siempre, con su fuente al lado."
          >
            <SmallIcon>
              <FileSignature className="size-5" strokeWidth={1.5} />
            </SmallIcon>
          </Cell>
          <Cell
            delay={160}
            className="xl:col-span-3"
            title="En tu organización"
            body="Con tus documentos reales, Solaris se instala dentro y sin salida a internet."
          >
            <div className="flex items-center gap-3 px-6 pt-6 md:px-7 md:pt-7">
              <span className="inline-flex h-11 items-center gap-2 rounded-xl bg-salvia px-4 font-mono text-[12px] text-salvia-ink">
                <Building2 className="size-4" strokeWidth={1.5} aria-hidden="true" /> tu organización
              </span>
            </div>
          </Cell>
          <Cell
            delay={240}
            className="xl:col-span-3"
            title="Un motor, muchos procesos"
            body="Cada proceso con su contrato, sus reglas y su vista."
          >
            <SmallIcon>
              <Layers className="size-5" strokeWidth={1.5} />
            </SmallIcon>
          </Cell>
        </div>
      </Container>
    </section>
  )
}
