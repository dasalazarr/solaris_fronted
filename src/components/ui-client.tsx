'use client'

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cx } from '../lib/cx'
import { useInView } from '../lib/hooks'

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
