/**
 * @file RecurringForm.tsx
 * @description 정기결제 생성/수정 폼 컴포넌트
 * @module components/recurring/RecurringForm
 */

import { useState, type ReactNode, type FormEvent } from 'react';
import { Button } from '@pompcore/ui';
import type { RecurringFormData } from '../../types/recurring.types';
import type { Account } from '../../types/account.types';
import type { Category } from '../../types/category.types';
import type { DbIntervalUnit } from '../../types/database.types';
import { CURRENCIES } from '../../constants/currencies';
import { INTERVAL_LABELS } from '../../constants/intervals';
import { getToday } from '../../utils/date';

// ============================================================
// 타입
// ============================================================

interface RecurringFormProps {
  initialData?: Partial<RecurringFormData>;
  accounts: Account[];
  categories: Category[];
  primaryCurrency?: string;
  onSubmit: (data: RecurringFormData) => void;
  onCancel: () => void;
}

// ============================================================
// 상수
// ============================================================

const INTERVAL_UNITS: DbIntervalUnit[] = ['day', 'week', 'month', 'year'];

// ============================================================
// RecurringForm
// ============================================================

/** 정기결제 생성/수정 폼 */
export function RecurringForm({
  initialData,
  accounts,
  categories,
  primaryCurrency,
  onSubmit,
  onCancel,
}: RecurringFormProps): ReactNode {
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type ?? 'expense');
  const [name, setName] = useState(initialData?.name ?? '');
  const [amount, setAmount] = useState(initialData?.amount ? String(initialData.amount) : '');
  const [accountId, setAccountId] = useState(initialData?.accountId ?? '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '');
  const [currency, setCurrency] = useState(initialData?.currency ?? '');
  const [startDate, setStartDate] = useState(initialData?.startDate ?? getToday());
  const [intervalUnit, setIntervalUnit] = useState<DbIntervalUnit>(initialData?.intervalUnit ?? 'month');
  const [intervalValue, setIntervalValue] = useState(String(initialData?.intervalValue ?? 1));

  const isEditing = initialData?.name !== undefined;
  const selectedAccount = accounts.find((a) => a.id === accountId);

  const filteredCategories = categories
    .filter((c) => c.type === type)
    .sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return a.sortOrder - b.sortOrder;
    });

  /** 타입 변경 시 기본 카테고리 자동 선택 (이벤트 핸들러에서 처리, Effect 불필요) */
  function handleTypeChange(newType: 'income' | 'expense'): void {
    setType(newType);
    if (!isEditing && !initialData?.categoryId) {
      const newCategories = categories
        .filter((c) => c.type === newType)
        .sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
          return a.sortOrder - b.sortOrder;
        });
      setCategoryId(newCategories.find((c) => c.isDefault)?.id ?? '');
    }
  }

  function handleAccountChange(id: string): void {
    setAccountId(id);
    const acc = accounts.find((a) => a.id === id);
    if (acc && !currency) setCurrency(acc.defaultCurrency);
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const parsedInterval = parseInt(intervalValue, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !accountId) return;
    if (isNaN(parsedInterval) || parsedInterval <= 0) return;

    onSubmit({
      name: name.trim() || (type === 'income' ? '수입' : '지출'),
      type,
      amount: parsedAmount,
      currency: currency || primaryCurrency || 'KRW',
      accountId,
      categoryId: categoryId || null,
      startDate,
      intervalUnit,
      intervalValue: parsedInterval,
    });
  }

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 수입/지출 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            type === 'income' ? 'bg-blue-500 text-white' : 'bg-navy/5 text-navy/60 dark:bg-white/5 dark:text-gray-400'
          }`}
        >
          수입
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            type === 'expense' ? 'bg-red-500 text-white' : 'bg-navy/5 text-navy/60 dark:bg-white/5 dark:text-gray-400'
          }`}
        >
          지출
        </button>
      </div>

      {/* 이름 */}
      <div>
        <label htmlFor="rec-name" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">이름 (생략 시 수입/지출)</label>
        <input
          id="rec-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={type === 'income' ? '수입' : '지출'}
          maxLength={50}
          autoComplete="off"
          className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          autoFocus
        />
      </div>

      {/* 금액 */}
      <div>
        <label htmlFor="rec-amount" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">금액</label>
        <input
          id="rec-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          min="0"
          step="any"
          autoComplete="off"
          className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>

      {/* 간격 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="rec-interval-value" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">간격 (숫자)</label>
          <input
            id="rec-interval-value"
            type="number"
            value={intervalValue}
            onChange={(e) => setIntervalValue(e.target.value)}
            min="1"
            className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="rec-interval-unit" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">단위</label>
          <select
            id="rec-interval-unit"
            value={intervalUnit}
            onChange={(e) => setIntervalUnit(e.target.value as DbIntervalUnit)}
            className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          >
            {INTERVAL_UNITS.map((unit) => (
              <option key={unit} value={unit}>{INTERVAL_LABELS[unit]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 통장 + 통화 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="rec-account" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">통장</label>
          <select
            id="rec-account"
            value={accountId}
            onChange={(e) => handleAccountChange(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          >
            <option value="">선택</option>
            {sortedAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.isFavorite ? '★ ' : ''}{acc.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rec-currency" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">통화</label>
          <select
            id="rec-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          >
            <option value="">선택</option>
            {(selectedAccount?.supportedCurrencies ?? Object.keys(CURRENCIES)).map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 카테고리 */}
      <div>
        <label htmlFor="rec-category" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">카테고리</label>
        <select
          id="rec-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
        >
          <option value="">선택 안 함</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.icon ? `${cat.icon} ` : ''}{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 시작일 */}
      <div>
        <label htmlFor="rec-start" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">시작일</label>
        <input
          id="rec-start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
        />
      </div>

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
          disabled={!amount || parseFloat(amount) <= 0 || !accountId}
          size="sm"
          className="rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
        >
          {isEditing ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
}
