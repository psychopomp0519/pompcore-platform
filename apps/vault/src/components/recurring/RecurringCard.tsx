/**
 * @file RecurringCard.tsx
 * @description 정기결제 카드 컴포넌트
 * @module components/recurring/RecurringCard
 */

import type { ReactNode } from 'react';
import type { RecurringPayment } from '../../types/recurring.types';
import type { Account } from '../../types/account.types';
import type { Category } from '../../types/category.types';
import { formatCurrency } from '../../utils/currency';
import { getNextOccurrence, getDaysUntilNext, getAverageByPeriod } from '../../utils/recurringCalculator';
import { formatShortDate } from '../../utils/date';
import { INTERVAL_LABELS } from '../../constants/intervals';
import type { IntervalUnit } from '../../constants/intervals';
import { renderCategoryIcon } from '../icons/CategoryIcons';

// ============================================================
// 타입
// ============================================================

interface RecurringCardProps {
  payment: RecurringPayment;
  account?: Account;
  category?: Category;
  avgPeriod: IntervalUnit;
  onEdit: (payment: RecurringPayment) => void;
  onDelete: (payment: RecurringPayment) => void;
  onToggleActive: (payment: RecurringPayment) => void;
}

// ============================================================
// RecurringCard
// ============================================================

/** 정기결제 카드 */
export function RecurringCard({
  payment,
  account,
  category,
  avgPeriod,
  onEdit,
  onDelete,
  onToggleActive,
}: RecurringCardProps): ReactNode {
  const nextDate = getNextOccurrence(payment.startDate, payment.intervalUnit, payment.intervalValue);
  const daysUntil = getDaysUntilNext(payment.startDate, payment.intervalUnit, payment.intervalValue);
  const avgAmount = getAverageByPeriod(payment.amount, payment.intervalUnit, payment.intervalValue, avgPeriod);

  const intervalLabel = `${payment.intervalValue}${INTERVAL_LABELS[payment.intervalUnit]}`;

  return (
    <div className={`rounded-xl bg-white/60 p-3 backdrop-blur-sm dark:bg-white/5 ${!payment.isActive ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-vault-color">
          {renderCategoryIcon(category?.icon, 'h-5 w-5')}
        </span>

        {/* 메인 정보 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-navy dark:text-gray-100">
              {payment.name}
            </span>
            {!payment.isActive && (
              <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                비활성
              </span>
            )}
          </div>

          {/* 세부 정보 */}
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-navy/40 dark:text-gray-500">
            <span>매 {intervalLabel}</span>
            <span>{account?.name ?? ''}</span>
            {category && <span>{category.name}</span>}
          </div>

          {/* 다음 결제 + 평균 */}
          <div className="mt-1.5 flex flex-wrap gap-x-3 text-xs">
            <span className="text-navy/60 dark:text-gray-400">
              다음: {formatShortDate(nextDate)}
              {daysUntil === 0 ? ' (오늘)' : ` (${daysUntil}일 후)`}
            </span>
            <span className="text-navy/40 dark:text-gray-500">
              {INTERVAL_LABELS[avgPeriod]} 평균: {formatCurrency(avgAmount, payment.currency)}
            </span>
          </div>
        </div>

        {/* 금액 */}
        <div className="shrink-0 text-right">
          <span className={`text-sm font-semibold ${
            payment.type === 'income'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-red-500 dark:text-red-400'
          }`}>
            {formatCurrency(payment.amount, payment.currency)}
          </span>
        </div>
      </div>

      {/* 액션 */}
      <div className="mt-2 flex justify-end gap-1">
        <button
          type="button"
          onClick={() => onToggleActive(payment)}
          className="rounded-lg px-2 py-1 text-xs text-navy/40 transition-colors hover:bg-navy/5 dark:text-gray-500 dark:hover:bg-white/5"
          title={payment.isActive ? '비활성화' : '활성화'}
        >
          {payment.isActive ? '일시정지' : '재개'}
        </button>
        <button
          type="button"
          onClick={() => onEdit(payment)}
          className="rounded-lg px-2 py-1 text-xs text-navy/40 transition-colors hover:bg-navy/5 dark:text-gray-500 dark:hover:bg-white/5"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => onDelete(payment)}
          className="rounded-lg px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
