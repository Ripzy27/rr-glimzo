import type { ReactNode } from 'react'

/** Small stroke icons, drawn inline so they inherit colour and need no extra assets. */
const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

export const HomeIcon = () => (
  <Svg>
    <path d="M4 11 12 4l8 7" />
    <path d="M6 10v9h12v-9" />
    <path d="M10 19v-5h4v5" />
  </Svg>
)

export const SparkleIcon = () => (
  <Svg>
    <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="m19 16 .7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" />
  </Svg>
)

export const BuildingIcon = () => (
  <Svg>
    <path d="M5 20V5l9-2v17" />
    <path d="M14 9h5v11" />
    <path d="M9 8h1M9 12h1M9 16h1M17 13h.01M17 17h.01" />
  </Svg>
)

export const OfficeIcon = () => (
  <Svg>
    <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
    <path d="M8 20h8M12 16v4" />
  </Svg>
)

export const NurseryIcon = () => (
  <Svg>
    <rect x="4" y="12" width="7" height="7" rx="1" />
    <rect x="13" y="12" width="7" height="7" rx="1" />
    <rect x="8.5" y="4.5" width="7" height="7" rx="1" />
  </Svg>
)

export const FactoryIcon = () => (
  <Svg>
    <path d="M3 20V10l6 3V10l6 3V6h3v14z" />
    <path d="M7 20v-3M12 20v-3" />
  </Svg>
)

export const HealthIcon = () => (
  <Svg>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M12 8.5v7M8.5 12h7" />
  </Svg>
)

export const HotelIcon = () => (
  <Svg>
    <path d="M3 18V7M3 14h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5" />
    <circle cx="7" cy="11" r="1.6" />
  </Svg>
)

export const GridIcon = () => (
  <Svg>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </Svg>
)

export const ArrowIcon = () => (
  <Svg>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

export const ImageIcon = () => (
  <Svg>
    <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" />
  </Svg>
)

export const ListIcon = () => (
  <Svg>
    <rect x="4" y="4" width="16" height="6" rx="1.5" />
    <rect x="4" y="14" width="16" height="6" rx="1.5" />
  </Svg>
)

export const BoardIcon = () => (
  <Svg>
    <rect x="4" y="4" width="4.5" height="16" rx="1.2" />
    <rect x="9.75" y="4" width="4.5" height="10" rx="1.2" />
    <rect x="15.5" y="4" width="4.5" height="13" rx="1.2" />
  </Svg>
)
