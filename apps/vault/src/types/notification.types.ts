/**
 * @file notification.types.ts
 * @description 알림 관련 타입 정의
 * @module types/notification.types
 */

// ============================================================
// 상수
// ============================================================

/** 알림 유형 */
export const NOTIFICATION_TYPES = {
  BUDGET_EXCEEDED: 'budget_exceeded',
  RECURRING_UPCOMING: 'recurring_upcoming',
  SAVINGS_MATURITY: 'savings_maturity',
  SYSTEM: 'system',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

/** 알림 유형 한국어 라벨 */
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  budget_exceeded: '예산 초과',
  recurring_upcoming: '정기결제 예정',
  savings_maturity: '만기 도래',
  system: '시스템',
};

// ============================================================
// 엔티티
// ============================================================

/** 알림 엔티티 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

/** DB → 클라이언트 매핑용 raw row */
export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

// ============================================================
// 변환
// ============================================================

/** DB row → 클라이언트 엔티티 변환 */
export function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as NotificationType,
    title: row.title,
    message: row.message,
    referenceId: row.reference_id,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}
