/**
 * @file inquiry.service.ts
 * @description 문의 CRUD 서비스 (core 스키마)
 * @module services/inquiry
 */

import { supabase, coreSchema } from './supabase';
import type { DbInquiry, DbInquiryInsert, DbInquiryUpdate } from '../types/database.types';
import type { Inquiry, InquiryFormData } from '../types/inquiry.types';
import { mapDbToInquiry } from '../types/inquiry.types';

// ============================================================
// 테이블 / 스토리지
// ============================================================

/** core 스키마 테이블 */
const TABLE = 'inquiries';
const STORAGE_BUCKET = 'inquiry-screenshots';

/** 스크린샷 만료 기간 (일) */
const SCREENSHOT_EXPIRY_DAYS = 90;

/** 허용된 MIME 타입 (이미지만) */
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
} as const;

/** 최대 파일 크기 (5MB) */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// ============================================================
// 조회
// ============================================================

/** 내 문의 목록 조회 */
export async function fetchMyInquiries(userId: string): Promise<Inquiry[]> {
  const { data, error } = await coreSchema()
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`문의 조회 실패: ${error.message}`);
  return (data as DbInquiry[]).map(mapDbToInquiry);
}

/** 전체 문의 조회 (관리자용) */
export async function fetchAllInquiries(): Promise<Inquiry[]> {
  const { data, error } = await coreSchema()
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`문의 조회 실패: ${error.message}`);
  return (data as DbInquiry[]).map(mapDbToInquiry);
}

// ============================================================
// 생성
// ============================================================

/** 문의 등록 */
export async function createInquiry(
  userId: string,
  form: InquiryFormData,
): Promise<Inquiry> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SCREENSHOT_EXPIRY_DAYS);

  const insert: DbInquiryInsert = {
    user_id: userId,
    title: form.title,
    content: form.content,
    screenshot_urls: form.screenshotUrls,
    screenshot_expires_at: form.screenshotUrls?.length
      ? expiresAt.toISOString()
      : null,
  };

  const { data, error } = await coreSchema()
    .from(TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`문의 등록 실패: ${error.message}`);
  return mapDbToInquiry(data as DbInquiry);
}

// ============================================================
// 답변 (관리자)
// ============================================================

/** 관리자 답변 작성 */
export async function respondToInquiry(
  inquiryId: string,
  response: string,
): Promise<void> {
  const update: DbInquiryUpdate = {
    admin_response: response,
    responded_at: new Date().toISOString(),
    status: 'answered',
  };

  const { error } = await coreSchema()
    .from(TABLE)
    .update(update)
    .eq('id', inquiryId);

  if (error) throw new Error(`답변 작성 실패: ${error.message}`);
}

// ============================================================
// 평가
// ============================================================

/** 답변 평가 */
export async function rateInquiry(
  inquiryId: string,
  rating: 'helpful' | 'not_helpful',
): Promise<void> {
  const update: DbInquiryUpdate = { user_rating: rating };

  const { error } = await coreSchema()
    .from(TABLE)
    .update(update)
    .eq('id', inquiryId);

  if (error) throw new Error(`평가 실패: ${error.message}`);
}

// ============================================================
// 스크린샷 업로드
// ============================================================

/** 스크린샷 업로드 (Supabase Storage — 스키마 무관) */
export async function uploadScreenshot(
  userId: string,
  file: File,
): Promise<string> {
  /* MIME 타입 검증 */
  const ext = ALLOWED_MIME_TYPES[file.type];
  if (!ext) {
    throw new Error('허용되지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 가능)');
  }

  /* 파일 크기 검증 */
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
  }

  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(`스크린샷 업로드 실패: ${error.message}`);

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}
