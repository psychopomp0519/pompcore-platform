/**
 * @file Entry point — Vault (vault.pompcore.cc)
 * @description 앱 진입점 - createAppConfig으로 공유 서비스 초기화 후 렌더
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAppConfig } from '@pompcore/sdk';
import { ErrorBoundary } from '@pompcore/ui';
import { App } from './App';
import './index.css';

createAppConfig({
  name: 'Vault',
  version: '1.1.1',
  brandColor: '#10B981',
  brandColorLight: '#34D399',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
