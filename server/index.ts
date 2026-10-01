import express, { type Request, type Response } from 'express'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { CONTACT_KEYS, QUOTE_KINDS, QUOTE_STATUSES, parseQuoteInput, type QuoteKind, type QuoteStatus } from '../src/shared/quotes.ts'
import { checkCredentials, endSession, isAuthenticated, rateLimit, requireAdmin, startSession } from './auth.ts'
import { createQuote, deleteQuote, getQuote, listQuotes, updateQuote, type QuotePatch } from './db.ts'

const PORT = Number(process.env.PORT ?? 3001)
const DIST = join(import.meta.dirname, '..', 'dist')
const ADMIN_PATH = '/0/v1/admin'

const app = express()
app.disable('x-powered-by')
if (process.env.TRUST_PROXY) app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : process.env.TRUST_PROXY)

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'same-origin')
  if (req.path.startsWith('/api/admin') || req.path.startsWith(ADMIN_PATH)) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')
    res.setHeader('Cache-Control', 'no-store')
  }
  next()
})
app.use('/api', express.json({ limit: '50kb' }))
// Mutations must be JSON, which a cross-site form post cannot send. Together with SameSite=Strict this blocks CSRF.
app.use('/api', (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'DELETE' && !req.is('application/json')) {
    return void res.status(415).json({ error: 'Send JSON.' })
  }
  next()
})

const one = (v: unknown) => (typeof v === 'string' ? v : undefined)
const idOf = (req: Request) => String(req.params.id)

/** Contact details are columns; strip them from `fields` so they are stored once. */
const withoutContact = (fields: Record<string, string> | undefined) =>
  fields && Object.fromEntries(Object.entries(fields).filter(([k]) => !(CONTACT_KEYS as readonly string[]).includes(k)))

// --- Public: the website's request forms -----------------------------------
app.post('/api/quotes', rateLimit(15, 60 * 60 * 1000), (req, res) => {
  // Hidden field that humans never fill in; pretend success to bots.
  if (req.body?.website) return void res.status(201).json({ ok: true })
  const parsed = parseQuoteInput(req.body)
  if (!parsed.ok) return void res.status(400).json({ error: parsed.error })
  const { kind, name, email, phone, fields } = parsed.value
  createQuote({ kind: kind!, name: name!, email: email!, phone, fields: withoutContact(fields) })
  res.status(201).json({ ok: true })
})

// --- Admin auth ------------------------------------------------------------
app.post('/api/admin/login', rateLimit(8, 15 * 60 * 1000), (req, res) => {
  const email = one(req.body?.email)
  const password = one(req.body?.password)
  if (!email || !password || !checkCredentials(email, password)) {
    return void res.status(401).json({ error: 'Those details do not match.' })
  }
  startSession(res)
  res.json({ ok: true })
})
app.post('/api/admin/logout', (_req, res) => {
  endSession(res)
  res.json({ ok: true })
})
app.get('/api/admin/me', (req, res) => {
  res.json({ authenticated: isAuthenticated(req) })
})

// --- Admin: quotes CRUD ----------------------------------------------------
const admin = express.Router()
admin.use(requireAdmin)

admin.get('/quotes', (req, res) => {
  const kind = one(req.query.kind)
  const status = one(req.query.status)
  res.json({
    quotes: listQuotes({
      kind: QUOTE_KINDS.includes(kind as QuoteKind) ? (kind as QuoteKind) : undefined,
      status: QUOTE_STATUSES.includes(status as QuoteStatus) ? (status as QuoteStatus) : undefined,
      q: one(req.query.q)?.trim().slice(0, 100) || undefined,
    }),
  })
})

admin.get('/quotes/:id', (req, res) => {
  const quote = getQuote(idOf(req))
  if (!quote) return void res.status(404).json({ error: 'Not found.' })
  res.json({ quote })
})

admin.post('/quotes', (req, res) => {
  const parsed = parseQuoteInput(req.body)
  if (!parsed.ok) return void res.status(400).json({ error: parsed.error })
  const { kind, name, email, phone, fields, notes, status } = parsed.value
  res.status(201).json({ quote: createQuote({ kind: kind!, name: name!, email: email!, phone, fields: withoutContact(fields), notes, status }) })
})

admin.patch('/quotes/:id', (req, res) => {
  const current = getQuote(idOf(req))
  if (!current) return void res.status(404).json({ error: 'Not found.' })
  // Validate fields against the kind the quote will have after this edit.
  const parsed = parseQuoteInput({ ...req.body, kind: req.body?.kind ?? current.kind }, { partial: true })
  if (!parsed.ok) return void res.status(400).json({ error: parsed.error })
  const patch: QuotePatch = { ...parsed.value, fields: withoutContact(parsed.value.fields) }
  const position = req.body?.position
  if (position !== undefined) {
    if (typeof position !== 'number' || !Number.isFinite(position)) return void res.status(400).json({ error: 'Invalid position.' })
    patch.position = position
  }
  res.json({ quote: updateQuote(idOf(req), patch) })
})

admin.delete('/quotes/:id', (req, res) => {
  if (!deleteQuote(idOf(req))) return void res.status(404).json({ error: 'Not found.' })
  res.json({ ok: true })
})
app.use('/api/admin', admin)

app.use('/api', (_req, res) => void res.status(404).json({ error: 'Not found.' }))

// --- Built website (production) -------------------------------------------
if (existsSync(DIST)) {
  app.use(express.static(DIST, { index: false, maxAge: '1h' }))
  app.get(/^(?!\/api\/).*/, (_req: Request, res: Response) => {
    res.sendFile(join(DIST, 'index.html'))
  })
}

app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
  const status = 'status' in err && typeof err.status === 'number' ? err.status : 500
  if (status >= 500) console.error(err)
  res.status(status).json({ error: status >= 500 ? 'Something went wrong.' : 'Invalid request.' })
})

app.listen(PORT, () => {
  console.log(`Glimzo server on http://localhost:${PORT}`)
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) console.warn('ADMIN_EMAIL / ADMIN_PASSWORD are not set: admin login is disabled.')
})
