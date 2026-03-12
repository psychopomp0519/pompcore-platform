/**
 * @file SummaryGrid.tsx
 * @description 부동산 상세 페이지 요약 카드 그리드
 * @module components/realEstate/SummaryGrid
 */

import { memo, type ReactNode } from 'react';
import type { RealEstate, RealEstateLease, RealEstateSummary } from '../../types/realEstate.types';
import { SummaryCard } from './SummaryCard';

// ============================================================
// 타입
// ============================================================

export interface SummaryGridProps {
  /** 부동산 물건 데이터 */
  property: RealEstate;
  /** 수익률 요약 */
  summary: RealEstateSummary;
  /** 자본 수익률 (소유자 전용, null이면 미표시) */
  capitalGainRate: number | null;
  /** 활성 계약 (만료일 표시용) */
  activeLease: RealEstateLease | null;
}

// ============================================================
// 헬퍼
// ============================================================

/** 금액을 로케일 포맷 문자열로 변환 */
function formatPrice(amount: number | null, currency: string): string {
  if (amount == null) return '-';
  return `${amount.toLocaleString('ko-KR')} ${currency}`;
}

/** 계약 만료 D-day 표시 문자열 */
function formatDDay(days: number): string {
  if (days === 0) return '오늘 만료';
  if (days < 0) return `${Math.abs(days)}일 초과`;
  return `D-${days}`;
}

// ============================================================
// SummaryGrid
// ============================================================

/** 부동산 요약 카드 그리드 — 현재가, 취득가, 수익률, 만료일 등 */
function SummaryGridInner({
  property,
  summary,
  capitalGainRate,
  activeLease,
}: SummaryGridProps): ReactNode {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <SummaryCard
        label="현재가"
        value={formatPrice(property.currentValue, property.currency)}
      />
      <SummaryCard
        label={property.role === 'owner' ? '취득가' : '보증금'}
        value={formatPrice(property.acquisitionPrice, property.currency)}
      />
      {property.role === 'owner' && capitalGainRate != null && (
        <SummaryCard
          label="자본 수익률"
          value={`${capitalGainRate >= 0 ? '+' : ''}${capitalGainRate.toFixed(2)}%`}
          highlight={capitalGainRate > 0}
        />
      )}
      {summary.annualRentalYield != null && (
        <SummaryCard
          label="임대 수익률"
          value={`${summary.annualRentalYield.toFixed(2)}%`}
          sub="연 순수익률"
          highlight
        />
      )}
      {summary.jeonseYield != null && (
        <SummaryCard
          label="전세 수익률"
          value={`${summary.jeonseYield.toFixed(2)}%`}
          sub="보증금 / 현재가"
          highlight
        />
      )}
      {summary.daysUntilLeaseEnd != null && (
        <SummaryCard
          label="계약 만료"
          value={formatDDay(summary.daysUntilLeaseEnd)}
          sub={activeLease?.endDate ?? undefined}
          highlight={summary.daysUntilLeaseEnd >= 0 && summary.daysUntilLeaseEnd <= 30}
        />
      )}
    </div>
  );
}

export const SummaryGrid = memo(SummaryGridInner);
