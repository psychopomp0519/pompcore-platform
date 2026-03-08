/**
 * @file Authentication and authorization type definitions
 * @module @pompcore/types/auth
 */

/** User role levels across the platform */
export type UserRole = 'leader' | 'member' | 'user';

/** Platform-wide permission identifiers */
export type Permission =
  | 'view_applications'
  | 'manage_team'
  | 'view_project_overview'
  | 'view_internal_docs'
  | 'use_services'
  | 'manage_profile';

/** Authenticated user profile */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  role: UserRole;
}

/** Valid user roles */
export const VALID_ROLES: UserRole[] = ['leader', 'member', 'user'] as const;

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Registration request payload */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

/** Authentication state */
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
