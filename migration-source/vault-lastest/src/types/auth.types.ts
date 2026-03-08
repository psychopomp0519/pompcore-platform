/**
 * @file auth.types.ts
 * @description 인증 관련 타입 정의
 * @module types/auth
 */

// ============================================================
// 사용자 역할
// ============================================================

/** 사용자 역할 (leader: 팀장, member: 팀원, user: 일반 사용자) */
export type UserRole = 'leader' | 'member' | 'user';

// ============================================================
// 사용자 프로필
// ============================================================

/** 사용자 프로필 정보 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  role: UserRole;
}

// ============================================================
// 인증 요청
// ============================================================

/** 로그인 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 회원가입 요청 */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

// ============================================================
// 인증 상태
// ============================================================

/** 인증 상태 */
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
