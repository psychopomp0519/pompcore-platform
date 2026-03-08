/**
 * @file BalanceEditDialog.tsx
 * @description 잔액 직접 수정 다이얼로그
 * @module components/accounts/BalanceEditDialog
 */

import { useState, type ReactNode, type FormEvent } from 'react';
import { Button } from '@pompcore/ui';
import { Modal } from '../common/Modal';
import { CURRENCIES } from '../../constants/currencies';

// ============================================================
// 타입
// ============================================================

interface BalanceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (balance: number) => void;
  accountName: string;
  currency: string;
  currentBalance: number;
}

// ============================================================
// BalanceEditDialog
// ============================================================

/** 잔액 수정 다이얼로그 */
export function BalanceEditDialog({
  isOpen,
  onClose,
  onSubmit,
  accountName,
  currency,
  currentBalance,
}: BalanceEditDialogProps): ReactNode {
  const [balance, setBalance] = useState(String(currentBalance));

  const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES];
  const symbol = currencyInfo?.symbol ?? currency;

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    const parsed = parseFloat(balance);
    if (isNaN(parsed)) return;
    onSubmit(parsed);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="잔액 수정" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-navy/60 dark:text-gray-400">
          {accountName} - {symbol} {currency}
        </p>

        <div>
          <label htmlFor="balance-input" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            잔액
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-navy/40 dark:text-gray-500">
              {symbol}
            </span>
            <input
              id="balance-input"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              step="any"
              className="w-full rounded-xl border border-navy/10 bg-white/60 py-2.5 pl-8 pr-3 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-xl text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
          >
            취소
          </Button>
          <Button
            type="submit"
            size="sm"
            className="rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
          >
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
}
