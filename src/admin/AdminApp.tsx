import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { BoardIcon, ListIcon } from '../components/Icons.tsx'
import { adminToken, api } from '../lib/api.ts'
import { ADMIN_BASE } from './paths.ts'
import { BoardPage } from './BoardPage.tsx'
import { Login } from './Login.tsx'
import { QuotesPage } from './QuotesPage.tsx'
import './admin.css'

type Session = 'checking' | 'in' | 'out'

/** The private admin area, served at /0/v1/admin. Everything inside requires the admin login. */
export function AdminApp() {
  const [session, setSession] = useState<Session>(() => (adminToken.get() ? 'checking' : 'out'))

  useEffect(() => {
    document.title = 'Admin | R&R Glimzo'
    if (!adminToken.get()) return
    api<{ authenticated: boolean }>('/admin/me')
      .then(r => setSession(r.authenticated ? 'in' : 'out'))
      .catch(() => setSession('out'))
  }, [])

  const signedOut = useCallback(() => setSession('out'), [])
  const logout = () => {
    adminToken.clear()
    setSession('out')
  }

  if (session === 'checking') return <div className="admin admin-center"><div className="spinner" aria-label="Loading" /></div>
  if (session === 'out') return <Login onSignedIn={() => setSession('in')} />

  return (
    <div className="admin admin-layout">
      <aside className="sidebar">
        <Link className="brand" to={ADMIN_BASE}>
          <span className="brand-mark" aria-hidden="true">R</span>
          <span className="brand-name">R&amp;R <span>Glimzo</span></span>
        </Link>
        <span className="admin-tag">Admin</span>
        <nav className="side-nav" aria-label="Admin">
          <NavLink to={ADMIN_BASE} end><ListIcon />Quotes</NavLink>
          <NavLink to={`${ADMIN_BASE}/board`}><BoardIcon />Board</NavLink>
        </nav>
        <button className="btn btn-quiet side-out" onClick={logout}>Sign out</button>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<QuotesPage onSignedOut={signedOut} />} />
          <Route path="board" element={<BoardPage onSignedOut={signedOut} />} />
          <Route path="*" element={<Navigate to={ADMIN_BASE} replace />} />
        </Routes>
      </main>
    </div>
  )
}
