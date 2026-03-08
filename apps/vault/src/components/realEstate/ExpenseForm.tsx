/**
 * @file ExpenseForm.tsx
 * @description 부동산 비용 추가 폼 컴포넌트
 * @module components/realEstate/ExpenseForm
 */

import { useState, type ReactNode, type FormEvent } from 'react';
import type { ExpenseFormData } from '../../types/realEstate.types';
import type { ExpenseType } from '../../types/database.types';
import { getToday } from '../../utils/date';

// ============================================================
// 상수
// ============================================================

const EXPENSE_TYPE_OPTIONS: Array<{ value: ExpenseType; label: string }> = [
  { value: 'maintenance', label: '관리비' },
  { value: 'tax', label: '세금' },
  { value: 'repair', label: '수리비' },
  { value: 'insurance', label: '보험료' },
  { value: 'loan_interest', label: '대출이자' },
  { value: 'other', label: '기타' },
];

const CURRENCY_OPTIONS = ['KRW', 'USD'];

// ============================================================
// 공통 클래스
// ============================================================

const INPUT_CLASS =
  'w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm text-navy placeholder-navy/30 dark:border-white/10 dark:bg-navy/60 dark:text-gray-100 dark:placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color';

const LABEL_CLASS = 'mb-1 block text-xs font-semibold text-navy/70 dark:text-gray-400';

// ============================================================
// 타입
// ============================================================

interface ExpenseFormProps {
  propertyCurrency: string;
  onSubmit: (form: ExpenseFormData) => void;
  onCancel: () => void;
}

// ============================================================
// ExpenseForm
// ============================================================

/** 비용 추가 폼 */
export function ExpenseForm({ propertyCurrency, onSubmit, onCancel }: ExpenseFormProps): ReactNode {
  const [form, setForm] = useState<ExpenseFormData>({
    expenseType: 'maintenance',
    amount: '',
    currency: CURRENCY_OPTIONS.includes(propertyCurrency) ? propertyCurrency : 'KRW',
    expenseDate: getToday(),
    memo: '',
  });

  const set = (patch: Partial<ExpenseFormData>): void =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 비용 유형 */}
      <div>
        <label className={LABEL_CLASS}>비용 유형</label>
        <select
          value={form.expenseType}
          onChange={(e) => set({ expenseType: e.target.value as ExpenseType })}
          className={INPUT_CLASS}
        >
          {EXPENSE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 금액 + 통화 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className={LABEL_CLASS}>금액 *</label>
          <input
            type="text"
            inputMode="numeric"
            required
            placeholder="0"
            value={form.amount}
            onChange={(e) => set({ amount: e.target.value.replace(/[^0-9]/g, '') })}
            className={`${INPUT_CLASS} tabular-nums`}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>통화</label>
          <select
            value={form.currency}
            onChange={(e) => set({ currency: e.target.value })}
            className={INPUT_CLASS}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 비용 날짜 */}
      <div>
        <label className={LABEL_CLASS}>날짜 *</label>
        <input
          type="date"
          required
          value={form.expenseDate}
          onChange={(e) => set({ expenseDate: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      {/* 메모 */}
      <div>
        <label className={LABEL_CLASS}>메모</label>
        <textarea
          rows={3}
          placeholder="추가 메모 (선택)"
          value={form.memo}
          onChange={(e) => set({ memo: e.target.value })}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-xl bg-vault-color px-5 py-2 text-sm font-semibold text-white hover:bg-vault-color/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color focus-visible:ring-offset-2"
        >
          비용 추가
        </button>
      </div>
    </form>
  );
}
