'use client'

import { useInView } from '../lib/hooks'
import { Container, cx } from './ui'

export function Figure() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 })
  return (
    <section
      id="cifra"
      className="relative overflow-hidden bg-ink py-28 text-center text-white md:py-36"
    >
      <div
        className="grain pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(242,181,68,.16),transparent)]"
      />
      <Container className="relative">
        <div ref={ref}>
          <p
            className={cx(
              'metal blur-in text-[180px] leading-[0.85] font-semibold tracking-[-0.05em] md:text-[240px]',
              inView && 'is-in',
            )}
          >
            0
          </p>
          <p className="headline mt-4 text-[32px] md:text-[48px]">documentos salen de tu organización</p>
          <p className="mx-auto mt-6 max-w-[460px] font-mono text-[12.5px] leading-relaxed text-white/55">
            En la instalación local. La demostración usa datos de muestra en la nube.
          </p>
        </div>
      </Container>
    </section>
  )
}
