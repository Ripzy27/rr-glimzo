import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { api } from '../lib/api.ts'
import { ADMIN_BASE } from './paths.ts'
import { BoardPage } from './BoardPage.tsx'
import { Login } from './Login.tsx'
import { QuotesPage } from './QuotesPage.tsx'
import './admin.css'

const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}

function navigate(to: string) {
  history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

type Session = 'checking' | 'in' | 'out'

/** The private admin area, served at /0/v1/admin. Everything inside requires the admin login. */
export function AdminApp() {
  const path = useSyncExternalStore(subscribe, () => location.pathname.replace(/\/+$/, ''))
  const [session, setSession] = useState<Session>('checking')

  useEffect(() => {
    document.title = 'Admin | R&R Glimzo'
    api<{ authenticated: boolean }>('/admin/me')
      .then(r => setSession(r.authenticated ? 'in' : 'out'))
      .catch(() => setSession('out'))
  }, [])

  const signedOut = useCallback(() => setSession('out'), [])
  const logout = async () => {
    await api('/admin/logout', { method: 'POST', body: {} }).catch(() => {})
    setSession('out')
  }

  if (session === 'checking') return <div className="admin admin-center"><div className="spinner" aria-label="Loading" /></div>
  if (session === 'out') return <Login onSignedIn={() => setSession('in')} />

  const onBoard = path === `${ADMIN_BASE}/board`
  const link = (to: string, label: string, active: boolean) => (
    <a
      href={to}
      className={active ? 'is-active' : ''}
      aria-current={active ? 'page' : undefined}
      onClick={e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        navigate(to)
      }}
    >
      {label}
    </a>
  )

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-bar">
          <a className="brand" href={ADMIN_BASE} onClick={e => (e.preventDefault(), navigate(ADMIN_BASE))}>
            <span className="brand-mark" aria-hidden="true">R</span>
            <span className="brand-name">R&amp;R <span>Glimzo</span></span>
            <span className="admin-tag">Admin</span>
          </a>
          <nav className="admin-nav" aria-label="Admin">
            {link(ADMIN_BASE, 'Quotes', !onBoard)}
            {link(`${ADMIN_BASE}/board`, 'Board', onBoard)}
          </nav>
          <button className="btn btn-quiet" onClick={logout}>Sign out</button>
        </div>
      </header>
      <main className="admin-main">
        {onBoard ? <BoardPage onSignedOut={signedOut} /> : <QuotesPage onSignedOut={signedOut} />}
      </main>
    </div>
  )
}
