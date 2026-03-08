/**
 * @file transactionStore.ts
 * @description 거래내역 상태를 관리하는 Zustand 스토어
 * @module stores/transactionStore
 */

import { create } from 'zustand';
import type { Transaction, TransactionFormData, TransactionFilters, MonthPeriod } from '../types/transaction.types';
import * as transactionService from '../services/transaction.service';
import { adjustBudgetAmount } from '../services/budget.service';
import { getCurrentMonthPeriod, getMonthPeriod, getPrevMonth, getNextMonth } from '../utils/date';
import { toUserMessage } from '../utils/errorMessages';

// ============================================================
// 타입 정의
// ============================================================

interface TransactionState {
  /** 현재 기간의 거래내역 */
  transactions: Transaction[];
  /** 현재 조회 기간 */
  period: MonthPeriod;
  /** 활성 필터 */
  filters: TransactionFilters;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

interface TransactionActions {
  /** 거래내역 로드 */
  loadTransactions: (userId: string) => Promise<void>;
  /** 이전 달 */
  goToPrevMonth: (userId: string) => Promise<void>;
  /** 다음 달 */
  goToNextMonth: (userId: string) => Promise<void>;
  /** 이번 달로 복귀 */
  goToCurrentMonth: (userId: string) => Promise<void>;
  /** 필터 설정 */
  setFilters: (userId: string, filters: TransactionFilters) => Promise<void>;
  /** 거래내역 생성 */
  addTransaction: (userId: string, form: TransactionFormData) => Promise<void>;
  /** 거래내역 수정 */
  editTransaction: (transactionId: string, updates: Partial<TransactionFormData>) => Promise<void>;
  /** 거래내역 삭제 */
  removeTransaction: (transactionId: string) => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

// ============================================================
// 초기 상태
// ============================================================

const INITIAL_STATE: TransactionState = {
  transactions: [],
  period: getCurrentMonthPeriod(),
  filters: {},
  isLoading: false,
  error: null,
};

// ============================================================
// 스토어
// ============================================================

/** 거래내역 상태 스토어 */
export const useTransactionStore = create<TransactionState & TransactionActions>()((set, get) => ({
  ...INITIAL_STATE,

  loadTransactions: async (userId) => {
    const { period, filters } = get();
    set({ isLoading: true, error: null });
    try {
      const transactions = await transactionService.fetchTransactions(
        userId,
        period.startDate,
        period.endDate,
        filters,
      );
      set({ transactions, isLoading: false });
    } catch (err) {
      set({ error: toUserMessage(err), isLoading: false });
    }
  },

  goToPrevMonth: async (userId) => {
    const { period } = get();
    const { year, month } = getPrevMonth(period.year, period.month);
    set({ period: getMonthPeriod(year, month) });
    await get().loadTransactions(userId);
  },

  goToNextMonth: async (userId) => {
    const { period } = get();
    const { year, month } = getNextMonth(period.year, period.month);
    set({ period: getMonthPeriod(year, month) });
    await get().loadTransactions(userId);
  },

  goToCurrentMonth: async (userId) => {
    set({ period: getCurrentMonthPeriod() });
    await get().loadTransactions(userId);
  },

  setFilters: async (userId, filters) => {
    set({ filters });
    await get().loadTransactions(userId);
  },

  addTransaction: async (userId, form) => {
    set({ error: null });
    try {
      const created = await transactionService.createTransaction(userId, form);

      /* 예산 금액 연동 (deposit: 추가, withdraw: 차감) */
      if (form.budgetId && form.budgetAction) {
        const delta = form.budgetAction === 'deposit' ? form.amount : -form.amount;
        await adjustBudgetAmount(form.budgetId, delta);
      }

      /* 같은 기간이면 목록에 추가 */
      const { period } = get();
      if (form.transactionDate >= period.startDate && form.transactionDate <= period.endDate) {
        set((state) => ({
          transactions: [created, ...state.transactions].sort(
            (a, b) => b.transactionDate.localeCompare(a.transactionDate),
          ),
        }));
      }
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  editTransaction: async (transactionId, updates) => {
    set({ error: null });
    try {
      const updated = await transactionService.updateTransaction(transactionId, updates);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === transactionId ? updated : t,
        ),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removeTransaction: async (transactionId) => {
    set({ error: null });
    try {
      await transactionService.deleteTransaction(transactionId);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== transactionId),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  clearError: () => set({ error: null }),
}));
