'use client'

import { useEffect } from 'react'
import { getUtm, track } from '../lib/analytics'

function useScrollDepth() {
  useEffect(() => {
    getUtm()
    const seen = new Set<number>()
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = (window.scrollY / max) * 100
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark - 1 && !seen.has(mark)) {
          seen.add(mark)
          track('scroll', { profundidad: mark })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/** Deep links: /#packs or /?seccion=packs scroll to that section once rendered. */
function useInitialSection() {
  useEffect(() => {
    const id =
      new URLSearchParams(window.location.search).get('seccion') || window.location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      // Let scroll-driven UI (nav background, loop) update in the same frame.
      window.dispatchEvent(new Event('scroll'))
    })
  }, [])
}

/** Efectos de página sin interfaz: profundidad de scroll, UTM y enlaces profundos. */
export function PageEffects() {
  useScrollDepth()
  useInitialSection()
  return null
}
