import type { Metadata } from 'next'
import { BASE_PATH } from '@/lib/site'
import { Landing } from '@/pages-content/Landing'

export const metadata: Metadata = {
  title: 'Solicitar demostración · Solaris',
  alternates: { canonical: `${BASE_PATH}/solicitar` },
}

export default function SolicitarPage() {
  return <Landing formOpen />
}
