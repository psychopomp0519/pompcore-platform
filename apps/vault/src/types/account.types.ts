/**
 * @file account.types.ts
 * @description 통장 관련 클라이언트 타입 정의
 * @module types/account
 */

import type { DbAccount, DbAccountBalance, AccountType } from './database.types';

export type { AccountType } from './database.types';

/** 계좌 유형 한국어 라벨 */
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  bank: '은행 계좌',
  credit_card: '신용카드',
  savings: '저축 계좌',
  investment: '투자 계좌',
};

// ============================================================
// 통장 클라이언트 타입
// ============================================================

/** 통화별 잔액 */
export interface AccountBalance {
  id: string;
  accountId: string;
  currency: string;
  balance: number;
  updatedAt: string;
}

/** 클라이언트에서 사용하는 통장 (잔액 포함) */
export interface Account {
  id: string;
  userId: string;
  name: string;
  supportedCurrencies: string[];
  defaultCurrency: string;
  isFavorite: boolean;
  sortOrder: number;
  accountType: AccountType;
  creditLimit: number | null;
  billingDay: number | null;
  createdAt: string;
  updatedAt: string;
  balances: AccountBalance[];
}

// ============================================================
// 통장 폼
// ============================================================

/** 통장 생성/수정 폼 데이터 */
export interface AccountFormData {
  name: string;
  defaultCurrency: string;
  supportedCurrencies: string[];
  isFavorite: boolean;
  accountType: AccountType;
  creditLimit: number | null;
  billingDay: number | null;
}

/** 이체 폼 데이터 */
export interface TransferFormData {
  fromAccountId: string;
  toAccountId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  transferDate: string;
  memo: string;
}

// ============================================================
// 변환 유틸리티
// ============================================================

/** DB 잔액 행 -> 클라이언트 변환 */
export function mapDbToBalance(row: DbAccountBalance): AccountBalance {
  return {
    id: row.id,
    accountId: row.account_id,
    currency: row.currency,
    balance: row.balance,
    updatedAt: row.updated_at,
  };
}

/** DB 통장 행 -> 클라이언트 변환 (잔액은 별도 조인) */
export function mapDbToAccount(row: DbAccount, balances: DbAccountBalance[]): Account {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    supportedCurrencies: row.supported_currencies,
    defaultCurrency: row.default_currency,
    isFavorite: row.is_favorite,
    sortOrder: row.sort_order,
    accountType: row.account_type,
    creditLimit: row.credit_limit,
    billingDay: row.billing_day,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    balances: balances.map(mapDbToBalance),
  };
}
