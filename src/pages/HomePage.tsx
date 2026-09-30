import { Commercial } from '../components/Commercial.tsx'
import { Hero } from '../components/Hero.tsx'
import { Quote } from '../components/Quote.tsx'
import { Services } from '../components/Services.tsx'
import { SiteFooter } from '../components/SiteFooter.tsx'
import { SiteHeader } from '../components/SiteHeader.tsx'
import { RequestProvider } from '../requests/RequestProvider.tsx'

export function HomePage() {
  return (
    <RequestProvider>
      <SiteHeader brandHref="#top">
        <div className="links">
          <a href="#services">Services</a>
          <a href="#commercial">Commercial spaces</a>
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
        <a href="privacy.html">Privacy notice</a>
      </SiteFooter>
    </RequestProvider>
  )
}
