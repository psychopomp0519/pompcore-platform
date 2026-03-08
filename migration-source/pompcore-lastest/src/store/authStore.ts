/**
 * 인증 상태 관리 (Zustand)
 * - 전역 인증 상태를 관리하는 스토어
 * - authService를 통해 Supabase Auth와 통신
 * - UI 컴포넌트에서 useAuthStore()로 접근
 */
import { create } from 'zustand';
import type { AuthState, LoginRequest, RegisterRequest, UserProfile } from '../types/auth.types';
import * as authService from '../services/authService';

interface AuthActions {
  /** 앱 시작 시 현재 세션 확인 */
  initialize: () => Promise<void>;
  /** 로그인 */
  login: (request: LoginRequest) => Promise<void>;
  /** Google OAuth 로그인 */
  loginWithGoogle: () => Promise<void>;
  /** 회원가입 */
  register: (request: RegisterRequest) => Promise<void>;
  /** 로그아웃 */
  logout: () => Promise<void>;
  /** 사용자 정보 직접 설정 (내부용) */
  setUser: (user: UserProfile | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  /* 초기 상태 */
  user: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(request);
      set({ user, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.loginWithGoogle();
      /* OAuth 리다이렉트 방식 — 성공 시 브라우저가 Google로 이동됨 */
      set({ isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google 로그인에 실패했습니다.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(request);
      set({ user, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그아웃에 실패했습니다.';
      set({ error: message });
    }
  },

  setUser: (user) => set({ user }),
}));
