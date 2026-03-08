/**
 * @file Auth Zustand store — Platform-wide authentication state
 * @module @pompcore/auth/auth.store
 */
import { create } from 'zustand';
import type { UserProfile, AuthState } from '@pompcore/types';
import { toUserMessage } from '@pompcore/ui';
import * as authService from './auth.service';

interface AuthActions {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...INITIAL_STATE,

  initialize: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signInWithEmail(email, password);
      set({ user, isLoading: false });
    } catch (e) {
      set({ error: toUserMessage(e), isLoading: false });
      throw e;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.signInWithGoogle();
    } catch (e) {
      set({ error: toUserMessage(e), isLoading: false });
      throw e;
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signUpWithEmail(email, password, displayName);
      set({ user, isLoading: false });
    } catch (e) {
      set({ error: toUserMessage(e), isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      await authService.signOut();
      set({ ...INITIAL_STATE, isLoading: false });
    } catch (e) {
      set({ error: toUserMessage(e) });
    }
  },

  setUser: (user) => set({ user, isLoading: false, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () => set(INITIAL_STATE),
}));
