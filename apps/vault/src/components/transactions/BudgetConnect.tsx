/**
 * @file BudgetConnect.tsx
 * @description 거래와 예산을 연결하는 섹션 컴포넌트
 * @module components/transactions/BudgetConnect
 */

import { memo, type ReactNode } from 'react';
import type { BudgetAction } from '../../types/database.types';
import type { Budget } from '../../types/budget.types';

// ============================================================
// 타입
// ============================================================

interface BudgetConnectProps {
  /** 사용 가능한 예산 목록 */
  budgets: Budget[];
  /** 선택된 예산 ID */
  budgetId: string;
  /** 예산 ID 변경 핸들러 */
  onBudgetIdChange: (id: string) => void;
  /** 선택된 예산 동작 */
  budgetAction: BudgetAction | '';
  /** 예산 동작 변경 핸들러 */
  onBudgetActionChange: (action: BudgetAction | '') => void;
}

// ============================================================
// 스타일 상수
// ============================================================

const SELECT_CLASS =
  'w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy ' +
  'focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color ' +
  'dark:border-white/10 dark:bg-white/5 dark:text-gray-100';

const LABEL_CLASS = 'mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400';

// ============================================================
// BudgetConnect
// ============================================================

/** 예산 연결 (선택 + 입금/출금 동작) */
function BudgetConnectInner({
  budgets,
  budgetId,
  onBudgetIdChange,
  budgetAction,
  onBudgetActionChange,
}: BudgetConnectProps): ReactNode {
  if (budgets.length === 0) return null;

  /** 예산 선택 변경 시, 선택 해제되면 동작도 초기화 */
  function handleBudgetChange(id: string): void {
    onBudgetIdChange(id);
    if (!id) onBudgetActionChange('');
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="tx-budget" className={LABEL_CLASS}>
          예산 (선택)
        </label>
        <select
          id="tx-budget"
          value={budgetId}
          onChange={(e) => handleBudgetChange(e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">선택 안 함</option>
          {budgets.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      {budgetId && (
        <div>
          <label htmlFor="tx-budget-action" className={LABEL_CLASS}>
            예산 동작
          </label>
          <select
            id="tx-budget-action"
            value={budgetAction}
            onChange={(e) => onBudgetActionChange(e.target.value as BudgetAction | '')}
            className={SELECT_CLASS}
          >
            <option value="">선택</option>
            <option value="deposit">예산 추가 (모금)</option>
            <option value="withdraw">예산 사용 (차감)</option>
          </select>
        </div>
      )}
    </div>
  );
}

export const BudgetConnect = memo(BudgetConnectInner);
