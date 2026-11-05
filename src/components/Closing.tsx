'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useDemoRequest } from '../lib/demoRequest'
import { CONTACT_EMAIL } from '../lib/site'
import { useInView, usePageVisible, usePrefersReducedMotion } from '../lib/hooks'
import { Button, Container, Evidence } from './ui'

const COLS = 44
const ROWS = 9

/**
 * Field of small sheets that light up in a wave from the centre, like a
 * sunrise. Runs on entry and every 8 s while visible.
 */
function DocumentField() {
  const reduced = usePrefersReducedMotion()
  const visible = usePageVisible()
  const [ref, inView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    once: false,
  })
  const [wave, setWave] = useState(0)

  useEffect(() => {
    if (reduced || !inView || !visible) return
    setWave((w) => w + 1)
    const id = window.setInterval(() => setWave((w) => w + 1), 8000)
    return () => window.clearInterval(id)
  }, [reduced, inView, visible])

  const cells = useMemo(() => {
    const cx = (COLS - 1) / 2
    const cy = ROWS - 1
    const max = Math.hypot(cx, cy)
    return Array.from({ length: COLS * ROWS }, (_, i) => {
      const x = i % COLS
      const y = Math.floor(i / COLS)
      const d = Math.hypot((x - cx) * 0.9, (y - cy) * 1.4) / max
      return { d, a: Math.max(0.06, 0.85 - d * 1.1) }
    })
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 grid gap-[5px] px-3 [mask-image:linear-gradient(to_top,black_35%,transparent_95%)]"
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
    >
      {cells.map((c, i) => (
        <div
          key={`${wave}-${i}`}
          className={`sheet-cell aspect-[3/4] ${wave > 0 ? 'lit' : ''}`}
          style={
            {
              ['--d' as string]: `${Math.round(c.d * 1400)}ms`,
              ['--a' as string]: c.a.toFixed(2),
              ...(reduced ? { background: `rgba(242,181,68,${(c.a * 0.25).toFixed(2)})` } : {}),
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function Closing() {
  const { requestDemo } = useDemoRequest()
  return (
    <section
      id="cierre"
      className="relative overflow-hidden bg-ink pt-32 pb-64 text-center text-white md:pt-40 md:pb-80"
    >
      <div className="sunbeam" aria-hidden="true" />
      <DocumentField />
      <Container className="relative">
        <h2 className="headline mx-auto max-w-[900px] text-[44px] md:text-[72px] lg:text-[80px]">
          Pon tus procesos{' '}
          <Evidence italic onDark>
            bajo contrato
          </Evidence>
          .
        </h2>
        <p className="mx-auto mt-6 max-w-[520px] text-[17px] leading-relaxed text-white/65">
          Una reunión de 30 minutos con tu sector y datos de muestra. Sin compromiso.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => requestDemo('cierre')}>
            Solicitar demostración
          </Button>
          <Button as="a" href={`mailto:${CONTACT_EMAIL}`} size="lg" variant="ghost-dark">
            Escribirnos
          </Button>
        </div>
      </Container>
    </section>
  )
}
