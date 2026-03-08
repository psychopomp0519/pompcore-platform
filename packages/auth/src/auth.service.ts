/**
 * @file Auth service — Email/password, Google OAuth, social linking
 * @module @pompcore/auth/auth.service
 */
import type { UserProfile } from '@pompcore/types';
import { mapUserToProfile } from '@pompcore/types';
import { getSupabase } from './supabase';

// ============================================================
// Auth service
// ============================================================

/** 이메일/비밀번호 로그인 */
export async function signInWithEmail(email: string, password: string): Promise<UserProfile> {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return mapUserToProfile(data.user);
}

/** 이메일/비밀번호 회원가입 */
export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<UserProfile> {
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName, role: 'user' } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('회원가입에 실패했습니다.');
  return mapUserToProfile(data.user);
}

/** Google OAuth 로그인 */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

/** 로그아웃 */
export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

/** 현재 세션 사용자 가져오기 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data, error } = await getSupabase().auth.getUser();
  if (error || !data.user) return null;
  return mapUserToProfile(data.user);
}

// ============================================================
// Social account linking
// ============================================================

/**
 * Supabase UserIdentity의 필수 필드 (구조적 타이핑용)
 * unlinkIdentity API 파라미터와 호환되는 최소 인터페이스
 */
export interface LinkedIdentity {
  id: string;
  user_id: string;
  identity_id: string;
  provider: string;
  identity_data?: Record<string, unknown>;
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
}

/** 현재 계정에 연동된 소셜 identity 목록 조회 */
export async function getLinkedIdentities(): Promise<LinkedIdentity[]> {
  const { data, error } = await getSupabase().auth.getUserIdentities();
  if (error) throw error;
  return (data?.identities ?? []) as LinkedIdentity[];
}

/**
 * Google 소셜 계정 연동 (OAuth redirect)
 * 연동 완료 후 redirectTo 경로로 돌아옴
 */
export async function linkGoogleAccount(): Promise<void> {
  const { error } = await getSupabase().auth.linkIdentity({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

/**
 * Google 소셜 계정 연동 해제
 * identity가 2개 이상일 때만 허용 (계정 잠금 방지)
 */
export async function unlinkGoogleAccount(identity: LinkedIdentity): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.unlinkIdentity(identity as Parameters<typeof supabase.auth.unlinkIdentity>[0]);
  if (error) throw error;
}

/** 인증 상태 변경 리스너 등록 */
export function onAuthStateChange(
  callback: (user: UserProfile | null) => void,
): { unsubscribe: () => void } {
  const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback(mapUserToProfile(session.user));
    } else {
      callback(null);
    }
  });

  return { unsubscribe: () => subscription.unsubscribe() };
}
