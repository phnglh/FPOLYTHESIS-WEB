import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './styles/global.css'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
