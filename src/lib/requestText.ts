import { CONTACT_EMAIL } from '../data/contact.ts'
import type { RequestKind } from '../requests/RequestContext.ts'

/** A request ready to send: the email subject and its plain-text body. */
export interface RequestEmail {
  subject: string
  body: string
}

type FieldSpec = readonly [label: string, key: string]
type SectionSpec = readonly [heading: string, fields: readonly FieldSpec[]]

const CONTACT_SECTION: SectionSpec = [
  'Contact details',
  [
    ['Name', 'name'],
    ['Email', 'email'],
    ['Phone', 'phone'],
  ],
]

const KINDS: Record<
  RequestKind,
  { title: string; intro: string; subjectKey: string; detailsHeading: string; sections: readonly SectionSpec[] }
> = {
  domestic: {
    title: 'Domestic quote request',
    intro: 'I would like to request a quote for a domestic clean. My details are below.',
    subjectKey: 'service',
    detailsHeading: 'Additional information',
    sections: [
      CONTACT_SECTION,
      [
        'Property',
        [
          ['Town or postcode', 'location'],
          ['Property type', 'property'],
          ['Bedrooms', 'bedrooms'],
        ],
      ],
      [
        'Cleaning required',
        [
          ['Service', 'service'],
          ['Frequency', 'frequency'],
          ['Preferred cleaning date', 'date'],
        ],
      ],
    ],
  },
  commercial: {
    title: 'Commercial site visit request',
    intro: 'I would like to arrange a site visit to discuss cleaning for our premises. Our details are below.',
    subjectKey: 'organisation',
    detailsHeading: 'Cleaning and site requirements',
    sections: [
      CONTACT_SECTION,
      [
        'Organisation and site',
        [
          ['Organisation', 'organisation'],
          ['Building type', 'sector'],
          ['Site town or postcode', 'location'],
          ['Approximate size', 'size'],
        ],
      ],
      [
        'Cleaning and visit',
        [
          ['Cleaning frequency', 'frequency'],
          ['Preferred visit date', 'date'],
          ['Preferred visit time', 'visit_time'],
        ],
      ],
    ],
  },
}

/** Shows ISO dates from <input type="date"> in UK format. */
const formatDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value

/** Builds the subject and plain-text body of a request email from the submitted form. */
export function buildRequest(kind: RequestKind, data: FormData): RequestEmail {
  const get = (key: string) => String(data.get(key) ?? '').trim()
  const { title, intro, subjectKey, detailsHeading, sections } = KINDS[kind]

  const blocks = [`Hello R&R Glimzo,\n\n${intro}`]
  for (const [heading, fields] of sections) {
    const lines = fields
      .map(([label, key]) => [label, key === 'date' ? formatDate(get(key)) : get(key)] as const)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
    if (lines.length) blocks.push([heading.toUpperCase(), ...lines].join('\n'))
  }
  const details = get('details')
  if (details) blocks.push(`${detailsHeading.toUpperCase()}\n${details}`)
  blocks.push(
    'Please contact me to discuss this request. Dates are subject to confirmation.',
    `Kind regards,\n${get('name')}`,
  )

  const subject = [title, get(subjectKey), get('name')].filter(Boolean).join(' – ')
  return { subject, body: blocks.join('\n\n') }
}

/** A Gmail web compose link with the request addressed to R&R Glimzo. */
export function requestGmail({ subject, body }: RequestEmail): string {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: CONTACT_EMAIL, su: subject, body })
  return `https://mail.google.com/mail/?${params}`
}
