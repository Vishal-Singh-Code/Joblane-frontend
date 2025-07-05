import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="97834691524-rivto7mjn1vgkmkg5f9tddshgfljpcfs.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </StrictMode>,
)
