/**
 * @file account.service.ts
 * @description Server-side account service for Vault.
 *
 * Uses a user-scoped Supabase client so all queries respect RLS.
 * Business logic that was previously in the frontend is moved here
 * to enable server-side validation and future SaaS tier enforcement.
 *
 * @module @pompcore/api/services/account
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { NotFoundError, ValidationError } from '../lib/errors.js';

const ACCOUNTS_TABLE = 'vault_accounts';
const BALANCES_TABLE = 'vault_account_balances';

// ============================================================
// Types (server-side, not exported to clients)
// ============================================================

interface AccountRow {
  id: string;
  user_id: string;
  name: string;
  default_currency: string;
  supported_currencies: string[];
  is_favorite: boolean;
  sort_order: number;
  created_at: string;
  deleted_at: string | null;
}

interface BalanceRow {
  account_id: string;
  currency: string;
  balance: number;
}

export interface AccountResult {
  id: string;
  name: string;
  defaultCurrency: string;
  supportedCurrencies: string[];
  isFavorite: boolean;
  sortOrder: number;
  createdAt: string;
  balances: Record<string, number>;
}

interface CreateAccountInput {
  name: string;
  defaultCurrency: string;
  supportedCurrencies: string[];
  isFavorite?: boolean;
}

// ============================================================
// Queries
// ============================================================

/** Fetch all active accounts for the authenticated user */
export async function fetchAccounts(db: SupabaseClient, userId: string): Promise<AccountResult[]> {
  const { data: accounts, error } = await db
    .from(ACCOUNTS_TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`통장 조회 실패: ${error.message}`);
  if (!accounts || accounts.length === 0) return [];

  const ids = (accounts as AccountRow[]).map((a) => a.id);

  const { data: balances, error: balError } = await db
    .from(BALANCES_TABLE)
    .select('*')
    .in('account_id', ids);

  if (balError) throw new Error(`잔액 조회 실패: ${balError.message}`);

  const balMap = new Map<string, Record<string, number>>();
  for (const b of (balances ?? []) as BalanceRow[]) {
    const map = balMap.get(b.account_id) ?? {};
    map[b.currency] = b.balance;
    balMap.set(b.account_id, map);
  }

  return (accounts as AccountRow[]).map((a) => ({
    id: a.id,
    name: a.name,
    defaultCurrency: a.default_currency,
    supportedCurrencies: a.supported_currencies,
    isFavorite: a.is_favorite,
    sortOrder: a.sort_order,
    createdAt: a.created_at,
    balances: balMap.get(a.id) ?? {},
  }));
}

/** Create a new account with initial zero balances */
export async function createAccount(
  db: SupabaseClient,
  userId: string,
  input: CreateAccountInput,
  sortOrder: number,
): Promise<AccountResult> {
  if (!input.name.trim()) throw new ValidationError('통장 이름은 필수입니다.');
  if (input.supportedCurrencies.length === 0) throw new ValidationError('지원 통화를 선택해주세요.');

  const { data: account, error } = await db
    .from(ACCOUNTS_TABLE)
    .insert({
      user_id: userId,
      name: input.name,
      default_currency: input.defaultCurrency,
      supported_currencies: input.supportedCurrencies,
      is_favorite: input.isFavorite ?? false,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) throw new Error(`통장 생성 실패: ${error.message}`);

  const balanceInserts = input.supportedCurrencies.map((currency) => ({
    account_id: (account as AccountRow).id,
    currency,
    balance: 0,
  }));

  await db.from(BALANCES_TABLE).insert(balanceInserts);

  return {
    id: (account as AccountRow).id,
    name: (account as AccountRow).name,
    defaultCurrency: (account as AccountRow).default_currency,
    supportedCurrencies: (account as AccountRow).supported_currencies,
    isFavorite: (account as AccountRow).is_favorite,
    sortOrder: (account as AccountRow).sort_order,
    createdAt: (account as AccountRow).created_at,
    balances: Object.fromEntries(input.supportedCurrencies.map((c) => [c, 0])),
  };
}

/** Soft-delete an account */
export async function deleteAccount(db: SupabaseClient, accountId: string): Promise<void> {
  const { error } = await db
    .from(ACCOUNTS_TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', accountId);

  if (error) throw new NotFoundError('통장을 찾을 수 없습니다.');
}
