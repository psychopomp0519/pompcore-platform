/**
 * @file investmentCalculator.ts
 * @description 투자 수익 계산 유틸리티 (평균단가, 손익, 수익률)
 * @module utils/investmentCalculator
 */

import type { InvestmentTrade, Holding, HoldingWithPnL, PriceSnapshot, PortfolioSummary } from '../types/investment.types';

// ============================================================
// 보유 종목 집계
// ============================================================

/**
 * 매매 기록 배열에서 현재 보유 종목을 집계
 * - buy: 수량 증가, 평균단가 갱신 (수수료 포함)
 * - sell: 수량 감소, 평균단가 불변
 * - dividend: 수량·단가 영향 없음
 */
export function computeHoldings(trades: InvestmentTrade[]): Holding[] {
  const map = new Map<string, Holding>();

  const sorted = [...trades].sort((a, b) => a.tradeDate.localeCompare(b.tradeDate));

  for (const trade of sorted) {
    if (trade.tradeType === 'dividend') continue;

    const existing = map.get(trade.ticker);

    if (trade.tradeType === 'buy') {
      map.set(trade.ticker, calcBuyHolding(existing, trade));
    } else if (trade.tradeType === 'sell' && existing) {
      map.set(trade.ticker, calcSellHolding(existing, trade));
    }
  }

  return Array.from(map.values()).filter((h) => h.quantity > 0);
}

/** 매수 시 보유 종목 갱신 */
function calcBuyHolding(existing: Holding | undefined, trade: InvestmentTrade): Holding {
  const prevQty = existing?.quantity ?? 0;
  const prevCost = existing?.totalCost ?? 0;
  const tradeCost = trade.quantity * trade.price + trade.fee;
  const newQty = prevQty + trade.quantity;
  const newCost = prevCost + tradeCost;
  return {
    ticker: trade.ticker,
    assetName: trade.assetName,
    quantity: newQty,
    avgPrice: newQty > 0 ? newCost / newQty : 0,
    currency: trade.currency,
    totalCost: newCost,
  };
}

/** 매도 시 보유 종목 갱신 (FIFO 단순화: 평균단가 유지) */
function calcSellHolding(existing: Holding, trade: InvestmentTrade): Holding {
  const newQty = Math.max(0, existing.quantity - trade.quantity);
  return {
    ...existing,
    quantity: newQty,
    totalCost: newQty * existing.avgPrice,
  };
}

// ============================================================
// 실현 손익
// ============================================================

/**
 * 매도 거래의 실현 손익 계산
 * @param sellTrade 매도 거래
 * @param avgPrice 해당 시점의 평균단가
 */
export function calcRealizedPnL(sellTrade: InvestmentTrade, avgPrice: number): number {
  return (sellTrade.price - avgPrice) * sellTrade.quantity - sellTrade.fee;
}

/**
 * 매매 기록 전체에서 총 실현 손익 계산
 */
export function calcTotalRealizedPnL(trades: InvestmentTrade[]): number {
  const sorted = [...trades].sort((a, b) => a.tradeDate.localeCompare(b.tradeDate));
  const holdingMap = new Map<string, Holding>();
  let totalPnL = 0;

  for (const trade of sorted) {
    if (trade.tradeType === 'buy') {
      holdingMap.set(trade.ticker, calcBuyHolding(holdingMap.get(trade.ticker), trade));
    } else if (trade.tradeType === 'sell') {
      const h = holdingMap.get(trade.ticker);
      if (h) {
        totalPnL += calcRealizedPnL(trade, h.avgPrice);
        holdingMap.set(trade.ticker, calcSellHolding(h, trade));
      }
    }
  }

  return totalPnL;
}

// ============================================================
// 미실현 손익 + 수익률
// ============================================================

/** 보유 종목에 현재가·손익 정보를 합산 */
export function enrichHoldingsWithPnL(
  holdings: Holding[],
  snapshots: PriceSnapshot[],
): HoldingWithPnL[] {
  const priceMap = new Map(snapshots.map((s) => [s.ticker, s.currentPrice]));

  return holdings.map((h) => {
    const currentPrice = priceMap.get(h.ticker) ?? h.avgPrice;
    const marketValue = currentPrice * h.quantity;
    const unrealizedPnL = marketValue - h.totalCost;
    const returnRate = h.totalCost > 0 ? (unrealizedPnL / h.totalCost) * 100 : 0;
    return { ...h, currentPrice, marketValue, unrealizedPnL, returnRate };
  });
}

// ============================================================
// 포트폴리오 요약
// ============================================================

/** 보유 종목 전체 요약 집계 */
export function calcPortfolioSummary(
  holdingsWithPnL: HoldingWithPnL[],
  realizedPnL: number,
  currency: string,
): PortfolioSummary {
  const totalCost = holdingsWithPnL.reduce((s, h) => s + h.totalCost, 0);
  const totalMarketValue = holdingsWithPnL.reduce((s, h) => s + h.marketValue, 0);
  const totalUnrealizedPnL = totalMarketValue - totalCost;
  const returnRate = totalCost > 0 ? (totalUnrealizedPnL / totalCost) * 100 : 0;

  return {
    totalCost,
    totalMarketValue,
    totalUnrealizedPnL,
    totalRealizedPnL: realizedPnL,
    returnRate,
    currency,
  };
}

// ============================================================
// 수익률 포맷 헬퍼
// ============================================================

/** 수익률 부호 포함 문자열 */
export function formatReturnRate(rate: number): string {
  const sign = rate >= 0 ? '+' : '';
  return `${sign}${rate.toFixed(2)}%`;
}

/** 손익 부호 클래스 */
export function pnlColorClass(value: number): string {
  if (value > 0) return 'text-blue-500';
  if (value < 0) return 'text-red-500';
  return 'text-navy/60 dark:text-gray-400';
}
