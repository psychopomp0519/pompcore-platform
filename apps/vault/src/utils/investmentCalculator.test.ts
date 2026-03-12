import { describe, it, expect } from 'vitest';
import {
  computeHoldings,
  calcRealizedPnL,
  calcTotalRealizedPnL,
  enrichHoldingsWithPnL,
  calcPortfolioSummary,
  formatReturnRate,
  pnlColorClass,
} from './investmentCalculator';
import type { InvestmentTrade, PriceSnapshot } from '../types/investment.types';

const makeTrade = (
  overrides: Partial<InvestmentTrade> & Pick<InvestmentTrade, 'tradeType' | 'ticker' | 'quantity' | 'price'>,
): InvestmentTrade => ({
  id: 'test',
  portfolioId: 'p1',
  assetName: overrides.ticker,
  tradeDate: '2026-01-01',
  currency: 'KRW',
  fee: 0,
  memo: '',
  createdAt: '',
  ...overrides,
});

describe('computeHoldings', () => {
  it('매수만 있을 때 보유 종목 반환', () => {
    const trades = [
      makeTrade({ tradeType: 'buy', ticker: 'AAPL', quantity: 10, price: 100 }),
    ];
    const holdings = computeHoldings(trades);
    expect(holdings).toHaveLength(1);
    expect(holdings[0].ticker).toBe('AAPL');
    expect(holdings[0].quantity).toBe(10);
    expect(holdings[0].avgPrice).toBe(100);
  });

  it('2회 매수 시 평균단가 계산', () => {
    const trades = [
      makeTrade({ tradeType: 'buy', ticker: 'AAPL', quantity: 10, price: 100, tradeDate: '2026-01-01' }),
      makeTrade({ tradeType: 'buy', ticker: 'AAPL', quantity: 10, price: 200, tradeDate: '2026-01-02' }),
    ];
    const holdings = computeHoldings(trades);
    expect(holdings[0].quantity).toBe(20);
    expect(holdings[0].avgPrice).toBe(150);
  });

  it('매도 후 수량 감소', () => {
    const trades = [
      makeTrade({ tradeType: 'buy', ticker: 'AAPL', quantity: 10, price: 100, tradeDate: '2026-01-01' }),
      makeTrade({ tradeType: 'sell', ticker: 'AAPL', quantity: 3, price: 150, tradeDate: '2026-01-02' }),
    ];
    const holdings = computeHoldings(trades);
    expect(holdings[0].quantity).toBe(7);
  });

  it('전량 매도 시 빈 배열', () => {
    const trades = [
      makeTrade({ tradeType: 'buy', ticker: 'AAPL', quantity: 10, price: 100, tradeDate: '2026-01-01' }),
      makeTrade({ tradeType: 'sell', ticker: 'AAPL', quantity: 10, price: 150, tradeDate: '2026-01-02' }),
    ];
    expect(computeHoldings(trades)).toHaveLength(0);
  });

  it('배당금은 수량에 영향 없음', () => {
    const trades = [
      makeTrade({ tradeType: 'buy', ticker: 'AAPL', quantity: 10, price: 100 }),
      makeTrade({ tradeType: 'dividend', ticker: 'AAPL', quantity: 0, price: 5 }),
    ];
    const holdings = computeHoldings(trades);
    expect(holdings[0].quantity).toBe(10);
  });

  it('빈 배열 → 빈 결과', () => {
    expect(computeHoldings([])).toHaveLength(0);
  });
});

describe('calcRealizedPnL', () => {
  it('매도 수익 계산 (수수료 차감)', () => {
    const sell = makeTrade({ tradeType: 'sell', ticker: 'AAPL', quantity: 5, price: 200, fee: 10 });
    // (200 - 100) * 5 - 10 = 490
    expect(calcRealizedPnL(sell, 100)).toBe(490);
  });

  it('손실 발생', () => {
    const sell = makeTrade({ tradeType: 'sell', ticker: 'AAPL', quantity: 5, price: 80, fee: 0 });
    // (80 - 100) * 5 = -100
    expect(calcRealizedPnL(sell, 100)).toBe(-100);
  });
});

describe('calcTotalRealizedPnL', () => {
  it('매수-매도 전체 실현 손익', () => {
    const trades = [
      makeTrade({ tradeType: 'buy', ticker: 'AAPL', quantity: 10, price: 100, tradeDate: '2026-01-01' }),
      makeTrade({ tradeType: 'sell', ticker: 'AAPL', quantity: 5, price: 150, fee: 0, tradeDate: '2026-01-02' }),
    ];
    // (150 - 100) * 5 = 250
    expect(calcTotalRealizedPnL(trades)).toBe(250);
  });
});

describe('enrichHoldingsWithPnL', () => {
  it('현재가와 미실현 손익 추가', () => {
    const holdings = [{ ticker: 'AAPL', assetName: 'Apple', quantity: 10, avgPrice: 100, currency: 'USD', totalCost: 1000 }];
    const snapshots: PriceSnapshot[] = [{ ticker: 'AAPL', currentPrice: 150, updatedAt: '' }];
    const result = enrichHoldingsWithPnL(holdings, snapshots);
    expect(result[0].currentPrice).toBe(150);
    expect(result[0].marketValue).toBe(1500);
    expect(result[0].unrealizedPnL).toBe(500);
    expect(result[0].returnRate).toBeCloseTo(50);
  });

  it('스냅샷 없으면 평균단가 사용', () => {
    const holdings = [{ ticker: 'AAPL', assetName: 'Apple', quantity: 10, avgPrice: 100, currency: 'USD', totalCost: 1000 }];
    const result = enrichHoldingsWithPnL(holdings, []);
    expect(result[0].currentPrice).toBe(100);
    expect(result[0].unrealizedPnL).toBe(0);
  });
});

describe('calcPortfolioSummary', () => {
  it('포트폴리오 요약 집계', () => {
    const holdingsWithPnL = [
      { ticker: 'A', assetName: 'A', quantity: 10, avgPrice: 100, currency: 'KRW', totalCost: 1000, currentPrice: 150, marketValue: 1500, unrealizedPnL: 500, returnRate: 50 },
    ];
    const summary = calcPortfolioSummary(holdingsWithPnL, 200, 'KRW');
    expect(summary.totalCost).toBe(1000);
    expect(summary.totalMarketValue).toBe(1500);
    expect(summary.totalUnrealizedPnL).toBe(500);
    expect(summary.totalRealizedPnL).toBe(200);
    expect(summary.returnRate).toBeCloseTo(50);
  });
});

describe('formatReturnRate', () => {
  it('양수 → +10.50%', () => {
    expect(formatReturnRate(10.5)).toBe('+10.50%');
  });

  it('음수 → -5.30%', () => {
    expect(formatReturnRate(-5.3)).toBe('-5.30%');
  });

  it('0 → +0.00%', () => {
    expect(formatReturnRate(0)).toBe('+0.00%');
  });
});

describe('pnlColorClass', () => {
  it('양수 → blue', () => {
    expect(pnlColorClass(100)).toContain('blue');
  });

  it('음수 → red', () => {
    expect(pnlColorClass(-100)).toContain('red');
  });

  it('0 → gray 계열', () => {
    expect(pnlColorClass(0)).toContain('navy');
  });
});
