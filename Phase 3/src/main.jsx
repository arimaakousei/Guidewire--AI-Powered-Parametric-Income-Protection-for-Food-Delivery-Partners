import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GigShieldPhase3 from './GigShieldPhase3.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GigShieldPhase3 />
  </StrictMode>,
)
