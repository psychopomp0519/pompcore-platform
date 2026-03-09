/**
 * @file investment.service.ts
 * @description 투자 포트폴리오 CRUD 서비스 (Supabase)
 * @module services/investment
 */

import { supabase } from './supabase';
import type {
  DbInvestmentPortfolio,
  DbInvestmentPortfolioInsert,
  DbInvestmentPortfolioUpdate,
  DbInvestmentTrade,
  DbInvestmentTradeInsert,
  DbInvestmentPriceSnapshot,
} from '../types/database.types';
import type {
  Portfolio,
  PortfolioFormData,
  InvestmentTrade,
  TradeFormData,
  PriceSnapshot,
} from '../types/investment.types';

// ============================================================
// 테이블 이름 상수
// ============================================================

const PORTFOLIO_TABLE = 'investment_portfolios' as const;
const TRADE_TABLE = 'investment_trades' as const;
const SNAPSHOT_TABLE = 'investment_price_snapshots' as const;

// ============================================================
// 포트폴리오 조회
// ============================================================

/** 사용자 포트폴리오 목록 조회 (소프트 삭제 제외) */
export async function fetchPortfolios(userId: string): Promise<Portfolio[]> {
  const { data, error } = await supabase
    .from(PORTFOLIO_TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw new Error(`포트폴리오 조회 실패: ${error.message}`);
  return (data as DbInvestmentPortfolio[]).map(mapDbPortfolio);
}

/** 단일 포트폴리오 조회 */
export async function fetchPortfolio(portfolioId: string): Promise<Portfolio> {
  const { data, error } = await supabase
    .from(PORTFOLIO_TABLE)
    .select('*')
    .eq('id', portfolioId)
    .is('deleted_at', null)
    .single();

  if (error) throw new Error(`포트폴리오 조회 실패: ${error.message}`);
  return mapDbPortfolio(data as DbInvestmentPortfolio);
}

// ============================================================
// 거래 기록 조회
// ============================================================

/** 포트폴리오 거래 기록 조회 (소프트 삭제 제외, 날짜 내림차순) */
export async function fetchTrades(portfolioId: string): Promise<InvestmentTrade[]> {
  const { data, error } = await supabase
    .from(TRADE_TABLE)
    .select('*')
    .eq('portfolio_id', portfolioId)
    .is('deleted_at', null)
    .order('trade_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(`거래 기록 조회 실패: ${error.message}`);
  return (data as DbInvestmentTrade[]).map(mapDbTrade);
}

// ============================================================
// 현재가 스냅샷 조회
// ============================================================

/** 포트폴리오 현재가 스냅샷 조회 */
export async function fetchSnapshots(portfolioId: string): Promise<PriceSnapshot[]> {
  const { data, error } = await supabase
    .from(SNAPSHOT_TABLE)
    .select('*')
    .eq('portfolio_id', portfolioId);

  if (error) throw new Error(`현재가 조회 실패: ${error.message}`);
  return (data as DbInvestmentPriceSnapshot[]).map(mapDbSnapshot);
}

// ============================================================
// 포트폴리오 생성/수정/삭제
// ============================================================

/** 포트폴리오 생성 */
export async function createPortfolio(
  userId: string,
  form: PortfolioFormData,
): Promise<Portfolio> {
  const insert: DbInvestmentPortfolioInsert = {
    user_id: userId,
    name: form.name,
    broker: form.broker || null,
    asset_type: form.assetType,
    base_currency: form.baseCurrency,
    linked_account_id: form.linkedAccountId,
    memo: form.memo || null,
    is_favorite: false,
    sort_order: 0,
  };

  const { data, error } = await supabase
    .from(PORTFOLIO_TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`포트폴리오 생성 실패: ${error.message}`);
  return mapDbPortfolio(data as DbInvestmentPortfolio);
}

/** 포트폴리오 수정 */
export async function updatePortfolio(
  portfolioId: string,
  form: PortfolioFormData,
): Promise<void> {
  const update: DbInvestmentPortfolioUpdate = {
    name: form.name,
    broker: form.broker || null,
    asset_type: form.assetType,
    base_currency: form.baseCurrency,
    linked_account_id: form.linkedAccountId,
    memo: form.memo || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from(PORTFOLIO_TABLE)
    .update(update)
    .eq('id', portfolioId);

  if (error) throw new Error(`포트폴리오 수정 실패: ${error.message}`);
}

/** 포트폴리오 소프트 삭제 */
export async function deletePortfolio(portfolioId: string): Promise<void> {
  const { error } = await supabase
    .from(PORTFOLIO_TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', portfolioId);

  if (error) throw new Error(`포트폴리오 삭제 실패: ${error.message}`);
}

// ============================================================
// 거래 기록 생성/삭제
// ============================================================

/** 거래 기록 추가 */
export async function addTrade(
  userId: string,
  portfolioId: string,
  form: TradeFormData,
): Promise<InvestmentTrade> {
  const insert: DbInvestmentTradeInsert = {
    user_id: userId,
    portfolio_id: portfolioId,
    ticker: form.ticker.toUpperCase(),
    asset_name: form.assetName,
    trade_type: form.tradeType,
    quantity: parseFloat(form.quantity),
    price: parseFloat(form.price),
    fee: parseFloat(form.fee) || 0,
    trade_date: form.tradeDate,
    currency: form.currency,
    memo: form.memo || null,
  };

  const { data, error } = await supabase
    .from(TRADE_TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`거래 추가 실패: ${error.message}`);
  return mapDbTrade(data as DbInvestmentTrade);
}

/** 거래 기록 소프트 삭제 */
export async function deleteTrade(tradeId: string): Promise<void> {
  const { error } = await supabase
    .from(TRADE_TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', tradeId);

  if (error) throw new Error(`거래 삭제 실패: ${error.message}`);
}

// ============================================================
// 현재가 스냅샷 upsert
// ============================================================

/** 현재가 스냅샷 upsert (portfolio_id + ticker 기준) */
export async function upsertSnapshot(snapshot: {
  portfolioId: string;
  ticker: string;
  currentPrice: number;
  currency: string;
}): Promise<void> {
  const { error } = await supabase
    .from(SNAPSHOT_TABLE)
    .upsert(
      {
        portfolio_id: snapshot.portfolioId,
        ticker: snapshot.ticker,
        current_price: snapshot.currentPrice,
        currency: snapshot.currency,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'portfolio_id,ticker' },
    );

  if (error) throw new Error(`현재가 업데이트 실패: ${error.message}`);
}

// ============================================================
// 매퍼 함수
// ============================================================

/** DB 포트폴리오 → 도메인 포트폴리오 */
export function mapDbPortfolio(db: DbInvestmentPortfolio): Portfolio {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    broker: db.broker,
    assetType: db.asset_type,
    baseCurrency: db.base_currency,
    linkedAccountId: db.linked_account_id,
    memo: db.memo,
    isFavorite: db.is_favorite,
    sortOrder: db.sort_order,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

/** DB 거래 기록 → 도메인 거래 기록 */
export function mapDbTrade(db: DbInvestmentTrade): InvestmentTrade {
  return {
    id: db.id,
    userId: db.user_id,
    portfolioId: db.portfolio_id,
    ticker: db.ticker,
    assetName: db.asset_name,
    tradeType: db.trade_type,
    quantity: db.quantity,
    price: db.price,
    fee: db.fee,
    tradeDate: db.trade_date,
    currency: db.currency,
    memo: db.memo,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

/** DB 스냅샷 → 도메인 스냅샷 */
export function mapDbSnapshot(db: DbInvestmentPriceSnapshot): PriceSnapshot {
  return {
    portfolioId: db.portfolio_id,
    ticker: db.ticker,
    currentPrice: db.current_price,
    currency: db.currency,
    updatedAt: db.updated_at,
  };
}
