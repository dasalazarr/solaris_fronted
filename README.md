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

- `src/app/` — la landing vive en `src/app/solaris/` (`/solaris`, `/solaris/demo`, `/solaris/solicitar` y legales). En la raíz quedan el layout, la 404, `sitemap.xml` y `robots.txt`; `/` redirige a `/solaris` (307) desde `vercel.json`, a la espera de la home de Illarium.
- `src/pages-content/` — composición de las páginas (no se llama `pages/` para no activar el Pages Router).
- `src/components/` — secciones. Solo las que tienen estado llevan `'use client'`; el resto se renderiza en el build.
- `src/data/content.ts` — textos, packs, FAQ (también alimenta el JSON-LD de FAQPage).

## Despliegue

Vercel, como sitio estático. Variable de entorno: `NEXT_PUBLIC_SITE_URL` (origen público sin ruta, `https://illarium.com`, para canonical, sitemap y Open Graph). Sin ella se usa `http://localhost:3000`. La ruta `/solaris` es `BASE_PATH` en `src/lib/site.ts` (no es basePath de Next).

Redirecciones en `vercel.json`: `/` → `/solaris` temporal (307) y `solaris.dasalazarr.com/*` → `https://illarium.com/solaris/*` permanente (308), con la query string.
