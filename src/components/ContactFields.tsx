import type { RequestKind } from '../requests/RequestContext.ts'
import { Field } from './Field.tsx'

export function ContactFields({ kind }: { kind: RequestKind }) {
  return (
    <fieldset>
      <legend>Your contact details</legend>
      <Field label="Your name">
        <input id={`${kind}-name`} name="name" autoComplete="name" maxLength={120} required />
      </Field>
      <Field label="Email address">
        <input name="email" type="email" autoComplete="email" maxLength={254} required />
      </Field>
      <Field label="Phone number" optional wide>
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </Field>
    </fieldset>
  )
}
