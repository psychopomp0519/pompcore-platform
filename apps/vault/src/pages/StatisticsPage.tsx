/**
 * @file StatisticsPage.tsx
 * @description 통계 페이지 - 4개 차트 (수입/지출, 자산추이, 카테고리별, 통장별)
 *              다중 통화를 주 통화로 환산하는 통합 보기 기능 포함
 * @module pages/StatisticsPage
 */

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useExchangeRates } from '../hooks/useExchangeRates';
import {
  fetchTransactionsForPeriod,
  fetchAccountBalances,
  fetchCategoryMap,
  type AccountBalanceInfo,
} from '../services/statistics.service';
import type { Transaction } from '../types/transaction.types';
import { LoadingSpinner, EmptyState, toUserMessage } from '@pompcore/ui';
import { IconChart } from '@pompcore/ui';
import { IncomeExpenseChart } from '../components/statistics/IncomeExpenseChart';
import { AssetTrendChart } from '../components/statistics/AssetTrendChart';
import { CategoryBreakdownChart } from '../components/statistics/CategoryBreakdownChart';
import { AccountDistributionChart } from '../components/statistics/AccountDistributionChart';

// ============================================================
// 상수
// ============================================================

/** 조회 기간 옵션 (개월 수) */
const PERIOD_OPTIONS = [
  { label: '6개월', months: 6 },
  { label: '12개월', months: 12 },
] as const;

/** 기본 통화 */
const DEFAULT_CURRENCY = 'KRW';

// ============================================================
// 헬퍼
// ============================================================

/** N개월 전 시작일 계산 */
function getStartDateMonthsAgo(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

/** 오늘 날짜 */
function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ============================================================
// StatisticsPage
// ============================================================

/** 통계 페이지 */
export function StatisticsPage(): ReactNode {
  const user = useAuthStore((s) => s.user);

  // ── 설정 ──────────────────────────────────────────────────
  const { settings, loadSettings } = useSettingsStore();
  const primaryCurrency = settings?.primaryCurrency ?? DEFAULT_CURRENCY;

  // ── 환율 ──────────────────────────────────────────────────
  const { convert, isLoading: ratesLoading } = useExchangeRates(primaryCurrency);

  // ── 페이지 상태 ───────────────────────────────────────────
  const [periodMonths, setPeriodMonths] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnifiedView, setIsUnifiedView] = useState(false);

  // ── 데이터 상태 ───────────────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<AccountBalanceInfo[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<string, { name: string; icon: string | null }>>(new Map());

  // ── 데이터 로드 ───────────────────────────────────────────
  useEffect(() => {
    const uid = user?.id;
    if (!uid) return;
    const userId: string = uid;

    async function loadData(): Promise<void> {
      setIsLoading(true);
      setError(null);
      try {
        const startDate = getStartDateMonthsAgo(periodMonths);
        const endDate = getToday();

        const [txs, bals, cats] = await Promise.all([
          fetchTransactionsForPeriod(userId, startDate, endDate),
          fetchAccountBalances(userId),
          fetchCategoryMap(userId),
          loadSettings(userId),
        ]);

        setTransactions(txs);
        setBalances(bals);
        setCategoryMap(cats);
      } catch (err) {
        setError(toUserMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user?.id, periodMonths]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 통화 목록 ─────────────────────────────────────────────
  /** 거래내역과 잔액에 사용된 통화 목록 */
  const currencies = useMemo(() => {
    const set = new Set<string>();
    for (const tx of transactions) set.add(tx.currency);
    for (const b of balances) set.add(b.currency);
    if (set.size === 0) set.add(DEFAULT_CURRENCY);
    return Array.from(set).sort();
  }, [transactions, balances]);

  const [selectedCurrency, setSelectedCurrency] = useState(primaryCurrency);

  /**
   * 현재 활성 통화
   * - 통합 보기: 항상 primaryCurrency
   * - 통화별: selectedCurrency (데이터에 없으면 primaryCurrency → 첫 번째로 순차 보정)
   */
  const activeCurrency = isUnifiedView
    ? primaryCurrency
    : (currencies.includes(selectedCurrency)
        ? selectedCurrency
        : (currencies.includes(primaryCurrency) ? primaryCurrency : (currencies[0] ?? primaryCurrency)));

  // ── 표시 데이터 (displayTransactions) ────────────────────
  /**
   * 통합 보기: 모든 거래를 primaryCurrency로 환산
   * 통화별 보기: selectedCurrency 필터링
   */
  const displayTransactions = useMemo<Transaction[]>(() => {
    if (!isUnifiedView) {
      return transactions.filter((tx) => tx.currency === selectedCurrency);
    }
    return transactions.map((tx) => ({
      ...tx,
      amount: convert(tx.amount, tx.currency, primaryCurrency),
      currency: primaryCurrency,
    }));
  }, [transactions, isUnifiedView, selectedCurrency, convert, primaryCurrency]);

  // ── 표시 데이터 (displayBalances) ────────────────────────
  /**
   * 통합 보기: 계좌별 모든 통화 잔액을 primaryCurrency로 환산 후 합산
   * 통화별 보기: selectedCurrency 필터링
   */
  const displayBalances = useMemo<AccountBalanceInfo[]>(() => {
    if (!isUnifiedView) {
      return balances.filter((b) => b.currency === selectedCurrency);
    }
    return buildUnifiedBalances(balances, primaryCurrency, convert);
  }, [balances, isUnifiedView, selectedCurrency, primaryCurrency, convert]);

  // ── 초기 잔액 ─────────────────────────────────────────────
  /** 현재 잔액 - 기간 내 변동 = 기간 시작 시점 잔액 */
  const initialBalance = useMemo(() => {
    const currentTotal = displayBalances.reduce((sum, b) => sum + b.balance, 0);
    const periodDelta = displayTransactions.reduce(
      (sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount),
      0,
    );
    return currentTotal - periodDelta;
  }, [displayBalances, displayTransactions]);

  // ── 렌더링 ────────────────────────────────────────────────
  if (isLoading || ratesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-600 dark:hover:text-red-300"
            aria-label="에러 닫기"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 헤더 + 필터 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">통계</h1>
        <div className="flex gap-2">
          {/* 기간 선택 */}
          <div className="flex gap-1 rounded-xl bg-navy/5 p-1 dark:bg-white/5">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.months}
                type="button"
                onClick={() => setPeriodMonths(opt.months)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  periodMonths === opt.months
                    ? 'bg-white text-navy shadow-sm dark:bg-white/10 dark:text-gray-100'
                    : 'text-navy/50 dark:text-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 통화 선택 — 통합 보기일 때 숨김 */}
          {!isUnifiedView && currencies.length > 1 && (
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="rounded-xl border border-navy/10 bg-white/60 px-3 py-1.5 text-xs text-navy focus:border-vault-color focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          )}

          {/* 통합 보기 토글 — 복수 통화일 때만 표시 */}
          {currencies.length > 1 && (
            <button
              type="button"
              onClick={() => setIsUnifiedView((prev) => !prev)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors border ${
                isUnifiedView
                  ? 'bg-vault-color text-white border-vault-color'
                  : 'border-navy/10 bg-white/60 text-navy/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-400'
              }`}
            >
              {isUnifiedView ? `통합 (${primaryCurrency})` : '통화별'}
            </button>
          )}
        </div>
      </div>

      {/* 차트 그리드 */}
      {transactions.length === 0 ? (
        <EmptyState
          icon={<IconChart className="h-7 w-7" />}
          title="거래 데이터가 없습니다"
          description="거래를 추가하면 통계를 확인할 수 있습니다."
        />
      ) : (
        <div className="grid gap-4 tablet:grid-cols-2">
          <IncomeExpenseChart
            transactions={displayTransactions}
            months={periodMonths}
            currency={activeCurrency}
          />
          <AssetTrendChart
            transactions={displayTransactions}
            currency={activeCurrency}
            initialBalance={initialBalance}
          />
          <CategoryBreakdownChart
            transactions={displayTransactions}
            currency={activeCurrency}
            categoryMap={categoryMap}
          />
          <AccountDistributionChart
            balances={displayBalances}
            currency={activeCurrency}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================
// 내부 헬퍼
// ============================================================

/**
 * 계좌별 잔액을 primaryCurrency로 환산하여 합산
 *
 * 동일 계좌에 여러 통화 잔액이 있는 경우 모두 합산
 */
function buildUnifiedBalances(
  balances: AccountBalanceInfo[],
  primaryCurrency: string,
  convert: (amount: number, from: string, to: string) => number,
): AccountBalanceInfo[] {
  const accountMap = new Map<string, AccountBalanceInfo>();

  for (const b of balances) {
    const converted = convert(b.balance, b.currency, primaryCurrency);
    const existing = accountMap.get(b.accountId);
    if (existing) {
      accountMap.set(b.accountId, { ...existing, balance: existing.balance + converted });
    } else {
      accountMap.set(b.accountId, { ...b, balance: converted, currency: primaryCurrency });
    }
  }

  return Array.from(accountMap.values());
}
