/**
 * @file AssetTrendChart.tsx
 * @description 총 자산 변동 추이 라인 차트
 * @module components/statistics/AssetTrendChart
 */

import { memo, type ReactNode } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { Transaction } from '../../types/transaction.types';
import { GlassCard } from '../common/GlassCard';
import { formatCompact, CHART_THEME } from '../../utils/chartHelpers';
import { CHART_HEIGHT } from '../../constants/ui';

// ============================================================
// 타입
// ============================================================

interface AssetTrendChartProps {
  transactions: Transaction[];
  currency: string;
  initialBalance: number;
}

// ============================================================
// 헬퍼
// ============================================================

/** 거래내역으로부터 일별 누적 자산 계산 */
function calculateAssetTrend(
  transactions: Transaction[],
  currency: string,
  initialBalance: number,
): { x: string; y: number }[] {
  const filtered = transactions
    .filter((tx) => tx.currency === currency)
    .sort((a, b) => a.transactionDate.localeCompare(b.transactionDate));

  if (filtered.length === 0) return [];

  const dailyMap = new Map<string, number>();
  for (const tx of filtered) {
    const date = tx.transactionDate;
    const prev = dailyMap.get(date) ?? 0;
    const delta = tx.type === 'income' ? tx.amount : -tx.amount;
    dailyMap.set(date, prev + delta);
  }

  const points: { x: string; y: number }[] = [];
  let running = initialBalance;

  const sortedDates = Array.from(dailyMap.keys()).sort();
  for (const date of sortedDates) {
    running += dailyMap.get(date) ?? 0;
    points.push({ x: date.slice(5), y: running });
  }

  return points;
}

// ============================================================
// AssetTrendChart
// ============================================================

/** 총 자산 변동 추이 라인 차트 */
function AssetTrendChartInner({
  transactions,
  currency,
  initialBalance,
}: AssetTrendChartProps): ReactNode {
  const points = calculateAssetTrend(transactions, currency, initialBalance);

  if (points.length === 0) {
    return (
      <GlassCard padding="md">
        <h3 className="mb-2 text-sm font-bold text-navy dark:text-gray-100">자산 추이</h3>
        <p className="text-xs text-navy/40 dark:text-gray-500">데이터가 없습니다.</p>
      </GlassCard>
    );
  }

  const lineData = [
    {
      id: '자산',
      data: points,
    },
  ];

  return (
    <GlassCard padding="md">
      <h3 className="mb-4 text-sm font-bold text-navy dark:text-gray-100">자산 추이</h3>
      <div style={{ height: CHART_HEIGHT }}>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          curve="monotoneX"
          colors={['#10B981']}
          lineWidth={2}
          pointSize={6}
          pointColor="#10B981"
          pointBorderWidth={2}
          pointBorderColor="#fff"
          enableArea
          areaOpacity={0.1}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: -45,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (v: number) => formatCompact(v),
          }}
          enableSlices="x"
          sliceTooltip={({ slice }) => (
            <div className="rounded-lg bg-white px-3 py-1.5 text-xs shadow-lg dark:bg-gray-800">
              {slice.points.map((point) => (
                <div key={point.id}>
                  <span className="text-navy/60 dark:text-gray-400">{point.data.xFormatted}: </span>
                  <span className="font-semibold text-navy dark:text-gray-100">
                    {Number(point.data.yFormatted).toLocaleString('ko-KR')}
                  </span>
                </div>
              ))}
            </div>
          )}
          theme={CHART_THEME}
        />
      </div>
    </GlassCard>
  );
}

export const AssetTrendChart = memo(AssetTrendChartInner);

