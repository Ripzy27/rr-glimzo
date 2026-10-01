/**
 * Quote model shared by the website, the admin panel and the API server.
 * Keep this file free of browser and Node imports; the server loads it directly.
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

export const MAX_FIELD_LENGTH = 2500

const isString = (v: unknown): v is string => typeof v === 'string'

/** Checks and trims untrusted input. Returns the clean value or a message for the first problem. */
export function parseQuoteInput(raw: unknown, { partial = false } = {}): { ok: true; value: Partial<QuoteInput> } | { ok: false; error: string } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { ok: false, error: 'Invalid request.' }
  const body = raw as Record<string, unknown>
  const out: Partial<QuoteInput> = {}

  if (body.kind !== undefined || !partial) {
    if (!QUOTE_KINDS.includes(body.kind as QuoteKind)) return { ok: false, error: 'Unknown request type.' }
    out.kind = body.kind as QuoteKind
  }
  for (const key of ['name', 'email', 'phone', 'notes'] as const) {
    const v = body[key]
    if (v === undefined && (partial || key === 'phone' || key === 'notes')) continue
    if (!isString(v)) return { ok: false, error: `Invalid ${key}.` }
    const t = v.trim()
    if (t.length > (key === 'notes' ? MAX_FIELD_LENGTH : 254)) return { ok: false, error: `${key} is too long.` }
    out[key] = t
  }
  if (out.name !== undefined && !out.name) return { ok: false, error: 'Name is required.' }
  if (out.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) return { ok: false, error: 'Enter a valid email address.' }

  if (body.status !== undefined) {
    if (!QUOTE_STATUSES.includes(body.status as QuoteStatus)) return { ok: false, error: 'Unknown status.' }
    out.status = body.status as QuoteStatus
  }
  if (body.fields !== undefined) {
    if (typeof body.fields !== 'object' || body.fields === null || Array.isArray(body.fields)) return { ok: false, error: 'Invalid fields.' }
    // On create the kind is known; on edit the caller passes it or the server checks against the stored kind.
    const kind = out.kind ?? (body.kind as QuoteKind | undefined)
    const allowed = kind ? new Set(QUOTE_FIELDS[kind].map(f => f.key)) : null
    const fields: Record<string, string> = {}
    for (const [key, v] of Object.entries(body.fields)) {
      if (allowed && !allowed.has(key)) continue
      if (!isString(v)) return { ok: false, error: `Invalid ${key}.` }
      const t = v.trim()
      if (t.length > MAX_FIELD_LENGTH) return { ok: false, error: `${key} is too long.` }
      if (t) fields[key] = t
    }
    out.fields = fields
  }
  return { ok: true, value: out }
}

/** A short headline for a quote card: what the request is about. */
export function quoteTitle(q: Pick<Quote, 'kind' | 'name' | 'fields'>): string {
  if (q.kind === 'commercial') return q.fields.organisation || q.name
  if (q.kind === 'referral') return q.fields.referee_name ? `${q.fields.referee_name} (via ${q.name})` : q.name
  return q.name
}
