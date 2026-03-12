import { describe, it, expect } from 'vitest';
import {
  formatDateKr,
  getMonthPeriod,
  getPrevMonth,
  getNextMonth,
  formatShortDate,
  formatDisplayDate,
} from './date';

describe('formatDateKr', () => {
  it('Date를 YYYY-MM-DD로 포맷', () => {
    expect(formatDateKr(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('월/일이 한 자리일 때 0 패딩', () => {
    expect(formatDateKr(new Date(2026, 2, 9))).toBe('2026-03-09');
  });

  it('12월 31일', () => {
    expect(formatDateKr(new Date(2025, 11, 31))).toBe('2025-12-31');
  });
});

describe('getMonthPeriod', () => {
  it('1월의 시작일과 끝일', () => {
    const period = getMonthPeriod(2026, 1);
    expect(period.startDate).toBe('2026-01-01');
    expect(period.endDate).toBe('2026-01-31');
    expect(period.year).toBe(2026);
    expect(period.month).toBe(1);
  });

  it('2월 윤년', () => {
    const period = getMonthPeriod(2024, 2);
    expect(period.endDate).toBe('2024-02-29');
  });

  it('2월 평년', () => {
    const period = getMonthPeriod(2025, 2);
    expect(period.endDate).toBe('2025-02-28');
  });

  it('4월은 30일', () => {
    const period = getMonthPeriod(2026, 4);
    expect(period.endDate).toBe('2026-04-30');
  });
});

describe('getPrevMonth', () => {
  it('3월 → 2월', () => {
    expect(getPrevMonth(2026, 3)).toEqual({ year: 2026, month: 2 });
  });

  it('1월 → 전년도 12월', () => {
    expect(getPrevMonth(2026, 1)).toEqual({ year: 2025, month: 12 });
  });
});

describe('getNextMonth', () => {
  it('3월 → 4월', () => {
    expect(getNextMonth(2026, 3)).toEqual({ year: 2026, month: 4 });
  });

  it('12월 → 다음 해 1월', () => {
    expect(getNextMonth(2025, 12)).toEqual({ year: 2026, month: 1 });
  });
});

describe('formatShortDate', () => {
  it('YYYY-MM-DD → M월 D일', () => {
    expect(formatShortDate('2026-03-12')).toBe('3월 12일');
  });

  it('1월 1일', () => {
    expect(formatShortDate('2026-01-01')).toBe('1월 1일');
  });
});

describe('formatDisplayDate', () => {
  it('YYYY-MM-DD → YYYY.MM.DD', () => {
    expect(formatDisplayDate('2026-03-12')).toBe('2026.03.12');
  });
});
