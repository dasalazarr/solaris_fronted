import type { Metadata } from 'next'
import { BASE_PATH } from '@/lib/site'
import { PrivacidadPage } from '@/pages-content/PrivacidadPage'

export const metadata: Metadata = {
  title: 'Política de privacidad · Solaris',
  description:
    'Qué datos trata Solaris cuando solicita una demostración o usa la demo, con qué fin, quién los recibe y cómo ejercer sus derechos.',
  alternates: { canonical: `${BASE_PATH}/privacidad` },
}

export default PrivacidadPage
