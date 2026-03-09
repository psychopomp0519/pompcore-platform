/**
 * @file savingsStore.ts
 * @description 예/적금 상태를 관리하는 Zustand 스토어
 * @module stores/savingsStore
 */

import { create } from 'zustand';
import type { Savings, SavingsFormData, DepositFormData } from '../types/savings.types';
import type { SavingsType } from '../types/database.types';
import * as savingsService from '../services/savings.service';
import { toUserMessage } from '@pompcore/ui';

// ============================================================
// 타입 정의
// ============================================================

interface SavingsState {
  /** 예/적금 목록 */
  savingsList: Savings[];
  /** 활성 탭 */
  activeTab: SavingsType;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

interface SavingsActions {
  /** 예/적금 로드 */
  loadSavings: (userId: string) => Promise<void>;
  /** 탭 변경 */
  setActiveTab: (tab: SavingsType) => void;
  /** 예/적금 생성 */
  addSavings: (userId: string, form: SavingsFormData) => Promise<void>;
  /** 예/적금 수정 */
  editSavings: (savingsId: string, updates: Partial<SavingsFormData>) => Promise<void>;
  /** 예/적금 삭제 */
  removeSavings: (savingsId: string) => Promise<void>;
  /** 납입 추가 */
  addDeposit: (userId: string, savingsId: string, form: DepositFormData) => Promise<void>;
  /** 납입 삭제 */
  removeDeposit: (userId: string, depositId: string) => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

// ============================================================
// 초기 상태
// ============================================================

const INITIAL_STATE: SavingsState = {
  savingsList: [],
  activeTab: 'fixed_deposit',
  isLoading: false,
  error: null,
};

// ============================================================
// 스토어
// ============================================================

/** 예/적금 상태 스토어 */
export const useSavingsStore = create<SavingsState & SavingsActions>()((set, get) => ({
  ...INITIAL_STATE,

  loadSavings: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const savingsList = await savingsService.fetchSavings(userId);
      set({ savingsList, isLoading: false });
    } catch (err) {
      set({ error: toUserMessage(err), isLoading: false });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  addSavings: async (userId, form) => {
    set({ error: null });
    try {
      const created = await savingsService.createSavings(userId, form);
      set((state) => ({ savingsList: [created, ...state.savingsList] }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  editSavings: async (savingsId, updates) => {
    set({ error: null });
    try {
      await savingsService.updateSavings(savingsId, updates);
      set((state) => ({
        savingsList: state.savingsList.map((s) =>
          s.id === savingsId ? { ...s, ...updates } : s,
        ),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removeSavings: async (savingsId) => {
    set({ error: null });
    try {
      await savingsService.deleteSavings(savingsId);
      set((state) => ({
        savingsList: state.savingsList.filter((s) => s.id !== savingsId),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  addDeposit: async (userId, savingsId, form) => {
    set({ error: null });
    try {
      await savingsService.addDeposit(savingsId, form);
      await get().loadSavings(userId);
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removeDeposit: async (userId, depositId) => {
    set({ error: null });
    try {
      await savingsService.deleteDeposit(depositId);
      await get().loadSavings(userId);
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  clearError: () => set({ error: null }),
}));
