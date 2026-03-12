/**
 * @file BudgetPage.tsx
 * @description 예산 관리 페이지
 * @module pages/BudgetPage
 */

import { useState, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useBudgetStore } from '../stores/budgetStore';
import { useAccountStore } from '../stores/accountStore';
import type { Budget, BudgetFormData } from '../types/budget.types';
import { Modal, ConfirmDialog, LoadingSpinner, EmptyState, Button } from '@pompcore/ui';
import { BudgetCard } from '../components/budget/BudgetCard';
import { BudgetForm } from '../components/budget/BudgetForm';
import { formatCurrency } from '../utils/currency';
import { exportBudgets } from '../utils/exportHelpers';
import { IconChart } from '@pompcore/ui';

// ============================================================
// BudgetPage
// ============================================================

/** 예산 관리 페이지 */
export function BudgetPage(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const {
    budgets,
    isLoading,
    error,
    loadBudgets,
    addBudget,
    editBudget,
    updateAmount,
    removeBudget,
    clearError,
  } = useBudgetStore();
  const { accounts, loadAccounts } = useAccountStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);
  const [amountTarget, setAmountTarget] = useState<Budget | null>(null);
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadBudgets(user.id);
      loadAccounts(user.id);
    }
  }, [user?.id, loadBudgets, loadAccounts]);

  function handleAdd(form: BudgetFormData): void {
    if (!user?.id) return;
    addBudget(user.id, form);
    setIsFormOpen(false);
  }

  function handleEdit(form: BudgetFormData): void {
    if (!editingBudget) return;
    editBudget(editingBudget.id, form);
    setEditingBudget(null);
  }

  function handleDelete(): void {
    if (!deletingBudget) return;
    removeBudget(deletingBudget.id);
    setDeletingBudget(null);
  }

  function handleUpdateAmount(): void {
    if (!amountTarget) return;
    const parsed = parseFloat(newAmount);
    if (isNaN(parsed) || parsed < 0) return;
    updateAmount(amountTarget.id, parsed);
    setAmountTarget(null);
    setNewAmount('');
  }

  function openAmountDialog(budget: Budget): void {
    setAmountTarget(budget);
    setNewAmount(String(budget.currentAmount));
  }

  if (isLoading && budgets.length === 0) {
    return <LoadingSpinner />;
  }

  /* 통화별 요약 */
  const summaryByCurrency = budgets.reduce<Record<string, { current: number; target: number }>>((acc, b) => {
    if (!acc[b.currency]) acc[b.currency] = { current: 0, target: 0 };
    acc[b.currency].current += b.currentAmount;
    acc[b.currency].target += b.targetAmount;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl space-y-4">
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
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">예산</h1>
        <div className="flex gap-2">
          {budgets.length > 0 && (
            <Button
              type="button"
              onClick={() => exportBudgets(budgets)}
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl border-vault-color/30 bg-none text-vault-color hover:bg-vault-color/10 dark:text-vault-color"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
              내보내기
            </Button>
          )}
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
      </div>

      {/* 통화별 요약 */}
      {Object.keys(summaryByCurrency).length > 0 && (
        <div className="flex flex-wrap gap-3">
          {Object.entries(summaryByCurrency).map(([cur, { current, target }]) => (
            <div
              key={cur}
              className="rounded-xl bg-white/80 px-4 py-2 text-sm backdrop-blur dark:bg-white/5"
            >
              <span className="text-navy/50 dark:text-gray-400">총 진행: </span>
              <span className="font-semibold text-navy dark:text-gray-100">
                {formatCurrency(current, cur)}
              </span>
              <span className="text-navy/30 dark:text-gray-500"> / {formatCurrency(target, cur)}</span>
            </div>
          ))}
        </div>
      )}

      {/* 목록 */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={<IconChart className="h-8 w-8" />}
          title="예산이 없습니다"
          description="새로 추가해보세요"
          actionLabel="추가"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid gap-4 tablet:grid-cols-2">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={setEditingBudget}
              onDelete={setDeletingBudget}
              onUpdateAmount={openAmountDialog}
            />
          ))}
        </div>
      )}

      {/* 생성 모달 */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="예산 추가">
        <BudgetForm
          accounts={accounts}
          onSubmit={handleAdd}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal isOpen={editingBudget !== null} onClose={() => setEditingBudget(null)} title="예산 수정">
        {editingBudget && (
          <BudgetForm
            initialData={{
              name: editingBudget.name,
              targetAmount: editingBudget.targetAmount,
              currency: editingBudget.currency,
              budgetType: editingBudget.budgetType,
              linkedAccountId: editingBudget.linkedAccountId,
            }}
            accounts={accounts}
            onSubmit={handleEdit}
            onCancel={() => setEditingBudget(null)}
          />
        )}
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingBudget !== null}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleDelete}
        title="예산 삭제"
        message={`"${deletingBudget?.name}"을(를) 삭제하시겠습니까?`}
        confirmText="삭제"
        isDangerous
      />

      {/* 금액 수정 모달 */}
      <Modal
        isOpen={amountTarget !== null}
        onClose={() => setAmountTarget(null)}
        title={`${amountTarget?.name ?? ''} 금액 수정`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="budget-amount" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
              현재 금액
            </label>
            <input
              id="budget-amount"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="any"
              className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
              autoFocus
            />
          </div>
          {amountTarget && (
            <p className="text-xs text-navy/40 dark:text-gray-500">
              목표: {formatCurrency(amountTarget.targetAmount, amountTarget.currency)}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => setAmountTarget(null)}
              variant="ghost"
              size="sm"
              className="rounded-xl text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleUpdateAmount}
              disabled={!newAmount || parseFloat(newAmount) < 0}
              size="sm"
              className="rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
