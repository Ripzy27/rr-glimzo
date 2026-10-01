import { Link } from "react-router-dom";
import { PRIVACY_PATH, TERMS_PATH } from "../lib/routes.ts";
import { Commercial } from "../components/Commercial.tsx";
import { Hero } from "../components/Hero.tsx";
import { Quote } from "../components/Quote.tsx";
import { Services } from "../components/Services.tsx";
import { SiteFooter } from "../components/SiteFooter.tsx";
import { SiteHeader } from "../components/SiteHeader.tsx";
import { RequestProvider } from "../requests/RequestProvider.tsx";

export function HomePage() {
  return (
    <RequestProvider>
      <SiteHeader brandHref="#top">
        <div className="links">
          <a href="#services">Services</a>
          <a href="#commercial">Commercial spaces</a>
          <a className="secondary-pill" href="#quote">
            Earn Referal 7%
          </a>
          <a className="pill" href="#quote">
            Get a quote
          </a>
        </div>
      </SiteHeader>
      <main id="top">
        <Hero />
        <Services />
        <Commercial />
        <Quote />
      </main>
      <SiteFooter>
        <a href="#top">Back to top ↑</a>
        <Link to={PRIVACY_PATH}>Privacy policy</Link>
        <Link to={TERMS_PATH}>Terms &amp; Conditions</Link>
      </SiteFooter>
    </RequestProvider>
  );
}
