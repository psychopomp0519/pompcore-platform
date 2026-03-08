/**
 * @file realEstateStore.ts
 * @description 부동산 상태를 관리하는 Zustand 스토어
 * @module stores/realEstateStore
 */

import { create } from 'zustand';
import type {
  RealEstate,
  RealEstateFormData,
  RealEstateLease,
  LeaseFormData,
  RealEstateExpense,
  ExpenseFormData,
} from '../types/realEstate.types';
import * as realEstateService from '../services/realEstate.service';
import { toUserMessage } from '../utils/errorMessages';

// ============================================================
// 타입 정의
// ============================================================

interface RealEstateState {
  /** 부동산 물건 목록 */
  properties: RealEstate[];
  /** 활성 계약 목록 (목록 뷰용 — 모든 물건 통합) */
  activeLeases: RealEstateLease[];
  /** 현재 선택된 물건 ID */
  selectedPropertyId: string | null;
  /** 현재 선택된 물건의 계약 목록 */
  leases: RealEstateLease[];
  /** 현재 선택된 물건의 비용 목록 */
  expenses: RealEstateExpense[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

interface RealEstateActions {
  /** 부동산 목록 로드 (활성 계약 포함) */
  loadProperties: (userId: string) => Promise<void>;
  /** 단일 물건 상세 로드 (계약 + 비용) */
  loadPropertyDetail: (propertyId: string) => Promise<void>;
  /** 부동산 추가 */
  addProperty: (userId: string, form: RealEstateFormData) => Promise<void>;
  /** 부동산 수정 */
  editProperty: (propertyId: string, form: RealEstateFormData) => Promise<void>;
  /** 부동산 삭제 */
  removeProperty: (propertyId: string) => Promise<void>;
  /** 계약 추가 */
  addLease: (userId: string, propertyId: string, form: LeaseFormData) => Promise<void>;
  /** 계약 종료 (비활성화) */
  closeLease: (leaseId: string) => Promise<void>;
  /** 비용 추가 */
  addExpense: (userId: string, propertyId: string, form: ExpenseFormData) => Promise<void>;
  /** 비용 삭제 */
  removeExpense: (expenseId: string) => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

// ============================================================
// 초기 상태
// ============================================================

const INITIAL_STATE: RealEstateState = {
  properties: [],
  activeLeases: [],
  selectedPropertyId: null,
  leases: [],
  expenses: [],
  isLoading: false,
  error: null,
};

// ============================================================
// 스토어
// ============================================================

/** 부동산 상태 스토어 */
export const useRealEstateStore = create<RealEstateState & RealEstateActions>()(
  (set, get) => ({
    ...INITIAL_STATE,

    loadProperties: async (userId) => {
      set({ isLoading: true, error: null });
      try {
        const properties = await realEstateService.fetchProperties(userId);
        const ids = properties.map((p) => p.id);
        const activeLeases = await realEstateService.fetchActiveLeases(ids);
        set({ properties, activeLeases, isLoading: false });
      } catch (err) {
        set({ error: toUserMessage(err), isLoading: false });
      }
    },

    loadPropertyDetail: async (propertyId) => {
      set({ isLoading: true, error: null, selectedPropertyId: propertyId });
      try {
        const [leases, expenses] = await Promise.all([
          realEstateService.fetchLeases(propertyId),
          realEstateService.fetchExpenses(propertyId),
        ]);
        set({ leases, expenses, isLoading: false });
      } catch (err) {
        set({ error: toUserMessage(err), isLoading: false });
      }
    },

    addProperty: async (userId, form) => {
      set({ error: null });
      try {
        const created = await realEstateService.createProperty(userId, form);
        set((state) => ({ properties: [created, ...state.properties] }));
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    editProperty: async (propertyId, form) => {
      set({ error: null });
      try {
        await realEstateService.updateProperty(propertyId, form);
        /* 수정 후 목록 재조회 대신 낙관적 업데이트 */
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === propertyId
              ? {
                  ...p,
                  name: form.name,
                  address: form.address || null,
                  propertyType: form.propertyType,
                  role: form.role,
                  acquisitionDate: form.acquisitionDate || null,
                  acquisitionPrice: form.acquisitionPrice ? Number(form.acquisitionPrice) : null,
                  currentValue: form.currentValue ? Number(form.currentValue) : null,
                  currency: form.currency,
                  linkedAccountId: form.linkedAccountId,
                  memo: form.memo || null,
                }
              : p,
          ),
        }));
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    removeProperty: async (propertyId) => {
      set({ error: null });
      try {
        await realEstateService.deleteProperty(propertyId);
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== propertyId),
          activeLeases: state.activeLeases.filter((l) => l.realEstateId !== propertyId),
        }));
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    addLease: async (userId, propertyId, form) => {
      set({ error: null });
      try {
        const created = await realEstateService.addLease(userId, propertyId, form);
        set((state) => ({
          leases: [created, ...state.leases],
          activeLeases: created.isActive
            ? [created, ...state.activeLeases]
            : state.activeLeases,
        }));
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    closeLease: async (leaseId) => {
      set({ error: null });
      try {
        await realEstateService.deactivateLease(leaseId);
        const updateLease = (l: RealEstateLease): RealEstateLease =>
          l.id === leaseId ? { ...l, isActive: false } : l;
        set((state) => ({
          leases: state.leases.map(updateLease),
          activeLeases: state.activeLeases.filter((l) => l.id !== leaseId),
        }));
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    addExpense: async (userId, propertyId, form) => {
      set({ error: null });
      try {
        const created = await realEstateService.addExpense(userId, propertyId, form);
        set((state) => ({ expenses: [created, ...state.expenses] }));
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    removeExpense: async (expenseId) => {
      set({ error: null });
      try {
        await realEstateService.deleteExpense(expenseId);
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== expenseId),
        }));
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    clearError: () => {
      const { error } = get();
      if (error !== null) set({ error: null });
    },
  }),
);
