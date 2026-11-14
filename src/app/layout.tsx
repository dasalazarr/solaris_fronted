import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import {
  BASE_PATH,
  NOINDEX,
  OPEN_GRAPH_BASE,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  UMAMI_SRC,
  UMAMI_WEBSITE_ID,
} from '@/lib/site'
import { jetbrains, newsreader, schibsted } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // Iconos de public/solaris: Solaris, la mascota (kit en la raíz, mascota/solaris; ADR-0023).
  icons: {
    icon: [
      { url: '/solaris/favicon.ico', sizes: '16x16 32x32' },
      { url: '/solaris/favicon.svg', type: 'image/svg+xml' },
      { url: '/solaris/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/solaris/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/solaris/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/solaris/site.webmanifest',
  alternates: { canonical: BASE_PATH },
  ...(NOINDEX && { robots: { index: false, follow: false } }),
  // Imagen Open Graph 1200×630 pendiente de contenido (PRD landing §10).
  openGraph: OPEN_GRAPH_BASE,
}

export const viewport: Viewport = {
  themeColor: '#0d0f14',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${schibsted.variable} ${newsreader.variable} ${jetbrains.variable}`}
    >
      <body>
        {children}
        {UMAMI_WEBSITE_ID ? (
          <Script src={UMAMI_SRC} data-website-id={UMAMI_WEBSITE_ID} strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  )
}
