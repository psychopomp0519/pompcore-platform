/**
 * @file AccountForm.tsx
 * @description 통장 생성/수정 폼 컴포넌트
 * @module components/accounts/AccountForm
 */

import { useState, memo, type ReactNode, type FormEvent } from 'react';
import { Button } from '@pompcore/ui';
import type { AccountFormData } from '../../types/account.types';
import { CURRENCIES, CURRENCY_CODES, DEFAULT_CURRENCY } from '../../constants/currencies';

// ============================================================
// 타입
// ============================================================

interface AccountFormProps {
  /** 수정 시 초기값 */
  initialData?: AccountFormData;
  /** 폼 제출 */
  onSubmit: (data: AccountFormData) => void;
  /** 취소 */
  onCancel: () => void;
}

// ============================================================
// AccountForm
// ============================================================

/** 통장 생성/수정 폼 */
function AccountFormInner({
  initialData,
  onSubmit,
  onCancel,
}: AccountFormProps): ReactNode {
  const [name, setName] = useState(initialData?.name ?? '');
  const [defaultCurrency, setDefaultCurrency] = useState(initialData?.defaultCurrency ?? DEFAULT_CURRENCY);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    initialData?.supportedCurrencies ?? [DEFAULT_CURRENCY],
  );
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite ?? false);

  const isEditing = initialData !== undefined;

  function handleCurrencyToggle(code: string): void {
    setSelectedCurrencies((prev) => {
      if (prev.includes(code)) {
        if (prev.length <= 1) return prev;
        const next = prev.filter((c) => c !== code);
        if (defaultCurrency === code) setDefaultCurrency(next[0]);
        return next;
      }
      return [...prev, code];
    });
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    if (!name.trim() || selectedCurrencies.length === 0) return;
    onSubmit({
      name: name.trim(),
      defaultCurrency,
      supportedCurrencies: selectedCurrencies,
      isFavorite,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 이름 */}
      <div>
        <label htmlFor="account-name" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
          통장 이름
        </label>
        <input
          id="account-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="통장 이름을 입력하세요"
          maxLength={30}
          className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 backdrop-blur-sm focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          autoFocus
        />
      </div>

      {/* 지원 통화 */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
          지원 통화
        </label>
        <div className="flex flex-wrap gap-2">
          {CURRENCY_CODES.map((code) => {
            const currency = CURRENCIES[code];
            const isSelected = selectedCurrencies.includes(code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleCurrencyToggle(code)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-vault-color/20 text-vault-color ring-1 ring-vault-color/30'
                    : 'bg-navy/5 text-navy/50 hover:bg-navy/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
                }`}
              >
                {currency.symbol} {code}
              </button>
            );
          })}
        </div>
      </div>

      {/* 주 사용 통화 */}
      {selectedCurrencies.length > 1 && (
        <div>
          <label htmlFor="default-currency" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            주 사용 통화
          </label>
          <select
            id="default-currency"
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          >
            {selectedCurrencies.map((code) => (
              <option key={code} value={code}>
                {CURRENCIES[code as keyof typeof CURRENCIES]?.name ?? code} ({code})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 즐겨찾기 */}
      <label className="flex items-center gap-2 text-sm text-navy/70 dark:text-gray-300">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
          className="rounded border-navy/20 text-vault-color focus:ring-vault-color dark:border-white/20"
        />
        즐겨찾기로 설정
      </label>

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
          disabled={!name.trim() || selectedCurrencies.length === 0}
          size="sm"
          className="rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
        >
          {isEditing ? '수정' : '생성'}
        </Button>
      </div>
    </form>
  );
}

export const AccountForm = memo(AccountFormInner);
