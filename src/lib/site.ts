/**
 * Origen público del sitio, sin ruta (p. ej. https://illarium.com). Se define en el despliegue
 * (Vercel) con NEXT_PUBLIC_SITE_URL. Va en metadataBase; las rutas se escriben con BASE_PATH.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

/**
 * Ruta de la landing de Solaris dentro de illarium.com. No es un basePath de Next: los assets y la
 * raíz quedan libres para la futura web de Illarium. "/" redirige aquí (307, vercel.json).
 */
export const BASE_PATH = '/solaris'

/** URL pública de la landing: canonical, og:url y sitemap. */
export const LANDING_URL = `${SITE_URL}${BASE_PATH}`

/** Mientras no haya dominio definitivo, el despliegue se marca como no indexable. */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === 'true'

/** Ruta del producto que recibe el formulario (`/api/solicitud`). Sin ella no hay envío. */
export const SOLICITUD_URL = process.env.NEXT_PUBLIC_SOLICITUD_URL || ''

/**
 * Canal de Solaris: contacto comercial, soporte y plan B del formulario. Único sitio donde se fija:
 * cambiarlo aquí o en NEXT_PUBLIC_CONTACT_EMAIL (Vercel) lo cambia en toda la landing.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'solaris@dasalazarr.com'

/** Enlace de agenda para reservar la llamada. Sin él, el botón no se muestra. */
export const AGENDA_URL = process.env.NEXT_PUBLIC_AGENDA_URL || ''

/** Analítica sin cookies (Umami Cloud). Sin id, no se carga ningún script. */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || ''
export const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js'

export const SITE_TITLE = 'Solaris · IA privada para procesos con contrato'
export const SITE_DESCRIPTION =
  'Solaris responde con la cita exacta de tus documentos, detecta lo que incumple tus reglas y no ejecuta nada sin la aprobación de una persona.'

/** Open Graph común. og:url solo lo declara la portada (/solaris): cada subpágina tiene su canonical. */
export const OPEN_GRAPH_BASE = {
  type: 'website',
  locale: 'es_ES',
  siteName: 'Solaris',
  title: SITE_TITLE,
  description: 'Tus procesos, con contrato.',
} as const
