import { useEffect, useSyncExternalStore } from 'react'
import { HomePage } from './pages/HomePage.tsx'
import { PrivacyPage } from './pages/PrivacyPage.tsx'
import { PRIVACY_HASH } from './lib/routes.ts'

const HOME_TITLE = document.title
const PRIVACY_TITLE = 'Website Privacy Notice | R&R Glimzo'

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const isPrivacyRoute = () => location.hash === PRIVACY_HASH

/** Switches between the two pages by URL hash, so the site needs no server-side routing. */
export function App() {
  const privacy = useSyncExternalStore(subscribe, isPrivacyRoute)

  // Browsers scroll to a hash before the new page renders, so scroll again once it has.
  useEffect(() => {
    document.title = privacy ? PRIVACY_TITLE : HOME_TITLE
    const target = privacy ? null : document.getElementById(location.hash.slice(1))
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [privacy])

  return privacy ? <PrivacyPage /> : <HomePage />
}
