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
  // Iconos de public/solaris (sol dorado). Sin SVG: el arte es un raster y un SVG con PNG
  // incrustado pesaba 2,9 MB.
  icons: {
    icon: [
      { url: '/solaris/favicon.ico', sizes: '16x16 32x32' },
      { url: '/solaris/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/solaris/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/solaris/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/solaris/site.webmanifest',
  alternates: { canonical: '/' },
  ...(NOINDEX && { robots: { index: false, follow: false } }),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Solaris',
    title: SITE_TITLE,
    description: 'Tus procesos, con contrato.',
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
