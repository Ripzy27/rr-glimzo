import { useMemo, useState, type DragEvent } from 'react'
import { QUOTE_STATUSES, STATUS_LABELS, type Quote, type QuoteStatus } from '../shared/quotes.ts'
import { QuoteCard } from './QuoteCard.tsx'
import { QuoteDialog } from './QuoteDialog.tsx'
import { useQuotes } from './useQuotes.ts'

const NO_FILTER = { q: '', kind: '', status: '' } as const
const GAP = 1024

/** Where a dragged card would land: in a column, before another card (or at the end when null). */
interface DropSpot {
  status: QuoteStatus
  beforeId: string | null
}

/** A Jira-style board: drag cards between Pending, Discussion ongoing, Confirmed and Done. */
export function BoardPage({ onSignedOut }: { onSignedOut: () => void }) {
  const { quotes, loading, error, create, update, move, remove, reload } = useQuotes(NO_FILTER, onSignedOut)
  const [dragId, setDragId] = useState<string | null>(null)
  const [spot, setSpot] = useState<DropSpot | null>(null)
  const [openId, setOpenId] = useState<string | 'new' | null>(null)
  const [newStatus, setNewStatus] = useState<QuoteStatus>('pending')

  const columns = useMemo(() => {
    const by: Record<QuoteStatus, Quote[]> = { pending: [], discussion: [], confirmed: [], done: [] }
    for (const q of quotes) by[q.status].push(q)
    for (const s of QUOTE_STATUSES) by[s].sort((a, b) => a.position - b.position)
    return by
  }, [quotes])

  const open = openId && openId !== 'new' ? (quotes.find(x => x.id === openId) ?? null) : null

  const drop = (target: DropSpot) => {
    if (!dragId) return
    const column = columns[target.status].filter(q => q.id !== dragId)
    const at = target.beforeId ? column.findIndex(q => q.id === target.beforeId) : column.length
    const prev = column[at - 1]?.position
    const next = column[at]?.position
    const position = prev === undefined && next === undefined ? GAP : prev === undefined ? next! - GAP : next === undefined ? prev + GAP : (prev + next) / 2
    move(dragId, target.status, position)
    setDragId(null)
    setSpot(null)
  }

  const overCard = (e: DragEvent<HTMLElement>, status: QuoteStatus, id: string) => {
    if (!dragId) return
    e.preventDefault()
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    const below = e.clientY > r.top + r.height / 2
    const col = columns[status].filter(q => q.id !== dragId)
    const idx = col.findIndex(q => q.id === id)
    const beforeId = below ? (col[idx + 1]?.id ?? null) : id
    setSpot(s => (s?.status === status && s.beforeId === beforeId ? s : { status, beforeId }))
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Board</h1>
          <p className="muted">{loading ? 'Loading…' : 'Drag a card to change its status, or open it to edit.'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => (setNewStatus('pending'), setOpenId('new'))}>+ New quote</button>
      </div>

      {error && (
        <div className="banner" role="alert">
          {error} <button className="link-btn" onClick={reload}>Try again</button>
        </div>
      )}

      <div className="board">
        {QUOTE_STATUSES.map(status => (
          <section
            key={status}
            className={`column col-${status} ${spot?.status === status ? 'is-over' : ''}`}
            aria-label={STATUS_LABELS[status]}
            onDragOver={e => {
              if (!dragId) return
              e.preventDefault()
              setSpot(s => (s?.status === status ? s : { status, beforeId: null }))
            }}
            onDrop={e => (e.preventDefault(), spot && drop(spot))}
          >
            <header>
              <h2><span className={`dot dot-${status}`} />{STATUS_LABELS[status]}</h2>
              <span className="count">{columns[status].length}</span>
              <button className="icon-btn" aria-label={`Add quote to ${STATUS_LABELS[status]}`} onClick={() => (setNewStatus(status), setOpenId('new'))}>+</button>
            </header>
            <div className="column-body">
              {columns[status].map(quote => (
                <div key={quote.id}>
                  {spot?.status === status && spot.beforeId === quote.id && dragId !== quote.id && <div className="drop-line" />}
                  <div
                    className={`draggable ${dragId === quote.id ? 'is-dragging' : ''}`}
                    draggable
                    onDragStart={e => {
                      setDragId(quote.id)
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData('text/plain', quote.id)
                    }}
                    onDragEnd={() => (setDragId(null), setSpot(null))}
                    onDragOver={e => overCard(e, status, quote.id)}
                  >
                    <QuoteCard quote={quote} onOpen={() => setOpenId(quote.id)} showStatus={false} compact />
                  </div>
                </div>
              ))}
              {spot?.status === status && spot.beforeId === null && <div className="drop-line" />}
              {!loading && columns[status].length === 0 && !dragId && <p className="column-empty">Nothing here yet.</p>}
            </div>
          </section>
        ))}
      </div>

      {openId && (openId === 'new' || open) && (
        <QuoteDialog key={openId} quote={open} defaultStatus={newStatus} onClose={() => setOpenId(null)} onCreate={create} onUpdate={update} onDelete={remove} />
      )}
    </>
  )
}
