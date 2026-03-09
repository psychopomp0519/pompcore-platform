/**
 * @file savings.service.ts
 * @description 예/적금 CRUD 서비스 (Supabase)
 * @module services/savings
 */

import { supabase } from './supabase';
import type {
  DbSavings,
  DbSavingsInsert,
  DbSavingsUpdate,
  DbSavingsDeposit,
  DbSavingsDepositInsert,
} from '../types/database.types';
import type { Savings, SavingsFormData, DepositFormData } from '../types/savings.types';
import { mapDbToSavings } from '../types/savings.types';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE = 'savings';
const DEPOSITS_TABLE = 'savings_deposits';

// ============================================================
// 조회
// ============================================================

/** 사용자의 모든 활성 예/적금 조회 (납입 내역 포함) */
export async function fetchSavings(userId: string): Promise<Savings[]> {
  const { data: savingsList, error: savError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (savError) throw new Error(`예/적금 조회 실패: ${savError.message}`);
  if (!savingsList || savingsList.length === 0) return [];

  const savingsIds = (savingsList as DbSavings[]).map((s) => s.id);

  const { data: deposits, error: depError } = await supabase
    .from(DEPOSITS_TABLE)
    .select('*')
    .in('savings_id', savingsIds)
    .order('deposit_date', { ascending: true });

  if (depError) throw new Error(`납입 내역 조회 실패: ${depError.message}`);

  const depositsBySavings = new Map<string, DbSavingsDeposit[]>();
  for (const d of (deposits ?? []) as DbSavingsDeposit[]) {
    const list = depositsBySavings.get(d.savings_id) ?? [];
    list.push(d);
    depositsBySavings.set(d.savings_id, list);
  }

  return (savingsList as DbSavings[]).map((s) =>
    mapDbToSavings(s, depositsBySavings.get(s.id) ?? []),
  );
}

// ============================================================
// 생성
// ============================================================

/** 예/적금 생성 */
export async function createSavings(
  userId: string,
  form: SavingsFormData,
): Promise<Savings> {
  const insert: DbSavingsInsert = {
    user_id: userId,
    linked_account_id: form.linkedAccountId,
    name: form.name,
    savings_type: form.savingsType,
    start_date: form.startDate,
    duration_months: form.durationMonths,
    interest_rate: form.interestRate,
    principal: form.principal,
    installment_amount: form.installmentAmount,
    is_tax_free: form.isTaxFree,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`예/적금 생성 실패: ${error.message}`);
  return mapDbToSavings(data as DbSavings, []);
}

// ============================================================
// 수정
// ============================================================

/** 예/적금 수정 */
export async function updateSavings(
  savingsId: string,
  updates: Partial<SavingsFormData>,
): Promise<void> {
  const dbUpdate: DbSavingsUpdate = {};

  if (updates.name !== undefined) dbUpdate.name = updates.name;
  if (updates.linkedAccountId !== undefined) dbUpdate.linked_account_id = updates.linkedAccountId;
  if (updates.durationMonths !== undefined) dbUpdate.duration_months = updates.durationMonths;
  if (updates.interestRate !== undefined) dbUpdate.interest_rate = updates.interestRate;
  if (updates.principal !== undefined) dbUpdate.principal = updates.principal;
  if (updates.installmentAmount !== undefined) dbUpdate.installment_amount = updates.installmentAmount;
  if (updates.isTaxFree !== undefined) dbUpdate.is_tax_free = updates.isTaxFree;

  const { error } = await supabase
    .from(TABLE)
    .update(dbUpdate)
    .eq('id', savingsId);

  if (error) throw new Error(`예/적금 수정 실패: ${error.message}`);
}

// ============================================================
// 삭제
// ============================================================

/** 예/적금 소프트 삭제 */
export async function deleteSavings(savingsId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', savingsId);

  if (error) throw new Error(`예/적금 삭제 실패: ${error.message}`);
}

// ============================================================
// 납입 (자유적금)
// ============================================================

/** 납입 추가 */
export async function addDeposit(
  savingsId: string,
  form: DepositFormData,
): Promise<void> {
  const insert: DbSavingsDepositInsert = {
    savings_id: savingsId,
    account_id: form.accountId,
    amount: form.amount,
    deposit_date: form.depositDate,
  };

  const { error } = await supabase
    .from(DEPOSITS_TABLE)
    .insert(insert);

  if (error) throw new Error(`납입 추가 실패: ${error.message}`);
}

/** 납입 삭제 */
export async function deleteDeposit(depositId: string): Promise<void> {
  const { error } = await supabase
    .from(DEPOSITS_TABLE)
    .delete()
    .eq('id', depositId);

  if (error) throw new Error(`납입 삭제 실패: ${error.message}`);
}
