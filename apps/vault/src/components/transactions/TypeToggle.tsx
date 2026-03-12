/**
 * @file TypeToggle.tsx
 * @description 거래 유형(수입/지출) 토글 버튼 컴포넌트
 * @module components/transactions/TypeToggle
 */

import { memo, type ReactNode } from 'react';

// ============================================================
// 타입
// ============================================================

/** 거래 유형 */
type TransactionType = 'income' | 'expense';

interface TypeToggleProps {
  /** 현재 선택된 거래 유형 */
  value: TransactionType;
  /** 유형 변경 핸들러 */
  onChange: (type: TransactionType) => void;
}

// ============================================================
// 스타일 상수
// ============================================================

const ACTIVE_INCOME_CLASS = 'bg-blue-500 text-white';
const ACTIVE_EXPENSE_CLASS = 'bg-red-500 text-white';
const INACTIVE_CLASS = 'bg-navy/5 text-navy/60 dark:bg-white/5 dark:text-gray-400';
const BASE_CLASS = 'flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors';

// ============================================================
// TypeToggle
// ============================================================

/** 수입/지출 토글 버튼 */
function TypeToggleInner({ value, onChange }: TypeToggleProps): ReactNode {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange('income')}
        className={`${BASE_CLASS} ${value === 'income' ? ACTIVE_INCOME_CLASS : INACTIVE_CLASS}`}
      >
        수입
      </button>
      <button
        type="button"
        onClick={() => onChange('expense')}
        className={`${BASE_CLASS} ${value === 'expense' ? ACTIVE_EXPENSE_CLASS : INACTIVE_CLASS}`}
      >
        지출
      </button>
    </div>
  );
}

export const TypeToggle = memo(TypeToggleInner);
