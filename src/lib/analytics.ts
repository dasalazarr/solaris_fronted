// Cookieless analytics shim (Plausible / Umami). No-ops until the script is loaded.
type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Props }) => void
    umami?: { track: (event: string, data?: Props) => void }
  }
}

export function track(event: string, props?: Props) {
  if (typeof window === 'undefined') return
  window.plausible?.(event, props ? { props } : undefined)
  window.umami?.track(event, props)
  if (process.env.NODE_ENV === 'development') console.debug('[analytics]', event, props ?? '')
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

/** UTM params from the landing URL, kept for the whole session until form submit. */
export function getUtm(): Record<string, string> {
  const out: Record<string, string> = {}
  try {
    const stored = sessionStorage.getItem('solaris-utm')
    if (stored) return JSON.parse(stored)
    const params = new URLSearchParams(window.location.search)
    for (const k of UTM_KEYS) {
      const v = params.get(k)
      if (v) out[k] = v
    }
    sessionStorage.setItem('solaris-utm', JSON.stringify(out))
  } catch {
    /* storage unavailable */
  }
  return out
}
