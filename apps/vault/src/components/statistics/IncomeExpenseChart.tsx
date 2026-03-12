/**
 * @file IncomeExpenseChart.tsx
 * @description 월별 수입/지출 막대 차트
 * @module components/statistics/IncomeExpenseChart
 */

import { memo, type ReactNode } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import type { Transaction } from '../../types/transaction.types';
import { GlassCard } from '../common/GlassCard';
import { formatCompact, CHART_THEME } from '../../utils/chartHelpers';
import { CHART_HEIGHT } from '../../constants/ui';

// ============================================================
// 타입
// ============================================================

interface IncomeExpenseChartProps {
  transactions: Transaction[];
  months: number;
  currency: string;
}

interface MonthData {
  [key: string]: string | number;
  month: string;
  income: number;
  expense: number;
}

// ============================================================
// 헬퍼
// ============================================================

/** 거래내역을 월별 수입/지출로 집계 */
function aggregateByMonth(transactions: Transaction[], currency: string): MonthData[] {
  const map = new Map<string, { income: number; expense: number }>();

  for (const tx of transactions) {
    if (tx.currency !== currency) continue;
    const monthKey = tx.transactionDate.slice(0, 7);
    const entry = map.get(monthKey) ?? { income: 0, expense: 0 };
    if (tx.type === 'income') {
      entry.income += tx.amount;
    } else {
      entry.expense += tx.amount;
    }
    map.set(monthKey, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: month.slice(5),
      income: data.income,
      expense: data.expense,
    }));
}

// ============================================================
// IncomeExpenseChart
// ============================================================

/** 월별 수입/지출 비교 막대 차트 */
function IncomeExpenseChartInner({
  transactions,
  months,
  currency,
}: IncomeExpenseChartProps): ReactNode {
  const data = aggregateByMonth(transactions, currency).slice(-months);

  if (data.length === 0) {
    return (
      <GlassCard padding="md">
        <h3 className="mb-2 text-sm font-bold text-navy dark:text-gray-100">월별 수입/지출</h3>
        <p className="text-xs text-navy/40 dark:text-gray-500">데이터가 없습니다.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="md">
      <h3 className="mb-4 text-sm font-bold text-navy dark:text-gray-100">월별 수입/지출</h3>
      <div style={{ height: CHART_HEIGHT }}>
        <ResponsiveBar
          data={data}
          keys={['income', 'expense']}
          indexBy="month"
          groupMode="grouped"
          margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
          padding={0.3}
          colors={['#3B82F6', '#EF4444']}
          borderRadius={4}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            format: (v: string) => `${v}월`,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (v: number) => formatCompact(v),
          }}
          enableLabel={false}
          theme={CHART_THEME}
          tooltip={({ id, value, color }) => (
            <div className="rounded-lg bg-white px-3 py-1.5 text-xs shadow-lg dark:bg-gray-800">
              <span style={{ color }}>{id === 'income' ? '수입' : '지출'}</span>
              <span className="ml-2 font-semibold text-navy dark:text-gray-100">
                {value.toLocaleString('ko-KR')}
              </span>
            </div>
          )}
        />
      </div>
    </GlassCard>
  );
}

export const IncomeExpenseChart = memo(IncomeExpenseChartInner);

