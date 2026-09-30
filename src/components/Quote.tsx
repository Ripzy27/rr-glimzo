import { RequestLink } from "../requests/RequestLink.tsx";
import { RequestPanel } from "../requests/RequestPanel.tsx";
import { CommercialForm } from "./CommercialForm.tsx";
import { DomesticForm } from "./DomesticForm.tsx";
import { ReferralForm } from "./ReferralForm.tsx";

export function Quote() {
  return (
    <section id="quote" className="quote">
      <div className="wrap quote-inner">
        <div>
          <div className="kicker">Domestic &amp; commercial enquiries</div>
          <h2>Let’s plan your clean.</h2>
          <p>
            For your home, tell us about the rooms, service and timing. For your
            business, request a site visit so we can discuss the building and
            your requirements.
          </p>
          <div className="request-links">
            <RequestLink kind="domestic">
              Domestic quote
              <span>Homes, one-off visits &amp; end of tenancy.</span>
            </RequestLink>
            <RequestLink kind="referral">
              Refer someone
              <span>Know someone who needs a clean? Send us their details.</span>
            </RequestLink>
            <RequestLink kind="commercial">
              Commercial site visit
              <span>Workplaces, facilities &amp; ongoing cleaning.</span>
            </RequestLink>
          </div>
          <p>Site visits and cleaning dates are subject to confirmation.</p>
        </div>
        <div className="request-stack">
          <RequestPanel kind="domestic" title="Request a domestic quote">
            <DomesticForm />
          </RequestPanel>
          <RequestPanel kind="referral" title="Refer someone">
            <ReferralForm />
          </RequestPanel>
          <RequestPanel
            kind="commercial"
            title="Request a commercial site visit"
          >
            <CommercialForm />
          </RequestPanel>
        </div>
      </div>
    </section>
  );
}
