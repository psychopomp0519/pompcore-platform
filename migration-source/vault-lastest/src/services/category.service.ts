/**
 * @file category.service.ts
 * @description 카테고리 CRUD 서비스 (Supabase)
 * @module services/category
 */

import { supabase } from './supabase';
import type { DbCategory, DbCategoryInsert, DbCategoryUpdate } from '../types/database.types';
import type { Category, CategoryFormData } from '../types/category.types';
import { mapDbToCategory } from '../types/category.types';
import {
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_EXPENSE_CATEGORIES,
  CATEGORY_TYPES,
} from '../constants/categories';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE = 'vault_categories';

// ============================================================
// 조회
// ============================================================

/** 사용자의 모든 활성 카테고리 조회 (소프트 삭제 제외) */
export async function fetchCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`카테고리 조회 실패: ${error.message}`);
  return (data as DbCategory[]).map(mapDbToCategory);
}

// ============================================================
// 생성
// ============================================================

/** 카테고리 생성 */
export async function createCategory(
  userId: string,
  form: CategoryFormData,
  sortOrder: number,
): Promise<Category> {
  const insert: DbCategoryInsert = {
    user_id: userId,
    name: form.name,
    type: form.type,
    icon: form.icon || null,
    is_favorite: form.isFavorite,
    is_default: false,
    sort_order: sortOrder,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`카테고리 생성 실패: ${error.message}`);
  return mapDbToCategory(data as DbCategory);
}

// ============================================================
// 수정
// ============================================================

/** 카테고리 수정 */
export async function updateCategory(
  categoryId: string,
  updates: Partial<CategoryFormData>,
): Promise<Category> {
  const dbUpdate: DbCategoryUpdate = {};

  if (updates.name !== undefined) dbUpdate.name = updates.name;
  if (updates.type !== undefined) dbUpdate.type = updates.type;
  if (updates.icon !== undefined) dbUpdate.icon = updates.icon || null;
  if (updates.isFavorite !== undefined) dbUpdate.is_favorite = updates.isFavorite;

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbUpdate)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) throw new Error(`카테고리 수정 실패: ${error.message}`);
  return mapDbToCategory(data as DbCategory);
}

/** 즐겨찾기 토글 */
export async function toggleCategoryFavorite(
  categoryId: string,
  isFavorite: boolean,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ is_favorite: isFavorite })
    .eq('id', categoryId);

  if (error) throw new Error(`즐겨찾기 변경 실패: ${error.message}`);
}

/** 기본 카테고리 설정 (같은 타입의 기존 기본 카테고리 해제 후 설정) */
export async function setDefaultCategory(
  userId: string,
  categoryId: string,
  type: 'income' | 'expense',
): Promise<void> {
  /* 기존 기본 카테고리 해제 */
  const { error: resetError } = await supabase
    .from(TABLE)
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('type', type)
    .eq('is_default', true);

  if (resetError) throw new Error(`기본 카테고리 해제 실패: ${resetError.message}`);

  /* 새 기본 카테고리 설정 */
  const { error: setError } = await supabase
    .from(TABLE)
    .update({ is_default: true })
    .eq('id', categoryId);

  if (setError) throw new Error(`기본 카테고리 설정 실패: ${setError.message}`);
}

/** 카테고리 순서 일괄 업데이트 */
export async function reorderCategories(
  orderedIds: string[],
): Promise<void> {
  const updates = orderedIds.map((id, index) =>
    supabase.from(TABLE).update({ sort_order: index }).eq('id', id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(`순서 변경 실패: ${failed.error.message}`);
}

// ============================================================
// 삭제 (소프트 삭제)
// ============================================================

/** 카테고리 소프트 삭제 */
export async function deleteCategory(categoryId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', categoryId);

  if (error) throw new Error(`카테고리 삭제 실패: ${error.message}`);
}

// ============================================================
// 시드 데이터
// ============================================================

/** 사용자에게 카테고리가 있는지 확인 */
export async function hasCategories(userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw new Error(`카테고리 확인 실패: ${error.message}`);
  return (count ?? 0) > 0;
}

/** 기본 카테고리 시드 데이터 생성 (최초 가입 시) */
export async function seedDefaultCategories(userId: string): Promise<void> {
  const incomeInserts: DbCategoryInsert[] = DEFAULT_INCOME_CATEGORIES.map(
    (cat, index) => ({
      user_id: userId,
      name: cat.name,
      type: CATEGORY_TYPES.INCOME,
      icon: cat.icon,
      is_favorite: false,
      is_default: index === 0,
      sort_order: index,
    }),
  );

  const expenseInserts: DbCategoryInsert[] = DEFAULT_EXPENSE_CATEGORIES.map(
    (cat, index) => ({
      user_id: userId,
      name: cat.name,
      type: CATEGORY_TYPES.EXPENSE,
      icon: cat.icon,
      is_favorite: false,
      is_default: index === 0,
      sort_order: index,
    }),
  );

  const { error } = await supabase
    .from(TABLE)
    .insert([...incomeInserts, ...expenseInserts]);

  if (error) throw new Error(`기본 카테고리 생성 실패: ${error.message}`);
}
