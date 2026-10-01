/**
 * Quote model used by the website and the admin panel.
 * The API (rr-glimzo-server) keeps its own copy in src/quotes.ts, with the input validation; keep the two in step.
 */

export const QUOTE_KINDS = ['domestic', 'referral', 'commercial'] as const
export type QuoteKind = (typeof QUOTE_KINDS)[number]

export const QUOTE_STATUSES = ['pending', 'discussion', 'confirmed', 'done'] as const
export type QuoteStatus = (typeof QUOTE_STATUSES)[number]

export const STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: 'Pending',
  discussion: 'Discussion ongoing',
  confirmed: 'Confirmed',
  done: 'Done',
}

export const KIND_LABELS: Record<QuoteKind, string> = {
  domestic: 'Domestic quote',
  referral: 'Referral',
  commercial: 'Commercial site visit',
}

export interface FieldDef {
  key: string
  label: string
  /** Free-text areas are shown full width. */
  long?: boolean
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea'
}

const CONTACT: FieldDef[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
]

/** Every attribute a quote of each kind can carry, in display order. Contact fields are columns; the rest are `fields`. */
export const QUOTE_FIELDS: Record<QuoteKind, FieldDef[]> = {
  domestic: [
    ...CONTACT,
    { key: 'service', label: 'Service' },
    { key: 'location', label: 'Town or postcode' },
    { key: 'property', label: 'Property type' },
    { key: 'bedrooms', label: 'Bedrooms' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'date', label: 'Preferred date', type: 'date' },
    { key: 'details', label: 'Additional information', long: true, type: 'textarea' },
  ],
  referral: [
    ...CONTACT,
    { key: 'referee_name', label: 'Referred person' },
    { key: 'referee_phone', label: 'Their phone', type: 'tel' },
    { key: 'referee_email', label: 'Their email', type: 'email' },
    { key: 'location', label: 'Town or postcode' },
    { key: 'service', label: 'Service' },
    { key: 'details', label: 'Additional information', long: true, type: 'textarea' },
  ],
  commercial: [
    ...CONTACT,
    { key: 'organisation', label: 'Organisation' },
    { key: 'sector', label: 'Building type' },
    { key: 'location', label: 'Site town or postcode' },
    { key: 'size', label: 'Approximate size' },
    { key: 'frequency', label: 'Cleaning frequency' },
    { key: 'date', label: 'Preferred visit date', type: 'date' },
    { key: 'visit_time', label: 'Preferred visit time' },
    { key: 'details', label: 'Cleaning and site requirements', long: true, type: 'textarea' },
  ],
}

/** Column fields that every quote has; the remainder live in `fields`. */
export const CONTACT_KEYS = ['name', 'email', 'phone'] as const

export interface Quote {
  id: string
  kind: QuoteKind
  status: QuoteStatus
  name: string
  email: string
  phone: string
  /** Kind-specific attributes, keyed by FieldDef.key. */
  fields: Record<string, string>
  /** Private admin notes, never shown on the website. */
  notes: string
  /** Order within a board column; lower comes first. */
  position: number
  createdAt: string
  updatedAt: string
}

/** What the website and the admin form send; the server fills in the rest. */
export interface QuoteInput {
  kind: QuoteKind
  name: string
  email: string
  phone?: string
  fields?: Record<string, string>
  notes?: string
  status?: QuoteStatus
}

/** A short headline for a quote card: what the request is about. */
export function quoteTitle(q: Pick<Quote, 'kind' | 'name' | 'fields'>): string {
  if (q.kind === 'commercial') return q.fields.organisation || q.name
  if (q.kind === 'referral') return q.fields.referee_name ? `${q.fields.referee_name} (via ${q.name})` : q.name
  return q.name
}
