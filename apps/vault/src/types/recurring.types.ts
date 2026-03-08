/**
 * @file recurring.types.ts
 * @description 정기결제 관련 클라이언트 타입 정의
 * @module types/recurring
 */

import type { DbRecurringPayment, DbRecurringOverride, DbIntervalUnit } from './database.types';

// ============================================================
// 정기결제 클라이언트 타입
// ============================================================

/** 정기결제 회차별 수정 */
export interface RecurringOverride {
  id: string;
  recurringId: string;
  occurrenceDate: string;
  amount: number | null;
  name: string | null;
  isSkipped: boolean;
}

/** 클라이언트에서 사용하는 정기결제 */
export interface RecurringPayment {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  startDate: string;
  intervalUnit: DbIntervalUnit;
  intervalValue: number;
  lastGeneratedDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  overrides: RecurringOverride[];
}

// ============================================================
// 정기결제 폼
// ============================================================

/** 정기결제 생성/수정 폼 데이터 */
export interface RecurringFormData {
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  accountId: string;
  categoryId: string | null;
  startDate: string;
  intervalUnit: DbIntervalUnit;
  intervalValue: number;
}

/** 정기결제 정렬 기준 */
export type RecurringSortKey = 'daily_avg' | 'next_date' | 'days_until';

// ============================================================
// 변환 유틸리티
// ============================================================

/** DB 오버라이드 행 -> 클라이언트 변환 */
export function mapDbToOverride(row: DbRecurringOverride): RecurringOverride {
  return {
    id: row.id,
    recurringId: row.recurring_id,
    occurrenceDate: row.occurrence_date,
    amount: row.amount,
    name: row.name,
    isSkipped: row.is_skipped,
  };
}

/** DB 정기결제 행 -> 클라이언트 변환 */
export function mapDbToRecurring(
  row: DbRecurringPayment,
  overrides: DbRecurringOverride[],
): RecurringPayment {
  return {
    id: row.id,
    userId: row.user_id,
    accountId: row.account_id,
    categoryId: row.category_id,
    name: row.name,
    type: row.type,
    amount: row.amount,
    currency: row.currency,
    startDate: row.start_date,
    intervalUnit: row.interval_unit,
    intervalValue: row.interval_value,
    lastGeneratedDate: row.last_generated_date,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    overrides: overrides.map(mapDbToOverride),
  };
}
