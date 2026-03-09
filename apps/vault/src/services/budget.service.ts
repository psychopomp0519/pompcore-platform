/**
 * @file budget.service.ts
 * @description 예산 CRUD 서비스 (Supabase)
 * @module services/budget
 */

import { supabase } from './supabase';
import type { DbBudget, DbBudgetInsert, DbBudgetUpdate } from '../types/database.types';
import type { Budget, BudgetFormData } from '../types/budget.types';
import { mapDbToBudget } from '../types/budget.types';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE = 'budgets';

// ============================================================
// 조회
// ============================================================

/** 사용자의 모든 활성 예산 조회 */
export async function fetchBudgets(userId: string): Promise<Budget[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`예산 조회 실패: ${error.message}`);
  return (data as DbBudget[]).map(mapDbToBudget);
}

// ============================================================
// 생성
// ============================================================

/** 예산 생성 */
export async function createBudget(
  userId: string,
  form: BudgetFormData,
): Promise<Budget> {
  const insert: DbBudgetInsert = {
    user_id: userId,
    name: form.name,
    target_amount: form.targetAmount,
    current_amount: 0,
    currency: form.currency,
    budget_type: form.budgetType,
    linked_account_id: form.linkedAccountId,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`예산 생성 실패: ${error.message}`);
  return mapDbToBudget(data as DbBudget);
}

// ============================================================
// 수정
// ============================================================

/** 예산 수정 */
export async function updateBudget(
  budgetId: string,
  updates: Partial<BudgetFormData>,
): Promise<void> {
  const dbUpdate: DbBudgetUpdate = {};

  if (updates.name !== undefined) dbUpdate.name = updates.name;
  if (updates.targetAmount !== undefined) dbUpdate.target_amount = updates.targetAmount;
  if (updates.currency !== undefined) dbUpdate.currency = updates.currency;
  if (updates.budgetType !== undefined) dbUpdate.budget_type = updates.budgetType;
  if (updates.linkedAccountId !== undefined) dbUpdate.linked_account_id = updates.linkedAccountId;

  const { error } = await supabase
    .from(TABLE)
    .update(dbUpdate)
    .eq('id', budgetId);

  if (error) throw new Error(`예산 수정 실패: ${error.message}`);
}

/** 예산 금액 직접 수정 */
export async function updateBudgetAmount(
  budgetId: string,
  currentAmount: number,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ current_amount: currentAmount })
    .eq('id', budgetId);

  if (error) throw new Error(`예산 금액 수정 실패: ${error.message}`);
}

/** 예산 금액 증감 (deposit: 추가, withdraw: 차감) */
export async function adjustBudgetAmount(
  budgetId: string,
  delta: number,
): Promise<void> {
  const { data, error: fetchErr } = await supabase
    .from(TABLE)
    .select('current_amount')
    .eq('id', budgetId)
    .single();

  if (fetchErr) throw new Error(`예산 조회 실패: ${fetchErr.message}`);

  const current = (data as { current_amount: number }).current_amount;
  const newAmount = Math.max(0, current + delta);

  const { error: updateErr } = await supabase
    .from(TABLE)
    .update({ current_amount: newAmount })
    .eq('id', budgetId);

  if (updateErr) throw new Error(`예산 금액 수정 실패: ${updateErr.message}`);
}

// ============================================================
// 삭제
// ============================================================

/** 예산 소프트 삭제 */
export async function deleteBudget(budgetId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', budgetId);

  if (error) throw new Error(`예산 삭제 실패: ${error.message}`);
}
