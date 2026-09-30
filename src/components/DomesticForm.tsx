import { BEDROOMS, DOMESTIC_FREQUENCIES, DOMESTIC_SERVICES, PROPERTY_TYPES, type DomesticService } from '../data/options.ts'
import { useRequests } from '../requests/RequestContext.ts'
import { RequestForm } from '../requests/RequestForm.tsx'
import { ContactFields } from './ContactFields.tsx'
import { Field, Options } from './Field.tsx'

export function DomesticForm() {
  const { service, setService } = useRequests()
  return (
    <RequestForm
      kind="domestic"
      label="Domestic quote request"
      intro="Tell us what your home needs."
      submitLabel="Prepare domestic request"
      preset={service}
    >
      <ContactFields kind="domestic" />
      <fieldset>
        <legend>About your clean</legend>
        <Field label="Cleaning service">
          <select
            name="service"
            id="domestic-service"
            required
            value={service}
            onChange={event => setService(event.target.value as DomesticService | '')}
          >
            <Options placeholder="Select a service" values={DOMESTIC_SERVICES} />
          </select>
        </Field>
        <Field label="Town or postcode">
          <input name="location" maxLength={120} autoComplete="postal-code" required />
        </Field>
        <Field label="Property type">
          <select name="property" required>
            <Options placeholder="Select a property" values={PROPERTY_TYPES} />
          </select>
        </Field>
        <Field label="Bedrooms">
          <select name="bedrooms">
            <Options placeholder="Choose if relevant" values={BEDROOMS} />
          </select>
        </Field>
        <Field label="How often?">
          <select name="frequency" required>
            <Options placeholder="Select frequency" values={DOMESTIC_FREQUENCIES} />
          </select>
        </Field>
        <Field label="Preferred date" optional>
          <input type="date" name="date" />
        </Field>
        <Field label="Anything else?" optional wide>
          <textarea
            name="details"
            maxLength={2500}
            placeholder="Bathrooms, priority areas, extra services or preferred days. Please leave out access codes and personal health details."
          />
        </Field>
      </fieldset>
    </RequestForm>
  )
}
