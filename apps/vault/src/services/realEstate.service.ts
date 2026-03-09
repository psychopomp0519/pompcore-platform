/**
 * @file realEstate.service.ts
 * @description 부동산 CRUD 서비스 (Supabase)
 * @module services/realEstate
 */

import { supabase } from './supabase';
import type {
  DbRealEstate,
  DbRealEstateInsert,
  DbRealEstateUpdate,
  DbRealEstateLease,
  DbRealEstateLeaseInsert,
  DbRealEstateLeaseUpdate,
  DbRealEstateExpense,
  DbRealEstateExpenseInsert,
} from '../types/database.types';
import type {
  RealEstate,
  RealEstateFormData,
  RealEstateLease,
  LeaseFormData,
  RealEstateExpense,
  ExpenseFormData,
} from '../types/realEstate.types';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE_PROPERTY = 'real_estate';
const TABLE_LEASE = 'real_estate_leases';
const TABLE_EXPENSE = 'real_estate_expenses';

// ============================================================
// 매퍼
// ============================================================

/** DB 행 → 도메인 RealEstate */
export function mapDbProperty(db: DbRealEstate): RealEstate {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    address: db.address,
    propertyType: db.property_type,
    role: db.role,
    acquisitionDate: db.acquisition_date,
    acquisitionPrice: db.acquisition_price,
    currentValue: db.current_value,
    currency: db.currency,
    linkedAccountId: db.linked_account_id,
    memo: db.memo,
    isFavorite: db.is_favorite,
    sortOrder: db.sort_order,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

/** DB 행 → 도메인 RealEstateLease */
export function mapDbLease(db: DbRealEstateLease): RealEstateLease {
  return {
    id: db.id,
    realEstateId: db.real_estate_id,
    userId: db.user_id,
    leaseType: db.lease_type,
    counterpartName: db.counterpart_name,
    deposit: db.deposit,
    monthlyRent: db.monthly_rent,
    startDate: db.start_date,
    endDate: db.end_date,
    isActive: db.is_active,
    memo: db.memo,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

/** DB 행 → 도메인 RealEstateExpense */
export function mapDbExpense(db: DbRealEstateExpense): RealEstateExpense {
  return {
    id: db.id,
    realEstateId: db.real_estate_id,
    userId: db.user_id,
    expenseType: db.expense_type,
    amount: db.amount,
    currency: db.currency,
    expenseDate: db.expense_date,
    memo: db.memo,
    createdAt: db.created_at,
  };
}

// ============================================================
// 부동산 조회
// ============================================================

/** 사용자 부동산 목록 조회 (소프트 삭제 제외) */
export async function fetchProperties(userId: string): Promise<RealEstate[]> {
  const { data, error } = await supabase
    .from(TABLE_PROPERTY)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw new Error(`부동산 목록 조회 실패: ${error.message}`);
  return (data as DbRealEstate[]).map(mapDbProperty);
}

/** 단일 부동산 조회 */
export async function fetchProperty(propertyId: string): Promise<RealEstate> {
  const { data, error } = await supabase
    .from(TABLE_PROPERTY)
    .select('*')
    .eq('id', propertyId)
    .is('deleted_at', null)
    .single();

  if (error) throw new Error(`부동산 조회 실패: ${error.message}`);
  return mapDbProperty(data as DbRealEstate);
}

/** 특정 물건의 임대 계약 목록 (최신순) */
export async function fetchLeases(propertyId: string): Promise<RealEstateLease[]> {
  const { data, error } = await supabase
    .from(TABLE_LEASE)
    .select('*')
    .eq('real_estate_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`계약 목록 조회 실패: ${error.message}`);
  return (data as DbRealEstateLease[]).map(mapDbLease);
}

/** 여러 물건의 활성 계약 일괄 조회 (목록 뷰용) */
export async function fetchActiveLeases(propertyIds: string[]): Promise<RealEstateLease[]> {
  if (propertyIds.length === 0) return [];

  const { data, error } = await supabase
    .from(TABLE_LEASE)
    .select('*')
    .in('real_estate_id', propertyIds)
    .eq('is_active', true);

  if (error) throw new Error(`활성 계약 조회 실패: ${error.message}`);
  return (data as DbRealEstateLease[]).map(mapDbLease);
}

/** 특정 물건의 비용 목록 (소프트 삭제 제외, 날짜 내림차순) */
export async function fetchExpenses(propertyId: string): Promise<RealEstateExpense[]> {
  const { data, error } = await supabase
    .from(TABLE_EXPENSE)
    .select('*')
    .eq('real_estate_id', propertyId)
    .is('deleted_at', null)
    .order('expense_date', { ascending: false });

  if (error) throw new Error(`비용 목록 조회 실패: ${error.message}`);
  return (data as DbRealEstateExpense[]).map(mapDbExpense);
}

// ============================================================
// 부동산 생성 / 수정 / 삭제
// ============================================================

/** 부동산 생성 */
export async function createProperty(
  userId: string,
  form: RealEstateFormData,
): Promise<RealEstate> {
  const insert: DbRealEstateInsert = {
    user_id: userId,
    name: form.name,
    address: form.address || null,
    property_type: form.propertyType,
    role: form.role,
    acquisition_date: form.acquisitionDate || null,
    acquisition_price: form.acquisitionPrice ? Number(form.acquisitionPrice) : null,
    current_value: form.currentValue ? Number(form.currentValue) : null,
    currency: form.currency,
    linked_account_id: form.linkedAccountId || null,
    memo: form.memo || null,
    is_favorite: false,
    sort_order: 0,
  };

  const { data, error } = await supabase
    .from(TABLE_PROPERTY)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`부동산 생성 실패: ${error.message}`);
  return mapDbProperty(data as DbRealEstate);
}

/** 부동산 수정 */
export async function updateProperty(
  propertyId: string,
  form: RealEstateFormData,
): Promise<void> {
  const update: DbRealEstateUpdate = {
    name: form.name,
    address: form.address || null,
    property_type: form.propertyType,
    role: form.role,
    acquisition_date: form.acquisitionDate || null,
    acquisition_price: form.acquisitionPrice ? Number(form.acquisitionPrice) : null,
    current_value: form.currentValue ? Number(form.currentValue) : null,
    currency: form.currency,
    linked_account_id: form.linkedAccountId || null,
    memo: form.memo || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from(TABLE_PROPERTY)
    .update(update)
    .eq('id', propertyId);

  if (error) throw new Error(`부동산 수정 실패: ${error.message}`);
}

/** 부동산 소프트 삭제 */
export async function deleteProperty(propertyId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_PROPERTY)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', propertyId);

  if (error) throw new Error(`부동산 삭제 실패: ${error.message}`);
}

// ============================================================
// 임대 계약 생성 / 수정 / 비활성화
// ============================================================

/** 계약 추가 */
export async function addLease(
  userId: string,
  propertyId: string,
  form: LeaseFormData,
): Promise<RealEstateLease> {
  const insert: DbRealEstateLeaseInsert = {
    user_id: userId,
    real_estate_id: propertyId,
    lease_type: form.leaseType,
    counterpart_name: form.counterpartName || null,
    deposit: Number(form.deposit) || 0,
    monthly_rent: Number(form.monthlyRent) || 0,
    start_date: form.startDate,
    end_date: form.endDate || null,
    is_active: true,
    memo: form.memo || null,
  };

  const { data, error } = await supabase
    .from(TABLE_LEASE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`계약 추가 실패: ${error.message}`);
  return mapDbLease(data as DbRealEstateLease);
}

/** 계약 수정 */
export async function updateLease(
  leaseId: string,
  updates: Partial<LeaseFormData>,
): Promise<void> {
  const update: DbRealEstateLeaseUpdate = {};

  if (updates.leaseType !== undefined) update.lease_type = updates.leaseType;
  if (updates.counterpartName !== undefined) update.counterpart_name = updates.counterpartName || null;
  if (updates.deposit !== undefined) update.deposit = Number(updates.deposit) || 0;
  if (updates.monthlyRent !== undefined) update.monthly_rent = Number(updates.monthlyRent) || 0;
  if (updates.startDate !== undefined) update.start_date = updates.startDate;
  if (updates.endDate !== undefined) update.end_date = updates.endDate || null;
  if (updates.memo !== undefined) update.memo = updates.memo || null;
  update.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from(TABLE_LEASE)
    .update(update)
    .eq('id', leaseId);

  if (error) throw new Error(`계약 수정 실패: ${error.message}`);
}

/** 계약 비활성화 (종료 처리) */
export async function deactivateLease(leaseId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_LEASE)
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', leaseId);

  if (error) throw new Error(`계약 종료 실패: ${error.message}`);
}

// ============================================================
// 비용 생성 / 삭제
// ============================================================

/** 비용 추가 */
export async function addExpense(
  userId: string,
  propertyId: string,
  form: ExpenseFormData,
): Promise<RealEstateExpense> {
  const insert: DbRealEstateExpenseInsert = {
    user_id: userId,
    real_estate_id: propertyId,
    expense_type: form.expenseType,
    amount: Number(form.amount) || 0,
    currency: form.currency,
    expense_date: form.expenseDate,
    memo: form.memo || null,
  };

  const { data, error } = await supabase
    .from(TABLE_EXPENSE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`비용 추가 실패: ${error.message}`);
  return mapDbExpense(data as DbRealEstateExpense);
}

/** 비용 소프트 삭제 */
export async function deleteExpense(expenseId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_EXPENSE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', expenseId);

  if (error) throw new Error(`비용 삭제 실패: ${error.message}`);
}
