/**
 * @file LeaseCard.tsx
 * @description 임대·임차 계약 카드 컴포넌트
 * @module components/realEstate/LeaseCard
 */

import type { ReactNode } from 'react';
import type { RealEstateLease } from '../../types/realEstate.types';
import { getDaysUntilLeaseEnd, formatLeaseEndLabel } from '../../utils/realEstateCalculator';

// ============================================================
// 상수
// ============================================================

const LEASE_TYPE_LABEL: Record<string, string> = {
  jeonse: '전세',
  monthly: '월세',
  commercial: '상가임대',
};

// ============================================================
// 타입
// ============================================================

interface LeaseCardProps {
  lease: RealEstateLease;
  onClose: (leaseId: string) => void;
}

// ============================================================
// 헬퍼
// ============================================================

function formatAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString('ko-KR')} ${currency}`;
}

// ============================================================
// LeaseCard
// ============================================================

/** 임대·임차 계약 카드 */
export function LeaseCard({ lease, onClose }: LeaseCardProps): ReactNode {
  const days = lease.endDate ? getDaysUntilLeaseEnd(lease.endDate) : null;
  const isUrgent = days != null && days >= 0 && days <= 30;
  const isExpired = days != null && days < 0;

  const dDayColorClass = isExpired
    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    : isUrgent
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      : 'bg-vault-color/10 text-vault-color dark:bg-vault-color/20';

  return (
    <div className="rounded-2xl border border-navy/8 bg-white/60 p-4 backdrop-blur dark:border-white/8 dark:bg-navy/40">
      {/* 상단 배지 행 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-vault-color/10 px-2.5 py-0.5 text-xs font-semibold text-vault-color dark:bg-vault-color/20">
          {LEASE_TYPE_LABEL[lease.leaseType] ?? lease.leaseType}
        </span>

        {lease.isActive ? (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
            진행 중
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            종료
          </span>
        )}

        {days != null && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${dDayColorClass}`}>
            {formatLeaseEndLabel(days)}
          </span>
        )}
      </div>

      {/* 상대방 */}
      {lease.counterpartName && (
        <p className="mb-2 text-sm font-medium text-navy dark:text-gray-100">
          상대방: {lease.counterpartName}
        </p>
      )}

      {/* 금액 정보 */}
      <div className="mb-2 space-y-1">
        <p className="text-sm text-navy/80 dark:text-gray-300">
          보증금: <span className="tabular-nums font-semibold">{formatAmount(lease.deposit, 'KRW')}</span>
        </p>
        {lease.monthlyRent > 0 && (
          <p className="text-sm text-navy/80 dark:text-gray-300">
            월세: <span className="tabular-nums font-semibold">{formatAmount(lease.monthlyRent, 'KRW')}</span>
          </p>
        )}
      </div>

      {/* 계약 기간 */}
      <p className="mb-3 text-xs text-navy/50 dark:text-gray-500">
        {lease.startDate}
        {lease.endDate ? ` ~ ${lease.endDate}` : ' ~ 기간 미정'}
      </p>

      {/* 메모 */}
      {lease.memo && (
        <p className="mb-3 text-xs text-navy/60 dark:text-gray-400">{lease.memo}</p>
      )}

      {/* 계약 종료 버튼 (활성 계약만) */}
      {lease.isActive && (
        <button
          type="button"
          onClick={() => onClose(lease.id)}
          className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          계약 종료
        </button>
      )}
    </div>
  );
}
