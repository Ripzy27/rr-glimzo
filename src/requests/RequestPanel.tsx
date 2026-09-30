import type { ReactNode } from 'react'
import { useRequests, type RequestKind } from './RequestContext.ts'

interface RequestPanelProps {
  kind: RequestKind
  title: string
  children: ReactNode
}

/** Collapsible panel for one request form; opening one closes the other. */
export function RequestPanel({ kind, title, children }: RequestPanelProps) {
  const { openKind, setPanelOpen, registerSummary } = useRequests()
  return (
    <details
      className="request-panel"
      id={`${kind}-request`}
      open={openKind === kind}
      onToggle={event => setPanelOpen(kind, event.currentTarget.open)}
    >
      <summary ref={el => registerSummary(kind, el)}>{title}</summary>
      {children}
    </details>
  )
}
