/**
 * @file Entry point — Forge (forge.pompcore.cc)
 * @description 앱 진입점 - createAppConfig으로 공유 서비스 초기화 후 렌더
 * @module main
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAppConfig } from '@pompcore/sdk';
import { ErrorBoundary } from '@pompcore/ui';
import { App } from './App';
import './styles/index.css';

// ============================================================
// Platform Config — Forge 서비스 등록
// ============================================================

createAppConfig({
  name: 'Forge',
  version: '0.1.0',
  brandColor: '#F97316',
  brandColorLight: '#FB923C',
});

// ============================================================
// Render
// ============================================================

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
