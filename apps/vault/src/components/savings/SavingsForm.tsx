/**
 * @file SavingsForm.tsx
 * @description 예/적금 생성/수정 폼 컴포넌트
 * @module components/savings/SavingsForm
 */

import { useState, memo, type ReactNode, type FormEvent } from 'react';
import { Button } from '@pompcore/ui';
import type { SavingsFormData } from '../../types/savings.types';
import { SAVINGS_TYPE_LABELS, SAVINGS_TYPES } from '../../types/savings.types';
import type { SavingsType } from '../../types/database.types';
import type { Account } from '../../types/account.types';
import { getToday } from '../../utils/date';

// ============================================================
// 타입
// ============================================================

interface SavingsFormProps {
  initialData?: Partial<SavingsFormData>;
  accounts: Account[];
  fixedType?: SavingsType;
  onSubmit: (data: SavingsFormData) => void;
  onCancel: () => void;
}

// ============================================================
// SavingsForm
// ============================================================

/** 예/적금 생성/수정 폼 */
function SavingsFormInner({
  initialData,
  accounts,
  fixedType,
  onSubmit,
  onCancel,
}: SavingsFormProps): ReactNode {
  const [savingsType, setSavingsType] = useState<SavingsType>(fixedType ?? initialData?.savingsType ?? 'fixed_deposit');
  const [name, setName] = useState(initialData?.name ?? '');
  const [linkedAccountId, setLinkedAccountId] = useState(initialData?.linkedAccountId ?? '');
  const [startDate, setStartDate] = useState(initialData?.startDate ?? getToday());
  const [durationMonths, setDurationMonths] = useState(String(initialData?.durationMonths ?? 12));
  const [interestRate, setInterestRate] = useState(String(initialData?.interestRate ?? ''));
  const [principal, setPrincipal] = useState(String(initialData?.principal ?? ''));
  const [installmentAmount, setInstallmentAmount] = useState(
    initialData?.installmentAmount ? String(initialData.installmentAmount) : '',
  );
  const [isTaxFree, setIsTaxFree] = useState(initialData?.isTaxFree ?? false);

  const isEditing = initialData?.name !== undefined;
  const needsInstallment = savingsType === 'installment' || savingsType === 'housing_subscription';

  /* 즐겨찾기 통장 우선 정렬 */
  const sortedAccounts = [...accounts].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    const parsedRate = parseFloat(interestRate);
    const parsedPrincipal = parseFloat(principal);
    const parsedDuration = parseInt(durationMonths, 10);

    if (!name.trim() || isNaN(parsedRate)) return;

    onSubmit({
      name: name.trim(),
      savingsType,
      linkedAccountId: linkedAccountId || null,
      startDate,
      durationMonths: isNaN(parsedDuration) ? null : parsedDuration,
      interestRate: parsedRate,
      principal: isNaN(parsedPrincipal) ? 0 : parsedPrincipal,
      installmentAmount: needsInstallment ? (parseFloat(installmentAmount) || null) : null,
      isTaxFree,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 타입 */}
      {!fixedType && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">유형</label>
          <div className="grid grid-cols-2 gap-2">
            {SAVINGS_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSavingsType(type)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  savingsType === type
                    ? 'bg-vault-color text-white'
                    : 'bg-navy/5 text-navy/60 dark:bg-white/5 dark:text-gray-400'
                }`}
              >
                {SAVINGS_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 이름 */}
      <div>
        <label htmlFor="sav-name" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">이름</label>
        <input
          id="sav-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예/적금 이름"
          maxLength={50}
          className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          autoFocus
        />
      </div>

      {/* 이자율 + 기간 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="sav-rate" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">연이율 (%)</label>
          <input
            id="sav-rate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="3.5"
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label htmlFor="sav-duration" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">기간 (개월)</label>
          <input
            id="sav-duration"
            type="number"
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            placeholder="12"
            min="1"
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* 원금 (예금) / 월 납입액 (적금/청약) */}
      {savingsType === 'fixed_deposit' && (
        <div>
          <label htmlFor="sav-principal" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">원금</label>
          <input
            id="sav-principal"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="0"
            min="0"
            max="9999999999"
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      )}

      {needsInstallment && (
        <div>
          <label htmlFor="sav-installment" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">월 납입액</label>
          <input
            id="sav-installment"
            type="number"
            value={installmentAmount}
            onChange={(e) => setInstallmentAmount(e.target.value)}
            placeholder="0"
            min="0"
            max="9999999999"
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      )}

      {/* 시작일 */}
      <div>
        <label htmlFor="sav-start" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">시작일</label>
        <input
          id="sav-start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
        />
      </div>

      {/* 연결 통장 */}
      <div>
        <label htmlFor="sav-account" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">연결 통장 (선택)</label>
        <select
          id="sav-account"
          value={linkedAccountId}
          onChange={(e) => setLinkedAccountId(e.target.value)}
          className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
        >
          <option value="">선택 안 함</option>
          {sortedAccounts.map((acc) => (
            <option key={acc.id} value={acc.id}>{acc.isFavorite ? '★ ' : ''}{acc.name}</option>
          ))}
        </select>
      </div>

      {/* 비과세 */}
      <label className="flex items-center gap-2 text-sm text-navy/70 dark:text-gray-300">
        <input
          type="checkbox"
          checked={isTaxFree}
          onChange={(e) => setIsTaxFree(e.target.checked)}
          className="rounded border-navy/20 text-vault-color focus:ring-vault-color dark:border-white/20"
        />
        비과세
      </label>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="rounded-xl text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={!name.trim() || !interestRate}
          size="sm"
          className="rounded-xl bg-none bg-vault-color text-sm font-semibold text-white shadow-none hover:bg-vault-color/90"
        >
          {isEditing ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
}

export const SavingsForm = memo(SavingsFormInner);
