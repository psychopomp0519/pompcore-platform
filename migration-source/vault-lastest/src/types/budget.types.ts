/**
 * @file budget.types.ts
 * @description 예산 관련 클라이언트 타입 정의
 * @module types/budget
 */

import type { DbBudget, BudgetType } from './database.types';

// ============================================================
// 예산 클라이언트 타입
// ============================================================

/** 클라이언트에서 사용하는 예산 */
export interface Budget {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  budgetType: BudgetType;
  linkedAccountId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 폼
// ============================================================

/** 예산 생성/수정 폼 데이터 */
export interface BudgetFormData {
  name: string;
  targetAmount: number;
  currency: string;
  budgetType: BudgetType;
  linkedAccountId: string | null;
}

// ============================================================
// 상수
// ============================================================

export const BUDGET_TYPE_LABELS: Record<BudgetType, string> = {
  virtual: '가상',
  actual: '실제',
};

// ============================================================
// 변환 유틸리티
// ============================================================

/** DB 행 -> 클라이언트 예산 변환 */
export function mapDbToBudget(row: DbBudget): Budget {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    targetAmount: row.target_amount,
    currentAmount: row.current_amount,
    currency: row.currency,
    budgetType: row.budget_type,
    linkedAccountId: row.linked_account_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
