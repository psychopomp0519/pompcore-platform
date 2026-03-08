/**
 * @file Role definitions and permission matrix
 * @module @pompcore/types/roles
 */
import type { UserRole, Permission } from './auth.types';

export const ROLE_LABELS: Record<UserRole, string> = {
  leader: '리더',
  member: '멤버',
  user: '사용자',
};

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  leader: ['view_applications', 'manage_team', 'view_project_overview', 'view_internal_docs', 'use_services', 'manage_profile'],
  member: ['view_project_overview', 'view_internal_docs', 'use_services', 'manage_profile'],
  user: ['use_services', 'manage_profile'],
};

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
