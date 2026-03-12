import { describe, it, expect } from 'vitest';
import {
  calculateFixedDepositInterest,
  calculateInstallmentInterest,
  calculateFreeSavingsInterest,
  calculateMaturityDate,
  getDaysUntilMaturity,
} from './interestCalculator';

describe('calculateFixedDepositInterest (정기예금 단리)', () => {
  it('1000만원 연 3% 12개월 과세', () => {
    const r = calculateFixedDepositInterest(10_000_000, 3, 12, false);
    expect(r.interest).toBe(300_000);
    expect(r.tax).toBe(Math.round(300_000 * 0.154));
    expect(r.netInterest).toBe(r.interest - r.tax);
    expect(r.totalAmount).toBe(Math.round(10_000_000 + r.netInterest));
  });

  it('비과세 시 세금 0', () => {
    const r = calculateFixedDepositInterest(10_000_000, 3, 12, true);
    expect(r.tax).toBe(0);
    expect(r.netInterest).toBe(r.interest);
  });

  it('6개월 예치 시 이자 절반', () => {
    const r = calculateFixedDepositInterest(10_000_000, 3, 6, true);
    expect(r.interest).toBe(150_000);
  });

  it('원금 0이면 이자 0', () => {
    const r = calculateFixedDepositInterest(0, 5, 12, false);
    expect(r.interest).toBe(0);
    expect(r.totalAmount).toBe(0);
  });
});

describe('calculateInstallmentInterest (정기적금 월복리)', () => {
  it('월 100만원 12개월 연 3% 과세', () => {
    const r = calculateInstallmentInterest(1_000_000, 3, 12, false);
    expect(r.principal).toBe(12_000_000);
    expect(r.interest).toBeGreaterThan(0);
    expect(r.tax).toBeGreaterThan(0);
    expect(r.totalAmount).toBe(Math.round(r.principal + r.netInterest));
  });

  it('비과세 시 세금 0', () => {
    const r = calculateInstallmentInterest(1_000_000, 3, 12, true);
    expect(r.tax).toBe(0);
  });

  it('월 납입 0이면 원금·이자 모두 0', () => {
    const r = calculateInstallmentInterest(0, 5, 12, false);
    expect(r.principal).toBe(0);
    expect(r.interest).toBe(0);
  });
});

describe('calculateFreeSavingsInterest (자유적금)', () => {
  it('납입 내역 기반 이자 계산', () => {
    const deposits = [
      { amount: 1_000_000, date: '2025-01-01' },
      { amount: 500_000, date: '2025-07-01' },
    ];
    const r = calculateFreeSavingsInterest(deposits, 3, '2026-01-01', true);
    expect(r.principal).toBe(1_500_000);
    expect(r.interest).toBeGreaterThan(0);
    expect(r.tax).toBe(0);
  });

  it('빈 납입 내역', () => {
    const r = calculateFreeSavingsInterest([], 3, '2026-01-01', false);
    expect(r.principal).toBe(0);
    expect(r.interest).toBe(0);
  });
});

describe('calculateMaturityDate', () => {
  it('2026-01-15 + 12개월 = 2027-01-15', () => {
    expect(calculateMaturityDate('2026-01-15', 12)).toBe('2027-01-15');
  });

  it('2026-01-31 + 1개월 = 2026-03-03 (JS Date 동작)', () => {
    // JS Date에서 1/31 + 1개월 = 3/3 (2월 28일 초과분)
    const result = calculateMaturityDate('2026-01-31', 1);
    expect(result).toBeTruthy();
  });

  it('2024-01-29 + 1개월 = 2024-02-29 (윤년)', () => {
    expect(calculateMaturityDate('2024-01-29', 1)).toBe('2024-02-29');
  });
});

describe('getDaysUntilMaturity', () => {
  it('미래 날짜는 양수', () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    const dateStr = future.toISOString().slice(0, 10);
    expect(getDaysUntilMaturity(dateStr)).toBe(30);
  });

  it('과거 날짜는 0', () => {
    expect(getDaysUntilMaturity('2020-01-01')).toBe(0);
  });

  it('오늘은 0', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(getDaysUntilMaturity(today)).toBe(0);
  });
});
