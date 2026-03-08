/**
 * @file SavingsCard.tsx
 * @description 예/적금 카드 컴포넌트
 * @module components/savings/SavingsCard
 */

import type { ReactNode } from 'react';
import type { Savings } from '../../types/savings.types';
import { SAVINGS_TYPE_LABELS } from '../../types/savings.types';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency } from '../../utils/currency';
import { IconBank } from '../icons/NavIcons';
import { IconCoin, IconPiggyBank, IconHouse } from '../icons/UIIcons';
import {
  calculateFixedDepositInterest,
  calculateInstallmentInterest,
  calculateFreeSavingsInterest,
  calculateMaturityDate,
  getDaysUntilMaturity,
} from '../../utils/interestCalculator';

// ============================================================
// 타입
// ============================================================

interface SavingsCardProps {
  savings: Savings;
  currency: string;
  onEdit: (savings: Savings) => void;
  onDelete: (savings: Savings) => void;
  onAddDeposit?: (savings: Savings) => void;
}

// ============================================================
// 아이콘 매핑
// ============================================================

const TYPE_ICONS: Record<string, (props: { className?: string }) => ReactNode> = {
  fixed_deposit: IconBank,
  installment: IconCoin,
  free_savings: IconPiggyBank,
  housing_subscription: IconHouse,
};

// ============================================================
// SavingsCard
// ============================================================

/** 예/적금 카드 */
export function SavingsCard({
  savings,
  currency,
  onEdit,
  onDelete,
  onAddDeposit,
}: SavingsCardProps): ReactNode {
  const maturityDate = savings.durationMonths
    ? calculateMaturityDate(savings.startDate, savings.durationMonths)
    : null;
  const daysUntil = maturityDate ? getDaysUntilMaturity(maturityDate) : null;

  /* 이자 계산 */
  const interestInfo = getInterestInfo(savings, maturityDate);

  return (
    <GlassCard hoverable padding="md">
      {/* 헤더 */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {(() => { const TypeIcon = TYPE_ICONS[savings.savingsType]; return TypeIcon ? <TypeIcon className="h-5 w-5" /> : null; })()}
          <div>
            <h3 className="text-sm font-bold text-navy dark:text-gray-100">{savings.name}</h3>
            <span className="text-xs text-navy/40 dark:text-gray-500">
              {SAVINGS_TYPE_LABELS[savings.savingsType]}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {savings.savingsType === 'free_savings' && onAddDeposit && (
            <button
              type="button"
              onClick={() => onAddDeposit(savings)}
              className="rounded-lg px-2 py-1 text-xs text-vault-color transition-colors hover:bg-vault-color/10"
            >
              납입
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(savings)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:text-navy/60 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(savings)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 정보 그리드 */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <InfoRow label="이자율" value={`${savings.interestRate}%`} />
        <InfoRow label="원금" value={formatCurrency(savings.principal, currency)} />
        {maturityDate && (
          <>
            <InfoRow label="만기일" value={maturityDate.replace(/-/g, '.')} />
            <InfoRow
              label="남은 기간"
              value={daysUntil !== null && daysUntil > 0 ? `${daysUntil}일` : '만기'}
              highlight={daysUntil !== null && daysUntil <= 30}
            />
          </>
        )}
        {interestInfo && (
          <>
            <InfoRow label="예상 이자" value={formatCurrency(interestInfo.netInterest, currency)} />
            <InfoRow
              label="만기 수령액"
              value={formatCurrency(interestInfo.totalAmount, currency)}
              bold
            />
          </>
        )}
        {savings.isTaxFree && (
          <div className="col-span-2">
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/20 dark:text-green-400">
              비과세
            </span>
          </div>
        )}
      </div>

      {/* 자유적금 납입 내역 (최근 3건) */}
      {savings.savingsType === 'free_savings' && savings.deposits.length > 0 && (
        <div className="mt-2 border-t border-navy/5 pt-2 dark:border-white/5">
          <div className="mb-1 text-xs font-medium text-navy/40 dark:text-gray-500">
            최근 납입 ({savings.deposits.length}건)
          </div>
          {savings.deposits.slice(-3).reverse().map((dep) => (
            <div key={dep.id} className="flex justify-between text-xs text-navy/60 dark:text-gray-400">
              <span>{dep.depositDate.replace(/-/g, '.')}</span>
              <span>{formatCurrency(dep.amount, currency)}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

// ============================================================
// 내부 컴포넌트
// ============================================================

function InfoRow({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}): ReactNode {
  return (
    <div>
      <div className="text-navy/40 dark:text-gray-500">{label}</div>
      <div className={`${bold ? 'font-semibold' : ''} ${highlight ? 'text-amber-600 dark:text-amber-400' : 'text-navy dark:text-gray-200'}`}>
        {value}
      </div>
    </div>
  );
}

// ============================================================
// 이자 계산 헬퍼
// ============================================================

function getInterestInfo(
  savings: Savings,
  maturityDate: string | null,
): { netInterest: number; totalAmount: number } | null {
  if (!savings.durationMonths) return null;

  switch (savings.savingsType) {
    case 'fixed_deposit':
      return calculateFixedDepositInterest(
        savings.principal,
        savings.interestRate,
        savings.durationMonths,
        savings.isTaxFree,
      );

    case 'installment':
    case 'housing_subscription':
      if (!savings.installmentAmount) return null;
      return calculateInstallmentInterest(
        savings.installmentAmount,
        savings.interestRate,
        savings.durationMonths,
        savings.isTaxFree,
      );

    case 'free_savings':
      if (!maturityDate) return null;
      return calculateFreeSavingsInterest(
        savings.deposits.map((d) => ({ amount: d.amount, date: d.depositDate })),
        savings.interestRate,
        maturityDate,
        savings.isTaxFree,
      );

    default:
      return null;
  }
}
