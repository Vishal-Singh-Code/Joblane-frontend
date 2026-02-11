import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

import { LoaderProvider } from "./contexts/LoaderContext";
import GlobalLoader from "./components/GlobalLoader";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoaderProvider>
      <GlobalLoader />
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
    </LoaderProvider>
  </StrictMode>
)
