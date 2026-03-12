import { describe, it, expect } from 'vitest';
import {
  addInterval,
  calculateOccurrences,
  getNextOccurrence,
  getUnrealizedOccurrences,
  getDailyAverage,
  getAverageByPeriod,
  getDaysUntilNext,
} from './recurringCalculator';

describe('addInterval', () => {
  it('일 단위 추가', () => {
    const base = new Date(2026, 0, 1); // 1월 1일
    const result = addInterval(base, 'day', 5);
    expect(result.getDate()).toBe(6);
  });

  it('주 단위 추가', () => {
    const base = new Date(2026, 0, 1);
    const result = addInterval(base, 'week', 2);
    expect(result.getDate()).toBe(15); // 1일 + 14일
  });

  it('월 단위 추가', () => {
    const base = new Date(2026, 0, 15);
    const result = addInterval(base, 'month', 3);
    expect(result.getMonth()).toBe(3); // 4월
    expect(result.getDate()).toBe(15);
  });

  it('월말 보정: 1/31 + 1개월 → 2/28', () => {
    const base = new Date(2026, 0, 31);
    const result = addInterval(base, 'month', 1);
    expect(result.getMonth()).toBe(1); // 2월
    expect(result.getDate()).toBe(28);
  });

  it('윤년 2/29 + 1년 → 2/28', () => {
    const base = new Date(2024, 1, 29); // 2024 윤년 2/29
    const result = addInterval(base, 'year', 1);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });

  it('년 단위 추가', () => {
    const base = new Date(2026, 5, 15);
    const result = addInterval(base, 'year', 2);
    expect(result.getFullYear()).toBe(2028);
  });
});

describe('calculateOccurrences', () => {
  it('월 1회, 3개월 범위 → 3건', () => {
    const result = calculateOccurrences({
      startDate: '2026-01-01',
      intervalUnit: 'month',
      intervalValue: 1,
      rangeStart: '2026-01-01',
      rangeEnd: '2026-03-31',
    });
    expect(result).toHaveLength(3);
    expect(result[0].date).toBe('2026-01-01');
    expect(result[1].date).toBe('2026-02-01');
    expect(result[2].date).toBe('2026-03-01');
  });

  it('범위 이전 발생일은 제외', () => {
    const result = calculateOccurrences({
      startDate: '2026-01-01',
      intervalUnit: 'month',
      intervalValue: 1,
      rangeStart: '2026-03-01',
      rangeEnd: '2026-03-31',
    });
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2026-03-01');
  });

  it('주 단위 발생', () => {
    const result = calculateOccurrences({
      startDate: '2026-01-01',
      intervalUnit: 'week',
      intervalValue: 1,
      rangeStart: '2026-01-01',
      rangeEnd: '2026-01-31',
    });
    expect(result.length).toBeGreaterThanOrEqual(4);
  });
});

describe('getNextOccurrence', () => {
  it('오늘 이후 다음 발생일 반환', () => {
    const result = getNextOccurrence('2026-01-01', 'month', 1, '2026-02-15');
    expect(result).toBe('2026-03-01');
  });

  it('오늘이 발생일이면 오늘 반환', () => {
    const result = getNextOccurrence('2026-01-01', 'month', 1, '2026-03-01');
    expect(result).toBe('2026-03-01');
  });
});

describe('getUnrealizedOccurrences', () => {
  it('마지막 생성일 이후 미실현 건', () => {
    const result = getUnrealizedOccurrences(
      '2026-01-01', 'month', 1, '2026-01-01', '2026-03-15',
    );
    expect(result.length).toBe(2); // 2월, 3월
  });

  it('마지막 생성일 없으면 시작일부터', () => {
    const result = getUnrealizedOccurrences(
      '2026-01-01', 'month', 1, null, '2026-02-15',
    );
    expect(result[0].date).toBe('2026-01-01');
  });
});

describe('getDailyAverage', () => {
  it('월 10만원 → 일 ~3,288원', () => {
    const daily = getDailyAverage(100_000, 'month', 1);
    expect(daily).toBeCloseTo(100_000 / 30.4375, 0);
  });

  it('주 7만원 → 일 10,000원', () => {
    expect(getDailyAverage(70_000, 'week', 1)).toBeCloseTo(10_000);
  });
});

describe('getAverageByPeriod', () => {
  it('월 10만원 → 연 ~120만원', () => {
    const annual = getAverageByPeriod(100_000, 'month', 1, 'year');
    expect(annual).toBeCloseTo(100_000 * 365.25 / 30.4375, 0);
  });
});

describe('getDaysUntilNext', () => {
  it('다음 발생일까지 남은 일수', () => {
    const days = getDaysUntilNext('2026-01-01', 'month', 1, '2026-02-15');
    expect(days).toBe(14); // 3월 1일까지 14일
  });

  it('오늘이 발생일이면 0일', () => {
    const days = getDaysUntilNext('2026-01-01', 'month', 1, '2026-03-01');
    expect(days).toBe(0);
  });
});
