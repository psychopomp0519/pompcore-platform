/**
 * @file categories.ts
 * @description 기본 카테고리 시드 데이터 및 관련 상수
 * @module constants/categories
 */

/** 카테고리 타입 */
export const CATEGORY_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

/** 기본 수입 카테고리 시드 데이터 */
export const DEFAULT_INCOME_CATEGORIES = [
  { name: '급여', icon: '💰' },
  { name: '부수입', icon: '💵' },
  { name: '용돈', icon: '🎁' },
  { name: '이자', icon: '🏦' },
  { name: '기타 수입', icon: '📥' },
] as const;

/** 기본 지출 카테고리 시드 데이터 */
export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: '식비', icon: '🍽️' },
  { name: '교통', icon: '🚌' },
  { name: '쇼핑', icon: '🛒' },
  { name: '주거', icon: '🏠' },
  { name: '통신', icon: '📱' },
  { name: '의료', icon: '🏥' },
  { name: '문화', icon: '🎬' },
  { name: '교육', icon: '📚' },
  { name: '기타 지출', icon: '📤' },
] as const;
