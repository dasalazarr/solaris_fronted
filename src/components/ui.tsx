import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { useInView } from '../lib/hooks'

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

export function Logo({
  tone = 'light',
  withBy = false,
  className,
}: {
  tone?: 'light' | 'dark'
  withBy?: boolean
  className?: string
}) {
  const text = tone === 'light' ? 'text-white' : 'text-ink'
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle
          cx="13"
          cy="13"
          r="12"
          fill="none"
          stroke="#F2B544"
          strokeOpacity=".55"
          strokeWidth="1"
        />
        <circle cx="13" cy="13" r="7.5" fill="#F2B544" />
      </svg>
      <span className={cx('text-[19px] font-semibold tracking-[-0.02em]', text)}>Solaris</span>
      {withBy && (
        <span
          className={cx(
            'font-mono text-[11px]',
            tone === 'light' ? 'text-white/50' : 'text-ink/50',
          )}
        >
          por Illarium
        </span>
      )}
    </span>
  )
}

type ButtonVariant = 'solar' | 'ghost-dark' | 'ghost-light' | 'ink'

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  solar:
    'bg-solar text-ink hover:bg-[#f6c565] shadow-[0_0_0_1px_rgba(242,181,68,.4),0_8px_24px_-8px_rgba(242,181,68,.55)]',
  'ghost-dark': 'text-white ring-1 ring-white/20 hover:bg-white/8 hover:ring-white/35',
  'ghost-light': 'text-ink ring-1 ring-ink/15 hover:bg-ink/5',
  ink: 'bg-ink text-white hover:bg-ink-3',
}

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'solar',
  size = 'md',
  className,
  children,
  ...rest
}: {
  as?: T
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>) {
  const Comp = (as ?? 'button') as ElementType
  const sizes = {
    sm: 'h-9 px-3.5 text-[13.5px]',
    md: 'h-11 px-5 text-[15px]',
    lg: 'h-12 px-6 text-[15.5px]',
  }
  return (
    <Comp
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,box-shadow,transform] duration-180 ease-out active:scale-[.98]',
        sizes[size],
        BUTTON_STYLES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function Eyebrow({
  children,
  tone = 'dark',
  className,
}: {
  children: ReactNode
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <p
      className={cx(
        'font-mono text-[12px] tracking-[0.08em] uppercase',
        tone === 'light' ? 'text-solar/90' : 'text-ink/55',
        className,
      )}
    >
      {children}
    </p>
  )
}

/** Wraps a headline fragment with the amber evidence highlight sweep. */
export function Evidence({
  children,
  italic = false,
  onDark = false,
}: {
  children: ReactNode
  italic?: boolean
  onDark?: boolean
}) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.6 })
  return (
    <span
      ref={ref}
      className={cx(
        'evidence',
        onDark && 'evidence-dark',
        inView && 'is-lit',
        italic && 'font-serif font-normal tracking-[-0.01em] italic',
      )}
    >
      {children}
    </span>
  )
}

export function Reveal<T extends ElementType = 'div'>({
  as,
  delay = 0,
  className,
  children,
  ...rest
}: {
  as?: T
  delay?: number
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>) {
  const [ref, inView] = useInView<HTMLElement>()
  const Comp = (as ?? 'div') as ElementType
  return (
    <Comp
      ref={ref}
      className={cx('reveal', inView && 'is-in', className)}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx('mx-auto w-full max-w-[1200px] px-5 md:px-8 xl:px-0', className)}>
      {children}
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  children,
  sub,
  tone = 'dark',
  align = 'left',
  className,
}: {
  eyebrow?: string
  children: ReactNode
  sub?: ReactNode
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <Reveal className={cx('max-w-[820px]', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <Eyebrow tone={tone === 'light' ? 'light' : 'dark'} className="mb-5">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cx(
          'headline text-[40px] md:text-[56px] lg:text-[64px]',
          tone === 'light' ? 'text-white' : 'text-ink',
        )}
      >
        {children}
      </h2>
      {sub && (
        <p
          className={cx(
            'mt-5 text-[17px] leading-relaxed md:text-[19px]',
            tone === 'light' ? 'text-white/65' : 'text-ink/65',
            align === 'center' && 'mx-auto max-w-[620px]',
          )}
        >
          {sub}
        </p>
      )}
    </Reveal>
  )
}
