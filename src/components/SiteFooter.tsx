import type { ReactNode } from 'react'

export function SiteFooter({ children }: { children: ReactNode }) {
  return (
    <footer>
      <div className="wrap footer-row">
        <strong>R&amp;R Glimzo · We clean. You unwind.</strong>
        <div className="footer-links">{children}</div>
      </div>
    </footer>
  )
}
