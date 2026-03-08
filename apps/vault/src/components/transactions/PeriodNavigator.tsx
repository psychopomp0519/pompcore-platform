/**
 * @file PeriodNavigator.tsx
 * @description 월별 기간 탐색 컴포넌트
 * @module components/transactions/PeriodNavigator
 */

import type { ReactNode } from 'react';
import type { MonthPeriod } from '../../types/transaction.types';

// ============================================================
// 타입
// ============================================================

interface PeriodNavigatorProps {
  period: MonthPeriod;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isCurrentMonth: boolean;
}

// ============================================================
// PeriodNavigator
// ============================================================

/** 월별 기간 탐색 */
export function PeriodNavigator({
  period,
  onPrev,
  onNext,
  onToday,
  isCurrentMonth,
}: PeriodNavigatorProps): ReactNode {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        className="rounded-lg p-2 text-navy/60 transition-colors hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
        aria-label="이전 달"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span className="min-w-[100px] text-center font-display text-base font-bold text-navy dark:text-gray-100">
        {period.year}년 {period.month}월
      </span>

      <button
        type="button"
        onClick={onNext}
        className="rounded-lg p-2 text-navy/60 transition-colors hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
        aria-label="다음 달"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {!isCurrentMonth && (
        <button
          type="button"
          onClick={onToday}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-vault-color transition-colors hover:bg-vault-color/10"
        >
          이번 달
        </button>
      )}
    </div>
  );
}
