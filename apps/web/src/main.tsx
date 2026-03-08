/**
 * @file Entry point — PompCore Web (pompcore.cc)
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAppConfig } from '@pompcore/sdk';
import { ErrorBoundary } from '@pompcore/ui';
import App from './App';

import '@pompcore/ui/styles/base.css';
import './styles/globals.css';

createAppConfig({
  name: 'PompCore',
  version: '0.4.8',
  brandColor: '#7C3AED',
  brandColorLight: '#A855F7',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
