import { DOMESTIC_SERVICES } from '../data/options.ts'
import { RequestLink } from '../requests/RequestLink.tsx'

const MORE_SERVICES = DOMESTIC_SERVICES.filter(
  name => name !== 'End of tenancy cleaning' && name !== 'Several services / advice needed',
)

export function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">Our services</div>
          <h2>Cleaning for the spaces you live and work in.</h2>
          <p className="intro">
            Tell us about your property, the work required and how often you need us. We’ll discuss a suitable clean
            with you.
          </p>
        </div>
        <div className="cards">
          <article className="card">
            <div className="icon" aria-hidden="true">⌂</div>
            <h3>Domestic cleaning</h3>
            <p>
              Cleaning for houses and flats, whether you need a one-off visit or regular support to keep your space
              feeling fresh.
            </p>
            <RequestLink className="service-action" kind="domestic">
              Request a domestic quote
            </RequestLink>
          </article>
          <article className="card">
            <div className="icon" aria-hidden="true">✧</div>
            <h3>End of tenancy</h3>
            <p>A thorough clean for a property handover, tailored to the size and condition of the home.</p>
            <RequestLink className="service-action" kind="domestic" service="End of tenancy cleaning">
              Request an end of tenancy quote
            </RequestLink>
          </article>
          <article className="card">
            <div className="icon" aria-hidden="true">▦</div>
            <h3>Commercial cleaning</h3>
            <p>Cleaning plans for businesses and facilities, arranged around the building and how it is used.</p>
            <RequestLink className="service-action" kind="commercial">
              Request a commercial site visit
            </RequestLink>
          </article>
        </div>
        <div className="service-list" aria-label="More cleaning services">
          {MORE_SERVICES.map(name => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
