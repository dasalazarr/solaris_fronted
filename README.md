# Solaris · landing

Landing comercial de Solaris, un producto de Illarium. Requisitos en `docs/prd-landing.md` del repositorio raíz `solaris`; identidad en `docs/marca.md`.

## Stack

Next.js 15 (App Router) con exportación estática (`output: 'export'`), Tailwind 4 con los tokens de marca en `src/app/globals.css`, fuentes autoalojadas con `@fontsource`.

## Comandos

```bash
pnpm install
pnpm dev        # desarrollo en http://localhost:3000
pnpm lint       # oxlint + tsc
pnpm build      # genera out/ (HTML estático)
pnpm start      # sirve out/ en local
```

## Estructura

- `src/app/` — rutas: `/`, `/demo`, `/solicitar`, 404, `sitemap.xml`, `robots.txt`.
- `src/pages-content/` — composición de las páginas (no se llama `pages/` para no activar el Pages Router).
- `src/components/` — secciones. Solo las que tienen estado llevan `'use client'`; el resto se renderiza en el build.
- `src/data/content.ts` — textos, packs, FAQ (también alimenta el JSON-LD de FAQPage).

## Despliegue

Vercel, como sitio estático. Variable de entorno: `NEXT_PUBLIC_SITE_URL` (URL pública, para canonical, sitemap y Open Graph). Sin ella se usa `http://localhost:3000`.
