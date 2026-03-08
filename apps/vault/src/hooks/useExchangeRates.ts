/**
 * @file useExchangeRates.ts
 * @description 환율 로드 + 금액 환산 훅
 * @module hooks/useExchangeRates
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchExchangeRates, convertAmount } from '../services/exchangeRate.service';

// ============================================================
// 타입
// ============================================================

export interface UseExchangeRatesResult {
  /** 기준 통화 대비 환율 맵 (base = baseCurrency) */
  rates: Record<string, number>;
  isLoading: boolean;
  /**
   * 금액을 fromCurrency → toCurrency(생략 시 baseCurrency)로 환산
   * 지원되지 않는 통화는 원본 반환
   */
  convert: (amount: number, fromCurrency: string, toCurrency?: string) => number;
}

// ============================================================
// useExchangeRates
// ============================================================

/**
 * @param baseCurrency 기준(주) 통화 — 이 통화를 기준으로 환율을 로드
 */
export function useExchangeRates(baseCurrency: string): UseExchangeRatesResult {
  const [rates, setRates] = useState<Record<string, number>>({ [baseCurrency]: 1 });
  /** baseCurrency가 있으면 초기 로딩 상태로 시작 */
  const [isLoading, setIsLoading] = useState(!!baseCurrency);

  useEffect(() => {
    if (!baseCurrency) return;
    let cancelled = false;
    fetchExchangeRates(baseCurrency)
      .then((r) => { if (!cancelled) { setRates(r); setIsLoading(false); } })
      .catch(() => { if (!cancelled) setIsLoading(false); /* 1:1 비율 유지 */ });
    /** cleanup: 통화 변경 시 다음 요청 전에 로딩 상태 재설정 */
    return () => { cancelled = true; setIsLoading(true); };
  }, [baseCurrency]);

  const convert = useCallback(
    (amount: number, fromCurrency: string, toCurrency = baseCurrency): number =>
      convertAmount(amount, fromCurrency, toCurrency, rates),
    [rates, baseCurrency],
  );

  return { rates, isLoading, convert };
}
