import { StructuredData } from '@/components/StructuredData'
import { Landing } from '@/pages-content/Landing'
import type { Metadata } from 'next'
import { BASE_PATH, OPEN_GRAPH_BASE } from '@/lib/site'

export const metadata: Metadata = {
  openGraph: { ...OPEN_GRAPH_BASE, url: BASE_PATH },
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Landing />
    </>
  )
}
