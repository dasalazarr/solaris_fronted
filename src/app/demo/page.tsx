import type { Metadata } from 'next'
import { DemoPage } from '@/pages-content/DemoPage'

export const metadata: Metadata = {
  title: 'Demo del proceso de compra · Solaris',
  description: 'Pruebe Solaris con datos de muestra: preguntas con cita, huecos detectados por reglas y aprobación humana.',
  alternates: { canonical: '/demo' },
}

export default DemoPage
