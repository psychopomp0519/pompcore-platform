/**
 * @file BudgetCard.tsx
 * @description 예산 카드 컴포넌트
 * @module components/budget/BudgetCard
 */

import type { ReactNode } from 'react';
import type { Budget } from '../../types/budget.types';
import { BUDGET_TYPE_LABELS } from '../../types/budget.types';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency } from '../../utils/currency';

// ============================================================
// 타입
// ============================================================

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
  onUpdateAmount: (budget: Budget) => void;
}

// ============================================================
// 상수
// ============================================================

/** 진행률에 따른 색상 */
const PROGRESS_COLORS = {
  low: 'bg-vault-color',
  mid: 'bg-amber-500',
  high: 'bg-red-500',
} as const;

/** 진행률 색상 구간 임계값 */
const PROGRESS_THRESHOLD_MID = 70;
const PROGRESS_THRESHOLD_HIGH = 90;

// ============================================================
// BudgetCard
// ============================================================

/** 예산 카드 */
export function BudgetCard({
  budget,
  onEdit,
  onDelete,
  onUpdateAmount,
}: BudgetCardProps): ReactNode {
  const percentage = budget.targetAmount > 0
    ? Math.min((budget.currentAmount / budget.targetAmount) * 100, 100)
    : 0;

  const progressColor = getProgressColor(percentage);
  const remaining = budget.targetAmount - budget.currentAmount;

  return (
    <GlassCard hoverable padding="md">
      {/* 헤더 */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-navy dark:text-gray-100">{budget.name}</h3>
          <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
            budget.budgetType === 'actual'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
          }`}>
            {BUDGET_TYPE_LABELS[budget.budgetType]}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onUpdateAmount(budget)}
            className="rounded-lg px-2 py-1 text-xs text-vault-color transition-colors hover:bg-vault-color/10"
          >
            금액 수정
          </button>
          <button
            type="button"
            onClick={() => onEdit(budget)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:text-navy/60 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(budget)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="mb-2">
        <div className="mb-1 flex justify-between text-xs">
          <span className="font-medium text-navy dark:text-gray-200">
            {formatCurrency(budget.currentAmount, budget.currency)}
          </span>
          <span className="text-navy/40 dark:text-gray-500">
            {formatCurrency(budget.targetAmount, budget.currency)}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-navy/5 dark:bg-white/10">
          <div
            className={`h-full rounded-full transition-all ${progressColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-navy/40 dark:text-gray-500">
            {percentage.toFixed(1)}%
          </span>
          <span className={`${remaining > 0 ? 'text-navy/40 dark:text-gray-500' : 'font-semibold text-vault-color'}`}>
            {remaining > 0
              ? `${formatCurrency(remaining, budget.currency)} 남음`
              : '달성!'}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

// ============================================================
// 헬퍼
// ============================================================

/** 진행률에 따른 색상 반환 */
function getProgressColor(percentage: number): string {
  if (percentage >= PROGRESS_THRESHOLD_HIGH) return PROGRESS_COLORS.high;
  if (percentage >= PROGRESS_THRESHOLD_MID) return PROGRESS_COLORS.mid;
  return PROGRESS_COLORS.low;
}
