/**
 * @file recurringCalculator.ts
 * @description 정기결제 발생일 계산 유틸리티
 * @module utils/recurringCalculator
 */

import type { IntervalUnit } from '../constants/intervals';

// ============================================================
// 공유 상수
// ============================================================

/** 무한 루프 방지용 최대 반복 횟수 */
const MAX_ITERATIONS = 10000;

/** 밀리초 단위 하루 길이 */
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** 각 단위별 평균 일수 */
const DAYS_PER_UNIT: Record<IntervalUnit, number> = {
  day: 1,
  week: 7,
  month: 30.4375,
  year: 365.25,
};

// ============================================================
// 날짜 유틸리티
// ============================================================

/** YYYY-MM-DD 문자열을 Date 객체로 변환 (로컬 시간) */
function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Date 객체를 YYYY-MM-DD 문자열로 변환 */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 해당 월의 마지막 날 */
function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// ============================================================
// 핵심 계산
// ============================================================

/**
 * 시작일에서 간격을 더한 다음 발생일 계산
 * 월말 처리: 1/31 + 1개월 = 2/28(29)
 * 윤년 처리: 2/29 + 1년 = 2/28 (비윤년)
 */
export function addInterval(
  baseDate: Date,
  unit: IntervalUnit,
  value: number,
): Date {
  const result = new Date(baseDate);

  switch (unit) {
    case 'day':
      result.setDate(result.getDate() + value);
      break;

    case 'week':
      result.setDate(result.getDate() + value * 7);
      break;

    case 'month': {
      const originalDay = baseDate.getDate();
      result.setMonth(result.getMonth() + value);
      /* 월말 보정: 원래 날짜가 해당 월의 마지막 날보다 크면 보정 */
      const lastDay = getLastDayOfMonth(result.getFullYear(), result.getMonth());
      if (originalDay > lastDay) {
        result.setDate(lastDay);
      }
      break;
    }

    case 'year': {
      const originalDay = baseDate.getDate();
      result.setFullYear(result.getFullYear() + value);
      /* 윤년 보정 */
      const lastDay = getLastDayOfMonth(result.getFullYear(), result.getMonth());
      if (originalDay > lastDay) {
        result.setDate(lastDay);
      }
      break;
    }
  }

  return result;
}

// ============================================================
// 발생일 목록 생성
// ============================================================

/** 정기결제 발생일 목록 계산 매개변수 */
export interface RecurringOccurrenceParams {
  startDate: string;
  intervalUnit: IntervalUnit;
  intervalValue: number;
  rangeStart: string;
  rangeEnd: string;
}

/** 정기결제 발생일 */
export interface RecurringOccurrence {
  date: string;
  index: number;
}

/**
 * 주어진 범위 내 정기결제 발생일 목록 계산
 * rangeStart ~ rangeEnd (포함) 사이의 발생일을 반환
 */
export function calculateOccurrences(params: RecurringOccurrenceParams): RecurringOccurrence[] {
  const { startDate, intervalUnit, intervalValue, rangeStart, rangeEnd } = params;
  const start = parseDate(startDate);
  const end = parseDate(rangeEnd);
  const rangeBegin = parseDate(rangeStart);

  const occurrences: RecurringOccurrence[] = [];
  let current = new Date(start);
  let index = 0;

  while (current <= end && index < MAX_ITERATIONS) {
    if (current >= rangeBegin) {
      occurrences.push({ date: formatDate(current), index });
    }
    index++;
    current = addInterval(start, intervalUnit, intervalValue * index);
  }

  return occurrences;
}

// ============================================================
// 다음 발생일 계산
// ============================================================

/** 오늘 이후의 다음 발생일 계산 */
export function getNextOccurrence(
  startDate: string,
  intervalUnit: IntervalUnit,
  intervalValue: number,
  today?: string,
): string {
  const todayDate = today ? parseDate(today) : new Date();
  const todayStr = formatDate(todayDate);
  const start = parseDate(startDate);

  let current = new Date(start);
  let index = 0;

  while (index < MAX_ITERATIONS) {
    const currentStr = formatDate(current);
    if (currentStr >= todayStr) {
      return currentStr;
    }
    index++;
    current = addInterval(start, intervalUnit, intervalValue * index);
  }

  return formatDate(current);
}

// ============================================================
// 미실현 건 조회
// ============================================================

/** 미실현 발생일 계산 (lastGeneratedDate ~ today) */
export function getUnrealizedOccurrences(
  startDate: string,
  intervalUnit: IntervalUnit,
  intervalValue: number,
  lastGeneratedDate: string | null,
  today?: string,
): RecurringOccurrence[] {
  const todayStr = today ?? formatDate(new Date());
  const rangeStart = lastGeneratedDate
    ? addIntervalStr(lastGeneratedDate, intervalUnit, intervalValue)
    : startDate;

  if (rangeStart > todayStr) return [];

  return calculateOccurrences({
    startDate,
    intervalUnit,
    intervalValue,
    rangeStart,
    rangeEnd: todayStr,
  });
}

/** 문자열 날짜에 간격을 더한 결과를 문자열로 반환 */
function addIntervalStr(
  dateStr: string,
  unit: IntervalUnit,
  value: number,
): string {
  return formatDate(addInterval(parseDate(dateStr), unit, value));
}

// ============================================================
// 평균 금액 계산
// ============================================================

/** 정기결제 일 평균 금액 계산 */
export function getDailyAverage(
  amount: number,
  intervalUnit: IntervalUnit,
  intervalValue: number,
): number {
  return amount / (DAYS_PER_UNIT[intervalUnit] * intervalValue);
}

/** 지정된 평균 단위로 금액 환산 */
export function getAverageByPeriod(
  amount: number,
  intervalUnit: IntervalUnit,
  intervalValue: number,
  avgPeriod: IntervalUnit,
): number {
  return getDailyAverage(amount, intervalUnit, intervalValue) * DAYS_PER_UNIT[avgPeriod];
}

/** 다음 발생일까지 남은 일수 */
export function getDaysUntilNext(
  startDate: string,
  intervalUnit: IntervalUnit,
  intervalValue: number,
  today?: string,
): number {
  const todayDate = today ? parseDate(today) : new Date();
  const nextStr = getNextOccurrence(startDate, intervalUnit, intervalValue, today);
  const nextDate = parseDate(nextStr);
  const diff = nextDate.getTime() - todayDate.getTime();
  return Math.max(0, Math.ceil(diff / MS_PER_DAY));
}
