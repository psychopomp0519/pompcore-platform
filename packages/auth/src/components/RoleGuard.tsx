/**
 * @file RoleGuard — Permission-based content rendering
 * @module @pompcore/auth/components/RoleGuard
 */
import type { ReactNode } from 'react';
import type { Permission } from '@pompcore/types';
import { useAuthStore } from '../auth.store';
import { hasPermission } from '../roles';

interface RoleGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ permission, children, fallback }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return fallback ?? <div className="py-16 text-center text-slate-500 dark:text-slate-400">로그인이 필요합니다.</div>;
  }

  if (!hasPermission(user.role, permission)) {
    return fallback ?? <div className="py-16 text-center text-slate-500 dark:text-slate-400">접근 권한이 없습니다.</div>;
  }

  return <>{children}</>;
}
