import { createHmac, randomBytes, timingSafeEqual, createHash } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

const COOKIE = 'glimzo_admin'
const SESSION_MS = 1000 * 60 * 60 * 12
const IS_PROD = process.env.NODE_ENV === 'production'

// Without SESSION_SECRET, sessions last only until the server restarts.
const SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex')
if (!process.env.SESSION_SECRET) console.warn('SESSION_SECRET is not set: admin sessions will end whenever the server restarts.')

const digest = (value: string) => createHash('sha256').update(value).digest()
const sign = (payload: string) => createHmac('sha256', SECRET).update(payload).digest('base64url')

/** Constant-time check of the submitted credentials against ADMIN_EMAIL and ADMIN_PASSWORD. */
export function checkCredentials(email: string, password: string): boolean {
  const wantEmail = process.env.ADMIN_EMAIL
  const wantPassword = process.env.ADMIN_PASSWORD
  if (!wantEmail || !wantPassword) return false
  // Both comparisons always run so timing does not reveal which one failed.
  const emailOk = timingSafeEqual(digest(email.trim().toLowerCase()), digest(wantEmail.trim().toLowerCase()))
  const passOk = timingSafeEqual(digest(password), digest(wantPassword))
  return emailOk && passOk
}

export function startSession(res: Response) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_MS })).toString('base64url')
  res.cookie(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: IS_PROD,
    maxAge: SESSION_MS,
    path: '/',
  })
}

export function endSession(res: Response) {
  res.clearCookie(COOKIE, { path: '/' })
}

function readCookie(req: Request): string | undefined {
  const header = req.headers.cookie ?? ''
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === COOKIE) return rest.join('=')
  }
}

export function isAuthenticated(req: Request): boolean {
  const token = readCookie(req)
  if (!token) return false
  const [payload, mac] = token.split('.')
  if (!payload || !mac) return false
  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(mac)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now()
  } catch {
    return false
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) return void res.status(401).json({ error: 'Please sign in.' })
  next()
}

/** Fixed-window limiter keyed by client IP; enough to blunt password guessing and form spam. */
export function rateLimit(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>()
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now()
    const key = req.ip ?? 'unknown'
    const hit = hits.get(key)
    if (!hit || hit.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs })
      if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
      return next()
    }
    if (++hit.count > max) {
      res.setHeader('Retry-After', Math.ceil((hit.reset - now) / 1000))
      return void res.status(429).json({ error: 'Too many attempts. Please try again later.' })
    }
    next()
  }
}
