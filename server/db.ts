import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { randomUUID } from 'node:crypto'
import type { Quote, QuoteKind, QuoteStatus } from '../src/shared/quotes.ts'

const DB_PATH = process.env.DB_PATH ?? 'data/glimzo.db'
mkdirSync(dirname(DB_PATH), { recursive: true })

const db = new DatabaseSync(DB_PATH)
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS quotes (
    id         TEXT PRIMARY KEY,
    kind       TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'pending',
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT NOT NULL DEFAULT '',
    fields     TEXT NOT NULL DEFAULT '{}',
    notes      TEXT NOT NULL DEFAULT '',
    position   REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS quotes_status_position ON quotes (status, position);
  CREATE INDEX IF NOT EXISTS quotes_created ON quotes (created_at);
`)

interface Row {
  id: string
  kind: QuoteKind
  status: QuoteStatus
  name: string
  email: string
  phone: string
  fields: string
  notes: string
  position: number
  created_at: string
  updated_at: string
}

const toQuote = (r: Row): Quote => ({
  id: r.id,
  kind: r.kind,
  status: r.status,
  name: r.name,
  email: r.email,
  phone: r.phone,
  fields: JSON.parse(r.fields),
  notes: r.notes,
  position: r.position,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
})

export interface ListFilter {
  kind?: QuoteKind
  status?: QuoteStatus
  q?: string
}

export function listQuotes({ kind, status, q }: ListFilter): Quote[] {
  const where: string[] = []
  const args: string[] = []
  if (kind) {
    where.push('kind = ?')
    args.push(kind)
  }
  if (status) {
    where.push('status = ?')
    args.push(status)
  }
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, '\\$&')}%`
    where.push(`(name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\' OR fields LIKE ? ESCAPE '\\')`)
    args.push(like, like, like, like)
  }
  const sql = `SELECT * FROM quotes ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC`
  return (db.prepare(sql).all(...args) as unknown as Row[]).map(toQuote)
}

export function getQuote(id: string): Quote | null {
  const row = db.prepare('SELECT * FROM quotes WHERE id = ?').get(id) as unknown as Row | undefined
  return row ? toQuote(row) : null
}

export function createQuote(input: {
  kind: QuoteKind
  name: string
  email: string
  phone?: string
  fields?: Record<string, string>
  notes?: string
  status?: QuoteStatus
}): Quote {
  const status = input.status ?? 'pending'
  const now = new Date().toISOString()
  const last = db.prepare('SELECT MAX(position) AS p FROM quotes WHERE status = ?').get(status) as { p: number | null }
  const id = randomUUID()
  db.prepare(
    `INSERT INTO quotes (id, kind, status, name, email, phone, fields, notes, position, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, input.kind, status, input.name, input.email, input.phone ?? '', JSON.stringify(input.fields ?? {}), input.notes ?? '', (last.p ?? 0) + 1024, now, now)
  return getQuote(id)!
}

export interface QuotePatch {
  kind?: QuoteKind
  status?: QuoteStatus
  name?: string
  email?: string
  phone?: string
  fields?: Record<string, string>
  notes?: string
  position?: number
}

export function updateQuote(id: string, patch: QuotePatch): Quote | null {
  const current = getQuote(id)
  if (!current) return null
  const defined = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined))
  const next = { ...current, ...defined, updatedAt: new Date().toISOString() }
  db.prepare(
    `UPDATE quotes SET kind = ?, status = ?, name = ?, email = ?, phone = ?, fields = ?, notes = ?, position = ?, updated_at = ? WHERE id = ?`,
  ).run(next.kind, next.status, next.name, next.email, next.phone, JSON.stringify(next.fields), next.notes, next.position, next.updatedAt, id)
  return getQuote(id)
}

export function deleteQuote(id: string): boolean {
  return Number(db.prepare('DELETE FROM quotes WHERE id = ?').run(id).changes) > 0
}
