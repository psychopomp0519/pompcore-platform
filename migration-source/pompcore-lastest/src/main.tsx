/**
 * 앱 엔트리포인트
 * - React 앱을 DOM에 마운트
 * - 글로벌 스타일시트 적용
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
