import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrivacyPage } from './pages/PrivacyPage.tsx'
import './styles/site.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivacyPage />
  </StrictMode>,
)
