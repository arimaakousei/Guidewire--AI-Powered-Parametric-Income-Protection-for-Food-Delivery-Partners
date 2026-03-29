import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Phase2 from './Phase2.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Phase2 />

  </StrictMode>,
)
