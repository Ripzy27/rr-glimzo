import type { RequestKind } from '../requests/RequestContext.ts'

type FieldSpec = readonly [label: string, key: string]

/** Builds the plain-text request a visitor copies into an email or WhatsApp message. */
export function requestText(kind: RequestKind, data: FormData): string {
  const get = (key: string) => String(data.get(key) ?? '').trim()
  const commercial = kind === 'commercial'
  const lines = [
    commercial ? 'R&R Glimzo — Commercial site visit request' : 'R&R Glimzo — Domestic quote request',
    '',
  ]
  const fields: FieldSpec[] = [
    ['Name', 'name'],
    ['Email', 'email'],
    ['Phone', 'phone'],
    ...(commercial
      ? ([['Organisation', 'organisation'], ['Building type', 'sector'], ['Approximate size', 'size']] as const)
      : ([['Service', 'service'], ['Property type', 'property'], ['Bedrooms', 'bedrooms']] as const)),
    ['Town or postcode', 'location'],
    ['Cleaning frequency', 'frequency'],
    [commercial ? 'Preferred visit date' : 'Preferred cleaning date', 'date'],
    ...(commercial ? ([['Preferred visit time', 'visit_time']] as const) : []),
    ['Details', 'details'],
  ]
  for (const [label, key] of fields) {
    let value = get(key)
    // Show ISO dates from <input type="date"> in UK format.
    if (key === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) value = value.split('-').reverse().join('/')
    if (value) lines.push(`${label}: ${value}`)
  }
  lines.push('', 'Please contact me to discuss this request. Dates are subject to confirmation.')
  return lines.join('\n')
}
