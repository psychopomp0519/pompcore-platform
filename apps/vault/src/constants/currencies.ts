/**
 * @file currencies.ts
 * @description 지원 통화 코드 및 관련 상수
 * @module constants/currencies
 */

/** 지원 통화 정보 */
export const CURRENCIES = {
  KRW: { code: 'KRW', symbol: '₩', name: '대한민국 원', decimals: 0 },
  USD: { code: 'USD', symbol: '$', name: '미국 달러', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: '유로', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: '일본 엔', decimals: 0 },
  CNY: { code: 'CNY', symbol: '¥', name: '중국 위안', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: '영국 파운드', decimals: 2 },
} as const;

/** 통화 코드 타입 */
export type CurrencyCode = keyof typeof CURRENCIES;

/** 기본 통화 */
export const DEFAULT_CURRENCY: CurrencyCode = 'KRW';

/** 통화 코드 목록 */
export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];
