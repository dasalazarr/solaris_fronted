import type { MetadataRoute } from 'next'
import { LANDING_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/demo', '/solicitar', '/privacidad', '/aviso-legal', '/cookies'].map((path) => ({
    url: `${LANDING_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.6,
  }))
}
