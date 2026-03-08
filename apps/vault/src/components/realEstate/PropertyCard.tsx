/**
 * @file PropertyCard.tsx
 * @description 부동산 물건 카드 컴포넌트
 * @module components/realEstate/PropertyCard
 */

import type { ReactNode } from 'react';
import type { RealEstate, RealEstateLease, RealEstateSummary } from '../../types/realEstate.types';
import { formatLeaseEndLabel } from '../../utils/realEstateCalculator';

// ============================================================
// 상수 — 레이블 맵
// ============================================================

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  apartment: '아파트',
  house: '단독주택',
  villa: '빌라',
  commercial: '상가',
  land: '토지',
  other: '기타',
};

const ROLE_LABEL: Record<string, string> = {
  owner: '소유',
  tenant: '임차',
};

const LEASE_TYPE_LABEL: Record<string, string> = {
  jeonse: '전세',
  monthly: '월세',
  commercial: '상가임대',
};

// ============================================================
// 타입
// ============================================================

interface PropertyCardProps {
  property: RealEstate;
  activeLease: RealEstateLease | null;
  summary: RealEstateSummary;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// ============================================================
// 서브 컴포넌트 — D-day 배지
// ============================================================

function DayBadge({ days }: { days: number }): ReactNode {
  const isUrgent = days >= 0 && days <= 30;
  const isExpired = days < 0;
  const label = formatLeaseEndLabel(days);

  const colorClass = isExpired
    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    : isUrgent
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      : 'bg-vault-color/10 text-vault-color dark:bg-vault-color/20';

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${colorClass}`}>
      {label}
    </span>
  );
}

// ============================================================
// PropertyCard
// ============================================================

/** 부동산 물건 카드 */
export function PropertyCard({
  property,
  activeLease,
  summary,
  onClick,
  onEdit,
  onDelete,
}: PropertyCardProps): ReactNode {
  const currentValueLabel = property.currentValue != null
    ? `${property.currentValue.toLocaleString('ko-KR')} ${property.currency}`
    : '가격 미입력';

  const handleEdit = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group relative cursor-pointer rounded-2xl bg-white/60 p-5 shadow-glass backdrop-blur transition-shadow hover:shadow-glass-lg dark:bg-navy/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
    >
      {/* 헤더 */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* 물건 유형 배지 */}
          <span className="rounded-full bg-vault-color/10 px-2.5 py-0.5 text-xs font-semibold text-vault-color dark:bg-vault-color/20">
            {PROPERTY_TYPE_LABEL[property.propertyType] ?? property.propertyType}
          </span>
          {/* 역할 배지 */}
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
            {ROLE_LABEL[property.role] ?? property.role}
          </span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-lg p-1.5 text-navy/50 hover:bg-navy/5 hover:text-navy dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
            aria-label="편집"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg p-1.5 text-navy/50 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
            aria-label="삭제"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 물건명 */}
      <h3 className="mb-1 font-display text-base font-bold text-navy dark:text-gray-100">
        {property.name}
      </h3>

      {/* 주소 */}
      {property.address && (
        <p className="mb-3 truncate text-sm text-navy/60 dark:text-gray-400">
          {property.address}
        </p>
      )}

      {/* 현재가 */}
      <p className="mb-3 text-lg font-bold tabular-nums text-navy dark:text-gray-100">
        {currentValueLabel}
      </p>

      {/* 계약 정보 */}
      {activeLease ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-navy/60 dark:text-gray-400">
            {LEASE_TYPE_LABEL[activeLease.leaseType] ?? activeLease.leaseType}
          </span>
          {summary.daysUntilLeaseEnd != null && (
            <DayBadge days={summary.daysUntilLeaseEnd} />
          )}
        </div>
      ) : (
        <span className="text-xs text-navy/40 dark:text-gray-500">계약 없음</span>
      )}
    </div>
  );
}
