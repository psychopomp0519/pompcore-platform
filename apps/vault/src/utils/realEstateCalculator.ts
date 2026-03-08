/**
 * @file realEstateCalculator.ts
 * @description 부동산 수익률 계산 유틸리티
 * @module utils/realEstateCalculator
 */

import type { RealEstate, RealEstateLease, RealEstateExpense, RealEstateSummary } from '../types/realEstate.types';

// ============================================================
// 상수
// ============================================================

const MONTHS_PER_YEAR = 12;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// ============================================================
// 수익률 계산
// ============================================================

/**
 * 연 월세 수익률 (%)
 * = (월세 × 12 / 현재가) × 100
 */
export function calcAnnualRentalYield(
  monthlyRent: number,
  currentValue: number,
): number {
  if (currentValue <= 0) return 0;
  return (monthlyRent * MONTHS_PER_YEAR / currentValue) * 100;
}

/**
 * 순 수익률 (비용 차감 후)
 * = ((월세 × 12 - 연간 비용) / 현재가) × 100
 */
export function calcNetAnnualYield(
  monthlyRent: number,
  annualExpenses: number,
  currentValue: number,
): number {
  if (currentValue <= 0) return 0;
  return ((monthlyRent * MONTHS_PER_YEAR - annualExpenses) / currentValue) * 100;
}

/**
 * 전세 수익률 (%)
 * 임차인 관점: 보증금 대비 (기회비용 or 대출이자로 환산)
 * 소유자 관점: 보증금 / 현재가 × 100
 */
export function calcJeonseYield(deposit: number, currentValue: number): number {
  if (currentValue <= 0) return 0;
  return (deposit / currentValue) * 100;
}

/**
 * 자본 수익률 (%) — 매입가 대비 현재가 상승률
 */
export function calcCapitalGainRate(
  currentValue: number,
  acquisitionPrice: number,
): number {
  if (acquisitionPrice <= 0) return 0;
  return ((currentValue - acquisitionPrice) / acquisitionPrice) * 100;
}

// ============================================================
// 계약 만료
// ============================================================

/**
 * 계약 만료까지 남은 일수 (음수 = 이미 만료)
 */
export function getDaysUntilLeaseEnd(endDate: string): number {
  const end = new Date(endDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / MS_PER_DAY);
}

/**
 * 만료 D-day 문자열
 */
export function formatLeaseEndLabel(days: number): string {
  if (days === 0) return '오늘 만료';
  if (days < 0) return `${Math.abs(days)}일 초과`;
  if (days <= 30) return `D-${days}`;
  return `${Math.floor(days / 30)}개월 후`;
}

// ============================================================
// 비용 집계
// ============================================================

/**
 * 최근 1년 비용 합산 (동일 통화 기준)
 */
export function calcAnnualExpenses(
  expenses: RealEstateExpense[],
  currency: string,
): number {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const cutoff = oneYearAgo.toISOString().slice(0, 10);

  return expenses
    .filter((e) => e.currency === currency && e.expenseDate >= cutoff)
    .reduce((sum, e) => sum + e.amount, 0);
}

// ============================================================
// 부동산 요약
// ============================================================

/**
 * 부동산 물건 + 활성 계약 기반 요약 계산
 */
export function calcRealEstateSummary(
  property: RealEstate,
  activeLease: RealEstateLease | null,
  expenses: RealEstateExpense[],
): RealEstateSummary {
  const cv = property.currentValue ?? 0;

  let annualRentalYield: number | null = null;
  let jeonseYield: number | null = null;
  let daysUntilLeaseEnd: number | null = null;

  if (activeLease) {
    if (activeLease.leaseType === 'monthly' || activeLease.leaseType === 'commercial') {
      const annualExp = calcAnnualExpenses(expenses, property.currency);
      annualRentalYield = cv > 0
        ? calcNetAnnualYield(activeLease.monthlyRent, annualExp, cv)
        : null;
    }

    if (activeLease.leaseType === 'jeonse') {
      jeonseYield = cv > 0 ? calcJeonseYield(activeLease.deposit, cv) : null;
    }

    if (activeLease.endDate) {
      daysUntilLeaseEnd = getDaysUntilLeaseEnd(activeLease.endDate);
    }
  }

  return { annualRentalYield, jeonseYield, daysUntilLeaseEnd };
}
