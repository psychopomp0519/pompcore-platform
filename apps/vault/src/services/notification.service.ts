/**
 * @file notification.service.ts
 * @description 알림 CRUD 서비스
 * @module services/notification
 */

import { supabase } from './supabase';
import type { Notification, NotificationRow, NotificationType } from '../types/notification.types';
import { toNotification } from '../types/notification.types';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE = 'notifications';

// ============================================================
// 조회
// ============================================================

/** 최대 조회 건수 */
const MAX_FETCH_COUNT = 50;

/** 사용자 알림 목록 조회 (최신 순) */
export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(MAX_FETCH_COUNT);

  if (error) throw new Error(`알림 조회 실패: ${error.message}`);
  return (data as NotificationRow[]).map(toNotification);
}

/** 미읽음 알림 수 조회 */
export async function fetchUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw new Error(`미읽음 수 조회 실패: ${error.message}`);
  return count ?? 0;
}

// ============================================================
// 읽음 처리
// ============================================================

/** 단건 읽음 처리 */
export async function markAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw new Error(`읽음 처리 실패: ${error.message}`);
}

/** 전체 읽음 처리 */
export async function markAllAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw new Error(`전체 읽음 처리 실패: ${error.message}`);
}

// ============================================================
// 삭제
// ============================================================

/** 단건 삭제 */
export async function deleteNotification(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', notificationId);

  if (error) throw new Error(`알림 삭제 실패: ${error.message}`);
}

// ============================================================
// 생성
// ============================================================

/** 알림 생성 (중복 방지: 동일 type + reference_id + 당일 내 기존 건이 있으면 스킵) */
export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string;
}): Promise<void> {
  /* 오늘 자정 기준 중복 검사 */
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const query = supabase
    .from(TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', params.userId)
    .eq('type', params.type)
    .gte('created_at', todayStart.toISOString());

  if (params.referenceId) {
    query.eq('reference_id', params.referenceId);
  }

  const { count } = await query;
  if (count && count > 0) return;

  const { error } = await supabase
    .from(TABLE)
    .insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      reference_id: params.referenceId ?? null,
    });

  if (error) throw new Error(`알림 생성 실패: ${error.message}`);
}
