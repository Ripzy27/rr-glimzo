import { DOMESTIC_SERVICES } from "../data/options.ts";
import { RequestForm } from "../requests/RequestForm.tsx";
import { ContactFields } from "./ContactFields.tsx";
import { Field, Options } from "./Field.tsx";

export function ReferralForm() {
  return (
    <RequestForm
      kind="referral"
      label="Referral request"
      intro="Refer a customer to R&R Glimzo and earn up to 7% of the qualifying cleaning charge. Your referral must be registered and the applicable commission rate agreed with us in writing before you introduce the customer. Commission becomes payable only after the customer has accepted our quotation, R&R Glimzo has confirmed the booking, the agreed cleaning work has been completed and we have received full cleared payment. Acceptance of a quotation alone does not trigger payment. Commission is calculated on the agreed cleaning charge actually received, excluding VAT, discounts and refunded amounts. Cancelled or unpaid jobs do not qualify. Rewards apply to the specific job covered by your referral agreement."
      submitLabel="Prepare referral"
    >
      <ContactFields kind="referral" />
      <fieldset>
        <legend>Who are you referring?</legend>
        <Field label="Their name">
          <input
            name="referee_name"
            autoComplete="off"
            maxLength={120}
            required
          />
        </Field>
        <Field label="Their phone number">
          <input
            name="referee_phone"
            type="tel"
            autoComplete="off"
            maxLength={40}
            required
          />
        </Field>
        <Field label="Their email address" optional>
          <input
            name="referee_email"
            type="email"
            autoComplete="off"
            maxLength={254}
          />
        </Field>
        <Field label="Their town or postcode" optional>
          <input name="location" autoComplete="off" maxLength={120} />
        </Field>
        <Field label="Service they need" optional wide>
          <select name="service">
            <Options placeholder="Not sure" values={DOMESTIC_SERVICES} />
          </select>
        </Field>
        <Field label="Anything else?" optional wide>
          <textarea
            name="details"
            maxLength={2500}
            placeholder="Anything that would help us, such as the best time to call. Please leave out access codes and personal health details."
          />
        </Field>
        <label className="consent">
          <input name="consent" type="checkbox" required />I have their
          permission to share their contact details with R&amp;R Glimzo.
        </label>
      </fieldset>
    </RequestForm>
  );
}
