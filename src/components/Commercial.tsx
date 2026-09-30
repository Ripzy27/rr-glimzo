import { RequestLink } from '../requests/RequestLink.tsx'

export function Commercial() {
  return (
    <section id="commercial" className="commercial">
      <div className="wrap">
        <div className="commercial-inner">
          <div>
            <div className="kicker">Commercial spaces</div>
            <h2>Every building has its own rhythm.</h2>
            <p className="intro">
              A site visit helps us understand the space, agree the cleaning tasks and discuss a schedule around your
              opening hours. Tell us about your building to start a commercial enquiry.
            </p>
            <RequestLink className="pill" kind="commercial">
              Request a commercial site visit
            </RequestLink>
          </div>
          <div className="sector-grid">
            <RequestLink className="sector" kind="commercial" sector="Office">
              Offices
            </RequestLink>
            <a className="sector" href="#nursery-cleaning">
              Nurseries
            </a>
            <RequestLink className="sector" kind="commercial" sector="Factory or industrial premises">
              Factories
            </RequestLink>
            <a className="sector" href="#healthcare-cleaning">
              Hospitals &amp; healthcare
            </a>
            <RequestLink className="sector" kind="commercial" sector="Hotel">
              Hotels
            </RequestLink>
            <RequestLink className="sector" kind="commercial" sector="Other commercial building">
              Other commercial buildings
            </RequestLink>
          </div>
        </div>
        <div className="specialist-grid">
          <article className="specialist" id="nursery-cleaning">
            <div className="kicker">Nurseries &amp; early years</div>
            <h3>A cleaning plan around their day.</h3>
            <p>
              Discuss a cleaning schedule for your nursery with tasks, frequency and responsibilities agreed with your
              manager.
            </p>
            <ul>
              <li>Playrooms, floors, tables and frequently touched surfaces.</li>
              <li>Toilets, handwashing and changing areas, with responsibilities clearly agreed.</li>
              <li>Washable toys and equipment, where included, following the manufacturer’s care instructions.</li>
              <li>Daily, weekly and periodic cleaning, with visits planned around children’s attendance.</li>
            </ul>
            <p className="scope">
              Before confirming the work, we discuss suitable products, separate equipment for different areas, safe
              storage and your safeguarding and access arrangements.
            </p>
            <RequestLink className="service-action" kind="commercial" sector="Nursery or early years setting">
              Discuss your nursery
            </RequestLink>
          </article>
          <article className="specialist" id="healthcare-cleaning">
            <div className="kicker">Hospitals &amp; healthcare</div>
            <h3>Start with your site’s requirements.</h3>
            <p>
              Healthcare enquiries begin with a discussion with your facilities or infection prevention team to assess
              the areas and work we can take on.
            </p>
            <ul>
              <li>Reception areas, offices, corridors and other agreed shared spaces.</li>
              <li>A written schedule defining cleaning tasks, frequency and responsibility.</li>
              <li>Site-approved methods and products, equipment separation and agreed checks.</li>
              <li>Access, staff training and documentation requirements reviewed before a service is agreed.</li>
            </ul>
            <p className="scope">
              Clinical areas, isolation rooms, bodily fluid spills and clinical waste require a separate assessment and
              agreement before any work can be accepted.
            </p>
            <RequestLink className="service-action" kind="commercial" sector="Hospital or healthcare setting">
              Discuss your healthcare site
            </RequestLink>
          </article>
        </div>
      </div>
    </section>
  )
}
