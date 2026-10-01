import { useCallback, useEffect, useRef, useState } from 'react'
import { api, ApiError } from '../lib/api.ts'
import type { Quote, QuoteInput, QuoteKind, QuoteStatus } from '../shared/quotes.ts'

export interface QuoteFilter {
  q: string
  kind: QuoteKind | ''
  status: QuoteStatus | ''
}

/** Loads quotes for the admin pages and applies create, edit, move and delete locally before the server confirms. */
export function useQuotes(filter: QuoteFilter, onUnauthorised: () => void) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const latest = useRef(0)

  const fail = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) return onUnauthorised()
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    },
    [onUnauthorised],
  )

  const load = useCallback(async () => {
    const run = ++latest.current
    const params = new URLSearchParams()
    if (filter.q) params.set('q', filter.q)
    if (filter.kind) params.set('kind', filter.kind)
    if (filter.status) params.set('status', filter.status)
    try {
      const data = await api<{ quotes: Quote[] }>(`/admin/quotes?${params}`)
      if (run !== latest.current) return
      setQuotes(data.quotes)
      setError('')
    } catch (err) {
      if (run === latest.current) fail(err)
    } finally {
      if (run === latest.current) setLoading(false)
    }
  }, [filter.q, filter.kind, filter.status, fail])

  useEffect(() => {
    const t = setTimeout(load, filter.q ? 250 : 0)
    return () => clearTimeout(t)
  }, [load, filter.q])

  const create = async (input: QuoteInput) => {
    const { quote } = await api<{ quote: Quote }>('/admin/quotes', { method: 'POST', body: input })
    setQuotes(prev => [quote, ...prev])
    return quote
  }

  const update = async (id: string, patch: Partial<QuoteInput> & { position?: number }) => {
    const { quote } = await api<{ quote: Quote }>(`/admin/quotes/${id}`, { method: 'PATCH', body: patch })
    setQuotes(prev => prev.map(q => (q.id === id ? quote : q)))
    return quote
  }

  /** Moves a card instantly, then tells the server; reloads if the server disagrees. */
  const move = async (id: string, status: QuoteStatus, position: number) => {
    setQuotes(prev => prev.map(q => (q.id === id ? { ...q, status, position } : q)))
    try {
      await api(`/admin/quotes/${id}`, { method: 'PATCH', body: { status, position } })
    } catch (err) {
      fail(err)
      load()
    }
  }

  const remove = async (id: string) => {
    await api(`/admin/quotes/${id}`, { method: 'DELETE' })
    setQuotes(prev => prev.filter(q => q.id !== id))
  }

  return { quotes, loading, error, create, update, move, remove, reload: load }
}
