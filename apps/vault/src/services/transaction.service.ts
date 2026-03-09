/**
 * @file transaction.service.ts
 * @description 거래내역 CRUD 서비스 (Supabase)
 * @module services/transaction
 */

import { supabase } from './supabase';
import type { DbTransaction, DbTransactionInsert, DbTransactionUpdate } from '../types/database.types';
import type { Transaction, TransactionFormData, TransactionFilters } from '../types/transaction.types';
import { mapDbToTransaction } from '../types/transaction.types';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE = 'transactions';

// ============================================================
// 조회
// ============================================================

/** 기간별 거래내역 조회 */
export async function fetchTransactions(
  userId: string,
  startDate: string,
  endDate: string,
  filters?: TransactionFilters,
): Promise<Transaction[]> {
  let query = supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.accountId) {
    query = query.eq('account_id', filters.accountId);
  }
  if (filters?.currency) {
    query = query.eq('currency', filters.currency);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  const { data, error } = await query;

  if (error) throw new Error(`거래내역 조회 실패: ${error.message}`);
  return (data as DbTransaction[]).map(mapDbToTransaction);
}

// ============================================================
// 생성
// ============================================================

/** 거래내역 생성 */
export async function createTransaction(
  userId: string,
  form: TransactionFormData,
): Promise<Transaction> {
  const insert: DbTransactionInsert = {
    user_id: userId,
    account_id: form.accountId,
    category_id: form.categoryId,
    name: form.name || (form.type === 'income' ? '수입' : '지출'),
    type: form.type,
    amount: form.amount,
    currency: form.currency,
    transaction_date: form.transactionDate,
    source_type: 'manual',
    source_id: null,
    transfer_pair_id: null,
    budget_id: form.budgetId,
    budget_action: form.budgetAction,
    memo: form.memo || null,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`거래내역 생성 실패: ${error.message}`);
  return mapDbToTransaction(data as DbTransaction);
}

// ============================================================
// 수정
// ============================================================

/** 거래내역 수정 */
export async function updateTransaction(
  transactionId: string,
  updates: Partial<TransactionFormData>,
): Promise<Transaction> {
  const dbUpdate: DbTransactionUpdate = {};

  if (updates.name !== undefined) dbUpdate.name = updates.name;
  if (updates.type !== undefined) dbUpdate.type = updates.type;
  if (updates.amount !== undefined) dbUpdate.amount = updates.amount;
  if (updates.currency !== undefined) dbUpdate.currency = updates.currency;
  if (updates.accountId !== undefined) dbUpdate.account_id = updates.accountId;
  if (updates.categoryId !== undefined) dbUpdate.category_id = updates.categoryId;
  if (updates.transactionDate !== undefined) dbUpdate.transaction_date = updates.transactionDate;
  if (updates.budgetId !== undefined) dbUpdate.budget_id = updates.budgetId;
  if (updates.budgetAction !== undefined) dbUpdate.budget_action = updates.budgetAction;
  if (updates.memo !== undefined) dbUpdate.memo = updates.memo || null;

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbUpdate)
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw new Error(`거래내역 수정 실패: ${error.message}`);
  return mapDbToTransaction(data as DbTransaction);
}

// ============================================================
// 삭제 (소프트 삭제)
// ============================================================

/** 거래내역 소프트 삭제 */
export async function deleteTransaction(transactionId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', transactionId);

  if (error) throw new Error(`거래내역 삭제 실패: ${error.message}`);
}

// ============================================================
// 일괄 생성 (정기결제 실현용)
// ============================================================

/** 거래내역 일괄 생성 */
export async function createTransactionsBatch(
  inserts: DbTransactionInsert[],
): Promise<Transaction[]> {
  if (inserts.length === 0) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .insert(inserts)
    .select();

  if (error) throw new Error(`거래내역 일괄 생성 실패: ${error.message}`);
  return (data as DbTransaction[]).map(mapDbToTransaction);
}
