/**
 * @file trash.service.ts
 * @description 휴지통 서비스 (소프트 삭제된 항목 통합 관리)
 * @module services/trash
 */

import { supabase } from './supabase';

// ============================================================
// 타입
// ============================================================

/** 휴지통 항목 */
export interface TrashItem {
  id: string;
  type: 'account' | 'category' | 'transaction' | 'recurring' | 'savings' | 'budget' | 'portfolio' | 'real_estate';
  name: string;
  deletedAt: string;
}

/** 소프트 삭제 테이블 매핑 */
const TRASH_TABLES = [
  { table: 'accounts', type: 'account' as const, nameField: 'name' },
  { table: 'categories', type: 'category' as const, nameField: 'name' },
  { table: 'transactions', type: 'transaction' as const, nameField: 'name' },
  { table: 'recurring_payments', type: 'recurring' as const, nameField: 'name' },
  { table: 'savings', type: 'savings' as const, nameField: 'name' },
  { table: 'budgets', type: 'budget' as const, nameField: 'name' },
  { table: 'vault_investment_portfolios', type: 'portfolio' as const, nameField: 'name' },
  { table: 'vault_real_estate', type: 'real_estate' as const, nameField: 'name' },
] as const;

/** 타입 라벨 */
export const TRASH_TYPE_LABELS: Record<TrashItem['type'], string> = {
  account: '통장',
  category: '카테고리',
  transaction: '거래내역',
  recurring: '정기결제',
  savings: '예/적금',
  budget: '예산',
  portfolio: '투자 포트폴리오',
  real_estate: '부동산',
};

// ============================================================
// 조회
// ============================================================

/** 모든 소프트 삭제 항목 통합 조회 */
export async function fetchTrashItems(userId: string): Promise<TrashItem[]> {
  const queries = TRASH_TABLES.map(({ table, type, nameField }) =>
    supabase
      .from(table)
      .select(`id, ${nameField}, deleted_at`)
      .eq('user_id', userId)
      .not('deleted_at', 'is', null)
      .then(({ data, error }) => {
        if (error || !data) return [];
        return data.map((row) => ({
          id: row.id as string,
          type,
          name: row[nameField] as string,
          deletedAt: row.deleted_at as string,
        }));
      }),
  );

  const results: TrashItem[] = (await Promise.all(queries)).flat();

  /* 삭제일 최신순 정렬 */
  results.sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
  return results;
}

// ============================================================
// 복원
// ============================================================

/** 항목 복원 (deleted_at = null) */
export async function restoreItem(item: TrashItem): Promise<void> {
  const tableInfo = TRASH_TABLES.find((t) => t.type === item.type);
  if (!tableInfo) throw new Error('알 수 없는 항목 유형입니다.');

  const { error } = await supabase
    .from(tableInfo.table)
    .update({ deleted_at: null })
    .eq('id', item.id);

  if (error) throw new Error(`복원 실패: ${error.message}`);
}

// ============================================================
// 영구 삭제
// ============================================================

/** 항목 영구 삭제 */
export async function permanentlyDelete(item: TrashItem): Promise<void> {
  const tableInfo = TRASH_TABLES.find((t) => t.type === item.type);
  if (!tableInfo) throw new Error('알 수 없는 항목 유형입니다.');

  const { error } = await supabase
    .from(tableInfo.table)
    .delete()
    .eq('id', item.id);

  if (error) throw new Error(`영구 삭제 실패: ${error.message}`);
}
