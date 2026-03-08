/**
 * @file interestCalculator.ts
 * @description 예/적금 이자 계산 유틸리티
 * @module utils/interestCalculator
 */

// ============================================================
// 상수
// ============================================================

/** 이자 소득세율 (15.4%: 소득세 14% + 지방소득세 1.4%) */
const TAX_RATE = 0.154;

// ============================================================
// 예금 (정기예금) - 단리
// ============================================================

/** 예금 만기 이자 계산 (단리) */
export function calculateFixedDepositInterest(
  principal: number,
  annualRate: number,
  durationMonths: number,
  isTaxFree: boolean,
): { interest: number; tax: number; netInterest: number; totalAmount: number } {
  const rate = annualRate / 100;
  const interest = principal * rate * (durationMonths / 12);
  const tax = isTaxFree ? 0 : interest * TAX_RATE;
  const netInterest = interest - tax;

  return {
    interest: Math.round(interest),
    tax: Math.round(tax),
    netInterest: Math.round(netInterest),
    totalAmount: Math.round(principal + netInterest),
  };
}

// ============================================================
// 적금 (정기적금) - 복리
// ============================================================

/** 적금 만기 이자 계산 (월복리) */
export function calculateInstallmentInterest(
  monthlyAmount: number,
  annualRate: number,
  durationMonths: number,
  isTaxFree: boolean,
): { principal: number; interest: number; tax: number; netInterest: number; totalAmount: number } {
  const monthlyRate = annualRate / 100 / 12;
  const principal = monthlyAmount * durationMonths;

  let totalWithInterest = 0;
  for (let i = 0; i < durationMonths; i++) {
    const remainingMonths = durationMonths - i;
    totalWithInterest += monthlyAmount * Math.pow(1 + monthlyRate, remainingMonths);
  }

  const interest = totalWithInterest - principal;
  const tax = isTaxFree ? 0 : interest * TAX_RATE;
  const netInterest = interest - tax;

  return {
    principal: Math.round(principal),
    interest: Math.round(interest),
    tax: Math.round(tax),
    netInterest: Math.round(netInterest),
    totalAmount: Math.round(principal + netInterest),
  };
}

// ============================================================
// 자유적금 - 가변 납입 복리
// ============================================================

/** 자유적금 이자 계산 (실제 납입 내역 기반) */
export function calculateFreeSavingsInterest(
  deposits: { amount: number; date: string }[],
  annualRate: number,
  maturityDate: string,
  isTaxFree: boolean,
): { principal: number; interest: number; tax: number; netInterest: number; totalAmount: number } {
  const rate = annualRate / 100;
  const maturity = new Date(maturityDate);
  let principal = 0;
  let interest = 0;

  for (const deposit of deposits) {
    const depositDate = new Date(deposit.date);
    const daysHeld = Math.max(0, (maturity.getTime() - depositDate.getTime()) / (1000 * 60 * 60 * 24));
    const depositInterest = deposit.amount * rate * (daysHeld / 365);
    principal += deposit.amount;
    interest += depositInterest;
  }

  const tax = isTaxFree ? 0 : interest * TAX_RATE;
  const netInterest = interest - tax;

  return {
    principal: Math.round(principal),
    interest: Math.round(interest),
    tax: Math.round(tax),
    netInterest: Math.round(netInterest),
    totalAmount: Math.round(principal + netInterest),
  };
}

// ============================================================
// 만기일 계산
// ============================================================

/** 시작일 + 기간(월)으로 만기일 계산 */
export function calculateMaturityDate(startDate: string, durationMonths: number): string {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + durationMonths);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 만기일까지 남은 일수 */
export function getDaysUntilMaturity(maturityDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maturity = new Date(maturityDate);
  const diff = maturity.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
