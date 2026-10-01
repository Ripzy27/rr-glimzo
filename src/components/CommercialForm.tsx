import { BUILDING_TYPES, COMMERCIAL_FREQUENCIES, VISIT_TIMES, type BuildingType } from '../data/options.ts'
import { useRequests } from '../requests/RequestContext.ts'
import { RequestForm } from '../requests/RequestForm.tsx'
import { ContactFields } from './ContactFields.tsx'
import { Field, Options } from './Field.tsx'

export function CommercialForm() {
  const { sector, setSector } = useRequests()
  return (
    <RequestForm
      kind="commercial"
      label="Commercial site visit request"
      intro="Share a few details so we can discuss a visit and prepare a cleaning proposal."
      submitLabel="Send site visit request"
      preset={sector}
    >
      <ContactFields kind="commercial" />
      <fieldset>
        <legend>About your site</legend>
        <Field label="Business or organisation" wide>
          <input name="organisation" autoComplete="organization" maxLength={160} required />
        </Field>
        <Field label="Building type">
          <select
            name="sector"
            id="commercial-sector"
            required
            value={sector}
            onChange={event => setSector(event.target.value as BuildingType | '')}
          >
            <Options placeholder="Select a building" values={BUILDING_TYPES} />
          </select>
        </Field>
        <Field label="Site town or postcode">
          <input name="location" maxLength={120} autoComplete="postal-code" required />
        </Field>
        <Field label="Approximate size" optional>
          <input name="size" maxLength={140} placeholder="Floor area, floors or number of rooms" />
        </Field>
        <Field label="Cleaning frequency">
          <select name="frequency" required>
            <Options placeholder="Select frequency" values={COMMERCIAL_FREQUENCIES} />
          </select>
        </Field>
        <Field label="Preferred visit date" optional>
          <input name="date" type="date" />
        </Field>
        <Field label="Best time to visit" optional>
          <select name="visit_time">
            <Options placeholder="Select a time" values={VISIT_TIMES} />
          </select>
        </Field>
        <Field label="Cleaning and site requirements" wide>
          <textarea
            name="details"
            maxLength={2500}
            required
            placeholder="Areas to clean, opening hours, preferred cleaning times and access arrangements. Please leave out patient, child and security-sensitive details."
          />
        </Field>
      </fieldset>
    </RequestForm>
  )
}
