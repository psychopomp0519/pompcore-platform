/**
 * @file ExpensesSection.tsx
 * @description 부동산 상세 페이지 비용 섹션
 * @module components/realEstate/ExpensesSection
 */

import { memo, type ReactNode } from 'react';
import type { RealEstateExpense } from '../../types/realEstate.types';
import { ExpenseList } from './ExpenseList';

// ============================================================
// 타입
// ============================================================

export interface ExpensesSectionProps {
  /** 비용 목록 */
  expenses: RealEstateExpense[];
  /** 비용 추가 버튼 클릭 핸들러 */
  onAddExpense: () => void;
  /** 비용 삭제 요청 핸들러 (확인 다이얼로그 오픈) */
  onDeleteExpense: (expenseId: string) => void;
}

// ============================================================
// ExpensesSection
// ============================================================

/** 비용 섹션 — 비용 목록 + 추가 버튼 */
function ExpensesSectionInner({
  expenses,
  onAddExpense,
  onDeleteExpense,
}: ExpensesSectionProps): ReactNode {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-navy dark:text-gray-100">비용</h2>
        <button
          type="button"
          onClick={onAddExpense}
          className="flex items-center gap-1 rounded-xl bg-vault-color/10 px-3 py-1.5 text-sm font-semibold text-vault-color hover:bg-vault-color/20 dark:bg-vault-color/20 dark:hover:bg-vault-color/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          비용 추가
        </button>
      </div>

      <div className="rounded-2xl bg-white/80 backdrop-blur dark:bg-navy/40">
        <ExpenseList
          expenses={expenses}
          onDelete={onDeleteExpense}
        />
      </div>
    </section>
  );
}

export const ExpensesSection = memo(ExpensesSectionInner);
