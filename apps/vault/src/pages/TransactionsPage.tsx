/**
 * @file TransactionsPage.tsx
 * @description 거래내역 페이지
 * @module pages/TransactionsPage
 */

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useAccountStore } from '../stores/accountStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useBudgetStore } from '../stores/budgetStore';
import type { Transaction, TransactionFormData } from '../types/transaction.types';
import { GlassCard, Modal, ConfirmDialog, LoadingSpinner, EmptyState, Button } from '@pompcore/ui';
import { PeriodNavigator } from '../components/transactions/PeriodNavigator';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { formatCurrency } from '../utils/currency';
import { getCurrentMonthPeriod, getToday } from '../utils/date';
import { IconReceipt } from '../components/icons/NavIcons';

// ============================================================
// TransactionsPage
// ============================================================

/** 거래내역 페이지 */
export function TransactionsPage(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const {
    transactions,
    period,
    isLoading,
    error,
    loadTransactions,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
    addTransaction,
    editTransaction,
    removeTransaction,
    setFilters,
    clearError,
  } = useTransactionStore();

  const { accounts, loadAccounts } = useAccountStore();
  const { categories, loadCategories } = useCategoryStore();
  const { budgets, loadBudgets } = useBudgetStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<'income' | 'expense' | ''>('');

  /* 데이터 로드 */
  useEffect(() => {
    if (user?.id) {
      loadTransactions(user.id);
      loadAccounts(user.id);
      loadCategories(user.id);
      loadBudgets(user.id);
    }
  }, [user?.id, loadTransactions, loadAccounts, loadCategories, loadBudgets]);

  /* 이번 달인지 확인 */
  const currentMonth = useMemo(() => getCurrentMonthPeriod(), []);
  const isCurrentMonth = period.year === currentMonth.year && period.month === currentMonth.month;

  /* 수입/지출 합계 (통화별) */
  const summary = useMemo(() => {
    const income = new Map<string, number>();
    const expense = new Map<string, number>();

    for (const tx of transactions) {
      const map = tx.type === 'income' ? income : expense;
      map.set(tx.currency, (map.get(tx.currency) ?? 0) + tx.amount);
    }

    return {
      income: Array.from(income.entries()),
      expense: Array.from(expense.entries()),
    };
  }, [transactions]);

  /* 핸들러 */
  async function handleAdd(form: TransactionFormData): Promise<void> {
    if (!user?.id) return;
    await addTransaction(user.id, form);
    if (!useTransactionStore.getState().error) setIsFormOpen(false);
  }

  async function handleEdit(form: TransactionFormData): Promise<void> {
    if (!editingTx) return;
    await editTransaction(editingTx.id, form);
    if (!useTransactionStore.getState().error) setEditingTx(null);
  }

  function handleDelete(): void {
    if (!deletingTx) return;
    removeTransaction(deletingTx.id);
    setDeletingTx(null);
  }

  if (isLoading && transactions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* 에러 표시 */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={clearError} className="text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
          </div>
        </div>
      )}

      {/* 헤더: 기간 탐색 + 추가 버튼 */}
      <div className="flex items-center justify-between">
        <PeriodNavigator
          period={period}
          onPrev={() => user?.id && goToPrevMonth(user.id)}
          onNext={() => user?.id && goToNextMonth(user.id)}
          onToday={() => user?.id && goToCurrentMonth(user.id)}
          isCurrentMonth={isCurrentMonth}
        />

        <Button
          type="button"
          onClick={() => setIsFormOpen(true)}
          size="sm"
          className="gap-1.5 rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          추가
        </Button>
      </div>

      {/* 수입/지출 요약 */}
      <GlassCard padding="sm">
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="text-xs text-navy/50 dark:text-gray-500">수입</div>
            {summary.income.length === 0 ? (
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">-</div>
            ) : (
              summary.income.map(([currency, total]) => (
                <div key={currency} className="text-sm font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                  +{formatCurrency(total, currency)}
                </div>
              ))
            )}
          </div>
          <div className="h-8 w-px bg-navy/10 dark:bg-white/10" />
          <div>
            <div className="text-xs text-navy/50 dark:text-gray-500">지출</div>
            {summary.expense.length === 0 ? (
              <div className="text-sm font-semibold text-red-500 dark:text-red-400">-</div>
            ) : (
              summary.expense.map(([currency, total]) => (
                <div key={currency} className="text-sm font-semibold tabular-nums text-red-500 dark:text-red-400">
                  -{formatCurrency(total, currency)}
                </div>
              ))
            )}
          </div>
        </div>
      </GlassCard>

      {/* 필터 */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 rounded-lg bg-navy/5 p-0.5 dark:bg-white/5">
          {[
            { key: '', label: '전체' },
            { key: 'income', label: '수입' },
            { key: 'expense', label: '지출' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                const newType = opt.key as 'income' | 'expense' | '';
                setFilterType(newType);
                if (user?.id) {
                  setFilters(user.id, { type: newType || undefined });
                }
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filterType === opt.key
                  ? 'bg-white text-navy shadow-sm dark:bg-white/10 dark:text-gray-100'
                  : 'text-navy/50 dark:text-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 거래내역 목록 */}
      {transactions.length === 0 ? (
        <EmptyState
          icon={<IconReceipt className="h-8 w-8" />}
          title="거래내역이 없습니다"
          description="거래를 추가해보세요"
          actionLabel="거래 추가"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <TransactionList
          transactions={transactions}
          categories={categories}
          accounts={accounts}
          today={getToday()}
          onEdit={setEditingTx}
          onDelete={setDeletingTx}
        />
      )}

      {/* 생성 모달 */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="거래 추가">
        <TransactionForm
          accounts={accounts}
          categories={categories}
          budgets={budgets}
          onSubmit={handleAdd}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal isOpen={editingTx !== null} onClose={() => setEditingTx(null)} title="거래 수정">
        {editingTx && (
          <TransactionForm
            initialData={{
              name: editingTx.name,
              type: editingTx.type,
              amount: editingTx.amount,
              currency: editingTx.currency,
              accountId: editingTx.accountId,
              categoryId: editingTx.categoryId ?? '',
              transactionDate: editingTx.transactionDate,
              budgetId: editingTx.budgetId,
              budgetAction: editingTx.budgetAction,
              memo: editingTx.memo ?? '',
            }}
            accounts={accounts}
            categories={categories}
            budgets={budgets}
            onSubmit={handleEdit}
            onCancel={() => setEditingTx(null)}
          />
        )}
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingTx !== null}
        onClose={() => setDeletingTx(null)}
        onConfirm={handleDelete}
        title="거래 삭제"
        message={`"${deletingTx?.name}" 거래를 삭제하시겠습니까?`}
        confirmText="삭제"
        isDangerous
      />
    </div>
  );
}
