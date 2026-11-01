import { FAQ } from '@/data/content'
import { SITE_DESCRIPTION, SITE_URL } from '@/lib/site'

/** Datos estructurados (PRD landing §9): Organization, SoftwareApplication y FAQPage. */
export function StructuredData() {
  const graph = [
    { '@type': 'Organization', '@id': `${SITE_URL}/#illarium`, name: 'Illarium', url: SITE_URL },
    {
      '@type': 'SoftwareApplication',
      name: 'Solaris',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, instalación local',
      description: SITE_DESCRIPTION,
      inLanguage: 'es',
      publisher: { '@id': `${SITE_URL}/#illarium` },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
  return (
    <script
      type="application/ld+json"
      // JSON generado a partir de contenido propio; se escapa '<' para no cerrar la etiqueta.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c'),
      }}
    />
  )
}
