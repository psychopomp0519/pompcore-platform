/**
 * @file AccountDistributionChart.tsx
 * @description 통장별 자산 분포 차트
 * @module components/statistics/AccountDistributionChart
 */

import type { ReactNode } from 'react';
import { ResponsivePie } from '@nivo/pie';
import type { AccountBalanceInfo } from '../../services/statistics.service';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency } from '../../utils/currency';
import { CHART_HEIGHT } from '../../constants/ui';

// ============================================================
// 타입
// ============================================================

interface AccountDistributionChartProps {
  balances: AccountBalanceInfo[];
  currency: string;
}

// ============================================================
// 색상 팔레트
// ============================================================

const PIE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#F97316', '#6366F1', '#14B8A6',
] as const;

// ============================================================
// AccountDistributionChart
// ============================================================

/** 통장별 자산 분포 차트 */
export function AccountDistributionChart({
  balances,
  currency,
}: AccountDistributionChartProps): ReactNode {
  const filtered = balances
    .filter((b) => b.currency === currency && b.balance > 0)
    .map((b) => ({
      id: b.accountName,
      label: b.accountName,
      value: b.balance,
    }));

  if (filtered.length === 0) {
    return (
      <GlassCard padding="md">
        <h3 className="mb-2 text-sm font-bold text-navy dark:text-gray-100">통장별 분포</h3>
        <p className="text-xs text-navy/40 dark:text-gray-500">데이터가 없습니다.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="md">
      <h3 className="mb-4 text-sm font-bold text-navy dark:text-gray-100">통장별 분포</h3>
      <div style={{ height: CHART_HEIGHT }}>
        <ResponsivePie
          data={filtered}
          margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
          innerRadius={0.5}
          padAngle={1}
          cornerRadius={4}
          colors={PIE_COLORS.slice(0, filtered.length)}
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
                {formatCurrency(datum.value, currency)}
              </span>
            </div>
          )}
        />
      </div>
    </GlassCard>
  );
}

// ============================================================
// 공통
// ============================================================

function formatCompact(n: number): string {
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}천`;
  return String(n);
}
