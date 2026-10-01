import type { ReactNode } from 'react'
import type { BuildingType } from '../data/options.ts'
import { RequestLink } from '../requests/RequestLink.tsx'
import { ArrowIcon, FactoryIcon, GridIcon, HealthIcon, HotelIcon, ImageIcon, NurseryIcon, OfficeIcon } from './Icons.tsx'
import { Photo, Reveal } from './Reveal.tsx'

/** A sector tile either pre-selects a building type in the form or jumps to a specialist section. */
type Sector = { label: ReactNode; icon: ReactNode } & ({ sector: BuildingType } | { href: string })

const SECTORS: Sector[] = [
  { label: 'Offices', icon: <OfficeIcon />, sector: 'Office' },
  { label: 'Nurseries', icon: <NurseryIcon />, href: '#nursery-cleaning' },
  { label: 'Factories', icon: <FactoryIcon />, sector: 'Factory or industrial premises' },
  { label: <>Hospitals &amp; healthcare</>, icon: <HealthIcon />, href: '#healthcare-cleaning' },
  { label: 'Hotels', icon: <HotelIcon />, sector: 'Hotel' },
  { label: 'Other commercial buildings', icon: <GridIcon />, sector: 'Other commercial building' },
]

interface SpecialistProps {
  id: string
  kicker: ReactNode
  title: string
  intro: string
  points: string[]
  scope: string
  sector: BuildingType
  action: string
}

const SPECIALISTS: SpecialistProps[] = [
  {
    id: 'nursery-cleaning',
    kicker: <>Nurseries &amp; early years</>,
    title: 'A cleaning plan around their day.',
    intro:
      'Discuss a cleaning schedule for your nursery with tasks, frequency and responsibilities agreed with your manager.',
    points: [
      'Playrooms, floors, tables and frequently touched surfaces.',
      'Toilets, handwashing and changing areas, with responsibilities clearly agreed.',
      'Washable toys and equipment, where included, following the manufacturer’s care instructions.',
      'Daily, weekly and periodic cleaning, with visits planned around children’s attendance.',
    ],
    scope:
      'Before confirming the work, we discuss suitable products, separate equipment for different areas, safe storage and your safeguarding and access arrangements.',
    sector: 'Nursery or early years setting',
    action: 'Discuss your nursery',
  },
  {
    id: 'healthcare-cleaning',
    kicker: <>Hospitals &amp; healthcare</>,
    title: 'Start with your site’s requirements.',
    intro:
      'Healthcare enquiries begin with a discussion with your facilities or infection prevention team to assess the areas and work we can take on.',
    points: [
      'Reception areas, offices, corridors and other agreed shared spaces.',
      'A written schedule defining cleaning tasks, frequency and responsibility.',
      'Site-approved methods and products, equipment separation and agreed checks.',
      'Access, staff training and documentation requirements reviewed before a service is agreed.',
    ],
    scope:
      'Clinical areas, isolation rooms, bodily fluid spills and clinical waste require a separate assessment and agreement before any work can be accepted.',
    sector: 'Hospital or healthcare setting',
    action: 'Discuss your healthcare site',
  },
]

function Specialist({ id, kicker, title, intro, points, scope, sector, action }: SpecialistProps) {
  return (
    <article className="specialist" id={id}>
      <div className="kicker">{kicker}</div>
      <h3>{title}</h3>
      <p>{intro}</p>
      <ul>
        {points.map(point => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="scope">{scope}</p>
      <RequestLink className="service-action" kind="commercial" sector={sector}>
        {action}
        <ArrowIcon />
      </RequestLink>
    </article>
  )
}

export function Commercial() {
  return (
    <section id="commercial" className="commercial">
      <div className="wrap">
        <div className="commercial-inner">
          <Reveal>
            <div className="kicker">Commercial spaces</div>
            <h2>Every building has its own rhythm.</h2>
            <p className="intro">
              A site visit helps us understand the space, agree the cleaning tasks and discuss a schedule around your
              opening hours. Tell us about your building to start a commercial enquiry.
            </p>
            <RequestLink className="pill" kind="commercial">
              Request a commercial site visit
              <ArrowIcon />
            </RequestLink>
            {/*
              PHOTO PLACEHOLDER (replace with <img>, ~16:10, cool-warm daylight):
              A calm, freshly cleaned open-plan office in late afternoon light, with polished floors and no people in frame.
            */}
            <Photo className="commercial-photo">
              <ImageIcon />
            </Photo>
          </Reveal>
          <div className="sector-grid">
            {SECTORS.map((item, index) => (
              <Reveal key={index} delay={index * 60}>
                {'href' in item ? (
                  <a className="sector" href={item.href}>
                    {item.icon}
                    {item.label}
                  </a>
                ) : (
                  <RequestLink className="sector" kind="commercial" sector={item.sector}>
                    {item.icon}
                    {item.label}
                  </RequestLink>
                )}
              </Reveal>
            ))}
          </div>
        </div>
        <div className="specialist-grid">
          {SPECIALISTS.map((specialist, index) => (
            <Reveal key={specialist.id} delay={index * 100}>
              <Specialist {...specialist} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
