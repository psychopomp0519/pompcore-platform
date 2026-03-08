/**
 * @file SavingsPage.tsx
 * @description 예/적금 관리 페이지
 * @module pages/SavingsPage
 */

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useSavingsStore } from '../stores/savingsStore';
import { useAccountStore } from '../stores/accountStore';
import type { Savings, SavingsFormData, DepositFormData } from '../types/savings.types';
import { SAVINGS_TYPE_LABELS, SAVINGS_TYPES } from '../types/savings.types';
import { Modal, ConfirmDialog, LoadingSpinner, EmptyState, Button } from '@pompcore/ui';
import { SavingsCard } from '../components/savings/SavingsCard';
import { SavingsForm } from '../components/savings/SavingsForm';
import { getToday } from '../utils/date';
import { IconBank } from '../components/icons/NavIcons';
import { IconCoin, IconPiggyBank, IconHouse } from '../components/icons/UIIcons';

// ============================================================
// SavingsPage
// ============================================================

/** 예/적금 관리 페이지 */
export function SavingsPage(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const {
    savingsList,
    activeTab,
    isLoading,
    error,
    loadSavings,
    setActiveTab,
    addSavings,
    editSavings,
    removeSavings,
    addDeposit,
    clearError,
  } = useSavingsStore();
  const { accounts, loadAccounts } = useAccountStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSavings, setEditingSavings] = useState<Savings | null>(null);
  const [deletingSavings, setDeletingSavings] = useState<Savings | null>(null);
  const [depositTarget, setDepositTarget] = useState<Savings | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDate, setDepositDate] = useState(getToday());

  useEffect(() => {
    if (user?.id) {
      loadSavings(user.id);
      loadAccounts(user.id);
    }
  }, [user?.id, loadSavings, loadAccounts]);

  const filteredList = useMemo(
    () => savingsList.filter((s) => s.savingsType === activeTab),
    [savingsList, activeTab],
  );

  function handleAdd(form: SavingsFormData): void {
    if (!user?.id) return;
    addSavings(user.id, form);
    setIsFormOpen(false);
  }

  function handleEdit(form: SavingsFormData): void {
    if (!editingSavings) return;
    editSavings(editingSavings.id, form);
    setEditingSavings(null);
  }

  function handleDelete(): void {
    if (!deletingSavings) return;
    removeSavings(deletingSavings.id);
    setDeletingSavings(null);
  }

  function handleDeposit(): void {
    if (!user?.id || !depositTarget) return;
    const parsed = parseFloat(depositAmount);
    if (isNaN(parsed) || parsed <= 0) return;
    const form: DepositFormData = {
      accountId: null,
      amount: parsed,
      depositDate,
    };
    addDeposit(user.id, depositTarget.id, form);
    setDepositTarget(null);
    setDepositAmount('');
    setDepositDate(getToday());
  }

  if (isLoading && savingsList.length === 0) {
    return <LoadingSpinner />;
  }

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
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">예/적금</h1>
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

      {/* 탭 */}
      <div className="flex gap-1 rounded-xl bg-navy/5 p-1 dark:bg-white/5">
        {SAVINGS_TYPES.map((type) => {
          const count = savingsList.filter((s) => s.savingsType === type).length;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setActiveTab(type)}
              className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                activeTab === type
                  ? 'bg-white text-navy shadow-sm dark:bg-white/10 dark:text-gray-100'
                  : 'text-navy/50 dark:text-gray-400'
              }`}
            >
              {SAVINGS_TYPE_LABELS[type]}
              {count > 0 && <span className="ml-1 text-navy/30 dark:text-gray-500">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* 목록 */}
      {filteredList.length === 0 ? (
        <EmptyState
          icon={activeTab === 'fixed_deposit' ? <IconBank className="h-8 w-8" /> : activeTab === 'installment' ? <IconCoin className="h-8 w-8" /> : activeTab === 'free_savings' ? <IconPiggyBank className="h-8 w-8" /> : <IconHouse className="h-8 w-8" />}
          title={`${SAVINGS_TYPE_LABELS[activeTab]}이 없습니다`}
          description="새로 추가해보세요"
          actionLabel="추가"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid gap-4 tablet:grid-cols-2">
          {filteredList.map((s) => (
            <SavingsCard
              key={s.id}
              savings={s}
              currency="KRW"
              onEdit={setEditingSavings}
              onDelete={setDeletingSavings}
              onAddDeposit={setDepositTarget}
            />
          ))}
        </div>
      )}

      {/* 생성 모달 */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="예/적금 추가">
        <SavingsForm
          accounts={accounts}
          fixedType={activeTab}
          onSubmit={handleAdd}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal isOpen={editingSavings !== null} onClose={() => setEditingSavings(null)} title="예/적금 수정">
        {editingSavings && (
          <SavingsForm
            initialData={{
              name: editingSavings.name,
              savingsType: editingSavings.savingsType,
              linkedAccountId: editingSavings.linkedAccountId,
              startDate: editingSavings.startDate,
              durationMonths: editingSavings.durationMonths,
              interestRate: editingSavings.interestRate,
              principal: editingSavings.principal,
              installmentAmount: editingSavings.installmentAmount,
              isTaxFree: editingSavings.isTaxFree,
            }}
            accounts={accounts}
            fixedType={editingSavings.savingsType}
            onSubmit={handleEdit}
            onCancel={() => setEditingSavings(null)}
          />
        )}
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingSavings !== null}
        onClose={() => setDeletingSavings(null)}
        onConfirm={handleDelete}
        title="예/적금 삭제"
        message={`"${deletingSavings?.name}"을(를) 삭제하시겠습니까?`}
        confirmText="삭제"
        isDangerous
      />

      {/* 납입 모달 (자유적금) */}
      <Modal
        isOpen={depositTarget !== null}
        onClose={() => setDepositTarget(null)}
        title={`${depositTarget?.name ?? ''} 납입`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="dep-amount" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">금액</label>
            <input
              id="dep-amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="dep-date" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">날짜</label>
            <input
              id="dep-date"
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => setDepositTarget(null)}
              variant="ghost"
              size="sm"
              className="rounded-xl text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleDeposit}
              disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              size="sm"
              className="rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
            >
              납입
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
