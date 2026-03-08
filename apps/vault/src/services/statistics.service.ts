/**
 * @file statistics.service.ts
 * @description 통계 데이터 조회 서비스
 * @module services/statistics
 */

import { supabase } from './supabase';
import type { DbTransaction, DbAccountBalance } from '../types/database.types';
import type { Transaction } from '../types/transaction.types';
import { mapDbToTransaction } from '../types/transaction.types';

// ============================================================
// 타입
// ============================================================

/** 월별 수입/지출 요약 */
export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

/** 카테고리별 금액 */
export interface CategoryAmount {
  categoryId: string;
  categoryName: string;
  icon: string | null;
  amount: number;
}

/** 통장별 잔액 */
export interface AccountBalanceInfo {
  accountId: string;
  accountName: string;
  currency: string;
  balance: number;
}

// ============================================================
// 테이블 이름
// ============================================================

const TX_TABLE = 'vault_transactions';
const ACCOUNT_TABLE = 'vault_accounts';
const BALANCE_TABLE = 'vault_account_balances';
const CATEGORY_TABLE = 'vault_categories';

// ============================================================
// 조회 함수
// ============================================================

/** 기간 내 모든 거래내역 조회 (통계용) */
export async function fetchTransactionsForPeriod(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from(TX_TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)
    .order('transaction_date', { ascending: true });

  if (error) throw new Error(`통계 데이터 조회 실패: ${error.message}`);
  return (data as DbTransaction[]).map(mapDbToTransaction);
}

/** 통장별 잔액 전체 조회 (통장 이름 포함) */
export async function fetchAccountBalances(
  userId: string,
): Promise<AccountBalanceInfo[]> {
  const { data: accounts, error: accErr } = await supabase
    .from(ACCOUNT_TABLE)
    .select('id, name')
    .eq('user_id', userId)
    .is('deleted_at', null);

  if (accErr) throw new Error(`통장 조회 실패: ${accErr.message}`);

  const accountIds = (accounts ?? []).map((a: { id: string }) => a.id);
  if (accountIds.length === 0) return [];

  const { data: balances, error: balErr } = await supabase
    .from(BALANCE_TABLE)
    .select('account_id, currency, balance')
    .in('account_id', accountIds);

  if (balErr) throw new Error(`잔액 조회 실패: ${balErr.message}`);

  const accountMap = new Map((accounts ?? []).map((a: { id: string; name: string }) => [a.id, a.name]));

  return (balances as DbAccountBalance[]).map((b) => ({
    accountId: b.account_id,
    accountName: accountMap.get(b.account_id) ?? '알 수 없음',
    currency: b.currency,
    balance: b.balance,
  }));
}

/** 카테고리 이름 맵 조회 */
export async function fetchCategoryMap(
  userId: string,
): Promise<Map<string, { name: string; icon: string | null }>> {
  const { data, error } = await supabase
    .from(CATEGORY_TABLE)
    .select('id, name, icon')
    .eq('user_id', userId);

  if (error) throw new Error(`카테고리 조회 실패: ${error.message}`);

  const map = new Map<string, { name: string; icon: string | null }>();
  for (const row of data ?? []) {
    map.set(row.id, { name: row.name, icon: row.icon });
  }
  return map;
}
