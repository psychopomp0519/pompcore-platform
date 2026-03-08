/**
 * @file category.types.ts
 * @description 카테고리 관련 클라이언트 타입 정의
 * @module types/category
 */

import type { DbCategory } from './database.types';

// ============================================================
// 카테고리 클라이언트 타입
// ============================================================

/** 클라이언트에서 사용하는 카테고리 */
export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  isFavorite: boolean;
  isDefault: boolean;
  sortOrder: number;
  icon: string | null;
  createdAt: string;
}

// ============================================================
// 카테고리 폼
// ============================================================

/** 카테고리 생성/수정 폼 데이터 */
export interface CategoryFormData {
  name: string;
  type: 'income' | 'expense';
  icon: string;
  isFavorite: boolean;
}

// ============================================================
// 변환 유틸리티
// ============================================================

/** DB 행 -> 클라이언트 카테고리 변환 */
export function mapDbToCategory(row: DbCategory): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    isFavorite: row.is_favorite,
    isDefault: row.is_default,
    sortOrder: row.sort_order,
    icon: row.icon,
    createdAt: row.created_at,
  };
}
