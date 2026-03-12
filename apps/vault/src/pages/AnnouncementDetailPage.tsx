/**
 * @file AnnouncementDetailPage.tsx
 * @description 공지사항 상세 페이지 (본문 + 댓글 + 좋아요)
 * @module pages/AnnouncementDetailPage
 */

import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { Announcement, AnnouncementComment } from '../types/announcement.types';
import * as announcementService from '../services/announcement.service';
import { GlassCard, LoadingSpinner, toUserMessage } from '@pompcore/ui';
import { IconHeartFilled, IconHeartOutline } from '@pompcore/ui';

// ============================================================
// AnnouncementDetailPage
// ============================================================

/** 공지사항 상세 페이지 */
export function AnnouncementDetailPage(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [comments, setComments] = useState<AnnouncementComment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!id) return;
    loadDetail(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadDetail(announcementId: string): Promise<void> {
    setIsLoading(true);
    try {
      const [ann, cmts] = await Promise.all([
        announcementService.fetchAnnouncement(announcementId),
        announcementService.fetchComments(announcementId),
      ]);
      setAnnouncement(ann);
      setComments(cmts);

      if (user?.id) {
        const liked = await announcementService.checkLiked(announcementId, user.id);
        setIsLiked(liked);
      }
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLike(): Promise<void> {
    if (!id || !user?.id) return;
    try {
      const nowLiked = await announcementService.toggleLike(id, user.id);
      setIsLiked(nowLiked);
      if (announcement) {
        setAnnouncement({
          ...announcement,
          likesCount: announcement.likesCount + (nowLiked ? 1 : -1),
        });
      }
    } catch {
      /* ignore */
    }
  }

  async function handleAddComment(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!id || !user?.id || !commentText.trim()) return;
    try {
      const comment = await announcementService.createComment(id, user.id, commentText.trim());
      setComments((prev) => [...prev, comment]);
      setCommentText('');
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  async function handleDeleteComment(commentId: string): Promise<void> {
    try {
      await announcementService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  if (isLoading) return <LoadingSpinner />;
  if (!announcement) return <div className="text-center text-sm text-navy/50 dark:text-gray-400">공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600 dark:hover:text-red-300" aria-label="에러 닫기">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 뒤로 가기 */}
      <button
        type="button"
        onClick={() => navigate('/announcements')}
        className="flex items-center gap-1 text-sm text-navy/50 hover:text-navy/70 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </button>

      {/* 본문 */}
      <GlassCard padding="lg">
        <div className="flex items-start justify-between">
          <div>
            {announcement.isPinned && (
              <span className="mb-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                고정
              </span>
            )}
            <h1 className="text-lg font-bold text-navy dark:text-gray-100">{announcement.title}</h1>
          </div>
        </div>
        <div className="mt-1 text-xs text-navy/40 dark:text-gray-500">
          {announcement.createdAt.slice(0, 10).replace(/-/g, '.')}
        </div>
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-navy/80 dark:text-gray-300">
          {announcement.content}
        </div>

        {/* 좋아요 */}
        <div className="mt-4 border-t border-navy/5 pt-3 dark:border-white/5">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm transition-colors ${
              isLiked
                ? 'bg-red-50 text-red-500 dark:bg-red-500/10'
                : 'text-navy/40 hover:bg-navy/5 dark:text-gray-500 dark:hover:bg-white/5'
            }`}
          >
            {isLiked ? <IconHeartFilled className="h-4 w-4" /> : <IconHeartOutline className="h-4 w-4" />}
            <span>{announcement.likesCount}</span>
          </button>
        </div>
      </GlassCard>

      {/* 댓글 */}
      <GlassCard padding="md">
        <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">
          댓글 ({comments.length})
        </div>

        {comments.length > 0 && (
          <div className="mb-4 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start justify-between text-sm">
                <div>
                  <span className="text-xs text-navy/40 dark:text-gray-500">
                    {c.authorName && (
                      <span className="mr-1.5 font-medium text-navy/70 dark:text-gray-300">{c.authorName}</span>
                    )}
                    {c.createdAt.slice(0, 10).replace(/-/g, '.')}
                  </span>
                  <p className="mt-0.5 text-navy/80 dark:text-gray-300">{c.content}</p>
                </div>
                {c.userId === user?.id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(c.id)}
                    className="ml-2 text-xs text-navy/30 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 댓글 입력 */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요"
            aria-label="댓글 입력"
            maxLength={300}
            className="flex-1 rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
          >
            등록
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
