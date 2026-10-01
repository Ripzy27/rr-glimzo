import { useState, type FormEvent } from 'react'
import { adminToken, api } from '../lib/api.ts'

export function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    try {
      const { token } = await api<{ token: string }>('/admin/login', {
        method: 'POST',
        body: { email: data.get('email'), password: data.get('password') },
      })
      adminToken.set(token)
      onSignedIn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(false)
    }
  }

  return (
    <div className="admin admin-center">
      <form className="login" onSubmit={submit}>
        <span className="brand-mark" aria-hidden="true">R</span>
        <h1>Admin sign in</h1>
        <p>R&amp;R Glimzo team only.</p>
        <label className="a-field">
          Email
          <input name="email" type="email" autoComplete="username" required autoFocus />
        </label>
        <label className="a-field">
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <div className="a-error" role="alert">{error}</div>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
