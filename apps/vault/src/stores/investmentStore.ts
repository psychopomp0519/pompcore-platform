/**
 * @file investmentStore.ts
 * @description 투자 포트폴리오 상태를 관리하는 Zustand 스토어
 * @module stores/investmentStore
 */

import { create } from 'zustand';
import type { Portfolio, PortfolioFormData, InvestmentTrade, TradeFormData, PriceSnapshot } from '../types/investment.types';
import * as investmentService from '../services/investment.service';
import { toUserMessage } from '@pompcore/ui';

// ============================================================
// 타입 정의
// ============================================================

interface InvestmentState {
  /** 포트폴리오 목록 */
  portfolios: Portfolio[];
  /** 현재 선택된 포트폴리오 ID */
  selectedPortfolioId: string | null;
  /** 선택된 포트폴리오의 거래 기록 */
  trades: InvestmentTrade[];
  /** 선택된 포트폴리오의 현재가 스냅샷 */
  snapshots: PriceSnapshot[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

interface InvestmentActions {
  /** 포트폴리오 목록 로드 */
  loadPortfolios: (userId: string) => Promise<void>;
  /** 포트폴리오 상세 (거래+스냅샷) 로드 */
  loadPortfolioDetail: (portfolioId: string) => Promise<void>;
  /** 포트폴리오 추가 */
  addPortfolio: (userId: string, form: PortfolioFormData) => Promise<void>;
  /** 포트폴리오 수정 */
  editPortfolio: (portfolioId: string, form: PortfolioFormData) => Promise<void>;
  /** 포트폴리오 삭제 */
  removePortfolio: (portfolioId: string) => Promise<void>;
  /** 거래 기록 추가 */
  addTrade: (userId: string, portfolioId: string, form: TradeFormData) => Promise<void>;
  /** 거래 기록 삭제 후 상세 재로드 */
  removeTrade: (tradeId: string, portfolioId: string) => Promise<void>;
  /** 현재가 스냅샷 업데이트 */
  updatePrice: (snapshot: { portfolioId: string; ticker: string; currentPrice: number; currency: string }) => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

// ============================================================
// 초기 상태
// ============================================================

const INITIAL_STATE: InvestmentState = {
  portfolios: [],
  selectedPortfolioId: null,
  trades: [],
  snapshots: [],
  isLoading: false,
  error: null,
};

// ============================================================
// 스토어
// ============================================================

/** 투자 포트폴리오 상태 스토어 */
export const useInvestmentStore = create<InvestmentState & InvestmentActions>()((set) => ({
  ...INITIAL_STATE,

  loadPortfolios: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const portfolios = await investmentService.fetchPortfolios(userId);
      set({ portfolios, isLoading: false });
    } catch (err) {
      set({ error: toUserMessage(err), isLoading: false });
    }
  },

  loadPortfolioDetail: async (portfolioId) => {
    set({ isLoading: true, error: null, selectedPortfolioId: portfolioId });
    try {
      const [trades, snapshots] = await Promise.all([
        investmentService.fetchTrades(portfolioId),
        investmentService.fetchSnapshots(portfolioId),
      ]);
      set({ trades, snapshots, isLoading: false });
    } catch (err) {
      set({ error: toUserMessage(err), isLoading: false });
    }
  },

  addPortfolio: async (userId, form) => {
    set({ error: null });
    try {
      const created = await investmentService.createPortfolio(userId, form);
      set((state) => ({ portfolios: [...state.portfolios, created] }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  editPortfolio: async (portfolioId, form) => {
    set({ error: null });
    try {
      await investmentService.updatePortfolio(portfolioId, form);
      set((state) => ({
        portfolios: state.portfolios.map((p) =>
          p.id === portfolioId
            ? { ...p, ...form, broker: form.broker || null, memo: form.memo || null }
            : p,
        ),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removePortfolio: async (portfolioId) => {
    set({ error: null });
    try {
      await investmentService.deletePortfolio(portfolioId);
      set((state) => ({
        portfolios: state.portfolios.filter((p) => p.id !== portfolioId),
      }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  addTrade: async (userId, portfolioId, form) => {
    set({ error: null });
    try {
      const created = await investmentService.addTrade(userId, portfolioId, form);
      set((state) => ({ trades: [created, ...state.trades] }));
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  removeTrade: async (tradeId, portfolioId) => {
    set({ error: null });
    try {
      await investmentService.deleteTrade(tradeId);
      set((state) => ({ trades: state.trades.filter((t) => t.id !== tradeId) }));
      /* 스냅샷 재로드 (보유 수량 변화에 따른 스냅샷 정합성 유지) */
      const snapshots = await investmentService.fetchSnapshots(portfolioId);
      set({ snapshots });
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  updatePrice: async (snapshot) => {
    set({ error: null });
    try {
      await investmentService.upsertSnapshot(snapshot);
      set((state) => {
        const existing = state.snapshots.find((s) => s.ticker === snapshot.ticker);
        const updated: PriceSnapshot = {
          portfolioId: snapshot.portfolioId,
          ticker: snapshot.ticker,
          currentPrice: snapshot.currentPrice,
          currency: snapshot.currency,
          updatedAt: new Date().toISOString(),
        };
        if (existing) {
          return { snapshots: state.snapshots.map((s) => s.ticker === snapshot.ticker ? updated : s) };
        }
        return { snapshots: [...state.snapshots, updated] };
      });
    } catch (err) {
      set({ error: toUserMessage(err) });
    }
  },

  clearError: () => set({ error: null }),
}));
