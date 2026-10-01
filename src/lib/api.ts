import type { QuoteInput } from '../shared/quotes.ts'

/** Error thrown for any non-2xx API response, carrying the server's message for display. */
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** Where the API lives. Empty means same origin (the dev server proxies /api); set VITE_API_URL when it is hosted elsewhere. */
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

const TOKEN_KEY = 'glimzo_admin_token'

/** The admin session token, kept for the length of the browser tab. */
export const adminToken = {
  get: () => {
    try {
      return sessionStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token: string) => {
    try {
      sessionStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* storage blocked: the session lasts until reload */
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch {
      /* nothing stored */
    }
  },
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (init.body !== undefined) headers['Content-Type'] = 'application/json'
  const token = adminToken.get()
  if (token) headers.Authorization = `Bearer ${token}`
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api${path}`, {
      method: init.method ?? 'GET',
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) adminToken.clear()
  if (!res.ok) throw new ApiError(typeof data.error === 'string' ? data.error : 'Something went wrong.', res.status)
  return data as T
}

/** Sends a website request form to the server. */
export const submitQuote = (input: QuoteInput & { website?: string }) => api<{ ok: true }>('/quotes', { method: 'POST', body: input })
