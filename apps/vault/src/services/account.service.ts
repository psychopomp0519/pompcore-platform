/**
 * @file account.service.ts
 * @description 통장 CRUD 및 이체 서비스 (Supabase)
 * @module services/account
 */

import { supabase } from './supabase';
import type {
  DbAccount,
  DbAccountInsert,
  DbAccountUpdate,
  DbAccountBalance,
  DbAccountBalanceInsert,
  DbTransferInsert,
  DbTransactionInsert,
} from '../types/database.types';
import type { Account, AccountFormData, TransferFormData } from '../types/account.types';
import { mapDbToAccount } from '../types/account.types';

// ============================================================
// 테이블 이름
// ============================================================

const ACCOUNTS_TABLE = 'accounts';
const BALANCES_TABLE = 'account_balances';
const TRANSFERS_TABLE = 'transfers';
const TRANSACTIONS_TABLE = 'transactions';

// ============================================================
// 조회
// ============================================================

/** 사용자의 모든 활성 통장 조회 (잔액 포함) */
export async function fetchAccounts(userId: string): Promise<Account[]> {
  const { data: accounts, error: accError } = await supabase
    .from(ACCOUNTS_TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (accError) throw new Error(`통장 조회 실패: ${accError.message}`);
  if (!accounts || accounts.length === 0) return [];

  const accountIds = (accounts as DbAccount[]).map((a) => a.id);

  const { data: balances, error: balError } = await supabase
    .from(BALANCES_TABLE)
    .select('*')
    .in('account_id', accountIds);

  if (balError) throw new Error(`잔액 조회 실패: ${balError.message}`);

  const balancesByAccount = new Map<string, DbAccountBalance[]>();
  for (const b of (balances ?? []) as DbAccountBalance[]) {
    const list = balancesByAccount.get(b.account_id) ?? [];
    list.push(b);
    balancesByAccount.set(b.account_id, list);
  }

  return (accounts as DbAccount[]).map((acc) =>
    mapDbToAccount(acc, balancesByAccount.get(acc.id) ?? []),
  );
}

// ============================================================
// 생성
// ============================================================

/** 통장 생성 (기본 잔액 0으로 초기화) */
export async function createAccount(
  userId: string,
  form: AccountFormData,
  sortOrder: number,
): Promise<Account> {
  const insert: DbAccountInsert = {
    user_id: userId,
    name: form.name,
    default_currency: form.defaultCurrency,
    supported_currencies: form.supportedCurrencies,
    is_favorite: form.isFavorite,
    sort_order: sortOrder,
  };

  const { data: account, error: accError } = await supabase
    .from(ACCOUNTS_TABLE)
    .insert(insert)
    .select()
    .single();

  if (accError) throw new Error(`통장 생성 실패: ${accError.message}`);

  const balanceInserts: DbAccountBalanceInsert[] = form.supportedCurrencies.map((currency) => ({
    account_id: (account as DbAccount).id,
    currency,
    balance: 0,
  }));

  const { data: balances, error: balError } = await supabase
    .from(BALANCES_TABLE)
    .insert(balanceInserts)
    .select();

  if (balError) throw new Error(`잔액 초기화 실패: ${balError.message}`);

  return mapDbToAccount(account as DbAccount, (balances ?? []) as DbAccountBalance[]);
}

// ============================================================
// 수정
// ============================================================

/** 통장 수정 */
export async function updateAccount(
  accountId: string,
  updates: Partial<AccountFormData>,
): Promise<void> {
  const dbUpdate: DbAccountUpdate = {};

  if (updates.name !== undefined) dbUpdate.name = updates.name;
  if (updates.defaultCurrency !== undefined) dbUpdate.default_currency = updates.defaultCurrency;
  if (updates.supportedCurrencies !== undefined) dbUpdate.supported_currencies = updates.supportedCurrencies;
  if (updates.isFavorite !== undefined) dbUpdate.is_favorite = updates.isFavorite;

  const { error } = await supabase
    .from(ACCOUNTS_TABLE)
    .update(dbUpdate)
    .eq('id', accountId);

  if (error) throw new Error(`통장 수정 실패: ${error.message}`);
}

/** 즐겨찾기 토글 */
export async function toggleAccountFavorite(
  accountId: string,
  isFavorite: boolean,
): Promise<void> {
  const { error } = await supabase
    .from(ACCOUNTS_TABLE)
    .update({ is_favorite: isFavorite })
    .eq('id', accountId);

  if (error) throw new Error(`즐겨찾기 변경 실패: ${error.message}`);
}

/** 잔액 직접 수정 (초기 잔액 설정 등) */
export async function updateBalance(
  accountId: string,
  currency: string,
  balance: number,
): Promise<void> {
  const { error } = await supabase
    .from(BALANCES_TABLE)
    .update({ balance })
    .eq('account_id', accountId)
    .eq('currency', currency);

  if (error) throw new Error(`잔액 수정 실패: ${error.message}`);
}

// ============================================================
// 삭제 (소프트 삭제)
// ============================================================

/** 통장 소프트 삭제 */
export async function deleteAccount(accountId: string): Promise<void> {
  const { error } = await supabase
    .from(ACCOUNTS_TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', accountId);

  if (error) throw new Error(`통장 삭제 실패: ${error.message}`);
}

// ============================================================
// 이체
// ============================================================

/** 이체 실행: 이체 레코드 1건 + 거래내역 2건 생성 + 잔액 업데이트 */
export async function executeTransfer(
  userId: string,
  form: TransferFormData,
): Promise<void> {
  /* 1. 이체 레코드 생성 */
  const transferInsert: DbTransferInsert = {
    user_id: userId,
    from_account_id: form.fromAccountId,
    to_account_id: form.toAccountId,
    from_currency: form.fromCurrency,
    to_currency: form.toCurrency,
    from_amount: form.fromAmount,
    to_amount: form.toAmount,
    transfer_date: form.transferDate,
    memo: form.memo || null,
  };

  const { data: transfer, error: transferError } = await supabase
    .from(TRANSFERS_TABLE)
    .insert(transferInsert)
    .select()
    .single();

  if (transferError) throw new Error(`이체 레코드 생성 실패: ${transferError.message}`);

  const transferId = (transfer as { id: string }).id;

  /* 2. 출금 거래내역 */
  const expenseTransaction: DbTransactionInsert = {
    user_id: userId,
    account_id: form.fromAccountId,
    category_id: null,
    name: '이체 출금',
    type: 'expense',
    amount: form.fromAmount,
    currency: form.fromCurrency,
    transaction_date: form.transferDate,
    source_type: 'transfer',
    source_id: transferId,
    transfer_pair_id: null,
    budget_id: null,
    budget_action: null,
    memo: form.memo || null,
  };

  /* 3. 입금 거래내역 */
  const incomeTransaction: DbTransactionInsert = {
    user_id: userId,
    account_id: form.toAccountId,
    category_id: null,
    name: '이체 입금',
    type: 'income',
    amount: form.toAmount,
    currency: form.toCurrency,
    transaction_date: form.transferDate,
    source_type: 'transfer',
    source_id: transferId,
    transfer_pair_id: null,
    budget_id: null,
    budget_action: null,
    memo: form.memo || null,
  };

  const { data: transactions, error: txError } = await supabase
    .from(TRANSACTIONS_TABLE)
    .insert([expenseTransaction, incomeTransaction])
    .select();

  if (txError) throw new Error(`거래내역 생성 실패: ${txError.message}`);

  /* transfer_pair_id 상호 연결 */
  if (transactions && transactions.length === 2) {
    const [tx1, tx2] = transactions as { id: string }[];
    await Promise.all([
      supabase.from(TRANSACTIONS_TABLE).update({ transfer_pair_id: tx2.id }).eq('id', tx1.id),
      supabase.from(TRANSACTIONS_TABLE).update({ transfer_pair_id: tx1.id }).eq('id', tx2.id),
    ]);
  }

  /* 4. 잔액 업데이트 (출금 계좌: 차감, 입금 계좌: 증가) */
  const { error: fromBalError } = await supabase.rpc('vault_adjust_balance', {
    p_account_id: form.fromAccountId,
    p_currency: form.fromCurrency,
    p_delta: -form.fromAmount,
  });

  if (fromBalError) {
    /* RPC가 없으면 직접 업데이트 */
    await adjustBalanceManually(form.fromAccountId, form.fromCurrency, -form.fromAmount);
  }

  const { error: toBalError } = await supabase.rpc('vault_adjust_balance', {
    p_account_id: form.toAccountId,
    p_currency: form.toCurrency,
    p_delta: form.toAmount,
  });

  if (toBalError) {
    await adjustBalanceManually(form.toAccountId, form.toCurrency, form.toAmount);
  }
}

/** 잔액 수동 조정 (RPC 미사용 폴백, 잔액 레코드 없으면 자동 생성) */
async function adjustBalanceManually(
  accountId: string,
  currency: string,
  delta: number,
): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from(BALANCES_TABLE)
    .select('balance')
    .eq('account_id', accountId)
    .eq('currency', currency)
    .single();

  if (fetchError && fetchError.code === 'PGRST116') {
    /* 잔액 레코드가 없으면 새로 생성 (교차 통화 이체 시) */
    const { error: insertError } = await supabase
      .from(BALANCES_TABLE)
      .insert({ account_id: accountId, currency, balance: delta });

    if (insertError) throw new Error(`잔액 생성 실패: ${insertError.message}`);
    return;
  }

  if (fetchError) throw new Error(`잔액 조회 실패: ${fetchError.message}`);

  const currentBalance = (data as { balance: number }).balance;
  const { error: updateError } = await supabase
    .from(BALANCES_TABLE)
    .update({ balance: currentBalance + delta })
    .eq('account_id', accountId)
    .eq('currency', currency);

  if (updateError) throw new Error(`잔액 업데이트 실패: ${updateError.message}`);
}
