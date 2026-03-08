/**
 * @file transaction.types.ts
 * @description 거래내역 관련 클라이언트 타입 정의
 * @module types/transaction
 */

import type { DbTransaction, TransactionSourceType, BudgetAction } from './database.types';

// ============================================================
// 거래내역 클라이언트 타입
// ============================================================

/** 클라이언트에서 사용하는 거래내역 */
export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  transactionDate: string;
  sourceType: TransactionSourceType;
  sourceId: string | null;
  transferPairId: string | null;
  budgetId: string | null;
  budgetAction: BudgetAction | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 거래내역 폼
// ============================================================

/** 거래내역 생성/수정 폼 데이터 */
export interface TransactionFormData {
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  accountId: string;
  categoryId: string | null;
  transactionDate: string;
  budgetId: string | null;
  budgetAction: BudgetAction | null;
  memo: string;
}

/** 거래내역 필터 */
export interface TransactionFilters {
  categoryId?: string;
  accountId?: string;
  currency?: string;
  type?: 'income' | 'expense';
}

/** 월별 기간 */
export interface MonthPeriod {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
}

// ============================================================
// 변환 유틸리티
// ============================================================

/** DB 행 -> 클라이언트 거래내역 변환 */
export function mapDbToTransaction(row: DbTransaction): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    accountId: row.account_id,
    categoryId: row.category_id,
    name: row.name,
    type: row.type,
    amount: row.amount,
    currency: row.currency,
    transactionDate: row.transaction_date,
    sourceType: row.source_type,
    sourceId: row.source_id,
    transferPairId: row.transfer_pair_id,
    budgetId: row.budget_id,
    budgetAction: row.budget_action,
    memo: row.memo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
