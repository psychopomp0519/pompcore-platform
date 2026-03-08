/**
 * @file recurring.service.ts
 * @description 정기결제 CRUD 및 자동 실현 서비스 (Supabase)
 * @module services/recurring
 */

import { supabase } from './supabase';
import type {
  DbRecurringPayment,
  DbRecurringPaymentInsert,
  DbRecurringPaymentUpdate,
  DbRecurringOverride,
  DbTransactionInsert,
} from '../types/database.types';
import type { RecurringPayment, RecurringFormData } from '../types/recurring.types';
import { mapDbToRecurring } from '../types/recurring.types';
import { getUnrealizedOccurrences } from '../utils/recurringCalculator';
import { createTransactionsBatch } from './transaction.service';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE = 'vault_recurring_payments';
const OVERRIDES_TABLE = 'vault_recurring_overrides';

// ============================================================
// 조회
// ============================================================

/** 사용자의 모든 활성 정기결제 조회 (오버라이드 포함) */
export async function fetchRecurringPayments(userId: string): Promise<RecurringPayment[]> {
  const { data: payments, error: payError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (payError) throw new Error(`정기결제 조회 실패: ${payError.message}`);
  if (!payments || payments.length === 0) return [];

  const paymentIds = (payments as DbRecurringPayment[]).map((p) => p.id);

  const { data: overrides, error: ovError } = await supabase
    .from(OVERRIDES_TABLE)
    .select('*')
    .in('recurring_id', paymentIds);

  if (ovError) throw new Error(`오버라이드 조회 실패: ${ovError.message}`);

  const overridesByPayment = new Map<string, DbRecurringOverride[]>();
  for (const ov of (overrides ?? []) as DbRecurringOverride[]) {
    const list = overridesByPayment.get(ov.recurring_id) ?? [];
    list.push(ov);
    overridesByPayment.set(ov.recurring_id, list);
  }

  return (payments as DbRecurringPayment[]).map((p) =>
    mapDbToRecurring(p, overridesByPayment.get(p.id) ?? []),
  );
}

// ============================================================
// 생성
// ============================================================

/** 정기결제 생성 */
export async function createRecurringPayment(
  userId: string,
  form: RecurringFormData,
): Promise<RecurringPayment> {
  const insert: DbRecurringPaymentInsert = {
    user_id: userId,
    account_id: form.accountId,
    category_id: form.categoryId,
    name: form.name,
    type: form.type,
    amount: form.amount,
    currency: form.currency,
    start_date: form.startDate,
    interval_unit: form.intervalUnit,
    interval_value: form.intervalValue,
    last_generated_date: null,
    is_active: true,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`정기결제 생성 실패: ${error.message}`);
  return mapDbToRecurring(data as DbRecurringPayment, []);
}

// ============================================================
// 수정
// ============================================================

/** 정기결제 수정 */
export async function updateRecurringPayment(
  paymentId: string,
  updates: Partial<RecurringFormData> & { isActive?: boolean },
): Promise<void> {
  const dbUpdate: DbRecurringPaymentUpdate = {};

  if (updates.name !== undefined) dbUpdate.name = updates.name;
  if (updates.type !== undefined) dbUpdate.type = updates.type;
  if (updates.amount !== undefined) dbUpdate.amount = updates.amount;
  if (updates.currency !== undefined) dbUpdate.currency = updates.currency;
  if (updates.accountId !== undefined) dbUpdate.account_id = updates.accountId;
  if (updates.categoryId !== undefined) dbUpdate.category_id = updates.categoryId;
  if (updates.startDate !== undefined) dbUpdate.start_date = updates.startDate;
  if (updates.intervalUnit !== undefined) dbUpdate.interval_unit = updates.intervalUnit;
  if (updates.intervalValue !== undefined) dbUpdate.interval_value = updates.intervalValue;
  if (updates.isActive !== undefined) dbUpdate.is_active = updates.isActive;

  const { error } = await supabase
    .from(TABLE)
    .update(dbUpdate)
    .eq('id', paymentId);

  if (error) throw new Error(`정기결제 수정 실패: ${error.message}`);
}

// ============================================================
// 삭제 (소프트 삭제)
// ============================================================

/** 정기결제 소프트 삭제 */
export async function deleteRecurringPayment(paymentId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', paymentId);

  if (error) throw new Error(`정기결제 삭제 실패: ${error.message}`);
}

// ============================================================
// 자동 실현 (페이지 로드 시)
// ============================================================

/** 미실현 정기결제를 거래내역으로 일괄 생성 */
export async function realizeRecurringPayments(
  userId: string,
  payments: RecurringPayment[],
): Promise<number> {
  const activePayments = payments.filter((p) => p.isActive);
  if (activePayments.length === 0) return 0;

  const inserts: DbTransactionInsert[] = [];
  const updatePromises: Promise<void>[] = [];

  for (const payment of activePayments) {
    const occurrences = getUnrealizedOccurrences(
      payment.startDate,
      payment.intervalUnit,
      payment.intervalValue,
      payment.lastGeneratedDate,
    );

    if (occurrences.length === 0) continue;

    /* 오버라이드 적용 */
    const overrideMap = new Map(
      payment.overrides.map((ov) => [ov.occurrenceDate, ov]),
    );

    let lastDate = '';

    for (const occ of occurrences) {
      const override = overrideMap.get(occ.date);
      if (override?.isSkipped) continue;

      const txAmount = override?.amount ?? payment.amount;
      const txName = override?.name ?? payment.name;

      inserts.push({
        user_id: userId,
        account_id: payment.accountId,
        category_id: payment.categoryId,
        name: txName,
        type: payment.type,
        amount: txAmount,
        currency: payment.currency,
        transaction_date: occ.date,
        source_type: 'recurring',
        source_id: payment.id,
        transfer_pair_id: null,
        budget_id: null,
        budget_action: null,
        memo: null,
      });

      if (occ.date > lastDate) lastDate = occ.date;
    }

    if (lastDate) {
      updatePromises.push(
        updateLastGeneratedDate(payment.id, lastDate),
      );
    }
  }

  if (inserts.length === 0) return 0;

  await createTransactionsBatch(inserts);
  await Promise.all(updatePromises);

  return inserts.length;
}

/** last_generated_date 업데이트 */
async function updateLastGeneratedDate(
  paymentId: string,
  date: string,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ last_generated_date: date })
    .eq('id', paymentId);

  if (error) throw new Error(`last_generated_date 업데이트 실패: ${error.message}`);
}
