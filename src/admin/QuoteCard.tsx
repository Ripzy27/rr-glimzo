import { KIND_LABELS, STATUS_LABELS, quoteTitle, type Quote } from '../shared/quotes.ts'
import { attributes, timeAgo } from './format.ts'

interface QuoteCardProps {
  quote: Quote
  onOpen: () => void
  /** Show the status pill; the board hides it because the column already says it. */
  showStatus?: boolean
  /** Compact cards show fewer attributes (board). */
  compact?: boolean
}

export function QuoteCard({ quote, onOpen, showStatus = true, compact = false }: QuoteCardProps) {
  const attrs = attributes(quote).filter(a => !a.long).slice(0, compact ? 3 : 5)
  const details = quote.fields.details
  return (
    <article className={`qcard kind-${quote.kind} ${compact ? 'is-compact' : ''}`}>
      <button className="qcard-hit" onClick={onOpen} aria-label={`Open ${quoteTitle(quote)}`} />
      <div className="qcard-top">
        <span className={`badge badge-${quote.kind}`}>{KIND_LABELS[quote.kind]}</span>
        {showStatus && <span className={`status status-${quote.status}`}>{STATUS_LABELS[quote.status]}</span>}
      </div>
      <h3>{quoteTitle(quote)}</h3>
      <div className="qcard-contact">
        <a href={`mailto:${quote.email}`}>{quote.email}</a>
        {quote.phone && <a href={`tel:${quote.phone}`}>{quote.phone}</a>}
      </div>
      {attrs.length > 0 && (
        <dl className="qcard-attrs">
          {attrs.map(a => (
            <div key={a.key}>
              <dt>{a.label}</dt>
              <dd>{a.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {details && !compact && <p className="qcard-note">{details}</p>}
      <footer>
        <time dateTime={quote.createdAt}>{timeAgo(quote.createdAt)}</time>
        {quote.notes && <span className="has-notes" title="Has admin notes">● Notes</span>}
      </footer>
    </article>
  )
}
