/**
 * @file investment.types.ts
 * @description 투자 관련 도메인 타입 정의
 * @module types/investment
 */

import type { AssetType, TradeType } from './database.types';

// ============================================================
// 포트폴리오
// ============================================================

/** 투자 포트폴리오 (증권사·거래소 계좌 단위) */
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  broker: string | null;
  assetType: AssetType;
  baseCurrency: string;
  linkedAccountId: string | null;
  memo: string | null;
  isFavorite: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioFormData {
  name: string;
  broker: string;
  assetType: AssetType;
  baseCurrency: string;
  linkedAccountId: string | null;
  memo: string;
}

// ============================================================
// 거래 기록
// ============================================================

/** 매매·배당 거래 기록 */
export interface InvestmentTrade {
  id: string;
  userId: string;
  portfolioId: string;
  ticker: string;
  assetName: string;
  tradeType: TradeType;
  quantity: number;
  price: number;
  fee: number;
  tradeDate: string;
  currency: string;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TradeFormData {
  ticker: string;
  assetName: string;
  tradeType: TradeType;
  quantity: string;
  price: string;
  fee: string;
  tradeDate: string;
  currency: string;
  memo: string;
}

// ============================================================
// 현재가 스냅샷
// ============================================================

/** 종목별 현재가 (사용자 직접 입력) */
export interface PriceSnapshot {
  portfolioId: string;
  ticker: string;
  currentPrice: number;
  currency: string;
  updatedAt: string;
}

// ============================================================
// 보유 종목 (거래 기록에서 파생)
// ============================================================

/** 보유 종목 집계 결과 */
export interface Holding {
  ticker: string;
  assetName: string;
  quantity: number;
  /** 매수 평균단가 */
  avgPrice: number;
  currency: string;
  /** 총 투자 원가 */
  totalCost: number;
}

/** 보유 종목 + 현재가 손익 계산 결과 */
export interface HoldingWithPnL extends Holding {
  currentPrice: number;
  /** 평가금액 */
  marketValue: number;
  /** 미실현 손익 */
  unrealizedPnL: number;
  /** 미실현 수익률 (%) */
  returnRate: number;
}

// ============================================================
// 포트폴리오 요약
// ============================================================

/** 포트폴리오 전체 요약 */
export interface PortfolioSummary {
  totalCost: number;
  totalMarketValue: number;
  totalUnrealizedPnL: number;
  totalRealizedPnL: number;
  returnRate: number;
  currency: string;
}
