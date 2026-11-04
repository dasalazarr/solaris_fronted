'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Profile } from '../data/content'
import { track } from './analytics'

type DemoRequestCtx = {
  open: boolean
  origin: string
  /** Perfil marcado en el formulario. Vacío salvo que se abra desde un botón de audiencia. */
  perfil: Profile | ''
  setPerfil: (p: Profile | '') => void
  /** Proceso marcado en el formulario. Lo fija el botón del pack o de la demo. */
  proceso: string
  setProceso: (p: string) => void
  requestDemo: (origin: string, perfil?: Profile, proceso?: string) => void
  close: () => void
}

const Ctx = createContext<DemoRequestCtx | null>(null)

export function DemoRequestProvider({
  children,
  initialOpen = false,
}: {
  children: ReactNode
  initialOpen?: boolean
}) {
  const [open, setOpen] = useState(initialOpen)
  const [origin, setOrigin] = useState(initialOpen ? 'url' : '')
  const [perfil, setPerfil] = useState<Profile | ''>('')
  const [proceso, setProceso] = useState('')
  const requestDemo = useCallback((from: string, as?: Profile, process?: string) => {
    track('cta_solicitar_demo', { section: from })
    track('form_abierto', { section: from, perfil: as ?? '' })
    setOrigin(from)
    setPerfil(as ?? '')
    if (process) setProceso(process)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const value = useMemo(
    () => ({ open, origin, perfil, setPerfil, proceso, setProceso, requestDemo, close }),
    [open, origin, perfil, proceso, requestDemo, close],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDemoRequest() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDemoRequest must be used inside DemoRequestProvider')
  return ctx
}
