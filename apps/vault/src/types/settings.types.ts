/**
 * @file settings.types.ts
 * @description 사용자 설정 클라이언트 타입 정의
 * @module types/settings
 */

import type { DbUserSettings } from './database.types';

// ============================================================
// 클라이언트 타입
// ============================================================

/** 사용자 설정 */
export interface UserSettings {
  id: string;
  userId: string;
  primaryCurrency: string;
  recurringAvgPeriod: 'day' | 'week' | 'month' | 'year';
  tabOrder: string[];
  displayName: string | null;
  avatarUrl: string | null;
  birthday: string | null;
  notificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 프로필 수정 데이터 */
export interface ProfileFormData {
  displayName: string;
  birthday: string | null;
}

/** 환경설정 수정 데이터 */
export interface PreferencesFormData {
  primaryCurrency: string;
  recurringAvgPeriod: 'day' | 'week' | 'month' | 'year';
}

// ============================================================
// 변환
// ============================================================

/** DB -> 클라이언트 변환 */
export function mapDbToSettings(row: DbUserSettings): UserSettings {
  return {
    id: row.id,
    userId: row.user_id,
    primaryCurrency: row.primary_currency,
    recurringAvgPeriod: row.recurring_avg_period,
    tabOrder: row.tab_order,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    birthday: row.birthday,
    notificationEnabled: row.notification_enabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
