/**
 * @file ProtectedRoute.tsx
 * @description 인증되지 않은 사용자를 로그인 페이지로 리다이렉트하는 라우트 가드
 * @module components/common/ProtectedRoute
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { ROUTES } from '../../constants/routes';

/** 인증 필요 라우트를 보호하는 컴포넌트 */
export function ProtectedRoute(): React.ReactNode {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-vault-color border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
