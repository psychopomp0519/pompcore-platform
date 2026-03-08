/**
 * @file currency.ts
 * @description 통화 포맷팅 유틸리티
 * @module utils/currency
 */

import { CURRENCIES, type CurrencyCode } from '../constants/currencies';

/** 통화 코드에 해당하는 정보 조회 (없으면 기본값) */
function getCurrencyInfo(code: string): { symbol: string; decimals: number } {
  const info = CURRENCIES[code as CurrencyCode];
  if (info) return { symbol: info.symbol, decimals: info.decimals };
  return { symbol: code, decimals: 2 };
}

/** 금액을 통화 형식으로 포맷팅 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const { symbol, decimals } = getCurrencyInfo(currencyCode);
  const formatted = Math.abs(amount).toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

/** 금액을 부호 포함 통화 형식으로 포맷팅 (+/-) */
export function formatSignedCurrency(amount: number, currencyCode: string): string {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${formatCurrency(amount, currencyCode)}`;
}
