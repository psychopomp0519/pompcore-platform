/**
 * @file transaction.service.ts
 * @description Server-side transaction service for Vault.
 *
 * Provides CRUD for financial transactions with server-side validation.
 * Uses user-scoped Supabase client for RLS enforcement.
 *
 * @module @pompcore/api/services/transaction
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { ValidationError } from '../lib/errors.js';

const TABLE = 'vault_transactions';

// ============================================================
// Types
// ============================================================

interface TransactionRow {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  transaction_date: string;
  source_type: string;
  source_id: string | null;
  transfer_pair_id: string | null;
  budget_id: string | null;
  budget_action: string | null;
  memo: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface TransactionResult {
  id: string;
  accountId: string;
  categoryId: string | null;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  transactionDate: string;
  sourceType: string;
  memo: string | null;
  createdAt: string;
}

interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  currency?: string;
  type?: 'income' | 'expense';
}

interface CreateTransactionInput {
  accountId: string;
  categoryId?: string | null;
  name?: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  transactionDate: string;
  budgetId?: string | null;
  budgetAction?: string | null;
  memo?: string | null;
}

// ============================================================
// Helpers
// ============================================================

function mapRow(row: TransactionRow): TransactionResult {
  return {
    id: row.id,
    accountId: row.account_id,
    categoryId: row.category_id,
    name: row.name,
    type: row.type,
    amount: row.amount,
    currency: row.currency,
    transactionDate: row.transaction_date,
    sourceType: row.source_type,
    memo: row.memo,
    createdAt: row.created_at,
  };
}

// ============================================================
// Queries
// ============================================================

/** Fetch transactions for a date range with optional filters */
export async function fetchTransactions(
  db: SupabaseClient,
  userId: string,
  startDate: string,
  endDate: string,
  filters?: TransactionFilters,
): Promise<TransactionResult[]> {
  let query = db
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.accountId) query = query.eq('account_id', filters.accountId);
  if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
  if (filters?.currency) query = query.eq('currency', filters.currency);
  if (filters?.type) query = query.eq('type', filters.type);

  const { data, error } = await query;
  if (error) throw new Error(`거래내역 조회 실패: ${error.message}`);

  return (data as TransactionRow[]).map(mapRow);
}

/** Create a new transaction */
export async function createTransaction(
  db: SupabaseClient,
  userId: string,
  input: CreateTransactionInput,
): Promise<TransactionResult> {
  if (input.amount <= 0) throw new ValidationError('금액은 0보다 커야 합니다.');
  if (!input.accountId) throw new ValidationError('계좌를 선택해주세요.');
  if (!input.transactionDate) throw new ValidationError('거래일을 입력해주세요.');

  const { data, error } = await db
    .from(TABLE)
    .insert({
      user_id: userId,
      account_id: input.accountId,
      category_id: input.categoryId ?? null,
      name: input.name || (input.type === 'income' ? '수입' : '지출'),
      type: input.type,
      amount: input.amount,
      currency: input.currency,
      transaction_date: input.transactionDate,
      source_type: 'manual',
      source_id: null,
      transfer_pair_id: null,
      budget_id: input.budgetId ?? null,
      budget_action: input.budgetAction ?? null,
      memo: input.memo ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`거래내역 생성 실패: ${error.message}`);
  return mapRow(data as TransactionRow);
}

/** Soft-delete a transaction */
export async function deleteTransaction(db: SupabaseClient, transactionId: string): Promise<void> {
  const { error } = await db
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', transactionId);

  if (error) throw new Error(`거래내역 삭제 실패: ${error.message}`);
}
