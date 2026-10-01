import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PRIVACY_PATH } from '../lib/routes.ts'
import { ApiError, submitQuote } from '../lib/api.ts'
import { CONTACT_KEYS } from '../shared/quotes.ts'
import type { RequestKind } from './RequestContext.ts'

interface RequestFormProps {
  kind: RequestKind
  label: string
  intro: string
  submitLabel: string
  /** Pre-selected value from a request link; changing it clears any sent confirmation. */
  preset?: string
  children: ReactNode
}

/** Form values that are not part of the request itself. */
const IGNORED = new Set(['consent', 'website'])

/**
 * Validates the form and sends the request to the R&R Glimzo server, where it is stored for the team to follow up.
 */
export function RequestForm({ kind, label, intro, submitLabel, preset = '', children }: RequestFormProps) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')
  const [prevPreset, setPrevPreset] = useState(preset)

  const reset = () => {
    setState('idle')
    setError('')
  }

  // A request link changed the pre-selected field: any earlier confirmation is out of date.
  if (preset !== prevPreset) {
    setPrevPreset(preset)
    reset()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || state === 'sending') return
    const data = new FormData(form)
    const get = (key: string) => String(data.get(key) ?? '').trim()
    const fields: Record<string, string> = {}
    for (const [key, value] of data.entries()) {
      if (IGNORED.has(key) || (CONTACT_KEYS as readonly string[]).includes(key) || typeof value !== 'string') continue
      if (value.trim()) fields[key] = value.trim()
    }
    setState('sending')
    setError('')
    try {
      await submitQuote({ kind, name: get('name'), email: get('email'), phone: get('phone'), fields, website: get('website') })
      form.reset()
      setState('sent')
    } catch (err) {
      setState('idle')
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form
      id={`${kind}-enquiry`}
      aria-label={label}
      aria-describedby={`${kind}-info`}
      method="post"
      onSubmit={handleSubmit}
      // Any edit after sending starts a fresh request.
      onChange={() => state === 'sent' && reset()}
    >
      <p className="form-intro">{intro}</p>
      <p className="form-info" id={`${kind}-info`}>
        This form sends your request to R&amp;R Glimzo, who will contact you to discuss it.{' '}
        <Link to={PRIVACY_PATH}>How your information is handled</Link>.
      </p>
      {children}
      {/* Honeypot: hidden from people, filled in by simple bots. */}
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="privacy-copy">
        Please include only contact and property details. Read our <Link to={PRIVACY_PATH}>privacy policy</Link>.
      </p>
      <button className="pill" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : submitLabel}
      </button>
      <div className="copy-status request-feedback" role="status" aria-live="polite">
        {error && <span className="is-error">{error}</span>}
        {state === 'sent' && (
          <span className="is-success">
            Thank you, your request has been sent. We will be in touch to discuss it. Dates are subject to confirmation.
          </span>
        )}
      </div>
    </form>
  )
}
