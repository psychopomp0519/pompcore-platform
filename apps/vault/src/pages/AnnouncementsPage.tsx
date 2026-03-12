/**
 * @file AnnouncementsPage.tsx
 * @description 공지사항 목록 페이지
 * @module pages/AnnouncementsPage
 */

import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { Announcement, AnnouncementFormData } from '../types/announcement.types';
import * as announcementService from '../services/announcement.service';
import { GlassCard, Modal, ConfirmDialog, LoadingSpinner, EmptyState, toUserMessage } from '@pompcore/ui';
import { IconMegaphone } from '@pompcore/ui';
import { IconHeartFilled } from '@pompcore/ui';

// ============================================================
// AnnouncementsPage
// ============================================================

/** 공지사항 목록 페이지 */
export function AnnouncementsPage(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'leader' || user?.role === 'member';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);

  /* 폼 상태 */
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formPinOrder, setFormPinOrder] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements(): Promise<void> {
    setIsLoading(true);
    try {
      const list = await announcementService.fetchAnnouncements();
      setAnnouncements(list);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateForm(): void {
    setFormTitle('');
    setFormContent('');
    setFormIsPinned(false);
    setFormPinOrder('');
    setEditingAnnouncement(null);
    setIsFormOpen(true);
  }

  function openEditForm(a: Announcement): void {
    setFormTitle(a.title);
    setFormContent(a.content);
    setFormIsPinned(a.isPinned);
    setFormPinOrder(a.pinOrder ? String(a.pinOrder) : '');
    setEditingAnnouncement(a);
    setIsFormOpen(true);
  }

  async function handleSubmit(): Promise<void> {
    if (!user?.id || !formTitle.trim() || !formContent.trim()) return;

    // Max 3 pinned validation
    if (formIsPinned) {
      const currentPinnedCount = announcements.filter((a) => a.isPinned).length;
      const isAlreadyPinned = editingAnnouncement?.isPinned;
      if (!isAlreadyPinned && currentPinnedCount >= 3) {
        setError('고정 공지는 최대 3개까지 가능합니다.');
        return;
      }
    }

    const form: AnnouncementFormData = {
      title: formTitle.trim(),
      content: formContent.trim(),
      isPinned: formIsPinned,
      pinOrder: formIsPinned && formPinOrder ? parseInt(formPinOrder, 10) : null,
    };

    try {
      if (editingAnnouncement) {
        await announcementService.updateAnnouncement(editingAnnouncement.id, form);
      } else {
        await announcementService.createAnnouncement(user.id, form);
      }
      setIsFormOpen(false);
      loadAnnouncements();
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  async function handleDelete(): Promise<void> {
    if (!deletingAnnouncement) return;
    try {
      await announcementService.deleteAnnouncement(deletingAnnouncement.id);
      setDeletingAnnouncement(null);
      loadAnnouncements();
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  if (isLoading && announcements.length === 0) {
    return <LoadingSpinner />;
  }

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

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">공지사항</h1>
        {isAdmin && (
          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-1.5 rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white hover:bg-vault-color/90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            작성
          </button>
        )}
      </div>

      {/* 목록 */}
      {announcements.length === 0 ? (
        <EmptyState icon={<IconMegaphone className="h-8 w-8" />} title="공지사항이 없습니다" description="아직 등록된 공지가 없습니다." />
      ) : (
        <div className="space-y-2">
          {announcements.map((a) => (
            <GlassCard
              key={a.id}
              hoverable
              padding="md"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/announcements/${a.id}`)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/announcements/${a.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {a.isPinned && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                          고정
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-navy dark:text-gray-100">{a.title}</h3>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-navy/60 dark:text-gray-400">
                      {a.content}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-navy/40 dark:text-gray-500">
                      <span>{a.createdAt.slice(0, 10).replace(/-/g, '.')}</span>
                      <span className="flex items-center gap-1"><IconHeartFilled className="h-3.5 w-3.5 text-red-400" /> {a.likesCount}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="ml-3 flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openEditForm(a)}
                        className="rounded-lg p-1.5 text-navy/30 hover:text-navy/60 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingAnnouncement(a)}
                        className="rounded-lg p-1.5 text-navy/30 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* 작성/수정 모달 */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingAnnouncement ? '공지사항 수정' : '공지사항 작성'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="ann-title" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">제목</label>
            <input
              id="ann-title"
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="공지사항 제목"
              maxLength={100}
              className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="ann-content" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">내용</label>
            <textarea
              id="ann-content"
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="공지 내용을 입력하세요"
              rows={6}
              className="w-full resize-none rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formIsPinned}
                onChange={(e) => setFormIsPinned(e.target.checked)}
                className="rounded border-navy/20 text-vault-color focus:ring-vault-color"
              />
              <span className="text-navy/70 dark:text-gray-300">고정</span>
            </label>
            {formIsPinned && (
              <input
                type="number"
                value={formPinOrder}
                onChange={(e) => setFormPinOrder(e.target.value)}
                placeholder="순서 (1~3)"
                min="1"
                max="3"
                className="w-24 rounded-xl border border-navy/10 bg-white/80 px-3 py-1.5 text-sm text-navy focus:border-vault-color focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
              />
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formTitle.trim() || !formContent.trim()}
              className="rounded-xl bg-vault-color px-4 py-2.5 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
            >
              {editingAnnouncement ? '수정' : '작성'}
            </button>
          </div>
        </div>
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingAnnouncement !== null}
        onClose={() => setDeletingAnnouncement(null)}
        onConfirm={handleDelete}
        title="공지사항 삭제"
        message={`"${deletingAnnouncement?.title}"을(를) 삭제하시겠습니까?`}
        confirmText="삭제"
        isDangerous
      />
    </div>
  );
}
