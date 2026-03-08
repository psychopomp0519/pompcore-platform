/**
 * @file announcement.types.ts
 * @description 공지사항 관련 클라이언트 타입 정의
 * @module types/announcement
 */

import type { DbAnnouncement, DbAnnouncementComment } from './database.types';

// ============================================================
// 클라이언트 타입
// ============================================================

/** 공지사항 */
export interface Announcement {
  id: string;
  authorId: string;
  title: string;
  content: string;
  isPinned: boolean;
  pinOrder: number | null;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 공지사항 댓글 */
export interface AnnouncementComment {
  id: string;
  announcementId: string;
  userId: string;
  authorName: string | null;
  content: string;
  createdAt: string;
}

/** 공지사항 생성/수정 폼 */
export interface AnnouncementFormData {
  title: string;
  content: string;
  isPinned: boolean;
  pinOrder: number | null;
}

// ============================================================
// 변환
// ============================================================

/** DB -> 클라이언트 공지사항 */
export function mapDbToAnnouncement(row: DbAnnouncement): Announcement {
  return {
    id: row.id,
    authorId: row.author_id,
    title: row.title,
    content: row.content,
    isPinned: row.is_pinned,
    pinOrder: row.pin_order,
    likesCount: row.likes_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** DB -> 클라이언트 댓글 */
export function mapDbToComment(row: DbAnnouncementComment, authorName?: string | null): AnnouncementComment {
  return {
    id: row.id,
    announcementId: row.announcement_id,
    userId: row.user_id,
    authorName: authorName ?? null,
    content: row.content,
    createdAt: row.created_at,
  };
}
