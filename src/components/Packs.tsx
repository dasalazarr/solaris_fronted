import { MapPinned, Scale, ShieldCheck, ShoppingCart } from 'lucide-react'
import { PACKS } from '../data/content'
import { Container, Evidence, Reveal, SectionTitle, cx } from './ui'

const ICONS = {
  cart: ShoppingCart,
  scale: Scale,
  shield: ShieldCheck,
  map: MapPinned,
}

const TONES = {
  solar: 'bg-solar-soft text-solar-ink',
  lavanda: 'bg-lavanda text-lavanda-ink',
  salvia: 'bg-salvia text-salvia-ink',
  niebla: 'bg-niebla text-niebla-ink',
}

export function Packs() {
  return (
    <section id="packs" className="scroll-mt-10 bg-paper pb-24 md:pb-32">
      <Container>
        <SectionTitle eyebrow="Packs por proceso">
          Un motor. Un pack por <Evidence italic>proceso</Evidence>.
        </SectionTitle>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {PACKS.map((p, i) => {
            const Icon = ICONS[p.icon]
            return (
              <Reveal
                key={p.name}
                delay={(i % 2) * 80}
                tabIndex={0}
                className={cx(
                  'group relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl p-7 transition-transform duration-180 ease-out hover:-translate-y-1 focus-visible:-translate-y-1 md:p-9',
                  TONES[p.tone],
                )}
              >
                <span className="w-fit rounded-full bg-white/60 px-3 py-1 font-mono text-[11px]">
                  {p.status}
                </span>
                <div className="mt-auto pr-24">
                  <h3 className="headline text-[32px] md:text-[40px]">{p.name}</h3>
                  <p className="mt-2 text-[16px] opacity-80">{p.line}</p>
                </div>
                <Icon
                  aria-hidden="true"
                  strokeWidth={2.2}
                  className="absolute right-7 bottom-7 size-16 transition-transform duration-180 ease-out group-hover:rotate-6 group-focus-visible:rotate-6 md:right-9 md:bottom-9 md:size-20"
                />
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
