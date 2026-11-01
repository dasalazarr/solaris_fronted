/**
 * URL pública de la landing. Se define en el despliegue (Vercel) con
 * NEXT_PUBLIC_SITE_URL; el dominio definitivo depende de la búsqueda de marca
 * (PRD landing §12), así que aquí no se inventa ninguno.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const SITE_TITLE = 'Solaris · IA privada para sus procesos'
export const SITE_DESCRIPTION =
  'Solaris responde con la cita exacta de sus documentos, detecta lo que incumple sus reglas y no ejecuta nada sin la aprobación de una persona.'
