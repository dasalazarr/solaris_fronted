import type { Metadata } from 'next'
import { Landing } from '@/pages-content/Landing'

export const metadata: Metadata = {
  title: 'Solicitar demostración · Solaris',
  alternates: { canonical: '/solicitar' },
}

export default function SolicitarPage() {
  return <Landing formOpen />
}
