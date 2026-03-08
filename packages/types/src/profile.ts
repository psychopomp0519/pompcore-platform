/**
 * @file Supabase User → UserProfile 변환
 * @module @pompcore/types/profile
 */
import type { UserProfile, UserRole } from './auth.types';
import { VALID_ROLES } from './auth.types';

/**
 * Supabase User 객체의 최소 인터페이스.
 * supabase-js의 `User` 타입과 호환되면서도 직접 의존하지 않는다.
 */
export interface SupabaseUserLike {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
}

/**
 * Supabase User 객체를 플랫폼 공용 UserProfile로 변환한다.
 *
 * displayName fallback 순서:
 *   display_name → full_name → nickname → email prefix → "Player"
 */
export function mapUserToProfile(user: SupabaseUserLike): UserProfile {
  const meta = user.user_metadata ?? {};

  const rawRole = String(meta.role ?? 'user');
  const role: UserRole = VALID_ROLES.includes(rawRole as UserRole)
    ? (rawRole as UserRole)
    : 'user';

  const displayName =
    nonEmpty(meta.display_name) ??
    nonEmpty(meta.full_name) ??
    nonEmpty(meta.nickname) ??
    emailPrefix(user.email) ??
    'Player';

  return {
    id: user.id,
    email: user.email ?? '',
    displayName,
    avatarUrl: (meta.avatar_url as string) ?? null,
    createdAt: user.created_at ?? new Date().toISOString(),
    role,
  };
}

/** 문자열이고 빈 문자열이 아닌 경우에만 반환 */
function nonEmpty(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

/** 이메일 주소에서 @ 앞부분 추출 */
function emailPrefix(email: string | undefined): string | undefined {
  if (!email) return undefined;
  const prefix = email.split('@')[0];
  return prefix || undefined;
}
