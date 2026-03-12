import { describe, it, expect } from 'vitest';
import {
  calcAnnualRentalYield,
  calcNetAnnualYield,
  calcJeonseYield,
  calcCapitalGainRate,
  getDaysUntilLeaseEnd,
  formatLeaseEndLabel,
  calcAnnualExpenses,
} from './realEstateCalculator';

describe('calcAnnualRentalYield', () => {
  it('월세 100만원, 현재가 3억 → 4%', () => {
    expect(calcAnnualRentalYield(1_000_000, 300_000_000)).toBeCloseTo(4);
  });

  it('현재가 0이면 0%', () => {
    expect(calcAnnualRentalYield(1_000_000, 0)).toBe(0);
  });

  it('현재가 음수면 0%', () => {
    expect(calcAnnualRentalYield(1_000_000, -100)).toBe(0);
  });
});

describe('calcNetAnnualYield', () => {
  it('비용 차감 후 수익률', () => {
    // (100만 * 12 - 200만) / 3억 * 100 = (1200만 - 200만) / 3억 * 100 ≈ 3.33%
    expect(calcNetAnnualYield(1_000_000, 2_000_000, 300_000_000)).toBeCloseTo(3.333, 1);
  });

  it('비용이 수입 초과 시 음수', () => {
    expect(calcNetAnnualYield(100_000, 5_000_000, 100_000_000)).toBeLessThan(0);
  });
});

describe('calcJeonseYield', () => {
  it('보증금 2억, 현재가 3억 → 66.67%', () => {
    expect(calcJeonseYield(200_000_000, 300_000_000)).toBeCloseTo(66.667, 1);
  });

  it('현재가 0이면 0%', () => {
    expect(calcJeonseYield(200_000_000, 0)).toBe(0);
  });
});

describe('calcCapitalGainRate', () => {
  it('현재가 4억, 매입가 3억 → 33.33%', () => {
    expect(calcCapitalGainRate(400_000_000, 300_000_000)).toBeCloseTo(33.333, 1);
  });

  it('가격 하락 시 음수', () => {
    expect(calcCapitalGainRate(200_000_000, 300_000_000)).toBeCloseTo(-33.333, 1);
  });

  it('매입가 0이면 0%', () => {
    expect(calcCapitalGainRate(300_000_000, 0)).toBe(0);
  });
});

describe('getDaysUntilLeaseEnd', () => {
  it('미래 날짜 → 양수', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const dateStr = future.toISOString().slice(0, 10);
    expect(getDaysUntilLeaseEnd(dateStr)).toBe(10);
  });

  it('과거 날짜 → 음수', () => {
    expect(getDaysUntilLeaseEnd('2020-01-01')).toBeLessThan(0);
  });
});

describe('formatLeaseEndLabel', () => {
  it('0일 → 오늘 만료', () => {
    expect(formatLeaseEndLabel(0)).toBe('오늘 만료');
  });

  it('음수 → N일 초과', () => {
    expect(formatLeaseEndLabel(-5)).toBe('5일 초과');
  });

  it('30일 이내 → D-N', () => {
    expect(formatLeaseEndLabel(15)).toBe('D-15');
  });

  it('31일 이상 → N개월 후', () => {
    expect(formatLeaseEndLabel(90)).toBe('3개월 후');
  });
});

describe('calcAnnualExpenses', () => {
  it('최근 1년 동일 통화 비용만 합산', () => {
    const now = new Date();
    const recentDate = new Date(now);
    recentDate.setMonth(recentDate.getMonth() - 3);

    const expenses = [
      { id: '1', propertyId: 'p1', category: '관리비', amount: 100_000, currency: 'KRW', expenseDate: recentDate.toISOString().slice(0, 10), memo: '', createdAt: '' },
      { id: '2', propertyId: 'p1', category: '수리비', amount: 200_000, currency: 'KRW', expenseDate: recentDate.toISOString().slice(0, 10), memo: '', createdAt: '' },
      { id: '3', propertyId: 'p1', category: '기타', amount: 50_000, currency: 'USD', expenseDate: recentDate.toISOString().slice(0, 10), memo: '', createdAt: '' },
    ];
    expect(calcAnnualExpenses(expenses, 'KRW')).toBe(300_000);
  });

  it('1년 이전 비용은 제외', () => {
    const expenses = [
      { id: '1', propertyId: 'p1', category: '관리비', amount: 100_000, currency: 'KRW', expenseDate: '2020-01-01', memo: '', createdAt: '' },
    ];
    expect(calcAnnualExpenses(expenses, 'KRW')).toBe(0);
  });
});
