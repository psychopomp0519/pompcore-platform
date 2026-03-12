/**
 * @file Currency formatting utilities
 * @module @pompcore/ui/utils/currency
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

/** 통화 코드에 해당하는 정보 조회 (없으면 기본값) */
function getCurrencyInfo(code: string): { symbol: string; decimals: number } {
  const info = CURRENCIES[code as CurrencyCode];
  if (info) return { symbol: info.symbol, decimals: info.decimals };
  return { symbol: code, decimals: 2 };
}

/** 브라우저 로케일 감지 (SSR 안전) */
function detectLocale(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'ko-KR';
}

/** 금액을 통화 형식으로 포맷팅 */
export function formatCurrency(amount: number, currencyCode: string, locale?: string): string {
  const { symbol, decimals } = getCurrencyInfo(currencyCode);
  const resolvedLocale = locale ?? detectLocale();
  const formatted = Math.abs(amount).toLocaleString(resolvedLocale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

/** 금액을 부호 포함 통화 형식으로 포맷팅 (+/-) */
export function formatSignedCurrency(amount: number, currencyCode: string, locale?: string): string {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${formatCurrency(amount, currencyCode, locale)}`;
}
