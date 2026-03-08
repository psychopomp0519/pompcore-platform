/**
 * @file announcement.service.ts
 * @description 공지사항 CRUD 서비스
 * @module services/announcement
 */

import { supabase } from './supabase';
import type {
  DbAnnouncement,
  DbAnnouncementInsert,
  DbAnnouncementUpdate,
  DbAnnouncementComment,
  DbAnnouncementCommentInsert,
} from '../types/database.types';
import type { Announcement, AnnouncementComment, AnnouncementFormData } from '../types/announcement.types';
import { mapDbToAnnouncement, mapDbToComment } from '../types/announcement.types';

// ============================================================
// 테이블 이름
// ============================================================

const TABLE = 'vault_announcements';
const COMMENT_TABLE = 'vault_announcement_comments';
const LIKE_TABLE = 'vault_announcement_likes';
const SETTINGS_TABLE = 'vault_user_settings';

// ============================================================
// 공지사항 조회
// ============================================================

/** 공지사항 목록 조회 (고정 상단 + 최신순, 삭제된 항목 제외) */
export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('pin_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(`공지사항 조회 실패: ${error.message}`);
  return (data as DbAnnouncement[]).map(mapDbToAnnouncement);
}

/** 공지사항 상세 조회 (삭제된 항목 제외) */
export async function fetchAnnouncement(id: string): Promise<Announcement> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) throw new Error(`공지사항 조회 실패: ${error.message}`);
  return mapDbToAnnouncement(data as DbAnnouncement);
}

// ============================================================
// 공지사항 CRUD
// ============================================================

/** 공지사항 생성 */
export async function createAnnouncement(
  authorId: string,
  form: AnnouncementFormData,
): Promise<Announcement> {
  const insert: DbAnnouncementInsert = {
    author_id: authorId,
    title: form.title,
    content: form.content,
    is_pinned: form.isPinned,
    pin_order: form.pinOrder,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`공지사항 생성 실패: ${error.message}`);
  return mapDbToAnnouncement(data as DbAnnouncement);
}

/** 공지사항 수정 */
export async function updateAnnouncement(
  id: string,
  updates: Partial<AnnouncementFormData>,
): Promise<void> {
  const dbUpdate: DbAnnouncementUpdate = {};

  if (updates.title !== undefined) dbUpdate.title = updates.title;
  if (updates.content !== undefined) dbUpdate.content = updates.content;
  if (updates.isPinned !== undefined) dbUpdate.is_pinned = updates.isPinned;
  if (updates.pinOrder !== undefined) dbUpdate.pin_order = updates.pinOrder;

  const { error } = await supabase
    .from(TABLE)
    .update(dbUpdate)
    .eq('id', id);

  if (error) throw new Error(`공지사항 수정 실패: ${error.message}`);
}

/** 공지사항 소프트 삭제 (deleted_at 설정) */
export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`공지사항 삭제 실패: ${error.message}`);
}

// ============================================================
// 댓글
// ============================================================

/** 댓글 조회 (작성자명 포함) */
export async function fetchComments(announcementId: string): Promise<AnnouncementComment[]> {
  const { data, error } = await supabase
    .from(COMMENT_TABLE)
    .select('*')
    .eq('announcement_id', announcementId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`댓글 조회 실패: ${error.message}`);

  const comments = data as DbAnnouncementComment[];
  const userIds = [...new Set(comments.map((c) => c.user_id))];

  /** 작성자 display_name 매핑 */
  const nameMap = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: settings } = await supabase
      .from(SETTINGS_TABLE)
      .select('user_id, display_name')
      .in('user_id', userIds);

    if (settings) {
      for (const s of settings) {
        if (s.display_name) nameMap.set(s.user_id as string, s.display_name as string);
      }
    }
  }

  return comments.map((c) => mapDbToComment(c, nameMap.get(c.user_id)));
}

/** 댓글 작성 */
export async function createComment(
  announcementId: string,
  userId: string,
  content: string,
): Promise<AnnouncementComment> {
  const insert: DbAnnouncementCommentInsert = {
    announcement_id: announcementId,
    user_id: userId,
    content,
  };

  const { data, error } = await supabase
    .from(COMMENT_TABLE)
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(`댓글 작성 실패: ${error.message}`);
  return mapDbToComment(data as DbAnnouncementComment);
}

/** 댓글 삭제 */
export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from(COMMENT_TABLE)
    .delete()
    .eq('id', commentId);

  if (error) throw new Error(`댓글 삭제 실패: ${error.message}`);
}

// ============================================================
// 좋아요
// ============================================================

/** 좋아요 여부 확인 */
export async function checkLiked(
  announcementId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from(LIKE_TABLE)
    .select('announcement_id')
    .eq('announcement_id', announcementId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return false;
  return data !== null;
}

/** 좋아요 토글 */
export async function toggleLike(
  announcementId: string,
  userId: string,
): Promise<boolean> {
  const isLiked = await checkLiked(announcementId, userId);

  if (isLiked) {
    await supabase
      .from(LIKE_TABLE)
      .delete()
      .eq('announcement_id', announcementId)
      .eq('user_id', userId);

    return false;
  }

  await supabase
    .from(LIKE_TABLE)
    .insert({ announcement_id: announcementId, user_id: userId });

  return true;
}
