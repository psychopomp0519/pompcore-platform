/**
 * @file settingsStore.ts
 * @description 사용자 설정 상태 관리 Zustand 스토어
 * @module stores/settingsStore
 */

import { create } from 'zustand';
import type { UserSettings, ProfileFormData, PreferencesFormData } from '../types/settings.types';
import * as settingsService from '../services/settings.service';
import { toUserMessage } from '@pompcore/ui';

// ============================================================
// 타입
// ============================================================

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
}

interface SettingsActions {
  loadSettings: (userId: string) => Promise<void>;
  updateProfile: (userId: string, form: ProfileFormData) => Promise<void>;
  updatePreferences: (userId: string, form: PreferencesFormData) => Promise<void>;
  updateTabOrder: (userId: string, tabOrder: string[]) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  clearError: () => void;
}

// ============================================================
// 스토어
// ============================================================

export const useSettingsStore = create<SettingsState & SettingsActions>()((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  loadSettings: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const settings = await settingsService.fetchSettings(userId);
      set({ settings, isLoading: false });
    } catch (err) {
      set({ error: toUserMessage(err), isLoading: false });
    }
  },

  updateProfile: async (userId, form) => {
    set({ error: null });
    try {
      await settingsService.updateProfile(userId, form);
      const current = get().settings;
      if (current) {
        set({
          settings: {
            ...current,
            displayName: form.displayName || null,
            birthday: form.birthday || null,
          },
        });
      }
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  updatePreferences: async (userId, form) => {
    set({ error: null });
    try {
      await settingsService.updatePreferences(userId, form);
      const current = get().settings;
      if (current) {
        set({
          settings: {
            ...current,
            primaryCurrency: form.primaryCurrency,
            recurringAvgPeriod: form.recurringAvgPeriod,
          },
        });
      }
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  updateTabOrder: async (userId, tabOrder) => {
    set({ error: null });
    try {
      await settingsService.updateTabOrder(userId, tabOrder);
      const current = get().settings;
      if (current) {
        set({ settings: { ...current, tabOrder } });
      }
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  changePassword: async (newPassword) => {
    set({ error: null });
    try {
      await settingsService.changePassword(newPassword);
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  clearError: () => set({ error: null }),
}));
