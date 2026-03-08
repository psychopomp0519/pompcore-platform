/**
 * @file TransferDialog.tsx
 * @description 이체 다이얼로그 컴포넌트
 * @module components/accounts/TransferDialog
 */

import { useState, useMemo, type ReactNode, type FormEvent } from 'react';
import type { Account } from '../../types/account.types';
import type { TransferFormData } from '../../types/account.types';
import { Modal } from '../common/Modal';
import { CURRENCIES } from '../../constants/currencies';

// ============================================================
// 타입
// ============================================================

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: TransferFormData) => void;
  accounts: Account[];
}

// ============================================================
// TransferDialog
// ============================================================

/** 이체 다이얼로그 */
export function TransferDialog({
  isOpen,
  onClose,
  onSubmit,
  accounts,
}: TransferDialogProps): ReactNode {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [memo, setMemo] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const [transferDate, setTransferDate] = useState(today);

  /* 즐겨찾기 통장 우선 정렬 */
  const sortedAccounts = useMemo(
    () => [...accounts].sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return a.sortOrder - b.sortOrder;
    }),
    [accounts],
  );

  const fromAccount = useMemo(
    () => accounts.find((a) => a.id === fromAccountId),
    [accounts, fromAccountId],
  );
  const toAccount = useMemo(
    () => accounts.find((a) => a.id === toAccountId),
    [accounts, toAccountId],
  );

  const isCrossCurrency = fromCurrency !== toCurrency && fromCurrency !== '' && toCurrency !== '';

  function handleFromAccountChange(id: string): void {
    setFromAccountId(id);
    const acc = accounts.find((a) => a.id === id);
    if (acc) setFromCurrency(acc.defaultCurrency);
  }

  function handleToAccountChange(id: string): void {
    setToAccountId(id);
    const acc = accounts.find((a) => a.id === id);
    if (acc) setToCurrency(acc.defaultCurrency);
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    const parsedFrom = parseFloat(fromAmount);
    const parsedTo = isCrossCurrency ? parseFloat(toAmount) : parsedFrom;
    if (!fromAccountId || !toAccountId || isNaN(parsedFrom) || parsedFrom <= 0) return;
    if (isCrossCurrency && (isNaN(parsedTo) || parsedTo <= 0)) return;
    if (fromAccountId === toAccountId && fromCurrency === toCurrency) return;

    onSubmit({
      fromAccountId,
      toAccountId,
      fromCurrency,
      toCurrency: isCrossCurrency ? toCurrency : fromCurrency,
      fromAmount: parsedFrom,
      toAmount: parsedTo,
      transferDate,
      memo,
    });
    resetForm();
  }

  function resetForm(): void {
    setFromAccountId('');
    setToAccountId('');
    setFromCurrency('');
    setToCurrency('');
    setFromAmount('');
    setToAmount('');
    setMemo('');
    setTransferDate(today);
  }

  function handleClose(): void {
    resetForm();
    onClose();
  }

  const isValid =
    fromAccountId &&
    toAccountId &&
    fromAmount &&
    parseFloat(fromAmount) > 0 &&
    (fromAccountId !== toAccountId || fromCurrency !== toCurrency) &&
    (!isCrossCurrency || (toAmount && parseFloat(toAmount) > 0));

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="이체" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 출금 통장 */}
        <div>
          <label htmlFor="from-account" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            출금 통장
          </label>
          <select
            id="from-account"
            value={fromAccountId}
            onChange={(e) => handleFromAccountChange(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          >
            <option value="">선택하세요</option>
            {sortedAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.isFavorite ? '★ ' : ''}{acc.name}</option>
            ))}
          </select>
        </div>

        {/* 출금 통화 */}
        {fromAccount && (
          <div>
            <label htmlFor="from-currency" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
              출금 통화
            </label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              disabled={fromAccount.supportedCurrencies.length <= 1}
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
            >
              {fromAccount.supportedCurrencies.map((c) => (
                <option key={c} value={c}>{CURRENCIES[c as keyof typeof CURRENCIES]?.name ?? c} ({c})</option>
              ))}
            </select>
          </div>
        )}

        {/* 입금 통장 */}
        <div>
          <label htmlFor="to-account" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            입금 통장
          </label>
          <select
            id="to-account"
            value={toAccountId}
            onChange={(e) => handleToAccountChange(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          >
            <option value="">선택하세요</option>
            {sortedAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.isFavorite ? '★ ' : ''}{acc.name}</option>
            ))}
          </select>
        </div>

        {/* 입금 통화 */}
        {toAccount && (
          <div>
            <label htmlFor="to-currency" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
              입금 통화
            </label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              disabled={toAccount.supportedCurrencies.length <= 1}
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
            >
              {toAccount.supportedCurrencies.map((c) => (
                <option key={c} value={c}>{CURRENCIES[c as keyof typeof CURRENCIES]?.name ?? c} ({c})</option>
              ))}
            </select>
          </div>
        )}

        {/* 교차 통화 안내 */}
        {isCrossCurrency && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            서로 다른 통화 간 이체입니다. 출금/입금 금액을 각각 입력해주세요.
          </p>
        )}

        {/* 금액 */}
        <div className={isCrossCurrency ? 'grid grid-cols-2 gap-3' : ''}>
          <div>
            <label htmlFor="from-amount" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
              {isCrossCurrency ? '출금 금액' : '금액'}
            </label>
            <input
              id="from-amount"
              type="number"
              value={fromAmount}
              onChange={(e) => {
                setFromAmount(e.target.value);
                if (!isCrossCurrency) setToAmount(e.target.value);
              }}
              placeholder="0"
              min="0"
              step="any"
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
          {isCrossCurrency && (
            <div>
              <label htmlFor="to-amount" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
                입금 금액
              </label>
              <input
                id="to-amount"
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="any"
                className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          )}
        </div>

        {/* 이체일 */}
        <div>
          <label htmlFor="transfer-date" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            이체일
          </label>
          <input
            id="transfer-date"
            type="date"
            value={transferDate}
            onChange={(e) => setTransferDate(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          />
        </div>

        {/* 메모 */}
        <div>
          <label htmlFor="transfer-memo" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            메모 (선택)
          </label>
          <input
            id="transfer-memo"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요"
            maxLength={100}
            className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy/70 transition-colors hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="rounded-xl bg-vault-color px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90 disabled:opacity-50"
          >
            이체
          </button>
        </div>
      </form>
    </Modal>
  );
}
