import { Plus } from 'lucide-react'
import { FAQ } from '../data/content'
import { track } from '../lib/analytics'
import { useDemoRequest } from '../lib/demoRequest'
import { Container, Evidence, Reveal } from './ui'

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export function Faq() {
  const { requestDemo } = useDemoRequest()
  return (
    <section id="preguntas" className="border-t border-ink/6 bg-sheet py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal>
          <p className="mb-5 font-mono text-[12px] tracking-[0.08em] text-ink/55 uppercase">
            Preguntas
          </p>
          <h2 className="headline text-[40px] md:text-[56px]">
            Lo que suelen <Evidence italic>preguntarnos</Evidence>.
          </h2>
          <p className="mt-5 max-w-[400px] text-[17px] leading-relaxed text-ink/65">
            Si su duda no está aquí, la resolvemos en la demostración.
          </p>
          <button
            type="button"
            onClick={() => requestDemo('faq')}
            className="mt-6 text-[15px] font-medium text-solar-ink underline underline-offset-4"
          >
            Solicitar demostración
          </button>
        </Reveal>
        <div className="border-t border-ink/10">
          {FAQ.map((f) => (
            <details
              key={f.q}
              name="faq"
              className="group border-b border-ink/10"
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) track('faq_abierta', { q: f.q })
              }}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-[18px] font-medium tracking-[-0.01em] md:text-[20px]">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-ink/12 transition-transform duration-180 group-open:rotate-45 group-open:bg-solar group-open:ring-solar">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-[620px] pb-7 text-[16px] leading-relaxed text-ink/68">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
    </section>
  )
}
