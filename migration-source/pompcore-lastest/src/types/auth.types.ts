/**
 * 인증 관련 타입 정의
 * - Supabase Auth 기반 SSO 인증 구조
 * - 모든 서브 프로젝트에서 동일한 타입 사용
 */

import type { UserRole } from '../constants/roles';

/** 사용자 프로필 정보 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  /** 사용자 역할 — 팀장(leader) / 팀원(member) / 사용자(user) */
  role: UserRole;
}

/** 로그인 요청 데이터 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 회원가입 요청 데이터 */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

/** 인증 상태 */
export interface AuthState {
  /** 현재 로그인한 사용자 (null이면 비로그인) */
  user: UserProfile | null;
  /** 인증 상태 로딩 여부 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}
