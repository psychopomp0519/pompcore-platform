/**
 * @file exportHelpers.ts
 * @description Vault 도메인별 CSV 내보내기 헬퍼
 * @module utils/exportHelpers
 */

import { generateCSV, downloadCSV } from '@pompcore/ui';
import type { Transaction } from '../types/transaction.types';
import type { Account } from '../types/account.types';
import type { Budget } from '../types/budget.types';
import type { RecurringPayment } from '../types/recurring.types';
import type { Savings } from '../types/savings.types';

// ============================================================
// 라벨 매핑
// ============================================================

const TYPE_LABELS: Record<string, string> = {
  income: '수입',
  expense: '지출',
};

const SOURCE_LABELS: Record<string, string> = {
  manual: '직접',
  transfer: '이체',
  recurring: '정기결제',
  savings: '예적금',
};

const BUDGET_TYPE_LABELS: Record<string, string> = {
  virtual: '가상',
  actual: '실제',
};

const INTERVAL_LABELS: Record<string, string> = {
  day: '일',
  week: '주',
  month: '월',
  year: '년',
};

const SAVINGS_TYPE_LABELS: Record<string, string> = {
  fixed_deposit: '정기예금',
  installment: '적금',
  free_savings: '자유적금',
  housing_subscription: '청약',
};

// ============================================================
// 거래내역 내보내기
// ============================================================

/** 거래내역 CSV 내보내기 */
export function exportTransactions(
  transactions: Transaction[],
  categoryMap: Record<string, string>,
  accountMap: Record<string, string>,
): void {
  const headers = ['날짜', '유형', '이름', '금액', '통화', '카테고리', '통장', '출처', '메모'];
  const rows = transactions.map((t) => [
    t.transactionDate,
    TYPE_LABELS[t.type] ?? t.type,
    t.name,
    t.amount,
    t.currency,
    t.categoryId ? (categoryMap[t.categoryId] ?? '') : '',
    accountMap[t.accountId] ?? '',
    SOURCE_LABELS[t.sourceType] ?? t.sourceType,
    t.memo ?? '',
  ]);

  const csv = generateCSV(headers, rows);
  downloadCSV(`거래내역_${todayStr()}.csv`, csv);
}

// ============================================================
// 통장 내보내기
// ============================================================

/** 통장 목록 CSV 내보내기 (잔액 포함) */
export function exportAccounts(accounts: Account[]): void {
  const headers = ['통장명', '기본 통화', '즐겨찾기', '통화', '잔액'];
  const rows: unknown[][] = [];

  for (const account of accounts) {
    if (account.balances.length === 0) {
      rows.push([account.name, account.defaultCurrency, account.isFavorite ? 'Y' : 'N', '', '']);
    } else {
      for (const bal of account.balances) {
        rows.push([
          account.name,
          account.defaultCurrency,
          account.isFavorite ? 'Y' : 'N',
          bal.currency,
          bal.balance,
        ]);
      }
    }
  }

  const csv = generateCSV(headers, rows);
  downloadCSV(`통장_${todayStr()}.csv`, csv);
}

// ============================================================
// 예산 내보내기
// ============================================================

/** 예산 CSV 내보내기 */
export function exportBudgets(budgets: Budget[]): void {
  const headers = ['이름', '유형', '통화', '목표액', '현재액', '진행률'];
  const rows = budgets.map((b) => {
    const progress = b.targetAmount > 0
      ? `${Math.round((b.currentAmount / b.targetAmount) * 100)}%`
      : '0%';
    return [
      b.name,
      BUDGET_TYPE_LABELS[b.budgetType] ?? b.budgetType,
      b.currency,
      b.targetAmount,
      b.currentAmount,
      progress,
    ];
  });

  const csv = generateCSV(headers, rows);
  downloadCSV(`예산_${todayStr()}.csv`, csv);
}

// ============================================================
// 정기결제 내보내기
// ============================================================

/** 정기결제 CSV 내보내기 */
export function exportRecurring(
  payments: RecurringPayment[],
  categoryMap: Record<string, string>,
  accountMap: Record<string, string>,
): void {
  const headers = ['이름', '유형', '금액', '통화', '주기', '시작일', '카테고리', '통장', '활성'];
  const rows = payments.map((p) => [
    p.name,
    TYPE_LABELS[p.type] ?? p.type,
    p.amount,
    p.currency,
    `${p.intervalValue}${INTERVAL_LABELS[p.intervalUnit] ?? p.intervalUnit}`,
    p.startDate,
    p.categoryId ? (categoryMap[p.categoryId] ?? '') : '',
    accountMap[p.accountId] ?? '',
    p.isActive ? 'Y' : 'N',
  ]);

  const csv = generateCSV(headers, rows);
  downloadCSV(`정기결제_${todayStr()}.csv`, csv);
}

// ============================================================
// 예/적금 내보내기
// ============================================================

/** 예/적금 CSV 내보내기 */
export function exportSavings(savings: Savings[]): void {
  const headers = ['이름', '유형', '원금', '이자율(%)', '기간(개월)', '시작일', '비과세', '월납입액'];
  const rows = savings.map((s) => [
    s.name,
    SAVINGS_TYPE_LABELS[s.savingsType] ?? s.savingsType,
    s.principal,
    s.interestRate,
    s.durationMonths ?? '',
    s.startDate,
    s.isTaxFree ? 'Y' : 'N',
    s.installmentAmount ?? '',
  ]);

  const csv = generateCSV(headers, rows);
  downloadCSV(`예적금_${todayStr()}.csv`, csv);
}

// ============================================================
// 내부 헬퍼
// ============================================================

/** 오늘 날짜 YYYYMMDD */
function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}
