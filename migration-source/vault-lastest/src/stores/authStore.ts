/**
 * @file authStore.ts
 * @description 인증 상태를 관리하는 Zustand 스토어
 * @module stores/authStore
 */

import { create } from 'zustand';
import type { UserProfile } from '../types/auth.types';

// ============================================================
// 타입 정의
// ============================================================

interface AuthState {
  /** 현재 로그인된 사용자 */
  user: UserProfile | null;
  /** 인증 상태 로딩 중 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

interface AuthActions {
  /** 사용자 설정 */
  setUser: (user: UserProfile | null) => void;
  /** 로딩 상태 설정 */
  setLoading: (isLoading: boolean) => void;
  /** 에러 설정 */
  setError: (error: string | null) => void;
  /** 상태 초기화 (로그아웃 시) */
  reset: () => void;
}

// ============================================================
// 초기 상태
// ============================================================

const INITIAL_STATE: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

// ============================================================
// 스토어
// ============================================================

/** 인증 상태 스토어 */
export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...INITIAL_STATE,

  setUser: (user) => set({ user, isLoading: false, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () => set(INITIAL_STATE),
}));
