import type { MetadataRoute } from 'next'
import { NOINDEX, SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  // Con NOINDEX se permite rastrear para que los buscadores lean la etiqueta noindex.
  if (NOINDEX) return { rules: { userAgent: '*', allow: '/' } }
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}/sitemap.xml` }
}
