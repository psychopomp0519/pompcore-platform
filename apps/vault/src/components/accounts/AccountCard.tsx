/**
 * @file AccountCard.tsx
 * @description 통장 카드 컴포넌트
 * @module components/accounts/AccountCard
 */

import { memo, type ReactNode } from 'react';
import type { Account } from '../../types/account.types';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency } from '../../utils/currency';
import { ACCOUNT_TYPE_LABELS } from '../../types/account.types';
import { IconBank } from '@pompcore/ui';

// ============================================================
// 타입
// ============================================================

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onToggleFavorite: (accountId: string) => void;
  onUpdateBalance: (accountId: string, currency: string) => void;
  /** 주 통화 (환산 금액 표시용) */
  primaryCurrency?: string;
  /** 환산 함수 (useExchangeRates에서 전달) */
  convert?: (amount: number, from: string, to: string) => number;
}

// ============================================================
// AccountCard
// ============================================================

/** 통장 카드 */
function AccountCardInner({
  account,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateBalance,
  primaryCurrency,
  convert,
}: AccountCardProps): ReactNode {
  return (
    <GlassCard hoverable padding="md">
      {/* 헤더 */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <IconBank className="h-5 w-5 text-vault-color" />
          <h3 className="font-display text-base font-bold text-navy dark:text-gray-100">
            {account.name}
          </h3>
          {account.accountType !== 'bank' && (
            <span className="rounded-full bg-vault-color/10 px-1.5 py-0.5 text-[10px] font-medium text-vault-color">
              {ACCOUNT_TYPE_LABELS[account.accountType]}
            </span>
          )}
          {account.isFavorite && (
            <span className="text-xs text-amber-500">★</span>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(account.id)}
            className={`rounded-lg p-1.5 transition-colors ${
              account.isFavorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-navy/30 hover:text-navy/60 dark:text-gray-500 dark:hover:text-gray-300'
            }`}
            title={account.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
          >
            <svg className="h-4 w-4" fill={account.isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onEdit(account)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:text-navy/60 dark:text-gray-500 dark:hover:text-gray-300"
            title="수정"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(account)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            title="삭제"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 잔액 목록 */}
      <div className="space-y-1.5">
        {account.balances.length === 0 ? (
          <p className="text-sm text-navy/40 dark:text-gray-500">잔액 없음</p>
        ) : (
          account.balances.map((bal) => {
            const showConverted =
              convert &&
              primaryCurrency &&
              bal.currency !== primaryCurrency &&
              bal.balance !== 0;
            const convertedAmt = showConverted
              ? convert(bal.balance, bal.currency, primaryCurrency!)
              : null;
            return (
              <button
                key={bal.id}
                type="button"
                onClick={() => onUpdateBalance(account.id, bal.currency)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-navy/5 dark:hover:bg-white/5"
                title="잔액 수정"
              >
                <span className="text-navy/60 dark:text-gray-400">{bal.currency}</span>
                <div className="text-right">
                  <span className={`block font-semibold tabular-nums ${
                    bal.balance >= 0
                      ? 'text-navy dark:text-gray-100'
                      : 'text-red-500 dark:text-red-400'
                  }`}>
                    {formatCurrency(bal.balance, bal.currency)}
                  </span>
                  {convertedAmt !== null && (
                    <span className="block text-xs tabular-nums text-navy/40 dark:text-gray-500">
                      ≈ {formatCurrency(convertedAmt, primaryCurrency!)}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* 신용카드: 한도 대비 사용률 */}
      {account.accountType === 'credit_card' && account.creditLimit != null && account.creditLimit > 0 && (
        <CreditUsageBar account={account} />
      )}
    </GlassCard>
  );
}

/** 신용카드 한도 사용률 바 */
function CreditUsageBar({ account }: { account: Account }): ReactNode {
  const totalUsed = account.balances.reduce((sum, b) => sum + Math.abs(b.balance), 0);
  const limit = account.creditLimit ?? 0;
  const usageRate = limit > 0 ? Math.min((totalUsed / limit) * 100, 100) : 0;
  const isHigh = usageRate >= 80;

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-navy/50 dark:text-gray-400">
          사용 {formatCurrency(totalUsed, account.defaultCurrency)} / 한도 {formatCurrency(limit, account.defaultCurrency)}
        </span>
        <span className={isHigh ? 'font-bold text-red-500' : 'text-navy/50 dark:text-gray-400'}>
          {usageRate.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10 dark:bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${isHigh ? 'bg-red-500' : 'bg-vault-color'}`}
          style={{ width: `${usageRate}%` }}
        />
      </div>
      {account.billingDay && (
        <div className="text-[10px] text-navy/40 dark:text-gray-500">
          결제일: 매월 {account.billingDay}일
        </div>
      )}
    </div>
  );
}

export const AccountCard = memo(AccountCardInner);
