/**
 * @file settings.service.ts
 * @description 사용자 설정 CRUD 서비스
 * @module services/settings
 */

import { supabase } from './supabase';
import { FunctionsHttpError } from '@supabase/supabase-js';
import type { DbUserSettings, DbUserSettingsUpdate } from '../types/database.types';
import type { UserSettings, ProfileFormData, PreferencesFormData } from '../types/settings.types';
import { mapDbToSettings } from '../types/settings.types';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE = 'vault_user_settings';

// ============================================================
// 조회
// ============================================================

/** 사용자 설정 조회 (없으면 기본값으로 생성) */
export async function fetchSettings(userId: string): Promise<UserSettings> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(`설정 조회 실패: ${error.message}`);

  if (data) return mapDbToSettings(data as DbUserSettings);

  /* 설정 레코드가 없으면 기본값으로 생성 */
  const { data: created, error: createErr } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      primary_currency: 'KRW',
      recurring_avg_period: 'month',
      tab_order: ['accounts', 'transactions', 'dashboard', 'recurring', 'statistics'],
      display_name: null,
      avatar_url: null,
      birthday: null,
    })
    .select()
    .single();

  if (createErr) throw new Error(`설정 생성 실패: ${createErr.message}`);
  return mapDbToSettings(created as DbUserSettings);
}

// ============================================================
// 프로필 수정
// ============================================================

/** 닉네임 최대 길이 */
const MAX_DISPLAY_NAME_LENGTH = 30;

/** 생년월일 형식 검증 (YYYY-MM-DD) */
const BIRTHDAY_PATTERN = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

/** 프로필 업데이트 (닉네임, 생년월일) */
export async function updateProfile(
  userId: string,
  form: ProfileFormData,
): Promise<void> {
  /* 입력값 검증 */
  const displayName = form.displayName?.trim().slice(0, MAX_DISPLAY_NAME_LENGTH) || null;

  if (form.birthday && !BIRTHDAY_PATTERN.test(form.birthday)) {
    throw new Error('생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD)');
  }

  const update: DbUserSettingsUpdate = {
    display_name: displayName,
    birthday: form.birthday || null,
  };

  const { error } = await supabase
    .from(TABLE)
    .update(update)
    .eq('user_id', userId);

  if (error) throw new Error(`프로필 수정 실패: ${error.message}`);

  /* Supabase Auth user_metadata도 동기화 */
  await supabase.auth.updateUser({
    data: { display_name: displayName },
  });
}

// ============================================================
// 환경설정
// ============================================================

/** 환경설정 업데이트 */
export async function updatePreferences(
  userId: string,
  form: PreferencesFormData,
): Promise<void> {
  const update: DbUserSettingsUpdate = {
    primary_currency: form.primaryCurrency,
    recurring_avg_period: form.recurringAvgPeriod,
  };

  const { error } = await supabase
    .from(TABLE)
    .update(update)
    .eq('user_id', userId);

  if (error) throw new Error(`환경설정 수정 실패: ${error.message}`);
}

// ============================================================
// 탭 순서
// ============================================================

/** 하단 탭 순서 저장 */
export async function updateTabOrder(
  userId: string,
  tabOrder: string[],
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ tab_order: tabOrder })
    .eq('user_id', userId);

  if (error) throw new Error(`탭 순서 수정 실패: ${error.message}`);
}

// ============================================================
// 비밀번호 변경
// ============================================================

/** 비밀번호 변경 */
export async function changePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(`비밀번호 변경 실패: ${error.message}`);
}

// ============================================================
// 회원 탈퇴
// ============================================================

/**
 * 회원 탈퇴 — Edge Function으로 Auth 사용자를 삭제하면
 * ON DELETE CASCADE로 모든 vault_* 테이블 데이터가 자동 정리된다.
 */
export async function deleteAccount(): Promise<void> {
  /* 세션 갱신 후 유효한 토큰으로 호출 */
  const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError || !session) throw new Error('로그인 세션이 없습니다.');

  const { error } = await supabase.functions.invoke('delete-account', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error) {
    let detail = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const body = await error.context.json();
        detail = body?.error ?? JSON.stringify(body);
      } catch { /* 파싱 실패 시 기본 메시지 사용 */ }
    }
    throw new Error(`계정 삭제 실패: ${detail}`);
  }

  await supabase.auth.signOut();
}
