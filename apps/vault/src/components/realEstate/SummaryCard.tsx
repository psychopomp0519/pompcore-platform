/**
 * @file SummaryCard.tsx
 * @description 부동산 상세 페이지 요약 카드 컴포넌트
 * @module components/realEstate/SummaryCard
 */

import { memo, type ReactNode } from 'react';

// ============================================================
// 타입
// ============================================================

export interface SummaryCardProps {
  /** 카드 라벨 */
  label: string;
  /** 표시 값 */
  value: string;
  /** 부가 설명 텍스트 */
  sub?: string;
  /** 강조 표시 여부 */
  highlight?: boolean;
}

// ============================================================
// SummaryCard
// ============================================================

/** 부동산 요약 정보를 보여주는 단일 카드 */
function SummaryCardInner({ label, value, sub, highlight }: SummaryCardProps): ReactNode {
  return (
    <div className="rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-navy/40">
      <p className="mb-1 text-xs font-semibold text-navy/60 dark:text-gray-400">{label}</p>
      <p className={`tabular-nums text-lg font-bold ${highlight ? 'text-vault-color' : 'text-navy dark:text-gray-100'}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-navy/50 dark:text-gray-500">{sub}</p>}
    </div>
  );
}

export const SummaryCard = memo(SummaryCardInner);
