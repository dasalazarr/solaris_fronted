/**
 * Datos del responsable del tratamiento (RGPD art. 13). No se inventan: se leen
 * del entorno del despliegue. Si falta alguno, la página de privacidad lo marca
 * como pendiente de forma visible.
 */
export const LEGAL_NAME = process.env.NEXT_PUBLIC_LEGAL_NAME || ''
export const LEGAL_ID = process.env.NEXT_PUBLIC_LEGAL_ID || ''
export const LEGAL_ADDRESS = process.env.NEXT_PUBLIC_LEGAL_ADDRESS || ''

/** Texto jurídico revisado por una persona cualificada. Sin esto, la página muestra el aviso de borrador. */
export const PRIVACY_REVIEWED = process.env.NEXT_PUBLIC_PRIVACY_REVIEWED === 'true'

/** Fecha de la última revisión del texto. Se cambia al editarlo. */
export const PRIVACY_UPDATED = '7 de noviembre de 2026'

/** Aviso legal y Cookies revisados por una persona cualificada. Sin esto, muestran el aviso de borrador. */
export const LEGAL_PAGES_REVIEWED = process.env.NEXT_PUBLIC_LEGAL_PAGES_REVIEWED === 'true'

/** Fecha de la última revisión de las páginas Aviso legal y Cookies. */
export const LEGAL_PAGES_UPDATED = '2 de noviembre de 2026'
