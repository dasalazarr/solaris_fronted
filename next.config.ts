import type { NextConfig } from 'next'

// Guarda de noindex: mientras no se decida indexar la landing (STATUS, bloqueo legal), un build de
// producción sin NEXT_PUBLIC_NOINDEX=true falla en lugar de publicar una página indexable. Entre el
// 02/11 y el 04/11 se publicó sin noindex por un valor distinto de `true` en Vercel.
// Para indexar a propósito: SOLARIS_PERMITIR_INDEXAR=true en el entorno de producción.
if (
  process.env.VERCEL_ENV === 'production' &&
  process.env.NEXT_PUBLIC_NOINDEX !== 'true' &&
  process.env.SOLARIS_PERMITIR_INDEXAR !== 'true'
) {
  throw new Error(
    'Build de producción sin noindex: NEXT_PUBLIC_NOINDEX debe ser exactamente "true" ' +
      '(o SOLARIS_PERMITIR_INDEXAR=true si se ha decidido indexar).',
  )
}

// Exportación estática (PRD landing §8): `next build` genera `out/`, servible desde Vercel o cualquier CDN.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
}

export default nextConfig
