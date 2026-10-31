'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../data/content'
import { useDemoRequest } from '../lib/demoRequest'
import { Button, Logo, cx } from './ui'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { requestDemo } = useDemoRequest()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40 h-16 transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled
          ? 'border-b border-white/8 bg-ink/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-full max-w-[1200px] items-center gap-6 px-5 md:px-8 xl:px-0"
      >
        <a href="#top" className="shrink-0" aria-label="Solaris, inicio">
          <Logo />
        </a>
        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[14px] text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button size="sm" onClick={() => requestDemo('nav')}>
            <span className="sm:hidden">Demostración</span>
            <span className="hidden sm:inline">Solicitar demostración</span>
          </Button>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-white ring-1 ring-white/15 lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-4.5" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="fixed inset-0 z-50 flex flex-col bg-ink px-5 pt-4 pb-8 lg:hidden"
        >
          <div className="flex h-8 items-center justify-between">
            <Logo withBy />
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full text-white ring-1 ring-white/15"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
              autoFocus
            >
              <X className="size-4.5" />
            </button>
          </div>
          <ul className="mt-12 flex flex-col">
            {NAV_LINKS.map((l) => (
              <li key={l.href} className="border-b border-white/8">
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-[28px] font-semibold tracking-[-0.02em] text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            size="lg"
            className="mt-auto w-full"
            onClick={() => {
              setMenuOpen(false)
              requestDemo('nav-movil')
            }}
          >
            Solicitar demostración
          </Button>
        </div>
      )}
    </header>
  )
}
