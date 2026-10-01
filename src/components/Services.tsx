import { DOMESTIC_SERVICES } from '../data/options.ts'
import { RequestLink } from '../requests/RequestLink.tsx'
import { ArrowIcon, BuildingIcon, HomeIcon, SparkleIcon } from './Icons.tsx'
import { Reveal } from './Reveal.tsx'

const MORE_SERVICES = DOMESTIC_SERVICES.filter(
  name => name !== 'End of tenancy cleaning' && name !== 'Several services / advice needed',
)

export function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="kicker">Our services</div>
          <h2>Cleaning for the spaces you live and work in.</h2>
          <p className="intro">
            Tell us about your property, the work required and how often you need us. We’ll discuss a suitable clean
            with you.
          </p>
        </Reveal>
        <div className="cards">
          <Reveal>
            <article className="card">
              <div className="icon">
                <HomeIcon />
              </div>
              <h3>Domestic cleaning</h3>
              <p>
                Cleaning for houses and flats, whether you need a one-off visit or regular support to keep your space
                feeling fresh.
              </p>
              <RequestLink className="service-action" kind="domestic">
                Request a domestic quote
                <ArrowIcon />
              </RequestLink>
            </article>
          </Reveal>
          <Reveal delay={90}>
            <article className="card">
              <div className="icon">
                <SparkleIcon />
              </div>
              <h3>End of tenancy</h3>
              <p>A thorough clean for a property handover, tailored to the size and condition of the home.</p>
              <RequestLink className="service-action" kind="domestic" service="End of tenancy cleaning">
                Request an end of tenancy quote
                <ArrowIcon />
              </RequestLink>
            </article>
          </Reveal>
          <Reveal delay={180}>
            <article className="card">
              <div className="icon">
                <BuildingIcon />
              </div>
              <h3>Commercial cleaning</h3>
              <p>Cleaning plans for businesses and facilities, arranged around the building and how it is used.</p>
              <RequestLink className="service-action" kind="commercial">
                Request a commercial site visit
                <ArrowIcon />
              </RequestLink>
            </article>
          </Reveal>
        </div>
        <Reveal>
          <div className="service-list" aria-label="More cleaning services">
            {MORE_SERVICES.map(name => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
