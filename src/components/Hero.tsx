import logoUrl from "../assets/glimzo-logo.png";
import { RequestLink } from "../requests/RequestLink.tsx";
import { ArrowIcon, ImageIcon } from "./Icons.tsx";
import { Photo } from "./Reveal.tsx";

const HIGHLIGHTS = [
  "Homes & apartments",
  "End of tenancy",
  "Workplaces & facilities",
  "Builders Cleaning / Post-Construction Cleaning",
];

export function Hero() {
  return (
    <>
      <div className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
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
                <ArrowIcon />
              </RequestLink>
              <RequestLink className="ghost" kind="commercial">
                Request a site visit
              </RequestLink>
            </div>
          </div>
          <div className="hero-art">
            {/*
              PHOTO PLACEHOLDERS (replace with <img>, ~4:5 and ~1:1, soft natural light, warm tones):
              1. Tall: bright, tidy living room with sunlight across a freshly cleaned floor, plants, a throw on the sofa.
              2. Small: close-up of a gloved hand wiping a pale kitchen worktop, with a soft-focus background.
            */}
            <Photo className="hero-photo hero-photo-a">
              <ImageIcon />
            </Photo>
            <Photo className="hero-photo hero-photo-b">
              <ImageIcon />
            </Photo>
            <div className="hero-logo">
              <img
                src={logoUrl}
                width={1536}
                height={1024}
                alt="R&R Glimzo purple electric logo and We clean. You unwind. tagline"
              />
            </div>
            <span className="spark spark-1" aria-hidden="true" />
            <span className="spark spark-2" aria-hidden="true" />
            <span className="spark spark-3" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="strip">
        <div className="marquee">
          {[0, 1].map((copy) => (
            <div className="marquee-track" key={copy} aria-hidden={copy === 1 || undefined}>
              {HIGHLIGHTS.map((text) => (
                <span key={text}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
