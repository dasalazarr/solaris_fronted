import type { ReactNode } from 'react'
import { FileText, MessageSquareText, ListChecks, ShieldCheck, Lock } from 'lucide-react'
import { cx } from './ui'

/** Window chrome around Solaris product surfaces (hero capture, demo, bento crops). */
export function ProductWindow({
  children,
  active = 'Preguntar',
  className,
  env = 'Demostración · datos de muestra',
}: {
  children: ReactNode
  active?: 'Preguntar' | 'Huecos' | 'Revisar'
  className?: string
  env?: string
}) {
  const nav = [
    { label: 'Preguntar', icon: MessageSquareText },
    { label: 'Huecos', icon: ListChecks },
    { label: 'Revisar', icon: ShieldCheck },
    { label: 'Documentos', icon: FileText },
  ]
  return (
    <div
      className={cx(
        'overflow-hidden rounded-[14px] bg-sheet text-ink ring-1 ring-white/12',
        'shadow-[0_40px_120px_-30px_rgba(242,181,68,.28),0_20px_60px_-20px_rgba(0,0,0,.6)]',
        className,
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-ink/8 bg-[#f1efe9] px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
        </div>
        <div className="mx-auto flex min-w-0 items-center gap-1.5 truncate rounded-md bg-white/70 px-3 py-1 whitespace-nowrap font-mono text-[11px] text-ink/60">
          <Lock className="size-3" aria-hidden="true" />
          solaris · caso de muestra · Compras
        </div>
        <span className="hidden font-mono text-[10.5px] text-ink/60 sm:block">{env}</span>
      </div>
      <div className="flex min-h-0">
        <aside className="hidden w-[176px] shrink-0 flex-col gap-0.5 border-r border-ink/8 bg-[#f7f6f2] p-3 md:flex">
          <div className="mb-3 flex items-center gap-2 px-2 pt-1">
            <span className="size-3.5 rounded-full bg-solar" />
            <span className="text-[13px] font-semibold">Solaris</span>
          </div>
          {nav.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className={cx(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px]',
                label === active
                  ? 'bg-white font-medium shadow-sm ring-1 ring-ink/6'
                  : 'text-ink/60',
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
            </div>
          ))}
          <div className="mt-auto rounded-md bg-salvia px-2 py-1.5 font-mono text-[10.5px] text-salvia-ink">
            Pack Compras · 5 docs
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}

/** Inline citation marker, e.g. [1]. */
export function CiteChip({
  n,
  active,
  onClick,
}: {
  n: number
  active?: boolean
  onClick?: () => void
}) {
  const cls = cx(
    'mx-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded px-1 align-[1px] font-mono text-[10.5px] font-medium transition-colors',
    active ? 'bg-solar text-ink' : 'bg-solar-soft text-solar-ink',
  )
  if (onClick)
    return (
      <button
        type="button"
        className={cx(cls, 'hover:bg-solar hover:text-ink')}
        onClick={onClick}
        aria-label={`Ver cita ${n}`}
      >
        {n}
      </button>
    )
  return <span className={cls}>{n}</span>
}

/** Renders text with [n] markers turned into citation chips. */
export function WithCites({
  text,
  active,
  onCite,
}: {
  text: string
  active?: number | null
  onCite?: (n: number) => void
}) {
  const parts = text.split(/(\[\d+\])/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[(\d+)\]$/)
        if (!m) return <span key={i}>{p}</span>
        const n = Number(m[1])
        return (
          <CiteChip
            key={i}
            n={n}
            active={active === n}
            onClick={onCite ? () => onCite(n) : undefined}
          />
        )
      })}
    </>
  )
}

/** A quoted paragraph with its highlighted fragment. */
export function EvidenceQuote({
  quote,
  mark,
  lit = true,
  className,
}: {
  quote: string
  mark: string
  lit?: boolean
  className?: string
}) {
  const i = quote.indexOf(mark)
  const before = i >= 0 ? quote.slice(0, i) : quote
  const after = i >= 0 ? quote.slice(i + mark.length) : ''
  return (
    <p className={cx('font-serif text-[15px] leading-[1.6] text-ink/85', className)}>
      {before}
      {i >= 0 && (
        <mark
          className={cx(
            'rounded-[2px] bg-transparent bg-no-repeat px-0.5 text-ink transition-[background-size] duration-700 ease-[var(--ease-solar)]',
            lit ? 'bg-[length:100%_100%]' : 'bg-[length:0%_100%]',
          )}
          style={{
            backgroundImage: 'linear-gradient(rgba(242,181,68,.45),rgba(242,181,68,.45))',
          }}
        >
          {mark}
        </mark>
      )}
      {after}
    </p>
  )
}
