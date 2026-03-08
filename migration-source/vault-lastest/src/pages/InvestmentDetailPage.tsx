/**
 * @file InvestmentDetailPage.tsx
 * @description 투자 포트폴리오 상세 페이지 (/investments/:id)
 * @module pages/InvestmentDetailPage
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useInvestmentStore } from '../stores/investmentStore';
import type { PortfolioSummary, TradeFormData } from '../types/investment.types';
import type { AssetType } from '../types/database.types';
import { HoldingsTable } from '../components/investment/HoldingsTable';
import { TradeHistory } from '../components/investment/TradeHistory';
import { TradeForm } from '../components/investment/TradeForm';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { GlassCard } from '../components/common/GlassCard';
import {
  computeHoldings,
  enrichHoldingsWithPnL,
  calcPortfolioSummary,
  calcTotalRealizedPnL,
  formatReturnRate,
  pnlColorClass,
} from '../utils/investmentCalculator';

// ============================================================
// 상수
// ============================================================

/** 자산 유형 한국어 레이블 */
const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  stock_kr: '국내주식',
  stock_us: '해외주식',
  crypto: '암호화폐',
  mixed: '혼합',
};

// ============================================================
// InvestmentDetailPage
// ============================================================

/** 투자 포트폴리오 상세 페이지 */
export function InvestmentDetailPage(): ReactNode {
  const { id: portfolioId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    portfolios,
    trades,
    snapshots,
    isLoading,
    error,
    loadPortfolios,
    loadPortfolioDetail,
    addTrade,
    removeTrade,
    updatePrice,
    clearError,
  } = useInvestmentStore();

  /* 모달 상태 */
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const [deletingTradeId, setDeletingTradeId] = useState<string | null>(null);

  /* 현재 포트폴리오 */
  const portfolio = useMemo(
    () => portfolios.find((p) => p.id === portfolioId) ?? null,
    [portfolios, portfolioId],
  );

  /* 초기 데이터 로드 */
  useEffect(() => {
    if (!portfolioId) return;
    if (user?.id && portfolios.length === 0) {
      loadPortfolios(user.id);
    }
    loadPortfolioDetail(portfolioId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId, user?.id]);

  // ============================================================
  // 계산: 보유 종목 + 요약
  // ============================================================

  const holdings = useMemo(() => computeHoldings(trades), [trades]);
  const holdingsWithPnL = useMemo(
    () => enrichHoldingsWithPnL(holdings, snapshots),
    [holdings, snapshots],
  );
  const realizedPnL = useMemo(() => calcTotalRealizedPnL(trades), [trades]);
  const summary = useMemo<PortfolioSummary | null>(() => {
    if (!portfolio) return null;
    return calcPortfolioSummary(holdingsWithPnL, realizedPnL, portfolio.baseCurrency);
  }, [holdingsWithPnL, realizedPnL, portfolio]);

  // ============================================================
  // 핸들러
  // ============================================================

  async function handleAddTrade(form: TradeFormData): Promise<void> {
    if (!user?.id || !portfolioId) return;
    await addTrade(user.id, portfolioId, form);
    if (!useInvestmentStore.getState().error) setIsTradeFormOpen(false);
  }

  function handleDeleteTradeConfirm(): void {
    if (!deletingTradeId || !portfolioId) return;
    removeTrade(deletingTradeId, portfolioId);
    setDeletingTradeId(null);
  }

  function handleUpdatePrice(ticker: string, currentPrice: number): void {
    if (!portfolio) return;
    const holding = holdingsWithPnL.find((h) => h.ticker === ticker);
    updatePrice({
      portfolioId: portfolio.id,
      ticker,
      currentPrice,
      currency: holding?.currency ?? portfolio.baseCurrency,
    });
  }

  // ============================================================
  // 로딩 / 에러 상태
  // ============================================================

  if (isLoading && !portfolio) {
    return <LoadingSpinner />;
  }

  if (!portfolioId) {
    return (
      <div className="py-16 text-center text-sm text-navy/50 dark:text-gray-500">
        잘못된 접근입니다.
      </div>
    );
  }

  // ============================================================
  // 렌더링
  // ============================================================

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* 에러 배너 */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="text-red-400 hover:text-red-500"
              aria-label="에러 닫기"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* 뒤로 가기 + 헤더 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/investments')}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-navy/60 transition-colors hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          목록
        </button>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">
            {portfolio?.name ?? '포트폴리오'}
          </h1>
          {portfolio && (
            <span className="rounded-full bg-navy/5 px-2 py-0.5 text-xs font-medium text-navy/60 dark:bg-white/10 dark:text-gray-400">
              {ASSET_TYPE_LABEL[portfolio.assetType]}
            </span>
          )}
        </div>
      </div>

      {/* 요약 카드 */}
      {summary && <SummaryCards summary={summary} />}

      {/* 보유 종목 테이블 */}
      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-navy dark:text-gray-100">보유 종목</h2>
          {isLoading && (
            <span className="text-xs text-navy/40 dark:text-gray-500">로딩 중...</span>
          )}
        </div>
        <HoldingsTable
          holdings={holdingsWithPnL}
          currency={portfolio?.baseCurrency ?? ''}
          onUpdatePrice={handleUpdatePrice}
        />
      </GlassCard>

      {/* 거래 내역 */}
      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-navy dark:text-gray-100">거래 내역</h2>
          <button
            type="button"
            onClick={() => setIsTradeFormOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-vault-color px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-vault-color/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            거래 추가
          </button>
        </div>
        <TradeHistory
          trades={trades}
          onDelete={(tradeId) => setDeletingTradeId(tradeId)}
        />
      </GlassCard>

      {/* 거래 추가 모달 */}
      <Modal
        isOpen={isTradeFormOpen}
        onClose={() => setIsTradeFormOpen(false)}
        title="거래 추가"
        maxWidth="md"
      >
        <TradeForm
          portfolioCurrency={portfolio?.baseCurrency ?? 'KRW'}
          onSubmit={handleAddTrade}
          onCancel={() => setIsTradeFormOpen(false)}
        />
      </Modal>

      {/* 거래 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingTradeId !== null}
        onClose={() => setDeletingTradeId(null)}
        onConfirm={handleDeleteTradeConfirm}
        title="거래 삭제"
        message="이 거래 기록을 삭제하시겠습니까? 보유 수량 및 손익이 재계산됩니다."
        confirmText="삭제"
        isDangerous
      />
    </div>
  );
}

// ============================================================
// SummaryCards
// ============================================================

interface SummaryCardsProps {
  summary: PortfolioSummary;
}

/** 포트폴리오 요약 카드 그리드 */
function SummaryCards({ summary }: SummaryCardsProps): ReactNode {
  const unrealizedColor = pnlColorClass(summary.totalUnrealizedPnL);
  const realizedColor = pnlColorClass(summary.totalRealizedPnL);
  const returnColor = pnlColorClass(summary.returnRate);
  const cur = summary.currency;

  const items = [
    {
      label: '총 매입가',
      value: `${summary.totalCost.toLocaleString('ko-KR')} ${cur}`,
      color: 'text-navy dark:text-gray-100',
    },
    {
      label: '평가금액',
      value: `${summary.totalMarketValue.toLocaleString('ko-KR')} ${cur}`,
      color: 'text-navy dark:text-gray-100',
    },
    {
      label: '미실현 손익',
      value: `${summary.totalUnrealizedPnL >= 0 ? '+' : ''}${summary.totalUnrealizedPnL.toLocaleString('ko-KR')} ${cur}`,
      color: unrealizedColor,
    },
    {
      label: '실현 손익',
      value: `${summary.totalRealizedPnL >= 0 ? '+' : ''}${summary.totalRealizedPnL.toLocaleString('ko-KR')} ${cur}`,
      color: realizedColor,
    },
    {
      label: '수익률',
      value: formatReturnRate(summary.returnRate),
      color: returnColor,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <GlassCard key={item.label} padding="sm">
          <div className="text-xs text-navy/50 dark:text-gray-500">{item.label}</div>
          <div className={`mt-1 tabular-nums text-sm font-bold ${item.color}`}>
            {item.value}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
