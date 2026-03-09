/**
 * @file budgetStore.ts
 * @description 예산 상태를 관리하는 Zustand 스토어
 * @module stores/budgetStore
 */

import { create } from 'zustand';
import type { Budget, BudgetFormData } from '../types/budget.types';
import * as budgetService from '../services/budget.service';
import { toUserMessage } from '@pompcore/ui';

// ============================================================
// 타입 정의
// ============================================================

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
}

interface BudgetActions {
  loadBudgets: (userId: string) => Promise<void>;
  addBudget: (userId: string, form: BudgetFormData) => Promise<void>;
  editBudget: (budgetId: string, updates: Partial<BudgetFormData>) => Promise<void>;
  updateAmount: (budgetId: string, amount: number) => Promise<void>;
  removeBudget: (budgetId: string) => Promise<void>;
  clearError: () => void;
}

// ============================================================
// 스토어
// ============================================================

export const useBudgetStore = create<BudgetState & BudgetActions>()((set) => ({
  budgets: [],
  isLoading: false,
  error: null,

  loadBudgets: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const budgets = await budgetService.fetchBudgets(userId);
      set({ budgets, isLoading: false });
    } catch (err) {
      set({ error: toUserMessage(err), isLoading: false });
    }
  },

  addBudget: async (userId, form) => {
    set({ error: null });
    try {
      const created = await budgetService.createBudget(userId, form);
      set((state) => ({ budgets: [created, ...state.budgets] }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  editBudget: async (budgetId, updates) => {
    set({ error: null });
    try {
      await budgetService.updateBudget(budgetId, updates);
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === budgetId ? { ...b, ...updates } : b,
        ),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  updateAmount: async (budgetId, amount) => {
    set({ error: null });
    try {
      await budgetService.updateBudgetAmount(budgetId, amount);
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === budgetId ? { ...b, currentAmount: amount } : b,
        ),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removeBudget: async (budgetId) => {
    set({ error: null });
    try {
      await budgetService.deleteBudget(budgetId);
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== budgetId),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  clearError: () => set({ error: null }),
}));
