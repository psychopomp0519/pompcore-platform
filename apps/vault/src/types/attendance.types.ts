/**
 * @file attendance.types.ts
 * @description 출석체크 관련 타입 정의
 * @module types/attendance
 */

// ============================================================
// 엔티티
// ============================================================

/** 출석 기록 */
export interface Attendance {
  id: string;
  userId: string;
  checkDate: string;
  streakCount: number;
  createdAt: string;
}

/** DB row */
export interface AttendanceRow {
  id: string;
  user_id: string;
  check_date: string;
  streak_count: number;
  created_at: string;
}

/** DB row → 클라이언트 변환 */
export function toAttendance(row: AttendanceRow): Attendance {
  return {
    id: row.id,
    userId: row.user_id,
    checkDate: row.check_date,
    streakCount: row.streak_count,
    createdAt: row.created_at,
  };
}
