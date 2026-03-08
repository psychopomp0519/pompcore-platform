/**
 * 인증 서비스 모듈
 * - Supabase Auth를 추상화하여 UI와 분리
 * - 향후 인증 방식이 변경되어도 이 파일만 수정하면 됨
 * - 모든 서브 프로젝트(Vault, Quest 등)에서 동일한 인터페이스 사용
 */
import { supabase, isSupabaseConfigured } from './supabase';
import type { LoginRequest, RegisterRequest, UserProfile } from '../types/auth.types';
import type { UserRole } from '../constants/roles';

/** 유효한 역할인지 런타임 검증 */
const VALID_ROLES: UserRole[] = ['leader', 'member', 'user'];
function isValidRole(value: unknown): value is UserRole {
  return typeof value === 'string' && VALID_ROLES.includes(value as UserRole);
}

/** Supabase User → UserProfile 변환 (런타임 타입 검증 포함) */
function toUserProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string }): UserProfile {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? '',
    displayName:
      (typeof meta.display_name === 'string' ? meta.display_name : null)
      ?? (typeof meta.full_name === 'string' ? meta.full_name : null)
      ?? (typeof meta.name === 'string' ? meta.name : null),
    avatarUrl:
      (typeof meta.avatar_url === 'string' ? meta.avatar_url : null)
      ?? (typeof meta.picture === 'string' ? meta.picture : null),
    createdAt: user.created_at ?? new Date().toISOString(),
    role: isValidRole(meta.role) ? meta.role : 'user',
  };
}

/** 이메일/비밀번호 로그인 */
export async function login({ email, password }: LoginRequest): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('사용자 정보를 가져올 수 없습니다.');

  return toUserProfile(data.user);
}

/** 이메일/비밀번호 회원가입 */
export async function register({ email, password, displayName }: RegisterRequest): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('회원가입에 실패했습니다.');

  return toUserProfile(data.user);
}

/** Google OAuth 로그인 */
export async function loginWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw new Error(error.message);
}

/** 로그아웃 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/** 현재 세션의 사용자 정보 조회 (URL 해시의 OAuth 토큰도 자동 감지) */
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.user) return null;

  /* OAuth 리다이렉트 후 URL 해시에 남은 토큰 정리 */
  if (window.location.hash.includes('access_token')) {
    window.history.replaceState(null, '', window.location.pathname);
  }

  return toUserProfile(session.user);
}

/** 인증 상태 변경 리스너 (앱 초기화 시 사용) */
export function onAuthStateChange(callback: (user: UserProfile | null) => void) {
  if (!isSupabaseConfigured) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toUserProfile(session.user) : null);
  });
}
