/**
 * @file SharedViewPage.tsx
 * @description 공유받은 가계부 읽기 전용 뷰
 * @module pages/SharedViewPage
 */

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { GlassCard, LoadingSpinner, EmptyState, IconArrowLeft } from '@pompcore/ui';
import { formatCurrency } from '../utils/currency';
import * as txService from '../services/transaction.service';
import * as accountService from '../services/account.service';
import { getCurrentMonthPeriod } from '../utils/date';
import type { Transaction } from '../types/transaction.types';
import type { Account } from '../types/account.types';
import { ROUTES } from '../constants/routes';

// ============================================================
// SharedViewPage
// ============================================================

/** 공유받은 가계부 조회 페이지 */
export function SharedViewPage(): ReactNode {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const period = useMemo(() => getCurrentMonthPeriod(), []);

  useEffect(() => {
    if (!ownerId || !user?.id) return;

    setIsLoading(true);
    Promise.all([
      txService.fetchTransactions(ownerId, period.startDate, period.endDate),
      accountService.fetchAccounts(ownerId),
    ])
      .then(([txs, accs]) => {
        setTransactions(txs);
        setAccounts(accs);
      })
      .catch(() => setLoadError('공유 데이터를 불러올 수 없습니다. 공유 권한을 확인해주세요.'))
      .finally(() => setIsLoading(false));
  }, [ownerId, user?.id, period]);

  /** 이번 달 수입/지출 합계 */
  const { income, expense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const tx of transactions) {
      if (tx.type === 'income') inc += tx.amount;
      else if (tx.type === 'expense') exp += tx.amount;
    }
    return { income: inc, expense: exp };
  }, [transactions]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.SETTINGS_FRIENDS)}
          className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
          aria-label="돌아가기"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">공유 가계부</h1>
        <span className="rounded-full bg-vault-color/10 px-2 py-0.5 text-[10px] font-medium text-vault-color">읽기 전용</span>
      </div>

      {loadError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {loadError}
        </div>
      )}

      {/* 통장 잔액 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">통장 잔액</h2>
        {accounts.length === 0 ? (
          <EmptyState title="통장 정보가 없습니다." />
        ) : (
          <div className="space-y-2">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between">
                <span className="text-sm text-navy dark:text-gray-200">{acc.name}</span>
                <div className="text-right">
                  {acc.balances.map((bal) => (
                    <div key={bal.currency} className="text-sm font-medium text-navy dark:text-gray-100">
                      {formatCurrency(bal.balance, bal.currency)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 이번 달 요약 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">
          {period.year}년 {period.month}월 요약
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-navy/50 dark:text-gray-400">수입</div>
            <div className="text-lg font-bold text-blue-500">{formatCurrency(income, 'KRW')}</div>
          </div>
          <div>
            <div className="text-xs text-navy/50 dark:text-gray-400">지출</div>
            <div className="text-lg font-bold text-red-500">{formatCurrency(expense, 'KRW')}</div>
          </div>
        </div>
      </GlassCard>

      {/* 최근 거래 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">
          최근 거래 ({transactions.length}건)
        </h2>
        {transactions.length === 0 ? (
          <EmptyState title="이번 달 거래가 없습니다." />
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 20).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-1">
                <div>
                  <div className="text-sm text-navy dark:text-gray-200">{tx.name}</div>
                  <div className="text-[10px] text-navy/40 dark:text-gray-500">{tx.transactionDate}</div>
                </div>
                <div className={`text-sm font-medium ${tx.type === 'income' ? 'text-blue-500' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
