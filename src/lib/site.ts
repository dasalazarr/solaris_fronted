/**
 * URL pública de la landing. Se define en el despliegue (Vercel) con
 * NEXT_PUBLIC_SITE_URL; el dominio definitivo depende de la búsqueda de marca
 * (PRD landing §12), así que aquí no se inventa ninguno.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Mientras no haya dominio definitivo, el despliegue se marca como no indexable. */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === 'true'

/** Ruta del producto que recibe el formulario (`/api/solicitud`). Sin ella no hay envío. */
export const SOLICITUD_URL = process.env.NEXT_PUBLIC_SOLICITUD_URL || ''

/** Canal de Solaris: contacto comercial, soporte y plan B del formulario. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'solaris@dasalazarr.com'

/** Enlace de agenda para reservar la llamada. Sin él, el botón no se muestra. */
export const AGENDA_URL = process.env.NEXT_PUBLIC_AGENDA_URL || ''

/** Analítica sin cookies (Umami Cloud). Sin id, no se carga ningún script. */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || ''
export const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js'

export const SITE_TITLE = 'Solaris · IA privada para procesos con contrato'
export const SITE_DESCRIPTION =
  'Solaris responde con la cita exacta de sus documentos, detecta lo que incumple sus reglas y no ejecuta nada sin la aprobación de una persona.'
