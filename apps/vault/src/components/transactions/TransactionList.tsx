/**
 * @file TransactionList.tsx
 * @description 거래내역 목록 컴포넌트
 * @module components/transactions/TransactionList
 */

import { useMemo, memo, type ReactNode } from 'react';
import type { Transaction } from '../../types/transaction.types';
import type { Category } from '../../types/category.types';
import type { Account } from '../../types/account.types';
import { formatCurrency } from '../../utils/currency';
import { formatShortDate, getToday } from '../../utils/date';
import { IconTransfer, IconArrowDown, IconArrowUp } from '@pompcore/ui';
import { renderCategoryIcon } from '../icons/CategoryIcons';

// ============================================================
// 타입
// ============================================================

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  today?: string; // YYYY-MM-DD format
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

/** 날짜별로 그룹화된 거래내역 */
interface DateGroup {
  date: string;
  transactions: Transaction[];
}

// ============================================================
// TransactionList
// ============================================================

/** 거래내역 목록 (날짜별 그룹핑) */
function TransactionListInner({
  transactions,
  categories,
  accounts,
  today,
  onEdit,
  onDelete,
}: TransactionListProps): ReactNode {
  const todayStr = today ?? getToday();
  /* 날짜별 그룹핑 */
  const groups = useMemo((): DateGroup[] => {
    const map = new Map<string, Transaction[]>();
    for (const tx of transactions) {
      const list = map.get(tx.transactionDate) ?? [];
      list.push(tx);
      map.set(tx.transactionDate, list);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, txs]) => ({ date, transactions: txs }));
  }, [transactions]);

  /* 카테고리/통장 룩업 */
  const categoryMap = useMemo(() => {
    const m = new Map<string, Category>();
    for (const c of categories) m.set(c.id, c);
    return m;
  }, [categories]);

  const accountMap = useMemo(() => {
    const m = new Map<string, Account>();
    for (const a of accounts) m.set(a.id, a);
    return m;
  }, [accounts]);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.date}>
          {/* 날짜 헤더 */}
          <div className="mb-1.5 px-1 text-xs font-medium text-navy/50 dark:text-gray-500">
            {formatShortDate(group.date)}
          </div>

          {/* 거래 항목 */}
          <div className="space-y-1">
            {group.transactions.map((tx) => {
              const category = tx.categoryId ? categoryMap.get(tx.categoryId) : null;
              const account = accountMap.get(tx.accountId);
              const isTransfer = tx.sourceType === 'transfer';
              const isRecurring = tx.sourceType === 'recurring';

              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => onEdit(tx)}
                  className={`flex w-full items-center gap-3 rounded-xl bg-white/80 px-3 py-2.5 text-left backdrop-blur-sm transition-colors hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10${
                    tx.transactionDate > todayStr ? ' opacity-50' : ''
                  }`}
                >
                  {/* 아이콘 */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy/5 dark:bg-white/5">
                    {isTransfer
                      ? <IconTransfer className="h-5 w-5 text-vault-color" />
                      : category?.icon
                        ? renderCategoryIcon(category.icon, 'h-5 w-5')
                        : tx.type === 'income'
                          ? <IconArrowDown className="h-5 w-5 text-blue-500" />
                          : <IconArrowUp className="h-5 w-5 text-red-500" />
                    }
                  </div>

                  {/* 이름 + 카테고리/통장 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-navy dark:text-gray-100">
                        {tx.name}
                      </span>
                      {isRecurring && (
                        <span className="shrink-0 rounded bg-purple-100 px-1 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                          정기
                        </span>
                      )}
                      {isTransfer && (
                        <span className="shrink-0 rounded bg-blue-100 px-1 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                          이체
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-navy/40 dark:text-gray-500">
                      {account?.name ?? ''}
                      {category ? ` · ${category.name}` : ''}
                    </div>
                  </div>

                  {/* 금액 */}
                  <div className="shrink-0 text-right">
                    <span className={`text-sm font-semibold ${
                      tx.type === 'income'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                    </span>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(tx);
                    }}
                    className="shrink-0 rounded-lg p-1 text-navy/20 transition-colors hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400"
                    title="삭제"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export const TransactionList = memo(TransactionListInner);
