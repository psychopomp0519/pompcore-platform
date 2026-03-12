/**
 * @file PortfolioCard.tsx
 * @description 포트폴리오 카드 컴포넌트 (목록 표시용)
 * @module components/investment/PortfolioCard
 */

import { memo, type ReactNode } from 'react';
import type { Portfolio, PortfolioSummary } from '../../types/investment.types';
import type { AssetType } from '../../types/database.types';
import { GlassCard } from '../common/GlassCard';
import { formatReturnRate, pnlColorClass } from '../../utils/investmentCalculator';

// ============================================================
// 타입
// ============================================================

interface PortfolioCardProps {
  portfolio: Portfolio;
  summary: PortfolioSummary | null;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// ============================================================
// 상수
// ============================================================

/** 자산 유형 한국어 레이블 */
const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  stock_kr: '국내주식',
  stock_us: '해외주식',
  crypto: '암호화폐',
  mixed: '혼합',
};

/** 자산 유형 배지 색상 */
const ASSET_TYPE_COLOR: Record<AssetType, string> = {
  stock_kr: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  stock_us: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  crypto: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  mixed: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300',
};

// ============================================================
// PortfolioCard
// ============================================================

/** 포트폴리오 목록 카드 */
function PortfolioCardInner({
  portfolio,
  summary,
  onClick,
  onEdit,
  onDelete,
}: PortfolioCardProps): ReactNode {
  const returnRateColor = summary ? pnlColorClass(summary.totalUnrealizedPnL) : '';

  return (
    <GlassCard hoverable className="cursor-pointer">
      {/* 카드 본문 - 클릭으로 상세 이동 */}
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color focus-visible:ring-offset-1 rounded-xl"
      >
        {/* 헤더: 이름 + 배지 */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-navy dark:text-gray-100">
              {portfolio.name}
            </h3>
            {portfolio.broker && (
              <p className="mt-0.5 truncate text-xs text-navy/50 dark:text-gray-500">
                {portfolio.broker}
              </p>
            )}
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${ASSET_TYPE_COLOR[portfolio.assetType]}`}>
            {ASSET_TYPE_LABEL[portfolio.assetType]}
          </span>
        </div>

        {/* 기준통화 */}
        <div className="mb-3 text-xs text-navy/50 dark:text-gray-500">
          기준통화: <span className="font-medium text-navy/70 dark:text-gray-400">{portfolio.baseCurrency}</span>
        </div>

        {/* 요약 정보 */}
        {summary ? (
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-navy/50 dark:text-gray-500">평가금액</div>
              <div className="tabular-nums text-lg font-bold text-navy dark:text-gray-100">
                {summary.totalMarketValue.toLocaleString('ko-KR')}
                <span className="ml-1 text-sm font-normal text-navy/50 dark:text-gray-500">
                  {summary.currency}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-navy/50 dark:text-gray-500">수익률</div>
              <div className={`tabular-nums text-sm font-semibold ${returnRateColor}`}>
                {formatReturnRate(summary.returnRate)}
              </div>
              <div className={`tabular-nums text-xs ${returnRateColor}`}>
                {summary.totalUnrealizedPnL >= 0 ? '+' : ''}
                {summary.totalUnrealizedPnL.toLocaleString('ko-KR')}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm text-navy/40 dark:text-gray-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
            클릭하여 상세 보기
          </div>
        )}
      </button>

      {/* 액션 버튼 */}
      <div className="mt-3 flex justify-end gap-1 border-t border-navy/5 pt-3 dark:border-white/5">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          수정
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          삭제
        </button>
      </div>
    </GlassCard>
  );
}

export const PortfolioCard = memo(PortfolioCardInner);
