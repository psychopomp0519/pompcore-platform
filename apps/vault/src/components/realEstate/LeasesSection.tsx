/**
 * @file LeasesSection.tsx
 * @description 부동산 상세 페이지 계약 섹션 (활성 + 종료된 계약 목록)
 * @module components/realEstate/LeasesSection
 */

import { memo, type ReactNode } from 'react';
import type { RealEstateLease } from '../../types/realEstate.types';
import { LeaseCard } from './LeaseCard';

// ============================================================
// 타입
// ============================================================

export interface LeasesSectionProps {
  /** 현재 활성 계약 (없으면 null) */
  activeLease: RealEstateLease | null;
  /** 종료된 계약 목록 */
  inactiveLeases: RealEstateLease[];
  /** 계약 추가 버튼 클릭 핸들러 */
  onAddLease: () => void;
  /** 계약 종료 핸들러 */
  onCloseLease: (leaseId: string) => void;
}

// ============================================================
// LeasesSection
// ============================================================

/** 계약 섹션 — 활성 계약 + 종료된 계약 목록 + 추가 버튼 */
function LeasesSectionInner({
  activeLease,
  inactiveLeases,
  onAddLease,
  onCloseLease,
}: LeasesSectionProps): ReactNode {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-navy dark:text-gray-100">계약</h2>
        <button
          type="button"
          onClick={onAddLease}
          className="flex items-center gap-1 rounded-xl bg-vault-color/10 px-3 py-1.5 text-sm font-semibold text-vault-color hover:bg-vault-color/20 dark:bg-vault-color/20 dark:hover:bg-vault-color/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          계약 추가
        </button>
      </div>

      {/* 활성 계약 */}
      {activeLease ? (
        <div className="mb-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy/50 dark:text-gray-500">
            활성 계약
          </p>
          <LeaseCard lease={activeLease} onClose={onCloseLease} />
        </div>
      ) : (
        <p className="mb-3 text-sm text-navy/50 dark:text-gray-500">활성 계약이 없습니다.</p>
      )}

      {/* 종료된 계약 */}
      {inactiveLeases.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy/50 dark:text-gray-500">
            종료된 계약
          </p>
          <div className="space-y-2">
            {inactiveLeases.map((lease) => (
              <LeaseCard key={lease.id} lease={lease} onClose={onCloseLease} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export const LeasesSection = memo(LeasesSectionInner);
