import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// GitHub Pages SPA redirect: convert /?/path back to /path
const { search } = window.location;
if (search.startsWith('?/')) {
  const path = search.slice(2).split('&')[0].replace(/~and~/g, '&');
  window.history.replaceState(null, '', '/' + path + window.location.hash);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
