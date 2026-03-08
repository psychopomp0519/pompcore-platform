/**
 * App 루트 컴포넌트
 * - ErrorBoundary로 런타임 에러 포착
 * - RouterProvider로 라우팅 시스템 마운트
 * - useAuthInit으로 인증 상태 리스너 자동 등록
 */
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthInit } from '@pompcore/auth';
import { ErrorBoundary } from '@pompcore/ui';

export default function App() {
  useAuthInit();

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
