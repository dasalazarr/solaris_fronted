import type { Metadata } from 'next'
import { BASE_PATH } from '@/lib/site'
import { DemoPage } from '@/pages-content/DemoPage'

export const metadata: Metadata = {
  title: 'Demo del proceso de compra · Solaris',
  description:
    'Prueba Solaris con datos de muestra: preguntas con cita, huecos detectados por reglas y aprobación humana.',
  alternates: { canonical: `${BASE_PATH}/demo` },
}

export default DemoPage
