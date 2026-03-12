/**
 * @file DashboardPage.tsx
 * @description 대시보드 페이지 - 정보 중심형
 * @module pages/DashboardPage
 */

import { useState, useEffect, useMemo, useCallback, useRef, type ReactNode } from 'react';

/** 캐시 유효 시간 (ms) — 60초 이내 재방문 시 재로드 방지 */
const CACHE_TTL_MS = 60_000;
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAccountStore } from '../stores/accountStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { ROUTES } from '../constants/routes';
import { GlassCard, LoadingSpinner, EmptyState } from '@pompcore/ui';
import { formatCurrency, formatSignedCurrency } from '../utils/currency';
import { getCurrentMonthPeriod, getPrevMonth, getMonthPeriod } from '../utils/date';
import type { Transaction } from '../types/transaction.types';
import type { Announcement } from '../types/announcement.types';
import type { RecurringPayment } from '../types/recurring.types';
import type { Portfolio } from '../types/investment.types';
import type { RealEstate } from '../types/realEstate.types';
import * as txService from '../services/transaction.service';
import * as annService from '../services/announcement.service';
import * as recurringService from '../services/recurring.service';
import * as investmentService from '../services/investment.service';
import * as realEstateService from '../services/realEstate.service';
import { getNextOccurrence } from '../utils/recurringCalculator';
import { computeHoldings, enrichHoldingsWithPnL } from '../utils/investmentCalculator';
import { IconMegaphone, IconChart, IconBank, IconInvestment, IconRealEstate } from '@pompcore/ui';
import { IconPlus, IconTransfer } from '@pompcore/ui';

// ============================================================
// 상수
// ============================================================

const RECENT_TX_COUNT = 5;
const UPCOMING_DAYS = 7;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// ============================================================
// DashboardPage
// ============================================================

/** 대시보드 페이지 */
export function DashboardPage(): ReactNode {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { accounts, loadAccounts } = useAccountStore();
  const { settings, loadSettings } = useSettingsStore();
  const primaryCurrency = settings?.primaryCurrency ?? 'KRW';
  const { convert, isLoading: ratesLoading } = useExchangeRates(primaryCurrency);

  const [currentMonthTx, setCurrentMonthTx] = useState<Transaction[]>([]);
  const [prevMonthTx, setPrevMonthTx] = useState<Transaction[]>([]);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState<Announcement[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  /** 투자 포트폴리오별 시가 합산 (통화 → 금액) */
  const [investmentByCurrency, setInvestmentByCurrency] = useState<Map<string, number>>(new Map());
  /** 부동산 자산 합산 (통화 → 금액) */
  const [realEstateByCurrency, setRealEstateByCurrency] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const currentPeriod = useMemo(() => getCurrentMonthPeriod(), []);
  const prevPeriod = useMemo(() => {
    const { year, month } = getPrevMonth(currentPeriod.year, currentPeriod.month);
    return getMonthPeriod(year, month);
  }, [currentPeriod]);

  /** 안정적인 함수 참조로 불필요한 재실행 방지 */
  const loadAccountsRef = useRef(loadAccounts);
  loadAccountsRef.current = loadAccounts;
  const loadSettingsRef = useRef(loadSettings);
  loadSettingsRef.current = loadSettings;

  /** 마지막 로드 시각 — TTL 이내 재로드 방지 */
  const lastLoadedAtRef = useRef<number>(0);

  const loadDashboard = useCallback(async (userId: string) => {
    const now = Date.now();
    if (now - lastLoadedAtRef.current < CACHE_TTL_MS) return;

    setIsLoading(true);
    try {
      const [txs, prevTxs, anns, recs, portfolios, properties] = await Promise.all([
        txService.fetchTransactions(userId, currentPeriod.startDate, currentPeriod.endDate),
        txService.fetchTransactions(userId, prevPeriod.startDate, prevPeriod.endDate),
        annService.fetchAnnouncements(),
        recurringService.fetchRecurringPayments(userId),
        investmentService.fetchPortfolios(userId),
        realEstateService.fetchProperties(userId),
        loadAccountsRef.current(userId),
        loadSettingsRef.current(userId),
      ]);
      setCurrentMonthTx(txs);
      setPrevMonthTx(prevTxs);
      setPinnedAnnouncements(anns.filter((a) => a.isPinned));
      setRecurringPayments(recs.filter((r) => r.isActive));

      /* 투자 포트폴리오 시가 합산 */
      const invMap = await calcInvestmentTotals(portfolios);
      setInvestmentByCurrency(invMap);

      /* 부동산 자산 합산 (소유자만) */
      const reMap = calcRealEstateTotals(properties);
      setRealEstateByCurrency(reMap);

      lastLoadedAtRef.current = Date.now();
    } catch {
      setLoadError('데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPeriod, prevPeriod]);

  useEffect(() => {
    const uid = user?.id;
    if (!uid) return;
    loadDashboard(uid);
  }, [user?.id, loadDashboard]);

  /* 통장 잔액 (통화별) */
  const accountByCurrency = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>();
    for (const acc of accounts) {
      for (const bal of acc.balances) {
        map.set(bal.currency, (map.get(bal.currency) ?? 0) + bal.balance);
      }
    }
    return map;
  }, [accounts]);

  /* 총 자산 = 통장 + 투자 + 부동산 (통화별) */
  const totalByCurrency = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>();
    const merge = (src: Map<string, number>): void => {
      for (const [c, v] of src.entries()) {
        map.set(c, (map.get(c) ?? 0) + v);
      }
    };
    merge(accountByCurrency);
    merge(investmentByCurrency);
    merge(realEstateByCurrency);
    return map;
  }, [accountByCurrency, investmentByCurrency, realEstateByCurrency]);

  /** 자산 구성 존재 여부 (구분 표시용) */
  const hasMultipleAssetTypes = investmentByCurrency.size > 0 || realEstateByCurrency.size > 0;

  /* 주 통화 기준 환산 합산 (복수 통화일 때만 표시) */
  const unifiedTotal = useMemo(() => {
    if (totalByCurrency.size <= 1) return null;
    let total = 0;
    for (const [currency, amount] of totalByCurrency.entries()) {
      total += convert(amount, currency, primaryCurrency);
    }
    return total;
  }, [totalByCurrency, convert, primaryCurrency]);

  /* 최근 5건 (이번달 거래에서 추출) */
  const recentTx = useMemo(() => currentMonthTx.slice(0, RECENT_TX_COUNT), [currentMonthTx]);

  /* 통화 표시 기준 순서 — 계좌 기반으로 고정, 모든 섹션에서 동일하게 사용 */
  const sortedCurrencies = useMemo(
    () => Array.from(totalByCurrency.keys()),
    [totalByCurrency],
  );

  const monthSummaryByCurrency = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    for (const tx of currentMonthTx) {
      const entry = map.get(tx.currency) ?? { income: 0, expense: 0 };
      if (tx.type === 'income') entry.income += tx.amount;
      else entry.expense += tx.amount;
      map.set(tx.currency, entry);
    }
    return map;
  }, [currentMonthTx]);

  /* 전월 총자산 (전월 거래 기반 델타) */
  const prevMonthDeltaByCurrency = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of prevMonthTx) {
      const delta = tx.type === 'income' ? tx.amount : -tx.amount;
      map.set(tx.currency, (map.get(tx.currency) ?? 0) + delta);
    }
    return map;
  }, [prevMonthTx]);

  /* 다가오는 정기결제 (7일 이내) */
  const upcomingPayments = useMemo(() => {
    return recurringPayments
      .map((rp) => {
        const nextDate = getNextOccurrence(rp.startDate, rp.intervalUnit, rp.intervalValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next = new Date(nextDate + 'T00:00:00');
        const daysUntil = Math.round((next.getTime() - today.getTime()) / MS_PER_DAY);
        return { ...rp, nextDate, daysUntil };
      })
      .filter((rp) => rp.daysUntil !== null && rp.daysUntil >= 0 && rp.daysUntil <= UPCOMING_DAYS)
      .sort((a, b) => (a.daysUntil ?? 0) - (b.daysUntil ?? 0));
  }, [recurringPayments]);

  if (isLoading || ratesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="sr-only">대시보드</h1>

      {/* 로딩 에러 배너 */}
      {loadError && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span>{loadError}</span>
          <button type="button" onClick={() => setLoadError(null)} className="ml-2 text-red-400 hover:text-red-600 dark:hover:text-red-300" aria-label="에러 닫기">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 고정 공지 배너 */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-2">
          {pinnedAnnouncements.map((ann) => (
            <button
              key={ann.id}
              type="button"
              onClick={() => navigate(`/announcements/${ann.id}`)}
              className="w-full text-left rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 transition-colors hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={`공지 보기: ${ann.title}`}
            >
              <IconMegaphone className="mr-2 inline h-4 w-4" aria-hidden="true" />
              {ann.title}
            </button>
          ))}
        </div>
      )}

      {/* 총 자산 */}
      <GlassCard padding="lg">
        <div className="mb-1 text-xs font-medium text-navy/50 dark:text-gray-400">총 자산</div>
        {totalByCurrency.size === 0 ? (
          <EmptyState
            icon={<IconBank className="h-7 w-7" />}
            title="등록된 통장이 없습니다"
            description="통장을 추가하여 자산을 관리해보세요."
            actionLabel="통장 추가하기"
            onAction={() => navigate(ROUTES.ACCOUNTS)}
          />
        ) : (
          <>
            <div className="space-y-2">
              {Array.from(totalByCurrency.entries()).map(([currency, total]) => {
                const convertedTotal = currency !== primaryCurrency && total !== 0
                  ? convert(total, currency, primaryCurrency)
                  : null;
                return (
                  <div key={currency}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold tabular-nums text-navy dark:text-gray-100">
                        {formatCurrency(total, currency)}
                      </span>
                      {prevMonthDeltaByCurrency.has(currency) && (
                        <span className={`text-xs ${
                          (prevMonthDeltaByCurrency.get(currency) ?? 0) >= 0
                            ? 'text-vault-color'
                            : 'text-red-500'
                        }`}>
                          전월 대비 {formatSignedCurrency(prevMonthDeltaByCurrency.get(currency) ?? 0, currency)}
                        </span>
                      )}
                    </div>
                    {convertedTotal !== null && (
                      <div className="text-xs tabular-nums text-navy/40 dark:text-gray-500">
                        ≈ {formatCurrency(convertedTotal, primaryCurrency)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 환산 합산 (복수 통화일 때만) */}
            {unifiedTotal !== null && (
              <div className="mt-2 border-t border-navy/5 pt-2 dark:border-white/5">
                <div className="text-xs text-navy/40 dark:text-gray-500">
                  {primaryCurrency} 환산 합계
                </div>
                <div className="text-base font-semibold tabular-nums text-navy/70 dark:text-gray-300">
                  ≈ {formatCurrency(unifiedTotal, primaryCurrency)}
                </div>
              </div>
            )}

            {/* 자산 유형별 구분 (투자/부동산 있을 때만) */}
            {hasMultipleAssetTypes && (
              <div className="mt-3 border-t border-navy/5 pt-3 dark:border-white/5">
                <div className="mb-2 text-xs font-medium text-navy/40 dark:text-gray-500">자산 구성</div>
                <div className="grid grid-cols-2 gap-2 tablet:grid-cols-3">
                  <AssetTypeCard
                    icon={<IconBank className="h-4 w-4" />}
                    label="통장"
                    amounts={accountByCurrency}
                    primaryCurrency={primaryCurrency}
                    convert={convert}
                  />
                  {investmentByCurrency.size > 0 && (
                    <AssetTypeCard
                      icon={<IconInvestment className="h-4 w-4" />}
                      label="투자"
                      amounts={investmentByCurrency}
                      primaryCurrency={primaryCurrency}
                      convert={convert}
                    />
                  )}
                  {realEstateByCurrency.size > 0 && (
                    <AssetTypeCard
                      icon={<IconRealEstate className="h-4 w-4" />}
                      label="부동산"
                      amounts={realEstateByCurrency}
                      primaryCurrency={primaryCurrency}
                      convert={convert}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </GlassCard>

      {/* 이번 달 수입/지출 */}
      <div className="grid gap-4 tablet:grid-cols-2">
        <GlassCard padding="md">
          <div className="mb-1 text-xs font-medium text-navy/50 dark:text-gray-400">
            {currentPeriod.month}월 수입
          </div>
          {monthSummaryByCurrency.size === 0 ? (
            <div className="text-lg font-bold text-blue-500">-</div>
          ) : (
            sortedCurrencies
              .filter((c) => monthSummaryByCurrency.has(c))
              .map((currency) => (
                <div key={currency} className="text-lg font-bold tabular-nums text-blue-500">
                  {formatCurrency(monthSummaryByCurrency.get(currency)!.income, currency)}
                </div>
              ))
          )}
        </GlassCard>
        <GlassCard padding="md">
          <div className="mb-1 text-xs font-medium text-navy/50 dark:text-gray-400">
            {currentPeriod.month}월 지출
          </div>
          {monthSummaryByCurrency.size === 0 ? (
            <div className="text-lg font-bold text-red-500">-</div>
          ) : (
            sortedCurrencies
              .filter((c) => monthSummaryByCurrency.has(c))
              .map((currency) => (
                <div key={currency} className="text-lg font-bold tabular-nums text-red-500">
                  {formatCurrency(monthSummaryByCurrency.get(currency)!.expense, currency)}
                </div>
              ))
          )}
        </GlassCard>
      </div>

      {/* 최근 거래내역 */}
      <GlassCard padding="md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-navy/50 dark:text-gray-400">최근 거래</span>
          <button
            type="button"
            onClick={() => navigate(ROUTES.TRANSACTIONS)}
            className="text-xs text-vault-color hover:underline"
          >
            전체 보기
          </button>
        </div>
        {recentTx.length === 0 ? (
          <p className="text-sm text-navy/40 dark:text-gray-500">거래내역이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-navy dark:text-gray-100">{tx.name}</div>
                  <div className="text-xs text-navy/40 dark:text-gray-500">
                    {tx.transactionDate.slice(5).replace('-', '/')}
                  </div>
                </div>
                <span className={`font-semibold tabular-nums ${tx.type === 'income' ? 'text-blue-500' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 다가오는 정기결제 */}
      {upcomingPayments.length > 0 && (
        <GlassCard padding="md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-navy/50 dark:text-gray-400">
              다가오는 결제 ({UPCOMING_DAYS}일 이내)
            </span>
            <button
              type="button"
              onClick={() => navigate(ROUTES.RECURRING)}
              className="text-xs text-vault-color hover:underline"
            >
              전체 보기
            </button>
          </div>
          <div className="space-y-2">
            {upcomingPayments.map((rp) => (
              <div key={rp.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-navy dark:text-gray-100">{rp.name}</div>
                  <div className="text-xs text-navy/40 dark:text-gray-500">
                    {rp.daysUntil === 0 ? '오늘' : `${rp.daysUntil}일 후`}
                  </div>
                </div>
                <span className={`font-semibold tabular-nums ${rp.type === 'income' ? 'text-blue-500' : 'text-red-500'}`}>
                  {formatCurrency(rp.amount, rp.currency)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 퀵 액션 */}
      <div className="grid grid-cols-3 gap-3">
        <QuickAction icon={<IconPlus className="h-5 w-5" />} label="거래 추가" onClick={() => navigate(ROUTES.TRANSACTIONS)} />
        <QuickAction icon={<IconTransfer className="h-5 w-5" />} label="이체" onClick={() => navigate(ROUTES.ACCOUNTS)} />
        <QuickAction icon={<IconChart className="h-5 w-5" />} label="통계" onClick={() => navigate(ROUTES.STATISTICS)} />
      </div>
    </div>
  );
}

// ============================================================
// 내부 컴포넌트
// ============================================================

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/20 bg-white/80 py-4 text-sm font-medium text-navy shadow-card backdrop-blur-[16px] transition-shadow hover:shadow-card-hover dark:border-white/10 dark:bg-surface-card-dark dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
    >
      <div className="text-vault-color">{icon}</div>
      <span className="text-xs">{label}</span>
    </button>
  );
}

/** 자산 유형별 요약 카드 */
function AssetTypeCard({
  icon,
  label,
  amounts,
  primaryCurrency,
  convert,
}: {
  icon: ReactNode;
  label: string;
  amounts: Map<string, number>;
  primaryCurrency: string;
  convert: (amount: number, from: string, to: string) => number;
}): ReactNode {
  let total = 0;
  for (const [currency, amount] of amounts.entries()) {
    total += convert(amount, currency, primaryCurrency);
  }
  return (
    <div className="rounded-lg bg-navy/5 px-3 py-2 dark:bg-white/5">
      <div className="mb-1 flex items-center gap-1.5 text-navy/50 dark:text-gray-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold tabular-nums text-navy dark:text-gray-200">
        {formatCurrency(total, primaryCurrency)}
      </div>
    </div>
  );
}

// ============================================================
// 대시보드 자산 계산 헬퍼
// ============================================================

/** 투자 포트폴리오 전체 시가 합산 (통화별) */
async function calcInvestmentTotals(portfolios: Portfolio[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (portfolios.length === 0) return map;

  /* 각 포트폴리오의 trades + snapshots를 병렬 로드 */
  const details = await Promise.all(
    portfolios.map(async (p) => {
      const [trades, snapshots] = await Promise.all([
        investmentService.fetchTrades(p.id),
        investmentService.fetchSnapshots(p.id),
      ]);
      return { portfolio: p, trades, snapshots };
    }),
  );

  for (const { portfolio, trades, snapshots } of details) {
    const holdings = computeHoldings(trades);
    const enriched = enrichHoldingsWithPnL(holdings, snapshots);
    const marketValue = enriched.reduce((sum, h) => sum + h.marketValue, 0);
    if (marketValue > 0) {
      map.set(portfolio.baseCurrency, (map.get(portfolio.baseCurrency) ?? 0) + marketValue);
    }
  }

  return map;
}

/** 부동산 자산 합산 (소유자 물건의 currentValue, 통화별) */
function calcRealEstateTotals(properties: RealEstate[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const prop of properties) {
    if (prop.role === 'owner' && prop.currentValue && prop.currentValue > 0) {
      map.set(prop.currency, (map.get(prop.currency) ?? 0) + prop.currentValue);
    }
  }
  return map;
}
