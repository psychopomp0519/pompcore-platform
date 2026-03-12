/**
 * @file attendanceStore.ts
 * @description 출석체크 상태 관리 Zustand 스토어
 * @module stores/attendanceStore
 */

import { create } from 'zustand';
import type { Attendance } from '../types/attendance.types';
import * as attendanceService from '../services/attendance.service';
import { toUserMessage } from '@pompcore/ui';

// ============================================================
// 타입
// ============================================================

interface AttendanceState {
  monthRecords: Attendance[];
  todayRecord: Attendance | null;
  currentStreak: number;
  isLoading: boolean;
  isCheckingIn: boolean;
  error: string | null;
}

interface AttendanceActions {
  load: (userId: string, year: number, month: number) => Promise<void>;
  checkIn: (userId: string) => Promise<void>;
  clearError: () => void;
}

// ============================================================
// 스토어
// ============================================================

export const useAttendanceStore = create<AttendanceState & AttendanceActions>()(
  (set) => ({
    monthRecords: [],
    todayRecord: null,
    currentStreak: 0,
    isLoading: false,
    isCheckingIn: false,
    error: null,

    load: async (userId, year, month) => {
      set({ isLoading: true, error: null });
      try {
        const [records, today, streak] = await Promise.all([
          attendanceService.fetchMonthlyAttendance(userId, year, month),
          attendanceService.checkTodayAttendance(userId),
          attendanceService.getCurrentStreak(userId),
        ]);
        set({ monthRecords: records, todayRecord: today, currentStreak: streak, isLoading: false });
      } catch (err) {
        set({ error: toUserMessage(err), isLoading: false });
      }
    },

    checkIn: async (userId) => {
      set({ isCheckingIn: true, error: null });
      try {
        const record = await attendanceService.checkIn(userId);
        set((state) => ({
          todayRecord: record,
          currentStreak: record.streakCount,
          monthRecords: state.monthRecords.some((r) => r.checkDate === record.checkDate)
            ? state.monthRecords
            : [...state.monthRecords, record],
          isCheckingIn: false,
        }));
      } catch (err) {
        set({ error: toUserMessage(err), isCheckingIn: false });
      }
    },

    clearError: () => set({ error: null }),
  }),
);
