import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  KIND_LABELS,
  QUOTE_FIELDS,
  QUOTE_KINDS,
  QUOTE_STATUSES,
  STATUS_LABELS,
  quoteTitle,
  type Quote,
  type QuoteInput,
  type QuoteKind,
  type QuoteStatus,
} from '../shared/quotes.ts'
import { attributes, fullDate } from './format.ts'

interface QuoteDialogProps {
  /** The quote to view/edit, or null to create a new one. */
  quote: Quote | null
  defaultStatus?: QuoteStatus
  onClose: () => void
  onCreate: (input: QuoteInput) => Promise<unknown>
  onUpdate: (id: string, patch: Partial<QuoteInput>) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}

const CONTACT = ['name', 'email', 'phone']

/** One dialog for the whole lifecycle of a quote: read it, edit it, create it, delete it. */
export function QuoteDialog({ quote, defaultStatus, onClose, onCreate, onUpdate, onDelete }: QuoteDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [mode, setMode] = useState<'view' | 'edit'>(quote ? 'view' : 'edit')
  const [kind, setKind] = useState<QuoteKind>(quote?.kind ?? 'domestic')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
  }, [])

  const run = async (job: () => Promise<unknown>, after: () => void) => {
    setBusy(true)
    setError('')
    try {
      await job()
      after()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(false)
    }
  }

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (k: string) => String(data.get(k) ?? '').trim()
    const fields: Record<string, string> = {}
    for (const f of QUOTE_FIELDS[kind]) if (!CONTACT.includes(f.key) && get(f.key)) fields[f.key] = get(f.key)
    const input: QuoteInput = {
      kind,
      name: get('name'),
      email: get('email'),
      phone: get('phone'),
      fields,
      notes: get('notes'),
      status: get('status') as QuoteStatus,
    }
    run(() => (quote ? onUpdate(quote.id, input) : onCreate(input)), () => (quote ? (setMode('view'), setBusy(false)) : onClose()))
  }

  const title = quote ? quoteTitle(quote) : 'New quote'

  return (
    <dialog ref={ref} className="qdialog" onClose={onClose} onClick={e => e.target === ref.current && ref.current?.close()}>
      <div className="qdialog-head">
        <div>
          <span className={`badge badge-${quote?.kind ?? kind}`}>{KIND_LABELS[quote?.kind ?? kind]}</span>
          <h2>{mode === 'edit' && quote ? `Edit ${title}` : title}</h2>
          {quote && <p className="muted">Received {fullDate(quote.createdAt)}</p>}
        </div>
        <button className="icon-btn" onClick={() => ref.current?.close()} aria-label="Close">✕</button>
      </div>

      {mode === 'view' && quote ? (
        <div className="qdialog-body">
          <span className={`status status-${quote.status}`}>{STATUS_LABELS[quote.status]}</span>
          <dl className="detail-grid">
            <div><dt>Name</dt><dd>{quote.name}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${quote.email}`}>{quote.email}</a></dd></div>
            {quote.phone && <div><dt>Phone</dt><dd><a href={`tel:${quote.phone}`}>{quote.phone}</a></dd></div>}
            {attributes(quote).map(a => (
              <div key={a.key} className={a.long ? 'wide' : ''}>
                <dt>{a.label}</dt>
                <dd className={a.long ? 'pre' : ''}>{a.value}</dd>
              </div>
            ))}
          </dl>
          {quote.notes && (
            <div className="notes-box">
              <dt>Admin notes</dt>
              <p>{quote.notes}</p>
            </div>
          )}
          <div className="error-line" role="alert">{error}</div>
          <div className="qdialog-actions">
            {confirmDelete ? (
              <>
                <span className="muted">Delete this quote for good?</span>
                <button className="btn btn-quiet" onClick={() => setConfirmDelete(false)}>Keep it</button>
                <button className="btn btn-danger" disabled={busy} onClick={() => run(() => onDelete(quote.id), onClose)}>
                  {busy ? 'Deleting…' : 'Yes, delete'}
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-quiet btn-danger-text" onClick={() => setConfirmDelete(true)}>Delete</button>
                <button className="btn btn-primary" onClick={() => setMode('edit')}>Edit</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <form className="qdialog-body" onSubmit={save}>
          <div className="form-grid">
            <label className="a-field">
              Type
              <select value={kind} onChange={e => setKind(e.target.value as QuoteKind)}>
                {QUOTE_KINDS.map(k => <option key={k} value={k}>{KIND_LABELS[k]}</option>)}
              </select>
            </label>
            <label className="a-field">
              Status
              <select name="status" defaultValue={quote?.status ?? defaultStatus ?? 'pending'}>
                {QUOTE_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </label>
            {QUOTE_FIELDS[kind].map(f => {
              const value = CONTACT.includes(f.key) ? (quote?.[f.key as 'name'] ?? '') : (quote?.fields[f.key] ?? '')
              const required = f.key === 'name' || f.key === 'email'
              return (
                <label key={`${kind}-${f.key}`} className={`a-field ${f.long ? 'wide' : ''}`}>
                  {f.label}{!required && <span> (optional)</span>}
                  {f.type === 'textarea' ? (
                    <textarea name={f.key} defaultValue={value} maxLength={2500} rows={3} />
                  ) : (
                    <input name={f.key} type={f.type ?? 'text'} defaultValue={value} required={required} maxLength={254} />
                  )}
                </label>
              )
            })}
            <label className="a-field wide">
              Admin notes<span> (private)</span>
              <textarea name="notes" defaultValue={quote?.notes ?? ''} maxLength={2500} rows={3} placeholder="Call history, agreed price, access details…" />
            </label>
          </div>
          <div className="error-line" role="alert">{error}</div>
          <div className="qdialog-actions">
            <button type="button" className="btn btn-quiet" onClick={() => (quote ? setMode('view') : ref.current?.close())}>Cancel</button>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : quote ? 'Save changes' : 'Create quote'}</button>
          </div>
        </form>
      )}
    </dialog>
  )
}
