/**
 * @file Date formatting utilities
 * @module @pompcore/ui/utils/date
 */

/** 월별 기간 */
export interface MonthPeriod {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
}

/** 오늘 날짜를 YYYY-MM-DD 형태로 반환 */
export function getToday(): string {
  const d = new Date();
  return formatDateKr(d);
}

/** Date 객체를 YYYY-MM-DD 형태로 반환 */
export function formatDateKr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 해당 월의 시작일과 마지막일을 포함한 기간 객체 반환 */
export function getMonthPeriod(year: number, month: number): MonthPeriod {
  const lastDay = new Date(year, month, 0).getDate();
  return {
    year,
    month,
    startDate: `${year}-${String(month).padStart(2, '0')}-01`,
    endDate: `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
  };
}

/** 현재 달의 기간 */
export function getCurrentMonthPeriod(): MonthPeriod {
  const now = new Date();
  return getMonthPeriod(now.getFullYear(), now.getMonth() + 1);
}

/** 이전 달 */
export function getPrevMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

/** 다음 달 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
}

/** YYYY-MM-DD 날짜를 읽기 편한 형식으로 (M월 D일) */
export function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${m}월 ${d}일`;
}

/** YYYY-MM-DD 날짜를 표시용 형식으로 (YYYY.MM.DD) */
export function formatDisplayDate(dateStr: string): string {
  return dateStr.replace(/-/g, '.');
}
