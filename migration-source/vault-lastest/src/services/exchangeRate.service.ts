/**
 * @file exchangeRate.service.ts
 * @description 환율 조회 서비스 (frankfurter.app — ECB 데이터, 무료·무키)
 * @module services/exchangeRate
 */

// ============================================================
// 상수
// ============================================================

const CACHE_KEY = 'vault_exchange_rates_v1';

/** 캐시 유효 시간: 1시간 */
const CACHE_TTL_MS = 60 * 60 * 1000;

const API_BASE = 'https://api.frankfurter.app';

// ============================================================
// 타입
// ============================================================

interface RateCache {
  base: string;
  rates: Record<string, number>;
  fetchedAt: number;
}

// ============================================================
// 캐시 유틸
// ============================================================

function loadCache(base: string): Record<string, number> | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as RateCache;
    if (cache.base !== base) return null;
    if (Date.now() - cache.fetchedAt > CACHE_TTL_MS) return null;
    return cache.rates;
  } catch {
    return null;
  }
}

function saveCache(base: string, rates: Record<string, number>): void {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ base, rates, fetchedAt: Date.now() } satisfies RateCache),
    );
  } catch {
    // localStorage 실패 시 무시
  }
}

// ============================================================
// 환율 조회
// ============================================================

/**
 * 기준 통화(base) 대비 다른 통화들의 환율을 반환
 *
 * 반환 예시 (base = 'KRW'):
 *   { KRW: 1, USD: 0.00073, JPY: 0.11, EUR: 0.00067, ... }
 *   → 1 KRW = 0.00073 USD
 *
 * 지원 통화 (ECB 기준 33종):
 *   AUD, BGN, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP,
 *   HKD, HUF, IDR, INR, ISK, JPY, KRW, MXN, MYR, NOK,
 *   NZD, PHP, PLN, RON, SEK, SGD, THB, TRY, USD, ZAR 등
 */
export async function fetchExchangeRates(
  baseCurrency: string,
): Promise<Record<string, number>> {
  const cached = loadCache(baseCurrency);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}/latest?base=${baseCurrency}`);
  if (!res.ok) throw new Error(`환율 조회 실패 (${res.status})`);

  const data = (await res.json()) as { base: string; rates: Record<string, number> };
  const rates: Record<string, number> = { [baseCurrency]: 1, ...data.rates };

  saveCache(baseCurrency, rates);
  return rates;
}

// ============================================================
// 환산
// ============================================================

/**
 * 금액을 fromCurrency → toCurrency로 환산
 *
 * rates 는 baseCurrency 기준 (fetchExchangeRates 반환값)
 * 지원되지 않는 통화(암호화폐 등)는 변환 없이 원본 반환
 */
export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency] ?? null;
  const toRate = rates[toCurrency] ?? null;
  if (fromRate === null || toRate === null) return amount;
  // amount(from) → base → to
  // fromRate = 1 base의 from 가치, toRate = 1 base의 to 가치
  return amount * (toRate / fromRate);
}
