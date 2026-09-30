import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CONTACT_EMAIL } from '../data/contact.ts'
import { PRIVACY_HASH } from '../lib/routes.ts'
import { buildRequest, requestGmail, type RequestEmail } from '../lib/requestText.ts'
import type { RequestKind } from './RequestContext.ts'

interface RequestFormProps {
  kind: RequestKind
  label: string
  intro: string
  submitLabel: string
  /** Pre-selected value from a request link; changing it clears any prepared request. */
  preset: string
  children: ReactNode
}

/**
 * Validates the form and prepares an email to R&R Glimzo for the visitor to open in Gmail or copy.
 * Nothing is sent: the text stays on the visitor's device.
 */
export function RequestForm({ kind, label, intro, submitLabel, preset, children }: RequestFormProps) {
  const [email, setEmail] = useState<RequestEmail | null>(null)
  const [status, setStatus] = useState('')
  const [prevPreset, setPrevPreset] = useState(preset)
  const summaryRef = useRef<HTMLTextAreaElement>(null)

  const reset = () => {
    setEmail(null)
    setStatus('')
  }

  // A request link changed the pre-selected field: the prepared text is out of date.
  if (preset !== prevPreset) {
    setPrevPreset(preset)
    reset()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    setEmail(buildRequest(kind, new FormData(form)))
    setStatus('')
  }

  const handleCopy = async () => {
    const textarea = summaryRef.current
    if (!textarea) return
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(textarea.value)
      setStatus(`Request copied. Paste it into an email to ${CONTACT_EMAIL}. Nothing has been sent automatically.`)
    } catch {
      textarea.focus()
      textarea.select()
      setStatus('Automatic copying is unavailable. Your request is selected; use your device’s Copy command.')
    }
  }

  return (
    <form
      id={`${kind}-enquiry`}
      aria-label={label}
      aria-describedby={`${kind}-info`}
      method="post"
      onSubmit={handleSubmit}
      // Any edit makes the prepared text out of date. The summary is read-only, so it never fires this.
      onChange={reset}
    >
      <p className="form-intro">{intro}</p>
      <p className="form-info" id={`${kind}-info`}>
        This form prepares an email to R&amp;R Glimzo for you to review and send. Direct sending is not available
        yet. <a href={PRIVACY_HASH}>How your information is handled</a>.
      </p>
      {children}
      <p className="privacy-copy">
        Please include only contact and property details. Read our <a href={PRIVACY_HASH}>privacy notice</a>.
      </p>
      <button className="pill" type="submit">
        {submitLabel}
      </button>
      <div className="request-result" hidden={email === null}>
        <h4>Your request is ready</h4>
        <p className="note">
          Open it in Gmail, or copy it into an email to {CONTACT_EMAIL}. It is only sent when you press send in
          your email, and it does not confirm a quote, site visit or booking.
        </p>
        <label className="field">
          Your request
          <textarea
            className="request-summary"
            ref={summaryRef}
            value={email?.body ?? ''}
            readOnly
            spellCheck={false}
          />
        </label>
        <div className="request-actions">
          {email && (
            <a className="pill" href={requestGmail(email)} target="_blank" rel="noopener noreferrer">
              Open in Gmail
            </a>
          )}
          <button className="pill copy-request" type="button" onClick={handleCopy}>
            Copy request
          </button>
        </div>
        <div className="copy-status" role="status" aria-live="polite">
          {status}
        </div>
      </div>
    </form>
  )
}
