/**
 * @file ExpenseList.tsx
 * @description 부동산 비용 목록 컴포넌트
 * @module components/realEstate/ExpenseList
 */

import type { ReactNode } from 'react';
import type { RealEstateExpense } from '../../types/realEstate.types';

// ============================================================
// 상수
// ============================================================

const EXPENSE_TYPE_LABEL: Record<string, string> = {
  maintenance: '관리비',
  tax: '세금',
  repair: '수리비',
  insurance: '보험료',
  loan_interest: '대출이자',
  other: '기타',
};

const EXPENSE_TYPE_COLOR: Record<string, string> = {
  maintenance: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  tax: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  repair: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  insurance: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  loan_interest: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

// ============================================================
// 타입
// ============================================================

interface ExpenseListProps {
  expenses: RealEstateExpense[];
  onDelete: (expenseId: string) => void;
}

// ============================================================
// 서브 컴포넌트 — 비용 행
// ============================================================

interface ExpenseRowProps {
  expense: RealEstateExpense;
  onDelete: (id: string) => void;
}

function ExpenseRow({ expense, onDelete }: ExpenseRowProps): ReactNode {
  const typeLabel = EXPENSE_TYPE_LABEL[expense.expenseType] ?? expense.expenseType;
  const colorClass = EXPENSE_TYPE_COLOR[expense.expenseType] ?? EXPENSE_TYPE_COLOR.other;

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-navy/3 dark:hover:bg-white/3">
      {/* 좌측: 배지 + 날짜 + 메모 */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${colorClass}`}>
            {typeLabel}
          </span>
          <span className="text-xs text-navy/50 tabular-nums dark:text-gray-500">
            {expense.expenseDate}
          </span>
        </div>
        {expense.memo && (
          <p className="truncate pl-1 text-xs text-navy/60 dark:text-gray-400">{expense.memo}</p>
        )}
      </div>

      {/* 우측: 금액 + 삭제 버튼 */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="tabular-nums text-sm font-semibold text-navy dark:text-gray-100">
          {expense.amount.toLocaleString('ko-KR')}
          <span className="ml-1 text-xs font-normal text-navy/50 dark:text-gray-500">
            {expense.currency}
          </span>
        </span>
        <button
          type="button"
          onClick={() => onDelete(expense.id)}
          className="rounded-lg p-1 text-navy/40 hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
          aria-label="비용 삭제"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}

// ============================================================
// ExpenseList
// ============================================================

/** 부동산 비용 목록 */
export function ExpenseList({ expenses, onDelete }: ExpenseListProps): ReactNode {
  if (expenses.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-navy/50 dark:text-gray-500">
        등록된 비용이 없습니다.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-navy/5 dark:divide-white/5">
      {expenses.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </ul>
  );
}
