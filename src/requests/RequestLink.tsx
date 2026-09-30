import type { ReactNode } from 'react'
import { useRequests, type RequestTarget } from './RequestContext.ts'

type RequestLinkProps = RequestTarget & { className?: string; children: ReactNode }

/** In-page link that opens a request panel and applies any pre-selection. */
export function RequestLink({ className, children, ...target }: RequestLinkProps) {
  const { request } = useRequests()
  return (
    <a className={className} href={`#${target.kind}-request`} onClick={() => request(target)}>
      {children}
    </a>
  )
}
