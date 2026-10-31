'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { track } from './analytics'

type DemoRequestCtx = {
  open: boolean
  origin: string
  requestDemo: (origin: string) => void
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
  const requestDemo = useCallback((from: string) => {
    track('cta_solicitar_demo', { section: from })
    track('form_abierto', { section: from })
    setOrigin(from)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const value = useMemo(
    () => ({ open, origin, requestDemo, close }),
    [open, origin, requestDemo, close],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDemoRequest() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDemoRequest must be used inside DemoRequestProvider')
  return ctx
}
