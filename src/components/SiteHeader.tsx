import type { ReactNode } from 'react'

export function SiteHeader({ brandHref, children }: { brandHref: string; children: ReactNode }) {
  return (
    <header className="top">
      <nav className="wrap nav" aria-label="Main navigation">
        <a href={brandHref} className="brand">
          R&amp;R <span>Glimzo</span>
        </a>
        {children}
      </nav>
    </header>
  )
}
