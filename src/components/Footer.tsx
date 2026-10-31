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
    title: 'Recursos',
    links: [
      { label: 'Diario', href: 'https://dasalazarr.com/diario' },
      { label: 'Ensayos', href: 'https://dasalazarr.com/ensayos' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Illarium', href: '#' },
      { label: 'Contacto', href: 'mailto:hola@illarium.com' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Aviso legal', href: '#' },
      { label: 'Privacidad', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-ink py-16 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo withBy />
            <p className="mt-4 max-w-[260px] text-[14px] leading-relaxed text-white/50">
              IA privada para procesos. Respuestas con cita, reglas que se evalúan solas y
              aprobación humana.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className="font-mono text-[11px] tracking-[0.08em] text-white/40 uppercase">
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
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 font-mono text-[11.5px] text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Illarium</span>
          <a href="https://dasalazarr.com" className="hover:text-white/70">
            dasalazarr.com
          </a>
        </div>
      </Container>
    </footer>
  )
}
