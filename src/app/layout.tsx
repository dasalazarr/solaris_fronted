import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import { NOINDEX, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, UMAMI_SRC, UMAMI_WEBSITE_ID } from '@/lib/site'
import { jetbrains, newsreader, schibsted } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  alternates: { canonical: '/' },
  ...(NOINDEX && { robots: { index: false, follow: false } }),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Solaris',
    title: SITE_TITLE,
    description: 'Sus procesos, con contrato.',
    // Imagen Open Graph 1200×630 pendiente de contenido (PRD landing §10).
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0f14',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${schibsted.variable} ${newsreader.variable} ${jetbrains.variable}`}>
      <body>
        {children}
        {UMAMI_WEBSITE_ID ? (
          <Script src={UMAMI_SRC} data-website-id={UMAMI_WEBSITE_ID} strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  )
}
