import type { NextConfig } from 'next'

// Exportación estática (PRD landing §8): `next build` genera `out/`, servible desde Vercel o cualquier CDN.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
}

export default nextConfig
