import { createContext, useContext } from 'react'
import type { BuildingType, DomesticService } from '../data/options.ts'

export type RequestKind = 'domestic' | 'commercial'

/** Which request panel to open, optionally pre-selecting its service or building type. */
export type RequestTarget =
  | { kind: 'domestic'; service?: DomesticService }
  | { kind: 'commercial'; sector?: BuildingType }

export interface RequestContextValue {
  /** The request panel currently expanded; only one is open at a time. */
  openKind: RequestKind | null
  setPanelOpen: (kind: RequestKind, open: boolean) => void
  /** Opens a panel, focuses its summary and applies any pre-selection. */
  request: (target: RequestTarget) => void
  registerSummary: (kind: RequestKind, el: HTMLElement | null) => void
  service: DomesticService | ''
  setService: (value: DomesticService | '') => void
  sector: BuildingType | ''
  setSector: (value: BuildingType | '') => void
}

export const RequestContext = createContext<RequestContextValue | null>(null)

export function useRequests(): RequestContextValue {
  const value = useContext(RequestContext)
  if (!value) throw new Error('useRequests must be used inside <RequestProvider>')
  return value
}
