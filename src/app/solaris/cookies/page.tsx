import type { Metadata } from 'next'
import { BASE_PATH } from '@/lib/site'
import { CookiesPage } from '@/pages-content/CookiesPage'

export const metadata: Metadata = {
  title: 'Política de cookies · Solaris',
  description:
    'Qué cookies usa Solaris: ninguna en la web informativa y una cookie técnica en la demo.',
  alternates: { canonical: `${BASE_PATH}/cookies` },
}

export default CookiesPage
