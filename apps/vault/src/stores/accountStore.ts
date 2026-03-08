/**
 * @file accountStore.ts
 * @description 통장 상태를 관리하는 Zustand 스토어
 * @module stores/accountStore
 */

import { create } from 'zustand';
import type { Account, AccountFormData, TransferFormData } from '../types/account.types';
import * as accountService from '../services/account.service';
import { toUserMessage } from '@pompcore/ui';

// ============================================================
// 타입 정의
// ============================================================

interface AccountState {
  /** 전체 통장 목록 */
  accounts: Account[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

interface AccountActions {
  /** 통장 목록 로드 */
  loadAccounts: (userId: string) => Promise<void>;
  /** 통장 생성 */
  addAccount: (userId: string, form: AccountFormData) => Promise<void>;
  /** 통장 수정 */
  editAccount: (accountId: string, updates: Partial<AccountFormData>) => Promise<void>;
  /** 통장 삭제 (소프트) */
  removeAccount: (accountId: string) => Promise<void>;
  /** 즐겨찾기 토글 */
  toggleFavorite: (accountId: string) => Promise<void>;
  /** 잔액 수정 */
  updateBalance: (accountId: string, currency: string, balance: number) => Promise<void>;
  /** 이체 실행 */
  transfer: (userId: string, form: TransferFormData) => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

// ============================================================
// 초기 상태
// ============================================================

const INITIAL_STATE: AccountState = {
  accounts: [],
  isLoading: false,
  error: null,
};

// ============================================================
// 스토어
// ============================================================

/** 통장 상태 스토어 */
export const useAccountStore = create<AccountState & AccountActions>()((set, get) => ({
  ...INITIAL_STATE,

  loadAccounts: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const accounts = await accountService.fetchAccounts(userId);
      set({ accounts, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addAccount: async (userId, form) => {
    set({ error: null });
    try {
      const nextOrder = get().accounts.length;
      const created = await accountService.createAccount(userId, form, nextOrder);
      set((state) => ({ accounts: [...state.accounts, created] }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  editAccount: async (accountId, updates) => {
    set({ error: null });
    try {
      await accountService.updateAccount(accountId, updates);
      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === accountId
            ? {
                ...a,
                ...(updates.name !== undefined && { name: updates.name }),
                ...(updates.defaultCurrency !== undefined && { defaultCurrency: updates.defaultCurrency }),
                ...(updates.supportedCurrencies !== undefined && { supportedCurrencies: updates.supportedCurrencies }),
                ...(updates.isFavorite !== undefined && { isFavorite: updates.isFavorite }),
              }
            : a,
        ),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removeAccount: async (accountId) => {
    set({ error: null });
    try {
      await accountService.deleteAccount(accountId);
      set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== accountId),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  toggleFavorite: async (accountId) => {
    const account = get().accounts.find((a) => a.id === accountId);
    if (!account) return;

    const newValue = !account.isFavorite;
    /* 낙관적 업데이트 */
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === accountId ? { ...a, isFavorite: newValue } : a,
      ),
    }));

    try {
      await accountService.toggleAccountFavorite(accountId, newValue);
    } catch (err) {
      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === accountId ? { ...a, isFavorite: !newValue } : a,
        ),
        error: (err as Error).message,
      }));
    }
  },

  updateBalance: async (accountId, currency, balance) => {
    set({ error: null });
    try {
      await accountService.updateBalance(accountId, currency, balance);
      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === accountId
            ? {
                ...a,
                balances: a.balances.map((b) =>
                  b.currency === currency ? { ...b, balance } : b,
                ),
              }
            : a,
        ),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  transfer: async (userId, form) => {
    set({ error: null });
    try {
      await accountService.executeTransfer(userId, form);
      /* 이체 후 전체 리로드로 잔액 동기화 */
      await get().loadAccounts(userId);
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  clearError: () => set({ error: null }),
}));
