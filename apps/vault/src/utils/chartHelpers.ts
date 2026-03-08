/**
 * @file chartHelpers.ts
 * @description Nivo 차트 공통 헬퍼 (테마, 포매터)
 * @module utils/chartHelpers
 */

// ============================================================
// 상수
// ============================================================

const TEN_THOUSAND = 10000;
const THOUSAND = 1000;

// ============================================================
// 포매터
// ============================================================

/** 숫자를 축약 표시 (만/천 단위) */
export function formatCompact(n: number): string {
  if (Math.abs(n) >= TEN_THOUSAND) return `${(n / TEN_THOUSAND).toFixed(0)}만`;
  if (Math.abs(n) >= THOUSAND) return `${(n / THOUSAND).toFixed(0)}천`;
  return String(n);
}

// ============================================================
// 테마
// ============================================================

/** Nivo 차트 공통 테마 */
export const CHART_THEME = {
  text: { fontSize: 11, fill: '#6B7280' },
  axis: {
    ticks: { text: { fontSize: 10, fill: '#9CA3AF' } },
  },
  grid: {
    line: { stroke: '#E5E7EB', strokeDasharray: '4 4' },
  },
} as const;
