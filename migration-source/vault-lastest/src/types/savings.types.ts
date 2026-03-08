/**
 * @file savings.types.ts
 * @description 예/적금 관련 클라이언트 타입 정의
 * @module types/savings
 */

import type { DbSavings, DbSavingsDeposit, SavingsType } from './database.types';

// ============================================================
// 예/적금 클라이언트 타입
// ============================================================

/** 자유적금 납입 내역 */
export interface SavingsDeposit {
  id: string;
  savingsId: string;
  accountId: string | null;
  amount: number;
  depositDate: string;
  createdAt: string;
}

/** 클라이언트에서 사용하는 예/적금 */
export interface Savings {
  id: string;
  userId: string;
  linkedAccountId: string | null;
  name: string;
  savingsType: SavingsType;
  startDate: string;
  durationMonths: number | null;
  interestRate: number;
  principal: number;
  installmentAmount: number | null;
  isTaxFree: boolean;
  createdAt: string;
  updatedAt: string;
  deposits: SavingsDeposit[];
}

// ============================================================
// 폼
// ============================================================

/** 예/적금 생성/수정 폼 데이터 */
export interface SavingsFormData {
  name: string;
  savingsType: SavingsType;
  linkedAccountId: string | null;
  startDate: string;
  durationMonths: number | null;
  interestRate: number;
  principal: number;
  installmentAmount: number | null;
  isTaxFree: boolean;
}

/** 납입 폼 데이터 */
export interface DepositFormData {
  accountId: string | null;
  amount: number;
  depositDate: string;
}

// ============================================================
// 상수
// ============================================================

/** 예/적금 타입별 라벨 */
export const SAVINGS_TYPE_LABELS: Record<SavingsType, string> = {
  fixed_deposit: '예금',
  installment: '적금',
  free_savings: '자유적금',
  housing_subscription: '청약',
};

/** 예/적금 타입 목록 */
export const SAVINGS_TYPES: SavingsType[] = [
  'fixed_deposit',
  'installment',
  'free_savings',
  'housing_subscription',
];

// ============================================================
// 변환 유틸리티
// ============================================================

/** DB 납입 -> 클라이언트 변환 */
export function mapDbToDeposit(row: DbSavingsDeposit): SavingsDeposit {
  return {
    id: row.id,
    savingsId: row.savings_id,
    accountId: row.account_id,
    amount: row.amount,
    depositDate: row.deposit_date,
    createdAt: row.created_at,
  };
}

/** DB 예/적금 -> 클라이언트 변환 */
export function mapDbToSavings(row: DbSavings, deposits: DbSavingsDeposit[]): Savings {
  return {
    id: row.id,
    userId: row.user_id,
    linkedAccountId: row.linked_account_id,
    name: row.name,
    savingsType: row.savings_type,
    startDate: row.start_date,
    durationMonths: row.duration_months,
    interestRate: row.interest_rate,
    principal: row.principal,
    installmentAmount: row.installment_amount,
    isTaxFree: row.is_tax_free,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deposits: deposits.map(mapDbToDeposit),
  };
}
