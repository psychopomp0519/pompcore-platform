/**
 * @file categoryStore.ts
 * @description 카테고리 상태를 관리하는 Zustand 스토어
 * @module stores/categoryStore
 */

import { create } from 'zustand';
import type { Category, CategoryFormData } from '../types/category.types';
import * as categoryService from '../services/category.service';
import { toUserMessage } from '../utils/errorMessages';

// ============================================================
// 타입 정의
// ============================================================

interface CategoryState {
  /** 전체 카테고리 목록 */
  categories: Category[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

interface CategoryActions {
  /** 카테고리 목록 로드 */
  loadCategories: (userId: string) => Promise<void>;
  /** 카테고리 생성 */
  addCategory: (userId: string, form: CategoryFormData) => Promise<void>;
  /** 카테고리 수정 */
  editCategory: (categoryId: string, updates: Partial<CategoryFormData>) => Promise<void>;
  /** 카테고리 삭제 (소프트) */
  removeCategory: (categoryId: string) => Promise<void>;
  /** 즐겨찾기 토글 */
  toggleFavorite: (categoryId: string) => Promise<void>;
  /** 기본 카테고리 설정 */
  setDefault: (userId: string, categoryId: string, type: 'income' | 'expense') => Promise<void>;
  /** 순서 변경 */
  reorder: (type: 'income' | 'expense', orderedIds: string[]) => Promise<void>;
  /** 시드 데이터 생성 (최초 가입 시) */
  seedIfNeeded: (userId: string) => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

// ============================================================
// 초기 상태
// ============================================================

const INITIAL_STATE: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

// ============================================================
// 헬퍼
// ============================================================

/** 타입별 카테고리 필터 */
function filterByType(categories: Category[], type: 'income' | 'expense'): Category[] {
  return categories.filter((c) => c.type === type);
}

// ============================================================
// 스토어
// ============================================================

/** 카테고리 상태 스토어 */
export const useCategoryStore = create<CategoryState & CategoryActions>()((set, get) => ({
  ...INITIAL_STATE,

  loadCategories: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryService.fetchCategories(userId);
      set({ categories, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addCategory: async (userId, form) => {
    set({ error: null });
    try {
      const sameType = filterByType(get().categories, form.type);
      const nextOrder = sameType.length;
      const created = await categoryService.createCategory(userId, form, nextOrder);
      set((state) => ({ categories: [...state.categories, created] }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  editCategory: async (categoryId, updates) => {
    set({ error: null });
    try {
      const updated = await categoryService.updateCategory(categoryId, updates);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === categoryId ? updated : c)),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removeCategory: async (categoryId) => {
    set({ error: null });
    try {
      await categoryService.deleteCategory(categoryId);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  toggleFavorite: async (categoryId) => {
    const category = get().categories.find((c) => c.id === categoryId);
    if (!category) return;

    const newValue = !category.isFavorite;
    /* 낙관적 업데이트 */
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId ? { ...c, isFavorite: newValue } : c,
      ),
    }));

    try {
      await categoryService.toggleCategoryFavorite(categoryId, newValue);
    } catch (err) {
      /* 롤백 */
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === categoryId ? { ...c, isFavorite: !newValue } : c,
        ),
        error: (err as Error).message,
      }));
    }
  },

  setDefault: async (userId, categoryId, type) => {
    set({ error: null });
    try {
      await categoryService.setDefaultCategory(userId, categoryId, type);
      set((state) => ({
        categories: state.categories.map((c) => {
          if (c.type !== type) return c;
          return { ...c, isDefault: c.id === categoryId };
        }),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  reorder: async (type, orderedIds) => {
    /* 낙관적 업데이트 */
    set((state) => ({
      categories: state.categories.map((c) => {
        if (c.type !== type) return c;
        const newOrder = orderedIds.indexOf(c.id);
        return newOrder >= 0 ? { ...c, sortOrder: newOrder } : c;
      }),
    }));

    try {
      await categoryService.reorderCategories(orderedIds);
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  seedIfNeeded: async (userId) => {
    try {
      const exists = await categoryService.hasCategories(userId);
      if (!exists) {
        await categoryService.seedDefaultCategories(userId);
        await get().loadCategories(userId);
      }
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  clearError: () => set({ error: null }),
}));
