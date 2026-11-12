import type { Metadata } from 'next'
import { BASE_PATH } from '@/lib/site'
import { AvisoLegalPage } from '@/pages-content/AvisoLegalPage'

export const metadata: Metadata = {
  title: 'Aviso legal · Solaris',
  description:
    'Titular de la web de Solaris, condiciones de uso, alcance de la demo y propiedad intelectual.',
  alternates: { canonical: `${BASE_PATH}/aviso-legal` },
}

export default AvisoLegalPage
