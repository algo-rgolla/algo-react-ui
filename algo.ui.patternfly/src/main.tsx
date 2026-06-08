import '@patternfly/react-core/dist/styles/base.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

;(() => {
  const html = document.documentElement
  html.classList.add('pf-v5-theme-dark', 'pf-v6-theme-dark')
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
