import { useEffect, useState, type ReactNode } from 'react'

export function SiteHeader({ brandHref, children }: { brandHref: string; children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`top ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="wrap nav" aria-label="Main navigation">
        <a href={brandHref} className="brand">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span className="brand-name">
            R&amp;R <span>Glimzo</span>
          </span>
        </a>
        {children}
      </nav>
    </header>
  )
}
