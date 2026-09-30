import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { BuildingType, DomesticService } from '../data/options.ts'
import {
  REQUEST_KINDS,
  RequestContext,
  type RequestContextValue,
  type RequestKind,
  type RequestTarget,
} from './RequestContext.ts'

function kindFromHash(hash: string): RequestKind | null {
  return REQUEST_KINDS.find(kind => hash === `#${kind}-request`) ?? null
}

export function RequestProvider({ children }: { children: ReactNode }) {
  const [openKind, setOpenKind] = useState<RequestKind | null>(null)
  const [service, setService] = useState<DomesticService | ''>('')
  const [sector, setSector] = useState<BuildingType | ''>('')
  const summaries = useRef<Partial<Record<RequestKind, HTMLElement | null>>>({})

  // Open the matching panel when the page loads with, or navigates to, a request hash.
  useEffect(() => {
    const followHash = () => {
      const kind = kindFromHash(location.hash)
      if (kind) setOpenKind(kind)
    }
    followHash()
    window.addEventListener('hashchange', followHash)
    return () => window.removeEventListener('hashchange', followHash)
  }, [])

  const setPanelOpen = useCallback((kind: RequestKind, open: boolean) => {
    setOpenKind(prev => (open ? kind : prev === kind ? null : prev))
  }, [])

  const request = useCallback((target: RequestTarget) => {
    setOpenKind(target.kind)
    if (target.kind === 'domestic' && target.service) setService(target.service)
    if (target.kind === 'commercial' && target.sector) setSector(target.sector)
    summaries.current[target.kind]?.focus({ preventScroll: true })
  }, [])

  const registerSummary = useCallback((kind: RequestKind, el: HTMLElement | null) => {
    summaries.current[kind] = el
  }, [])

  const value = useMemo<RequestContextValue>(
    () => ({ openKind, setPanelOpen, request, registerSummary, service, setService, sector, setSector }),
    [openKind, setPanelOpen, request, registerSummary, service, sector],
  )

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
}
