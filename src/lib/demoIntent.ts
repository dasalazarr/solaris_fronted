import { useEffect, useRef } from 'react'

/**
 * Estado con el que otra sección pide abrir la demostración: la captura del
 * hero lleva a la cita pulsada o a la aprobación, no al principio de la demo.
 */
export type DemoIntent = { tab: 'Preguntar'; cite: number } | { tab: 'Revisar' }

/** Ancla de la ventana de la demo (pestañas incluidas), no del título de la sección. */
export const DEMO_APP_ID = 'demo-app'

/**
 * Ancla del panel de evidencia. En pantallas estrechas queda debajo de la
 * respuesta: quien pulsa una cita tiene que aterrizar en el párrafo citado.
 */
export const DEMO_EVIDENCE_ID = 'demo-evidencia'
/** A partir de aquí la respuesta y la evidencia van lado a lado (`lg` de Tailwind). */
export const DEMO_SIDE_BY_SIDE = '(min-width: 1024px)'

const EVENT = 'solaris:demo-intent'

export function openDemo(intent: DemoIntent) {
  window.dispatchEvent(new CustomEvent<DemoIntent>(EVENT, { detail: intent }))
}

export function useDemoIntent(handler: (intent: DemoIntent) => void) {
  const latest = useRef(handler)
  useEffect(() => {
    latest.current = handler
  })
  useEffect(() => {
    const onIntent = (e: Event) => latest.current((e as CustomEvent<DemoIntent>).detail)
    window.addEventListener(EVENT, onIntent)
    return () => window.removeEventListener(EVENT, onIntent)
  }, [])
}
