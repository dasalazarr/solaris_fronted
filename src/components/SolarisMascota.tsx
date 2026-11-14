'use client'

import { useEffect, useId, useRef } from 'react'

/**
 * Solaris, la mascota (kit en la raíz: mascota/solaris, ADR-0023).
 * SVG en línea con la geometría del kit: el aura pasa por detrás y por delante del cuerpo,
 * que es lo que da la profundidad. Los colores son los del kit y solo viven aquí; la
 * interfaz sigue con `solar` (docs/marca.md).
 *
 * Estados honestos (principio 4): `pensando` solo mientras hay una consulta en curso.
 * Copia de product/components/SolarisMascota.tsx: si cambias una, cambia la otra.
 */
export type EstadoMascota = 'reposo' | 'pensando'

const ANILLO = 'M -165 0 A 165 38 0 0 1 165 0'
const ANILLO_DELANTE = 'M -165 0 A 165 38 0 0 0 165 0'

export function SolarisMascota({
  size = 48,
  estado = 'reposo',
  flota = false,
  sigue = false,
  label,
  className = '',
}: {
  size?: number
  estado?: EstadoMascota
  /** Flotación lenta (6 s). Para apariciones grandes, no para la interfaz densa. */
  flota?: boolean
  /** Los ojos y el aura siguen al puntero con un desplazamiento mínimo. */
  sigue?: boolean
  /** Sin `label` es decorativa (aria-hidden). */
  label?: string
  className?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const ref = useRef<SVGSVGElement>(null)
  const micro = size <= 32

  useEffect(() => {
    if (!sigue) return
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reduce.matches || !fino.matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const mx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)))
        const my = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)))
        el.style.setProperty('--sol-mx', mx.toFixed(3))
        el.style.setProperty('--sol-my', my.toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [sigue])

  const id = (n: string) => `sol-${n}-${uid}`
  const anilloAncho = micro ? 18 : 9
  const ojos = micro
    ? [
        { x: 16, y: -20, rx: 15, ry: 31 },
        { x: 68, y: -34, rx: 13, ry: 30 },
      ]
    : [
        { x: 22, y: -24, rx: 10, ry: 21.5 },
        { x: 71, y: -37, rx: 8.5, ry: 21 },
      ]

  const anillo = (d: string, delante: boolean) => (
    <g className="sol-estado sol-anillo" fill="none" stroke="#FFE08A" strokeLinecap="round">
      <g className="sol-oscila">
        {!micro && (
          <path
            d={d}
            stroke={delante ? '#F8C94F' : undefined}
            strokeWidth={delante ? 19.8 : 18}
            opacity={delante ? 0.4 : 0.19}
            filter={`url(#${id('blur')})`}
          />
        )}
        <path d={d} strokeWidth={anilloAncho} opacity={delante ? 1 : 0.85} />
        {delante && !micro && (
          <g className="sol-chispa">
            <circle
              cx="95"
              cy="31"
              r="16"
              fill="#FFFBEA"
              opacity=".6"
              filter={`url(#${id('eb')})`}
            />
            <circle cx="95" cy="31" r="7" fill="#FFFBEA" />
          </g>
        )}
      </g>
    </g>
  )

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="-200 -200 400 400"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-estado={estado}
      className={`sol-mascota sol-${estado} ${flota ? 'sol-flotar' : ''} shrink-0 overflow-visible ${className}`}
    >
      <defs>
        <radialGradient id={id('body')} cx="36%" cy="28%" r="80%">
          <stop offset="0" stopColor="#FFF1BE" />
          <stop offset=".42" stopColor="#F8C94F" />
          <stop offset=".82" stopColor="#DCA040" />
          <stop offset="1" stopColor="#D29A3A" />
        </radialGradient>
        <radialGradient id={id('glow')}>
          <stop offset=".55" stopColor="#F8C94F" stopOpacity=".6" />
          <stop offset="1" stopColor="#F8C94F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('rim')} x1="85%" y1="5%" x2="15%" y2="95%">
          <stop offset="0" stopColor="#EDBE55" />
          <stop offset="1" stopColor="#D29A3A" />
        </linearGradient>
        <filter id={id('blur')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={id('eb')} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {!micro && (
        <circle className="sol-glow" r="180" fill={`url(#${id('glow')})`} opacity="0.41" />
      )}
      <g className="sol-parallax-aura">{anillo(ANILLO, false)}</g>
      <g className="sol-parallax-cuerpo">
        <ellipse
          cx="-2.5"
          cy="2.5"
          rx={micro ? 122 : 119}
          ry={micro ? 112 : 109}
          fill={`url(#${id('rim')})`}
        />
        <ellipse rx="112" ry="102" fill={`url(#${id('body')})`} />
        {!micro && (
          <path
            d="M -84.6 -27.4 Q -73.2 -56.8 -36.6 -73.1"
            fill="none"
            stroke="#fff"
            strokeWidth="15"
            strokeLinecap="round"
            opacity=".5"
          />
        )}
      </g>
      <g className="sol-parallax-ojos">
        <g className="sol-estado sol-mirada">
          {ojos.map((o) => (
            <g key={o.x} transform={`translate(${o.x} ${o.y}) rotate(-25)`}>
              <ellipse className="sol-eye" rx={o.rx} ry={o.ry} fill="#1A1206" />
            </g>
          ))}
        </g>
      </g>
      <g className="sol-parallax-aura">{anillo(ANILLO_DELANTE, true)}</g>
    </svg>
  )
}
