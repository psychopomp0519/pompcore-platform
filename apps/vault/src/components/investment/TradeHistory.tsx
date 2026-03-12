/**
 * @file TradeHistory.tsx
 * @description 거래 기록 목록 컴포넌트
 * @module components/investment/TradeHistory
 */

import { memo, type ReactNode } from 'react';
import type { InvestmentTrade } from '../../types/investment.types';
import type { TradeType } from '../../types/database.types';
import { formatDisplayDate } from '../../utils/date';

// ============================================================
// 타입
// ============================================================

interface TradeHistoryProps {
  trades: InvestmentTrade[];
  onDelete: (tradeId: string) => void;
}

// ============================================================
// 상수
// ============================================================

/** 거래 유형 한국어 레이블 */
const TRADE_TYPE_LABEL: Record<TradeType, string> = {
  buy: '매수',
  sell: '매도',
  dividend: '배당',
};

/** 거래 유형 배지 색상 */
const TRADE_TYPE_COLOR: Record<TradeType, string> = {
  buy: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  sell: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300',
  dividend: 'bg-vault-color/10 text-vault-color dark:bg-vault-color/20 dark:text-green-300',
};

// ============================================================
// TradeHistory
// ============================================================

/** 거래 기록 목록 */
function TradeHistoryInner({ trades, onDelete }: TradeHistoryProps): ReactNode {
  if (trades.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-navy/40 dark:text-gray-500">
        거래 기록이 없습니다
      </div>
    );
  }

  return (
    <ul className="divide-y divide-navy/5 dark:divide-white/5">
      {trades.map((trade) => (
        <TradeItem key={trade.id} trade={trade} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export const TradeHistory = memo(TradeHistoryInner);

// ============================================================
// TradeItem
// ============================================================

interface TradeItemProps {
  trade: InvestmentTrade;
  onDelete: (tradeId: string) => void;
}

/** 개별 거래 항목 */
function TradeItem({ trade, onDelete }: TradeItemProps): ReactNode {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      {/* 날짜 + 배지 */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 text-xs text-navy/50 dark:text-gray-500">
          {formatDisplayDate(trade.tradeDate)}
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${TRADE_TYPE_COLOR[trade.tradeType]}`}>
          {TRADE_TYPE_LABEL[trade.tradeType]}
        </span>
        <div className="min-w-0">
          <span className="font-mono text-sm font-semibold text-navy dark:text-gray-100">
            {trade.ticker}
          </span>
          <span className="ml-1.5 text-xs text-navy/50 dark:text-gray-500 truncate">
            {trade.assetName}
          </span>
        </div>
      </div>

      {/* 수량 / 단가 / 수수료 */}
      <div className="shrink-0 text-right">
        <div className="tabular-nums text-sm text-navy/80 dark:text-gray-300">
          {trade.quantity.toLocaleString('ko-KR')}주
          &nbsp;×&nbsp;
          {trade.price.toLocaleString('ko-KR')}
          <span className="ml-1 text-xs text-navy/40 dark:text-gray-500">{trade.currency}</span>
        </div>
        {trade.fee > 0 && (
          <div className="tabular-nums text-xs text-navy/40 dark:text-gray-500">
            수수료 {trade.fee.toLocaleString('ko-KR')}
          </div>
        )}
      </div>

      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={() => onDelete(trade.id)}
        className="shrink-0 rounded-lg p-1.5 text-navy/30 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        aria-label="거래 삭제"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  );
}
