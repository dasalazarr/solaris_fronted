import { CONTACT_EMAIL } from '../lib/site'
import { Container, Logo } from './ui'

const COLUMNS = [
  {
    title: 'Producto',
    links: [
      { label: 'Cómo funciona', href: '#demo' },
      { label: 'Packs', href: '#packs' },
      { label: 'Preguntas', href: '#preguntas' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Illarium', href: '/aviso-legal' },
      { label: 'Contacto', href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Aviso legal', href: '/aviso-legal' },
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-ink py-16 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo withBy />
            <p className="mt-4 max-w-[260px] text-[14px] leading-relaxed text-white/50">
              IA privada para procesos. Respuestas con cita, reglas que se evalúan solas y
              aprobación humana.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className="font-mono text-[11px] tracking-[0.08em] text-white/50 uppercase">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[14px] text-white/70 hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 font-mono text-[11.5px] text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Illarium</span>
          <a href="https://dasalazarr.com" className="hover:text-white/70">
            dasalazarr.com
          </a>
        </div>
      </Container>
    </footer>
  )
}
