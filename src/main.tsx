import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initStorefrontAuth } from '@/core';
import App from './App';
import './index.css';

initStorefrontAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
