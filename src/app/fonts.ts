import localFont from 'next/font/local'

/*
 * Fuentes autoalojadas (los mismos woff2 de @fontsource) cargadas con next/font:
 * precarga y fuente de reserva con métricas ajustadas, para que el cambio de
 * fuente no mueva el layout (CLS). Sin red en build ni en runtime.
 */
export const schibsted = localFont({
  src: [
    { path: '../../node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-500-normal.woff2', weight: '500' },
    { path: '../../node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-600-normal.woff2', weight: '600' },
  ],
  variable: '--font-schibsted',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const newsreader = localFont({
  src: [
    { path: '../../node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/newsreader/files/newsreader-latin-400-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-newsreader',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
  fallback: ['ui-serif', 'Georgia', 'serif'],
})

export const jetbrains = localFont({
  src: [
    { path: '../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2', weight: '400' },
    { path: '../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-jetbrains',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'monospace'],
})
