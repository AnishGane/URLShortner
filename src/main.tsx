import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { AuthProvider } from './context/auth-context.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { URLProvider } from './context/url-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <URLProvider>
        <Toaster />
        <App />
      </URLProvider>
    </AuthProvider>
  </StrictMode>
)
