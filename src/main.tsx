import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

/**
 * autoUpdate + reload: installed PWAs were keeping the pre-hybrid bundle in
 * Workbox precache because the injected registerSW.js never reloaded on
 * controllerchange. Immediate check + reload on needRefresh fixes QA case 2
 * for returning clients after a hard refresh / next visit.
 */
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    // Re-check periodically so long-lived phone PWAs pick up deploys.
    if (registration) {
      setInterval(() => {
        void registration.update()
      }, 60 * 60 * 1000)
    }
  },
  onNeedRefresh() {
    // registerType autoUpdate: virtual helper reloads when the new SW takes over.
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
