/**
 * @file CategoryBreakdownChart.tsx
 * @description 카테고리별 지출 도넛 차트
 * @module components/statistics/CategoryBreakdownChart
 */

import { memo, type ReactNode } from 'react';
import { ResponsivePie } from '@nivo/pie';
import type { Transaction } from '../../types/transaction.types';
import { GlassCard } from '../common/GlassCard';
import { CHART_HEIGHT } from '../../constants/ui';

// ============================================================
// 타입
// ============================================================

interface CategoryBreakdownChartProps {
  transactions: Transaction[];
  currency: string;
  categoryMap: Map<string, { name: string; icon: string | null }>;
}

// ============================================================
// 색상 팔레트
// ============================================================

const PIE_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6',
] as const;

// ============================================================
// 헬퍼
// ============================================================

/** 카테고리별 지출 집계 */
function aggregateByCategory(
  transactions: Transaction[],
  currency: string,
  categoryMap: Map<string, { name: string; icon: string | null }>,
): { id: string; label: string; value: number }[] {
  const map = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== 'expense' || tx.currency !== currency) continue;
    const key = tx.categoryId ?? 'uncategorized';
    map.set(key, (map.get(key) ?? 0) + tx.amount);
  }

  return Array.from(map.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([catId, amount]) => {
      const info = categoryMap.get(catId);
      const label = info ? info.name : '미분류';
      return { id: label, label, value: amount };
    });
}

// ============================================================
// CategoryBreakdownChart
// ============================================================

/** 카테고리별 지출 도넛 차트 */
function CategoryBreakdownChartInner({
  transactions,
  currency,
  categoryMap,
}: CategoryBreakdownChartProps): ReactNode {
  const data = aggregateByCategory(transactions, currency, categoryMap);

  if (data.length === 0) {
    return (
      <GlassCard padding="md">
        <h3 className="mb-2 text-sm font-bold text-navy dark:text-gray-100">카테고리별 지출</h3>
        <p className="text-xs text-navy/40 dark:text-gray-500">데이터가 없습니다.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="md">
      <h3 className="mb-4 text-sm font-bold text-navy dark:text-gray-100">카테고리별 지출</h3>
      <div style={{ height: CHART_HEIGHT }}>
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 100, bottom: 20, left: 100 }}
          innerRadius={0.5}
          padAngle={1}
          cornerRadius={4}
          colors={PIE_COLORS.slice(0, data.length)}
          borderWidth={0}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#6B7280"
          arcLinkLabelsThickness={1}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#fff"
          arcLabel={(d) => formatCompact(d.value)}
          tooltip={({ datum }) => (
            <div className="rounded-lg bg-white px-3 py-1.5 text-xs shadow-lg dark:bg-gray-800">
              <span style={{ color: datum.color }}>{datum.label}</span>
              <span className="ml-2 font-semibold text-navy dark:text-gray-100">
                {datum.value.toLocaleString('ko-KR')}
              </span>
              <span className="ml-1 text-navy/40 dark:text-gray-500">
                ({((datum.arc.angleDeg / 360) * 100).toFixed(1)}%)
              </span>
            </div>
          )}
        />
      </div>
    </GlassCard>
  );
}

export const CategoryBreakdownChart = memo(CategoryBreakdownChartInner);

// ============================================================
// 공통
// ============================================================

function formatCompact(n: number): string {
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}천`;
  return String(n);
}
