/**
 * @file main.tsx
 * @description React 앱 진입점 - ErrorBoundary 래핑
 * @module main
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
