/**
 * @file auth.service.ts
 * @description Server-side auth service — profile lookup, role management.
 *
 * Authentication itself is handled by Supabase Auth (JWT issuance, OAuth).
 * This service handles server-side operations that require elevated
 * privileges: fetching any user's profile, updating roles, etc.
 *
 * @module @pompcore/api/services/auth
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { type UserProfile, type UserRole, VALID_ROLES, mapUserToProfile } from '@pompcore/types';
import { getAdminClient } from '../lib/supabase.js';
import { NotFoundError } from '../lib/errors.js';

/** Get a user's profile by ID (admin operation) */
export async function getUserById(userId: string): Promise<UserProfile> {
  const { data, error } = await getAdminClient().auth.admin.getUserById(userId);
  if (error || !data.user) throw new NotFoundError('사용자를 찾을 수 없습니다.');
  return mapUserToProfile(data.user);
}

/** Get the current user's profile from their scoped client */
export async function getCurrentProfile(userClient: SupabaseClient): Promise<UserProfile> {
  const { data, error } = await userClient.auth.getUser();
  if (error || !data.user) throw new NotFoundError('사용자 정보를 가져올 수 없습니다.');
  return mapUserToProfile(data.user);
}

/** Update a user's role (leader-only admin operation) */
export async function updateUserRole(userId: string, role: UserRole): Promise<UserProfile> {
  if (!VALID_ROLES.includes(role)) {
    throw new Error(`유효하지 않은 역할: ${role}`);
  }

  const { data, error } = await getAdminClient().auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });

  if (error) throw new Error(`역할 변경 실패: ${error.message}`);
  return mapUserToProfile(data.user);
}
