/**
 * @file attendance.service.ts
 * @description 출석체크 서비스
 * @module services/attendance
 */

import { supabase } from './supabase';
import type { Attendance, AttendanceRow } from '../types/attendance.types';
import { toAttendance } from '../types/attendance.types';

// ============================================================
// 상수
// ============================================================

const TABLE = 'attendance';

// ============================================================
// 조회
// ============================================================

/** 이번 달 출석 기록 조회 */
export async function fetchMonthlyAttendance(
  userId: string,
  year: number,
  month: number,
): Promise<Attendance[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .gte('check_date', startDate)
    .lte('check_date', endDate)
    .order('check_date', { ascending: true });

  if (error) throw new Error(`출석 조회 실패: ${error.message}`);
  return (data as AttendanceRow[]).map(toAttendance);
}

/** 오늘 출석 여부 확인 */
export async function checkTodayAttendance(userId: string): Promise<Attendance | null> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .eq('check_date', today)
    .maybeSingle();

  if (error) throw new Error(`오늘 출석 확인 실패: ${error.message}`);
  return data ? toAttendance(data as AttendanceRow) : null;
}

// ============================================================
// 출석하기
// ============================================================

/** 출석 체크 실행 (연속 출석일 계산 포함) */
export async function checkIn(userId: string): Promise<Attendance> {
  const today = new Date().toISOString().slice(0, 10);

  /* 이미 출석했는지 확인 */
  const existing = await checkTodayAttendance(userId);
  if (existing) return existing;

  /* 어제 출석 기록 확인 → 연속 출석일 계산 */
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const { data: yesterdayRecord } = await supabase
    .from(TABLE)
    .select('streak_count')
    .eq('user_id', userId)
    .eq('check_date', yesterdayStr)
    .maybeSingle();

  const streakCount = yesterdayRecord
    ? (yesterdayRecord as { streak_count: number }).streak_count + 1
    : 1;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      check_date: today,
      streak_count: streakCount,
    })
    .select()
    .single();

  if (error) throw new Error(`출석 체크 실패: ${error.message}`);
  return toAttendance(data as AttendanceRow);
}

/** 현재 연속 출석일 조회 */
export async function getCurrentStreak(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('streak_count')
    .eq('user_id', userId)
    .order('check_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return 0;

  /* 가장 최근 출석이 오늘 또는 어제인지 확인 */
  return (data as { streak_count: number }).streak_count;
}
