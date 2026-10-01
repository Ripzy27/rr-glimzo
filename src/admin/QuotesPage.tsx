import { useMemo, useState } from 'react'
import { KIND_LABELS, QUOTE_KINDS, QUOTE_STATUSES, STATUS_LABELS, type QuoteKind, type QuoteStatus } from '../shared/quotes.ts'
import { QuoteCard } from './QuoteCard.tsx'
import { QuoteDialog } from './QuoteDialog.tsx'
import { useQuotes } from './useQuotes.ts'

/** The quotes list: every request as a card, with search and filters. */
export function QuotesPage({ onSignedOut }: { onSignedOut: () => void }) {
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<QuoteKind | ''>('')
  const [status, setStatus] = useState<QuoteStatus | ''>('')
  const filter = useMemo(() => ({ q, kind, status }), [q, kind, status])
  const { quotes, loading, error, create, update, remove, reload } = useQuotes(filter, onSignedOut)
  const [openId, setOpenId] = useState<string | 'new' | null>(null)
  const open = openId && openId !== 'new' ? (quotes.find(x => x.id === openId) ?? null) : null
  const filtered = Boolean(q || kind || status)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Quotes</h1>
          <p className="muted">{loading ? 'Loading…' : `${quotes.length} ${quotes.length === 1 ? 'request' : 'requests'}${filtered ? ' match' : ''}`}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpenId('new')}>+ New quote</button>
      </div>

      <div className="toolbar">
        <input className="search" type="search" placeholder="Search name, email, phone, details…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search quotes" />
        <div className="chips" role="group" aria-label="Filter by type">
          <button className={!kind ? 'is-on' : ''} onClick={() => setKind('')}>All types</button>
          {QUOTE_KINDS.map(k => (
            <button key={k} className={kind === k ? 'is-on' : ''} onClick={() => setKind(k)}>{KIND_LABELS[k]}</button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="Filter by status">
          <button className={!status ? 'is-on' : ''} onClick={() => setStatus('')}>Any status</button>
          {QUOTE_STATUSES.map(s => (
            <button key={s} className={status === s ? 'is-on' : ''} onClick={() => setStatus(s)}>{STATUS_LABELS[s]}</button>
          ))}
        </div>
      </div>

      {error && (
        <div className="banner" role="alert">
          {error} <button className="link-btn" onClick={reload}>Try again</button>
        </div>
      )}

      {!loading && quotes.length === 0 && !error ? (
        <div className="empty">
          <h2>{filtered ? 'Nothing matches those filters.' : 'No quotes yet.'}</h2>
          <p className="muted">{filtered ? 'Try a different search or clear the filters.' : 'Requests from the website will appear here as they arrive.'}</p>
        </div>
      ) : (
        <div className="qgrid">
          {quotes.map((quote, i) => (
            <div key={quote.id} className="qgrid-item" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
              <QuoteCard quote={quote} onOpen={() => setOpenId(quote.id)} />
            </div>
          ))}
        </div>
      )}

      {openId && (openId === 'new' || open) && (
        <QuoteDialog key={openId} quote={open} onClose={() => setOpenId(null)} onCreate={create} onUpdate={update} onDelete={remove} />
      )}
    </>
  )
}
