import type { QuoteInput } from '../shared/quotes.ts'

/** Error thrown for any non-2xx API response, carrying the server's message for display. */
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`/api${path}`, {
      method: init.method ?? 'GET',
      headers: init.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      credentials: 'same-origin',
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(typeof data.error === 'string' ? data.error : 'Something went wrong.', res.status)
  return data as T
}

/** Sends a website request form to the server. */
export const submitQuote = (input: QuoteInput & { website?: string }) => api<{ ok: true }>('/quotes', { method: 'POST', body: input })
