/**
 * @file AttendanceCard.tsx
 * @description 대시보드용 출석체크 카드 — 미니 캘린더 + 출석 버튼
 * @module components/attendance/AttendanceCard
 */

import { useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useAttendanceStore } from '../../stores/attendanceStore';
import { GlassCard } from '@pompcore/ui';

// ============================================================
// 상수
// ============================================================

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// ============================================================
// AttendanceCard
// ============================================================

/** 출석체크 카드 */
export function AttendanceCard(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const {
    monthRecords,
    todayRecord,
    currentStreak,
    isCheckingIn,
    load,
    checkIn,
  } = useAttendanceStore();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  useEffect(() => {
    if (user?.id) load(user.id, year, month);
  }, [user?.id, year, month, load]);

  /** 출석한 날짜 Set */
  const checkedDates = useMemo(
    () => new Set(monthRecords.map((r) => r.checkDate)),
    [monthRecords],
  );

  /** 캘린더 셀 데이터 생성 */
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const today = now.getDate();

    const cells: { day: number; isChecked: boolean; isToday: boolean; isEmpty: boolean }[] = [];

    /* 빈 셀 (월 시작 전) */
    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: 0, isChecked: false, isToday: false, isEmpty: true });
    }

    /* 날짜 셀 */
    for (let d = 1; d <= lastDate; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        isChecked: checkedDates.has(dateStr),
        isToday: d === today,
        isEmpty: false,
      });
    }

    return cells;
  }, [year, month, checkedDates, now]);

  function handleCheckIn(): void {
    if (!user?.id || todayRecord || isCheckingIn) return;
    checkIn(user.id);
  }

  return (
    <GlassCard padding="md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-navy dark:text-gray-100">
          출석체크
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-navy/50 dark:text-gray-400">
            연속 <span className="font-bold text-vault-color">{currentStreak}</span>일
          </span>
        </div>
      </div>

      {/* 미니 캘린더 */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {/* 요일 헤더 */}
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-0.5 font-medium text-navy/40 dark:text-gray-500">
            {label}
          </div>
        ))}

        {/* 날짜 셀 */}
        {calendarCells.map((cell, idx) => (
          <div
            key={idx}
            className={[
              'flex h-7 w-7 items-center justify-center rounded-full text-[10px] mx-auto',
              cell.isEmpty
                ? ''
                : cell.isChecked
                  ? 'bg-vault-color text-white font-bold'
                  : cell.isToday
                    ? 'ring-1 ring-vault-color text-navy dark:text-gray-200'
                    : 'text-navy/50 dark:text-gray-400',
            ].join(' ')}
          >
            {cell.isEmpty ? '' : cell.day}
          </div>
        ))}
      </div>

      {/* 출석 버튼 */}
      <button
        type="button"
        onClick={handleCheckIn}
        disabled={!!todayRecord || isCheckingIn}
        className={[
          'mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors',
          todayRecord
            ? 'bg-vault-color/10 text-vault-color cursor-default'
            : 'bg-vault-color text-white hover:bg-vault-color/90',
        ].join(' ')}
      >
        {isCheckingIn
          ? '처리 중...'
          : todayRecord
            ? '오늘 출석 완료!'
            : '출석하기'}
      </button>
    </GlassCard>
  );
}
