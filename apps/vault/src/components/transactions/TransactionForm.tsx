/**
 * @file TransactionForm.tsx
 * @description 거래내역 생성/수정 폼 컴포넌트
 * @module components/transactions/TransactionForm
 */

import { useState, memo, type ReactNode, type FormEvent } from 'react';
import { Button } from '@pompcore/ui';
import type { TransactionFormData } from '../../types/transaction.types';
import type { BudgetAction } from '../../types/database.types';
import type { Account } from '../../types/account.types';
import type { Category } from '../../types/category.types';
import type { Budget } from '../../types/budget.types';
import { CURRENCIES } from '../../constants/currencies';
import { getToday } from '../../utils/date';
import { TypeToggle } from './TypeToggle';
import { BudgetConnect } from './BudgetConnect';

// ============================================================
// 타입
// ============================================================

interface TransactionFormProps {
  initialData?: Partial<TransactionFormData>;
  accounts: Account[];
  categories: Category[];
  budgets?: Budget[];
  primaryCurrency?: string;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

// ============================================================
// 스타일 상수
// ============================================================

const INPUT_CLASS =
  'w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy ' +
  'placeholder-navy/30 focus-visible:border-vault-color focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 ' +
  'dark:text-gray-100 dark:placeholder-gray-500';

const SELECT_CLASS =
  'w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy ' +
  'focus-visible:border-vault-color focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100';

const LABEL_CLASS = 'mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400';

// ============================================================
// 헬퍼
// ============================================================

/** 카테고리 정렬: 즐겨찾기 -> 기본 -> sortOrder */
function sortCategories(list: Category[]): Category[] {
  return [...list].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });
}

// ============================================================
// TransactionForm
// ============================================================

/** 거래내역 생성/수정 폼 */
function TransactionFormInner({
  initialData,
  accounts,
  categories,
  budgets = [],
  primaryCurrency,
  onSubmit,
  onCancel,
}: TransactionFormProps): ReactNode {
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type ?? 'expense');
  const [name, setName] = useState(initialData?.name ?? '');
  const [amount, setAmount] = useState(initialData?.amount ? String(initialData.amount) : '');
  const [accountId, setAccountId] = useState(initialData?.accountId ?? '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '');
  const [currency, setCurrency] = useState(initialData?.currency ?? '');
  const [transactionDate, setTransactionDate] = useState(initialData?.transactionDate ?? getToday());
  const [memo, setMemo] = useState(initialData?.memo ?? '');
  const [budgetId, setBudgetId] = useState(initialData?.budgetId ?? '');
  const [budgetAction, setBudgetAction] = useState<BudgetAction | ''>(initialData?.budgetAction ?? '');

  const isEditing = initialData?.name !== undefined;
  const filteredCategories = sortCategories(categories.filter((c) => c.type === type));
  const selectedAccount = accounts.find((a) => a.id === accountId);

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  /** 타입 변경 시 기본 카테고리 자동 선택 */
  function handleTypeChange(newType: 'income' | 'expense'): void {
    setType(newType);
    if (!isEditing && !initialData?.categoryId) {
      const newCategories = sortCategories(categories.filter((c) => c.type === newType));
      setCategoryId(newCategories.find((c) => c.isDefault)?.id ?? '');
    }
  }

  /** 통장 선택 시 통화 자동 설정 */
  function handleAccountChange(id: string): void {
    setAccountId(id);
    const acc = accounts.find((a) => a.id === id);
    if (acc && !currency) setCurrency(acc.defaultCurrency);
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !accountId) return;

    onSubmit({
      name: name.trim(),
      type,
      amount: parsedAmount,
      currency: currency || primaryCurrency || 'KRW',
      accountId,
      categoryId: categoryId || null,
      transactionDate,
      budgetId: budgetId || null,
      budgetAction: (budgetId && budgetAction) ? budgetAction : null,
      memo,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 수입/지출 토글 */}
      <TypeToggle value={type} onChange={handleTypeChange} />

      {/* 이름 */}
      <div>
        <label htmlFor="tx-name" className={LABEL_CLASS}>이름 (생략 시 수입/지출)</label>
        <input
          id="tx-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder={type === 'income' ? '수입' : '지출'} maxLength={50} autoComplete="off"
          className={INPUT_CLASS}
        />
      </div>

      {/* 금액 */}
      <div>
        <label htmlFor="tx-amount" className={LABEL_CLASS}>금액</label>
        <input
          id="tx-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="0" min="0" max="9999999999" step="any" autoComplete="off" autoFocus
          className={INPUT_CLASS}
        />
      </div>

      {/* 통장 + 통화 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="tx-account" className={LABEL_CLASS}>통장</label>
          <select id="tx-account" value={accountId} onChange={(e) => handleAccountChange(e.target.value)} className={SELECT_CLASS}>
            <option value="">선택</option>
            {sortedAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.isFavorite ? '★ ' : ''}{acc.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tx-currency" className={LABEL_CLASS}>통화</label>
          <select id="tx-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={SELECT_CLASS}>
            <option value="">선택</option>
            {(selectedAccount?.supportedCurrencies ?? Object.keys(CURRENCIES)).map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 카테고리 */}
      <div>
        <label htmlFor="tx-category" className={LABEL_CLASS}>카테고리</label>
        <select id="tx-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={SELECT_CLASS}>
          <option value="">선택 안 함</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.isFavorite ? '★ ' : ''}{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 예산 연결 */}
      <BudgetConnect
        budgets={budgets}
        budgetId={budgetId}
        onBudgetIdChange={setBudgetId}
        budgetAction={budgetAction}
        onBudgetActionChange={setBudgetAction}
      />

      {/* 날짜 */}
      <div>
        <label htmlFor="tx-date" className={LABEL_CLASS}>날짜</label>
        <input
          id="tx-date" type="date" value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className={SELECT_CLASS}
        />
      </div>

      {/* 메모 */}
      <div>
        <label htmlFor="tx-memo" className={LABEL_CLASS}>메모 (선택)</label>
        <input
          id="tx-memo" type="text" value={memo} onChange={(e) => setMemo(e.target.value)}
          placeholder="메모" maxLength={100} className={INPUT_CLASS}
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button" onClick={onCancel} variant="ghost" size="sm"
          className="rounded-xl text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
        >
          취소
        </Button>
        <Button
          type="submit" disabled={!amount || parseFloat(amount) <= 0 || !accountId} size="sm"
          className="rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
        >
          {isEditing ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
}

export const TransactionForm = memo(TransactionFormInner);
