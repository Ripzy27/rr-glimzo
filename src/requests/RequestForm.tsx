import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { requestText } from '../lib/requestText.ts'
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
 * Validates the form and prepares a request for the visitor to copy.
 * Nothing is sent: the text stays on the visitor's device.
 */
export function RequestForm({ kind, label, intro, submitLabel, preset, children }: RequestFormProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [prevPreset, setPrevPreset] = useState(preset)
  const summaryRef = useRef<HTMLTextAreaElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const reset = () => {
    setSummary(null)
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
    flushSync(() => {
      setSummary(requestText(kind, new FormData(form)))
      setStatus('Request prepared on this device. It has not been sent.')
    })
    summaryRef.current?.focus({ preventScroll: true })
    resultRef.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' })
  }

  const handleCopy = async () => {
    const textarea = summaryRef.current
    if (!textarea) return
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(textarea.value)
      setStatus('Request copied. Paste it into your message to R&R Glimzo. Nothing has been sent automatically.')
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
        This form prepares a request on your device. Direct sending is not available yet.{' '}
        <a href="privacy.html">How your information is handled</a>.
      </p>
      {children}
      <p className="privacy-copy">
        Please include only contact and property details. Read our <a href="privacy.html">privacy notice</a>.
      </p>
      <button className="pill" type="submit">
        {submitLabel}
      </button>
      <div className="request-result" ref={resultRef} hidden={summary === null}>
        <h4>Your request is ready to copy</h4>
        <p className="note">
          Preparing a request does not send it or confirm a booking. Copy it to use in an email or WhatsApp
          conversation.
        </p>
        <label className="field">
          Your request
          <textarea className="request-summary" ref={summaryRef} value={summary ?? ''} readOnly spellCheck={false} />
        </label>
        <button className="pill copy-request" type="button" onClick={handleCopy}>
          Copy request
        </button>
        <div className="copy-status" role="status" aria-live="polite">
          {status}
        </div>
      </div>
    </form>
  )
}
