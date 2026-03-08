/**
 * @file ProtectedRoute — Redirects unauthenticated users to login
 * @module @pompcore/auth/components/ProtectedRoute
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../auth.store';
import { LoadingSpinner } from '@pompcore/ui';

export function ProtectedRoute() {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
