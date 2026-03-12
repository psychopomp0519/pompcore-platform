/**
 * @file HoldingsTable.tsx
 * @description 보유 종목 테이블 컴포넌트 (현재가 인라인 업데이트 포함)
 * @module components/investment/HoldingsTable
 */

import { useState, memo, type ReactNode } from 'react';
import type { HoldingWithPnL } from '../../types/investment.types';
import { formatReturnRate, pnlColorClass } from '../../utils/investmentCalculator';

// ============================================================
// 타입
// ============================================================

interface HoldingsTableProps {
  holdings: HoldingWithPnL[];
  currency: string;
  onUpdatePrice: (ticker: string, currentPrice: number) => void;
}

// ============================================================
// 보유 종목 행
// ============================================================

interface HoldingRowProps {
  holding: HoldingWithPnL;
  onUpdatePrice: (ticker: string, currentPrice: number) => void;
}

/** 보유 종목 행 (인라인 가격 업데이트 포함) */
function HoldingRow({ holding, onUpdatePrice }: HoldingRowProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false);
  const [priceInput, setPriceInput] = useState('');

  const colorClass = pnlColorClass(holding.unrealizedPnL);

  function handleUpdateConfirm(): void {
    const parsed = parseFloat(priceInput);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdatePrice(holding.ticker, parsed);
    }
    setIsEditing(false);
    setPriceInput('');
  }

  function handleEditOpen(): void {
    setPriceInput(String(holding.currentPrice));
    setIsEditing(true);
  }

  return (
    <tr className="border-b border-navy/5 last:border-0 dark:border-white/5">
      {/* 티커 + 종목명 */}
      <td className="py-3 pr-4">
        <div className="font-mono text-sm font-semibold text-navy dark:text-gray-100">
          {holding.ticker}
        </div>
        <div className="mt-0.5 text-xs text-navy/50 dark:text-gray-500 truncate max-w-[120px]">
          {holding.assetName}
        </div>
      </td>

      {/* 수량 */}
      <td className="py-3 pr-4 tabular-nums text-right text-sm text-navy/80 dark:text-gray-300">
        {holding.quantity.toLocaleString('ko-KR')}
      </td>

      {/* 평균단가 */}
      <td className="py-3 pr-4 tabular-nums text-right text-sm text-navy/80 dark:text-gray-300">
        {holding.avgPrice.toLocaleString('ko-KR')}
      </td>

      {/* 현재가 + 업데이트 버튼 */}
      <td className="py-3 pr-4 text-right">
        {isEditing ? (
          <div className="flex items-center justify-end gap-1">
            <input
              type="number"
              min="0"
              step="any"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateConfirm();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              autoFocus
              className="w-24 rounded-lg border border-vault-color/40 bg-white/80 px-2 py-1 text-right text-xs text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:bg-white/10 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={handleUpdateConfirm}
              className="rounded-lg bg-vault-color px-2 py-1 text-xs font-medium text-white hover:bg-vault-color/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
            >
              확인
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg px-2 py-1 text-xs text-navy/50 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <span className="tabular-nums text-sm text-navy/80 dark:text-gray-300">
              {holding.currentPrice.toLocaleString('ko-KR')}
            </span>
            <button
              type="button"
              onClick={handleEditOpen}
              className="rounded-lg px-2 py-0.5 text-xs font-medium text-vault-color hover:bg-vault-color/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
              title="현재가 업데이트"
            >
              수정
            </button>
          </div>
        )}
      </td>

      {/* 평가금액 */}
      <td className="py-3 pr-4 tabular-nums text-right text-sm text-navy/80 dark:text-gray-300">
        {holding.marketValue.toLocaleString('ko-KR')}
      </td>

      {/* 미실현 손익 */}
      <td className="py-3 pr-4 tabular-nums text-right text-sm">
        <div className={`font-medium ${colorClass}`}>
          {holding.unrealizedPnL >= 0 ? '+' : ''}
          {holding.unrealizedPnL.toLocaleString('ko-KR')}
        </div>
        <div className={`text-xs ${colorClass}`}>
          {formatReturnRate(holding.returnRate)}
        </div>
      </td>
    </tr>
  );
}

// ============================================================
// HoldingsTable
// ============================================================

/** 보유 종목 테이블 */
function HoldingsTableInner({ holdings, currency, onUpdatePrice }: HoldingsTableProps): ReactNode {
  if (holdings.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-navy/40 dark:text-gray-500">
        보유 종목이 없습니다
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-navy/10 dark:border-white/10">
            <th className="pb-2 text-left text-xs font-medium text-navy/50 dark:text-gray-500">종목</th>
            <th className="pb-2 text-right text-xs font-medium text-navy/50 dark:text-gray-500">수량</th>
            <th className="pb-2 pr-4 text-right text-xs font-medium text-navy/50 dark:text-gray-500">
              평균단가 ({currency})
            </th>
            <th className="pb-2 pr-4 text-right text-xs font-medium text-navy/50 dark:text-gray-500">
              현재가 ({currency})
            </th>
            <th className="pb-2 pr-4 text-right text-xs font-medium text-navy/50 dark:text-gray-500">
              평가금액 ({currency})
            </th>
            <th className="pb-2 text-right text-xs font-medium text-navy/50 dark:text-gray-500">미실현 손익</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <HoldingRow
              key={holding.ticker}
              holding={holding}
              onUpdatePrice={onUpdatePrice}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const HoldingsTable = memo(HoldingsTableInner);
