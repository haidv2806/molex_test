import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import './config/globalErrorHandler'
import ReactErrorHandler from './config/ReactErrorHandler'
import ToastProvider, { ToastConnector } from './config/ToastConfig'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactErrorHandler>
      <ToastProvider>
        <ToastConnector />
        <App />
      </ToastProvider>
    </ReactErrorHandler>
  </StrictMode>,
)
