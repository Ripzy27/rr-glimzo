import { QUOTE_FIELDS, type Quote } from '../shared/quotes.ts'

const DAY = 86_400_000

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < DAY) return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const fullDate = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/** ISO dates from date inputs shown as UK dates; anything else untouched. */
export const showValue = (key: string, value: string) =>
  key === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value

/** The kind-specific attributes of a quote that have a value, in display order (contact details excluded). */
export function attributes(q: Quote) {
  return QUOTE_FIELDS[q.kind]
    .filter(f => !['name', 'email', 'phone'].includes(f.key) && q.fields[f.key])
    .map(f => ({ ...f, value: showValue(f.key, q.fields[f.key]) }))
}
