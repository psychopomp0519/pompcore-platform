/**
 * @file RecurringPage.tsx
 * @description 정기결제 관리 페이지
 * @module pages/RecurringPage
 */

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useRecurringStore } from '../stores/recurringStore';
import { useAccountStore } from '../stores/accountStore';
import { useCategoryStore } from '../stores/categoryStore';
import type { RecurringPayment, RecurringFormData, RecurringSortKey } from '../types/recurring.types';
import { GlassCard, Modal, ConfirmDialog, LoadingSpinner, EmptyState } from '@pompcore/ui';
import { RecurringCard } from '../components/recurring/RecurringCard';
import { RecurringForm } from '../components/recurring/RecurringForm';
import { formatCurrency } from '../utils/currency';
import { getDailyAverage, getDaysUntilNext } from '../utils/recurringCalculator';
import { INTERVAL_LABELS, type IntervalUnit } from '../constants/intervals';
import { IconRepeat } from '../components/icons/NavIcons';

// ============================================================
// 상수
// ============================================================

const SORT_OPTIONS: { key: RecurringSortKey; label: string }[] = [
  { key: 'days_until', label: '남은 기간' },
  { key: 'daily_avg', label: '일 평균' },
  { key: 'next_date', label: '다음 결제일' },
];

const AVG_PERIOD_OPTIONS: { key: IntervalUnit; label: string }[] = [
  { key: 'month', label: '월' },
  { key: 'day', label: '일' },
  { key: 'week', label: '주' },
  { key: 'year', label: '년' },
];

// ============================================================
// RecurringPage
// ============================================================

/** 정기결제 관리 페이지 */
export function RecurringPage(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const {
    payments,
    isLoading,
    error,
    loadPayments,
    addPayment,
    editPayment,
    removePayment,
    realizePayments,
    clearError,
  } = useRecurringStore();
  const { accounts, loadAccounts } = useAccountStore();
  const { categories, loadCategories } = useCategoryStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RecurringPayment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<RecurringPayment | null>(null);
  const [sortKey, setSortKey] = useState<RecurringSortKey>('days_until');
  const [sortAsc, setSortAsc] = useState(true);
  const [avgPeriod, setAvgPeriod] = useState<IntervalUnit>('month');

  /* 데이터 로드 + 자동 실현 */
  useEffect(() => {
    if (user?.id) {
      loadPayments(user.id);
      loadAccounts(user.id);
      loadCategories(user.id);
    }
  }, [user?.id, loadPayments, loadAccounts, loadCategories]);

  /* 정기결제 로드 후 자동 실현 */
  useEffect(() => {
    if (user?.id && payments.length > 0) {
      realizePayments(user.id);
    }
  }, [user?.id, payments.length, realizePayments]);

  /* 룩업 맵 */
  const accountMap = useMemo(() => {
    const m = new Map(accounts.map((a) => [a.id, a]));
    return m;
  }, [accounts]);

  const categoryMap = useMemo(() => {
    const m = new Map(categories.map((c) => [c.id, c]));
    return m;
  }, [categories]);

  /* 수입/지출 합계 (월 평균) */
  const monthlySummary = useMemo(() => {
    const income = new Map<string, number>();
    const expense = new Map<string, number>();

    for (const p of payments.filter((p) => p.isActive)) {
      const monthlyAvg = getDailyAverage(p.amount, p.intervalUnit, p.intervalValue) * 30.4375;
      const map = p.type === 'income' ? income : expense;
      map.set(p.currency, (map.get(p.currency) ?? 0) + monthlyAvg);
    }

    return {
      income: Array.from(income.entries()),
      expense: Array.from(expense.entries()),
    };
  }, [payments]);

  /* 정렬 */
  const sortedPayments = useMemo(() => {
    const sorted = [...payments].sort((a, b) => {
      switch (sortKey) {
        case 'daily_avg': {
          const avgA = getDailyAverage(a.amount, a.intervalUnit, a.intervalValue);
          const avgB = getDailyAverage(b.amount, b.intervalUnit, b.intervalValue);
          return avgB - avgA;
        }
        case 'next_date': {
          const daysA = getDaysUntilNext(a.startDate, a.intervalUnit, a.intervalValue);
          const daysB = getDaysUntilNext(b.startDate, b.intervalUnit, b.intervalValue);
          return daysA - daysB;
        }
        case 'days_until':
        default: {
          const daysA = getDaysUntilNext(a.startDate, a.intervalUnit, a.intervalValue);
          const daysB = getDaysUntilNext(b.startDate, b.intervalUnit, b.intervalValue);
          return daysA - daysB;
        }
      }
    });
    return sortAsc ? sorted : sorted.reverse();
  }, [payments, sortKey, sortAsc]);

  /* 핸들러 */
  function handleAdd(form: RecurringFormData): void {
    if (!user?.id) return;
    addPayment(user.id, form);
    setIsFormOpen(false);
  }

  function handleEdit(form: RecurringFormData): void {
    if (!editingPayment) return;
    editPayment(editingPayment.id, form);
    setEditingPayment(null);
  }

  function handleDelete(): void {
    if (!deletingPayment) return;
    removePayment(deletingPayment.id);
    setDeletingPayment(null);
  }

  function handleToggleActive(payment: RecurringPayment): void {
    editPayment(payment.id, { isActive: !payment.isActive });
  }

  if (isLoading && payments.length === 0) {
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

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">정기결제</h1>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          추가
        </button>
      </div>

      {/* 월 평균 요약 */}
      <GlassCard padding="sm">
        <div className="mb-1 text-xs text-navy/50 dark:text-gray-500">월 평균</div>
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="text-xs text-navy/50 dark:text-gray-500">수입</div>
            {monthlySummary.income.length === 0 ? (
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">-</div>
            ) : (
              monthlySummary.income.map(([currency, total]) => (
                <div key={currency} className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  +{formatCurrency(Math.round(total), currency)}
                </div>
              ))
            )}
          </div>
          <div className="h-8 w-px bg-navy/10 dark:bg-white/10" />
          <div>
            <div className="text-xs text-navy/50 dark:text-gray-500">지출</div>
            {monthlySummary.expense.length === 0 ? (
              <div className="text-sm font-semibold text-red-500 dark:text-red-400">-</div>
            ) : (
              monthlySummary.expense.map(([currency, total]) => (
                <div key={currency} className="text-sm font-semibold text-red-500 dark:text-red-400">
                  -{formatCurrency(Math.round(total), currency)}
                </div>
              ))
            )}
          </div>
        </div>
      </GlassCard>

      {/* 정렬 + 평균 단위 */}
      {payments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-lg bg-navy/5 p-0.5 dark:bg-white/5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSortKey(opt.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  sortKey === opt.key
                    ? 'bg-white text-navy shadow-sm dark:bg-white/10 dark:text-gray-100'
                    : 'text-navy/50 dark:text-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSortAsc((prev) => !prev)}
            className="rounded-md p-1 text-navy/50 hover:text-navy dark:text-gray-400 dark:hover:text-gray-200"
            title={sortAsc ? '오름차순' : '내림차순'}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {sortAsc ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              )}
            </svg>
          </button>
          <div className="flex gap-1 rounded-lg bg-navy/5 p-0.5 dark:bg-white/5">
            {AVG_PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setAvgPeriod(opt.key)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  avgPeriod === opt.key
                    ? 'bg-white text-navy shadow-sm dark:bg-white/10 dark:text-gray-100'
                    : 'text-navy/50 dark:text-gray-400'
                }`}
              >
                {INTERVAL_LABELS[opt.key]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 정기결제 목록 */}
      {sortedPayments.length === 0 ? (
        <EmptyState
          icon={<IconRepeat className="h-8 w-8" />}
          title="등록된 정기결제가 없습니다"
          description="정기결제를 추가해보세요"
          actionLabel="정기결제 추가"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="space-y-2">
          {sortedPayments.map((payment) => (
            <RecurringCard
              key={payment.id}
              payment={payment}
              account={accountMap.get(payment.accountId)}
              category={payment.categoryId ? categoryMap.get(payment.categoryId) : undefined}
              avgPeriod={avgPeriod}
              onEdit={setEditingPayment}
              onDelete={setDeletingPayment}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      {/* 생성 모달 */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="정기결제 추가">
        <RecurringForm
          accounts={accounts}
          categories={categories}
          onSubmit={handleAdd}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal isOpen={editingPayment !== null} onClose={() => setEditingPayment(null)} title="정기결제 수정">
        {editingPayment && (
          <RecurringForm
            initialData={{
              name: editingPayment.name,
              type: editingPayment.type,
              amount: editingPayment.amount,
              currency: editingPayment.currency,
              accountId: editingPayment.accountId,
              categoryId: editingPayment.categoryId ?? '',
              startDate: editingPayment.startDate,
              intervalUnit: editingPayment.intervalUnit,
              intervalValue: editingPayment.intervalValue,
            }}
            accounts={accounts}
            categories={categories}
            onSubmit={handleEdit}
            onCancel={() => setEditingPayment(null)}
          />
        )}
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingPayment !== null}
        onClose={() => setDeletingPayment(null)}
        onConfirm={handleDelete}
        title="정기결제 삭제"
        message={`"${deletingPayment?.name}" 정기결제를 삭제하시겠습니까?`}
        confirmText="삭제"
        isDangerous
      />
    </div>
  );
}
