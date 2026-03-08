/**
 * @file inquiry.types.ts
 * @description 문의 관련 클라이언트 타입 정의
 * @module types/inquiry
 */

import type { DbInquiry } from './database.types';

// ============================================================
// 클라이언트 타입
// ============================================================

/** 문의 */
export interface Inquiry {
  id: string;
  userId: string;
  title: string;
  content: string;
  screenshotUrls: string[] | null;
  status: 'pending' | 'answered';
  adminResponse: string | null;
  respondedAt: string | null;
  userRating: 'helpful' | 'not_helpful' | null;
  screenshotExpiresAt: string | null;
  createdAt: string;
}

/** 문의 생성 폼 */
export interface InquiryFormData {
  title: string;
  content: string;
  screenshotUrls: string[] | null;
  screenshotExpiresAt: string | null;
}

// ============================================================
// 상수
// ============================================================

export const INQUIRY_STATUS_LABELS = {
  pending: '대기중',
  answered: '답변완료',
} as const;

export const INQUIRY_RATING_LABELS = {
  helpful: '유용해요',
  not_helpful: '아쉬워요',
} as const;

// ============================================================
// 변환
// ============================================================

/** DB -> 클라이언트 문의 */
export function mapDbToInquiry(row: DbInquiry): Inquiry {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    screenshotUrls: row.screenshot_urls,
    status: row.status,
    adminResponse: row.admin_response,
    respondedAt: row.responded_at,
    userRating: row.user_rating,
    screenshotExpiresAt: row.screenshot_expires_at,
    createdAt: row.created_at,
  };
}
