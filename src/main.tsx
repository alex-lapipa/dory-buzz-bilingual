import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { ConsentProvider } from './contexts/ConsentContext.tsx'

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <AuthProvider>
      <ConsentProvider>
        <App />
      </ConsentProvider>
    </AuthProvider>
  </LanguageProvider>
);
