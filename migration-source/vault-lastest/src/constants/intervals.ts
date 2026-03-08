/**
 * @file intervals.ts
 * @description 정기결제 간격 관련 상수
 * @module constants/intervals
 */

/** 정기결제 간격 단위 */
export const INTERVAL_UNITS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type IntervalUnit = (typeof INTERVAL_UNITS)[keyof typeof INTERVAL_UNITS];

/** 간격 단위별 표시 라벨 */
export const INTERVAL_LABELS: Record<IntervalUnit, string> = {
  day: '일',
  week: '주',
  month: '개월',
  year: '년',
};

/** 정기결제 평균 표시 단위 */
export const RECURRING_AVG_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type RecurringAvgPeriod = (typeof RECURRING_AVG_PERIODS)[keyof typeof RECURRING_AVG_PERIODS];
