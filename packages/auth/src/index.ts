/**
 * @file @pompcore/auth — SSO and session management for the PompCore platform
 * @module @pompcore/auth
 */

// ============================================================
// Core
// ============================================================

export { createSupabaseClient, getSupabase } from './supabase';
export { createCookieStorage } from './cookie-storage';

// ============================================================
// Auth service
// ============================================================

// Re-export from @pompcore/types for convenience
export { mapUserToProfile } from '@pompcore/types';
export type { SupabaseUserLike } from '@pompcore/types';

export {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  getLinkedIdentities,
  linkGoogleAccount,
  unlinkGoogleAccount,
  onAuthStateChange,
} from './auth.service';

export type { LinkedIdentity } from './auth.service';

// ============================================================
// Store
// ============================================================

export { useAuthStore } from './auth.store';

// ============================================================
// Roles & Permissions
// ============================================================

export { ROLE_LABELS, ROLE_PERMISSIONS, hasPermission } from './roles';

// ============================================================
// Hooks
// ============================================================

export { useAuthInit } from './hooks/useAuthInit';

// ============================================================
// Components
// ============================================================

export { ProtectedRoute } from './components/ProtectedRoute';
export { RoleGuard } from './components/RoleGuard';
