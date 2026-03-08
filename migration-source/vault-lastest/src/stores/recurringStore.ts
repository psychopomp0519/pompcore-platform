/**
 * @file recurringStore.ts
 * @description 정기결제 상태를 관리하는 Zustand 스토어
 * @module stores/recurringStore
 */

import { create } from 'zustand';
import type { RecurringPayment, RecurringFormData } from '../types/recurring.types';
import * as recurringService from '../services/recurring.service';
import { toUserMessage } from '../utils/errorMessages';

// ============================================================
// 타입 정의
// ============================================================

interface RecurringState {
  /** 정기결제 목록 */
  payments: RecurringPayment[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 자동 실현 완료 여부 */
  isRealized: boolean;
}

interface RecurringActions {
  /** 정기결제 로드 */
  loadPayments: (userId: string) => Promise<void>;
  /** 정기결제 생성 */
  addPayment: (userId: string, form: RecurringFormData) => Promise<void>;
  /** 정기결제 수정 */
  editPayment: (paymentId: string, updates: Partial<RecurringFormData> & { isActive?: boolean }) => Promise<void>;
  /** 정기결제 삭제 */
  removePayment: (paymentId: string) => Promise<void>;
  /** 미실현 건 자동 실현 */
  realizePayments: (userId: string) => Promise<number>;
  /** 에러 초기화 */
  clearError: () => void;
}

// ============================================================
// 초기 상태
// ============================================================

const INITIAL_STATE: RecurringState = {
  payments: [],
  isLoading: false,
  error: null,
  isRealized: false,
};

// ============================================================
// 스토어
// ============================================================

/** 정기결제 상태 스토어 */
export const useRecurringStore = create<RecurringState & RecurringActions>()((set, get) => ({
  ...INITIAL_STATE,

  loadPayments: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const payments = await recurringService.fetchRecurringPayments(userId);
      set({ payments, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addPayment: async (userId, form) => {
    set({ error: null });
    try {
      const created = await recurringService.createRecurringPayment(userId, form);
      set((state) => ({ payments: [created, ...state.payments] }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  editPayment: async (paymentId, updates) => {
    set({ error: null });
    try {
      await recurringService.updateRecurringPayment(paymentId, updates);
      set((state) => ({
        payments: state.payments.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                ...(updates.name !== undefined && { name: updates.name }),
                ...(updates.type !== undefined && { type: updates.type }),
                ...(updates.amount !== undefined && { amount: updates.amount }),
                ...(updates.currency !== undefined && { currency: updates.currency }),
                ...(updates.accountId !== undefined && { accountId: updates.accountId }),
                ...(updates.categoryId !== undefined && { categoryId: updates.categoryId }),
                ...(updates.startDate !== undefined && { startDate: updates.startDate }),
                ...(updates.intervalUnit !== undefined && { intervalUnit: updates.intervalUnit }),
                ...(updates.intervalValue !== undefined && { intervalValue: updates.intervalValue }),
                ...(updates.isActive !== undefined && { isActive: updates.isActive }),
              }
            : p,
        ),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removePayment: async (paymentId) => {
    set({ error: null });
    try {
      await recurringService.deleteRecurringPayment(paymentId);
      set((state) => ({
        payments: state.payments.filter((p) => p.id !== paymentId),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  realizePayments: async (userId) => {
    if (get().isRealized) return 0;
    try {
      const count = await recurringService.realizeRecurringPayments(userId, get().payments);
      set({ isRealized: true });
      if (count > 0) {
        /* 실현 후 목록 새로고침 */
        await get().loadPayments(userId);
      }
      return count;
    } catch (err) {
      set({ error: toUserMessage(err) });
      return 0;
    }
  },

  clearError: () => set({ error: null }),
}));
