/**
 * @file AccountsPage.tsx
 * @description 통장 관리 페이지
 * @module pages/AccountsPage
 */

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useAccountStore } from '../stores/accountStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useExchangeRates } from '../hooks/useExchangeRates';
import type { Account, AccountFormData, TransferFormData } from '../types/account.types';
import { Modal, ConfirmDialog, LoadingSpinner, EmptyState, Button } from '@pompcore/ui';
import { AccountCard } from '../components/accounts/AccountCard';
import { AccountForm } from '../components/accounts/AccountForm';
import { TransferDialog } from '../components/accounts/TransferDialog';
import { BalanceEditDialog } from '../components/accounts/BalanceEditDialog';
import { formatCurrency } from '../utils/currency';
import { IconBank } from '@pompcore/ui';
import { exportAccounts } from '../utils/exportHelpers';

// ============================================================
// AccountsPage
// ============================================================

/** 통장 관리 페이지 */
export function AccountsPage(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const { settings } = useSettingsStore();
  const primaryCurrency = settings?.primaryCurrency ?? 'KRW';
  const { convert, isLoading: ratesLoading } = useExchangeRates(primaryCurrency);
  const {
    accounts,
    isLoading,
    error,
    loadAccounts,
    addAccount,
    editAccount,
    removeAccount,
    toggleFavorite,
    updateBalance,
    transfer,
    clearError,
  } = useAccountStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [balanceEdit, setBalanceEdit] = useState<{
    accountId: string;
    accountName: string;
    currency: string;
    currentBalance: number;
  } | null>(null);

  /* 통장 로드 */
  useEffect(() => {
    if (user?.id) {
      loadAccounts(user.id);
    }
  }, [user?.id, loadAccounts]);

  /* 정렬: 즐겨찾기 우선 */
  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return a.sortOrder - b.sortOrder;
    });
  }, [accounts]);

  /* 통화별 총 잔액 */
  const totalByCurrency = useMemo(() => {
    const totals = new Map<string, number>();
    for (const account of accounts) {
      for (const bal of account.balances) {
        totals.set(bal.currency, (totals.get(bal.currency) ?? 0) + bal.balance);
      }
    }
    return Array.from(totals.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [accounts]);

  /* 핸들러 */
  function handleAdd(form: AccountFormData): void {
    if (!user?.id) return;
    addAccount(user.id, form);
    setIsFormOpen(false);
  }

  function handleEdit(form: AccountFormData): void {
    if (!editingAccount) return;
    editAccount(editingAccount.id, form);
    setEditingAccount(null);
  }

  function handleDelete(): void {
    if (!deletingAccount) return;
    removeAccount(deletingAccount.id);
    setDeletingAccount(null);
  }

  function handleTransfer(form: TransferFormData): void {
    if (!user?.id) return;
    transfer(user.id, form);
    setIsTransferOpen(false);
  }

  function handleBalanceClick(accountId: string, currency: string): void {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return;
    const bal = account.balances.find((b) => b.currency === currency);
    setBalanceEdit({
      accountId,
      accountName: account.name,
      currency,
      currentBalance: bal?.balance ?? 0,
    });
  }

  function handleBalanceUpdate(newBalance: number): void {
    if (!balanceEdit) return;
    updateBalance(balanceEdit.accountId, balanceEdit.currency, newBalance);
    setBalanceEdit(null);
  }

  if (isLoading || ratesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
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
        <div>
          <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">통장</h1>
          {totalByCurrency.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
              {totalByCurrency.map(([currency, total]) => (
                <span key={currency} className="text-sm text-navy/60 dark:text-gray-400">
                  총 {formatCurrency(total, currency)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {accounts.length > 0 && (
            <Button
              type="button"
              onClick={() => exportAccounts(accounts)}
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
          {accounts.length >= 2 && (
            <Button
              type="button"
              onClick={() => setIsTransferOpen(true)}
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl border-vault-color/30 bg-none text-vault-color hover:bg-vault-color/10 dark:text-vault-color"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              이체
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
            통장 추가
          </Button>
        </div>
      </div>

      {/* 통장 목록 */}
      {sortedAccounts.length === 0 ? (
        <EmptyState
          icon={<IconBank className="h-8 w-8" />}
          title="등록된 통장이 없습니다"
          description="통장을 추가하여 자산을 관리해보세요"
          actionLabel="통장 추가"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid gap-4 tablet:grid-cols-2">
          {sortedAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={setEditingAccount}
              onDelete={setDeletingAccount}
              onToggleFavorite={toggleFavorite}
              onUpdateBalance={handleBalanceClick}
              primaryCurrency={primaryCurrency}
              convert={convert}
            />
          ))}
        </div>
      )}

      {/* 생성 모달 */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="통장 추가">
        <AccountForm onSubmit={handleAdd} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* 수정 모달 */}
      <Modal isOpen={editingAccount !== null} onClose={() => setEditingAccount(null)} title="통장 수정">
        {editingAccount && (
          <AccountForm
            initialData={{
              name: editingAccount.name,
              defaultCurrency: editingAccount.defaultCurrency,
              supportedCurrencies: editingAccount.supportedCurrencies,
              isFavorite: editingAccount.isFavorite,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditingAccount(null)}
          />
        )}
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingAccount !== null}
        onClose={() => setDeletingAccount(null)}
        onConfirm={handleDelete}
        title="통장 삭제"
        message={`"${deletingAccount?.name}" 통장을 삭제하시겠습니까? 휴지통에서 복원할 수 있습니다.`}
        confirmText="삭제"
        isDangerous
      />

      {/* 이체 다이얼로그 */}
      <TransferDialog
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSubmit={handleTransfer}
        accounts={accounts}
      />

      {/* 잔액 수정 다이얼로그 */}
      {balanceEdit && (
        <BalanceEditDialog
          isOpen
          onClose={() => setBalanceEdit(null)}
          onSubmit={handleBalanceUpdate}
          accountName={balanceEdit.accountName}
          currency={balanceEdit.currency}
          currentBalance={balanceEdit.currentBalance}
        />
      )}
    </div>
  );
}
