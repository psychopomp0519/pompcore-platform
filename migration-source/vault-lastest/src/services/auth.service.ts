/**
 * @file auth.service.ts
 * @description Supabase 인증 관련 서비스 함수
 * @module services/auth
 */

import { supabase } from './supabase';
import type { UserProfile, UserRole } from '../types/auth.types';

// ============================================================
// 헬퍼
// ============================================================

/** Supabase User 객체를 UserProfile로 변환 */
function mapUserToProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
}): UserProfile {
  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? '',
    displayName: (metadata.display_name as string) ?? (metadata.full_name as string) ?? null,
    avatarUrl: (metadata.avatar_url as string) ?? null,
    createdAt: user.created_at ?? new Date().toISOString(),
    role: (metadata.role as UserRole) ?? 'user',
  };
}

// ============================================================
// 인증 서비스
// ============================================================

/** 이메일/비밀번호 로그인 */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return mapUserToProfile(data.user);
}

/** 이메일/비밀번호 회원가입 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role: 'user' },
    },
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('회원가입에 실패했습니다.');
  return mapUserToProfile(data.user);
}

/** Google OAuth 로그인 */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw new Error(error.message);
}

/** 로그아웃 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/** 현재 세션 사용자 가져오기 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return mapUserToProfile(user);
}

// ============================================================
// 소셜 계정 연동
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
  const { data, error } = await supabase.auth.getUserIdentities();
  if (error) throw new Error(error.message);
  return (data?.identities ?? []) as LinkedIdentity[];
}

/**
 * Google 소셜 계정 연동 (OAuth redirect)
 * 연동 완료 후 redirectTo 경로로 돌아옴
 */
export async function linkGoogleAccount(): Promise<void> {
  const { error } = await supabase.auth.linkIdentity({
    provider: 'google',
    options: { redirectTo: window.location.href },
  });
  if (error) throw new Error(error.message);
}

/**
 * Google 소셜 계정 연동 해제
 * identity가 2개 이상일 때만 허용 (계정 잠금 방지)
 */
export async function unlinkGoogleAccount(identity: LinkedIdentity): Promise<void> {
  const { error } = await supabase.auth.unlinkIdentity(identity as Parameters<typeof supabase.auth.unlinkIdentity>[0]);
  if (error) throw new Error(error.message);
}

/** 인증 상태 변경 리스너 등록 */
export function onAuthStateChange(
  callback: (user: UserProfile | null) => void,
): { unsubscribe: () => void } {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback(mapUserToProfile(session.user));
    } else {
      callback(null);
    }
  });

  return { unsubscribe: () => subscription.unsubscribe() };
}
