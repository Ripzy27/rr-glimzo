import logoUrl from "../assets/glimzo-logo.png";
import { RequestLink } from "../requests/RequestLink.tsx";

export function Hero() {
  return (
    <>
      <div className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Domestic &amp; commercial cleaning</div>
            <h1>
              We clean.
              <br />
              <em>You unwind.</em>
            </h1>
            <p>
              From your home to your workplace, R&amp;R Glimzo takes care of the
              cleaning so you can focus on everything else.
            </p>
            <div className="actions">
              <RequestLink className="pill" kind="domestic">
                Request a domestic quote
              </RequestLink>
              <RequestLink className="ghost" kind="commercial">
                Request a site visit
              </RequestLink>
            </div>
          </div>
          <div className="hero-art">
            <img
              src={logoUrl}
              width={1536}
              height={1024}
              alt="R&R Glimzo purple electric logo and We clean. You unwind. tagline"
            />
          </div>
        </div>
      </div>
      <div className="strip">
        <div className="wrap">
          <span>Homes &amp; apartments</span>
          <span>End of tenancy</span>
          <span>Workplaces &amp; facilities</span>
          <span>Builders Cleaning / Post-Construction Cleaning</span>
        </div>
      </div>
    </>
  );
}
