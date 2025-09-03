import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import faviconUrl from './assets/one_piece.png';

const link = document.getElementById('favicon') as HTMLLinkElement | null;
if (link) link.href = faviconUrl;


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
