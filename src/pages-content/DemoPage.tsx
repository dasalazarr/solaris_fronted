import { Demo } from '../components/Demo'
import { Container, Logo } from '../components/ui'

/**
 * La demo del proceso de compra en su propia página, adonde llevan las publicaciones.
 * Abre con una bienvenida y un recorrido de tres pasos, y cierra con un formulario corto.
 */
export function DemoPage() {
  return (
    <main className="bg-paper">
      <header className="border-b border-ink/8">
        <Container className="flex h-16 items-center justify-between gap-4">
          <a href="/solaris" aria-label="Solaris, ir a la página principal">
            <Logo tone="dark" />
          </a>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] text-white/80">
            <span className="text-solar">●</span> Datos de muestra
          </span>
        </Container>
      </header>
      <Demo standalone />
    </main>
  )
}
