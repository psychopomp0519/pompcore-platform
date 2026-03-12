/**
 * @file BudgetForm.tsx
 * @description 예산 생성/수정 폼 컴포넌트
 * @module components/budget/BudgetForm
 */

import { useState, memo, type ReactNode, type FormEvent } from 'react';
import { Button } from '@pompcore/ui';
import type { BudgetFormData } from '../../types/budget.types';
import type { BudgetType } from '../../types/database.types';
import { BUDGET_TYPE_LABELS } from '../../types/budget.types';
import type { Account } from '../../types/account.types';
import { CURRENCIES } from '../../constants/currencies';

// ============================================================
// 타입
// ============================================================

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData>;
  accounts: Account[];
  onSubmit: (data: BudgetFormData) => void;
  onCancel: () => void;
}

// ============================================================
// 상수
// ============================================================

const BUDGET_TYPES: BudgetType[] = ['virtual', 'actual'];

// ============================================================
// BudgetForm
// ============================================================

/** 예산 생성/수정 폼 */
function BudgetFormInner({
  initialData,
  accounts,
  onSubmit,
  onCancel,
}: BudgetFormProps): ReactNode {
  const [name, setName] = useState(initialData?.name ?? '');
  const [targetAmount, setTargetAmount] = useState(
    initialData?.targetAmount ? String(initialData.targetAmount) : '',
  );
  const [currency, setCurrency] = useState(initialData?.currency ?? 'KRW');
  const [budgetType, setBudgetType] = useState<BudgetType>(initialData?.budgetType ?? 'virtual');
  const [linkedAccountId, setLinkedAccountId] = useState(initialData?.linkedAccountId ?? '');

  const isEditing = initialData?.name !== undefined;

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    const parsedAmount = parseFloat(targetAmount);
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (budgetType === 'actual' && !linkedAccountId) return;

    onSubmit({
      name: name.trim(),
      targetAmount: parsedAmount,
      currency,
      budgetType,
      linkedAccountId: budgetType === 'actual' ? linkedAccountId : null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 예산 타입 */}
      <div className="flex gap-2">
        {BUDGET_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setBudgetType(type)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              budgetType === type
                ? type === 'virtual'
                  ? 'bg-purple-500 text-white'
                  : 'bg-blue-500 text-white'
                : 'bg-navy/5 text-navy/60 dark:bg-white/5 dark:text-gray-400'
            }`}
          >
            {BUDGET_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* 이름 */}
      <div>
        <label htmlFor="budget-name" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
          이름
        </label>
        <input
          id="budget-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예산 이름"
          maxLength={50}
          className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          autoFocus
        />
      </div>

      {/* 목표 금액 + 통화 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label htmlFor="budget-target" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            목표 금액
          </label>
          <input
            id="budget-target"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0"
            min="0"
            max="9999999999"
            step="any"
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label htmlFor="budget-currency" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            통화
          </label>
          <select
            id="budget-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          >
            {Object.keys(CURRENCIES).map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 연결 통장 (실제 예산일 때만) */}
      {budgetType === 'actual' && (
        <div>
          <label htmlFor="budget-account" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            연결 통장
          </label>
          <select
            id="budget-account"
            value={linkedAccountId}
            onChange={(e) => setLinkedAccountId(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          >
            <option value="">통장 선택</option>
            {sortedAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.isFavorite ? '★ ' : ''}{acc.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-navy/40 dark:text-gray-500">
            실제 예산은 납입/사용 시 연결 통장 잔액이 변동됩니다.
          </p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="rounded-xl text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={!name.trim() || !targetAmount || parseFloat(targetAmount) <= 0 || (budgetType === 'actual' && !linkedAccountId)}
          size="sm"
          className="rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
        >
          {isEditing ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
}

export const BudgetForm = memo(BudgetFormInner);
