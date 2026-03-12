/**
 * @file InquiriesPage.tsx
 * @description 문의 페이지 (목록 + 등록)
 * @module pages/InquiriesPage
 */

import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { Inquiry } from '../types/inquiry.types';
import { INQUIRY_STATUS_LABELS, INQUIRY_RATING_LABELS } from '../types/inquiry.types';
import * as inquiryService from '../services/inquiry.service';
import { GlassCard, Modal, LoadingSpinner, EmptyState, toUserMessage } from '@pompcore/ui';
import { IconChat } from '@pompcore/ui';

// ============================================================
// InquiriesPage
// ============================================================

/** 문의 페이지 */
export function InquiriesPage(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'leader' || user?.role === 'member';

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* 등록 폼 */
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  /* 답변 모달 */
  const [respondingInquiry, setRespondingInquiry] = useState<Inquiry | null>(null);
  const [responseText, setResponseText] = useState('');

  /* 상세 보기 */
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    if (user?.id) loadInquiries();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadInquiries(): Promise<void> {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const list = isAdmin
        ? await inquiryService.fetchAllInquiries()
        : await inquiryService.fetchMyInquiries(user.id);
      setInquiries(list);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!user?.id || !formTitle.trim() || !formContent.trim()) return;

    try {
      await inquiryService.createInquiry(user.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        screenshotUrls: uploadedUrls.length > 0 ? uploadedUrls : null,
        screenshotExpiresAt: null,
      });
      setIsFormOpen(false);
      setFormTitle('');
      setFormContent('');
      setUploadedUrls([]);
      loadInquiries();
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    try {
      const url = await inquiryService.uploadScreenshot(user.id, file);
      setUploadedUrls((prev) => [...prev, url]);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRespond(): Promise<void> {
    if (!respondingInquiry || !responseText.trim()) return;
    try {
      await inquiryService.respondToInquiry(respondingInquiry.id, responseText.trim());
      setRespondingInquiry(null);
      setResponseText('');
      loadInquiries();
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  async function handleRate(inquiryId: string, rating: 'helpful' | 'not_helpful'): Promise<void> {
    try {
      await inquiryService.rateInquiry(inquiryId, rating);
      loadInquiries();
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  if (isLoading && inquiries.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">문의</h1>
        {!isAdmin && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white hover:bg-vault-color/90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            문의하기
          </button>
        )}
      </div>

      {/* 목록 */}
      {inquiries.length === 0 ? (
        <EmptyState
          icon={<IconChat className="h-8 w-8" />}
          title="문의 내역이 없습니다"
          description={isAdmin ? '아직 접수된 문의가 없습니다.' : '궁금한 점이 있으면 위의 문의하기 버튼을 눌러주세요.'}
        />
      ) : (
        <div className="space-y-2">
          {inquiries.map((inq) => (
            <GlassCard key={inq.id} hoverable padding="md">
              <div
                className="cursor-pointer"
                onClick={() => setSelectedInquiry(inq)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedInquiry(inq)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                        inq.status === 'answered'
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {INQUIRY_STATUS_LABELS[inq.status]}
                      </span>
                      <h3 className="text-sm font-bold text-navy dark:text-gray-100">{inq.title}</h3>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-navy/60 dark:text-gray-400">{inq.content}</p>
                    <div className="mt-1 text-xs text-navy/40 dark:text-gray-500">
                      {inq.createdAt.slice(0, 10).replace(/-/g, '.')}
                    </div>
                  </div>
                  {isAdmin && inq.status === 'pending' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRespondingInquiry(inq);
                        setResponseText('');
                      }}
                      className="ml-3 rounded-xl bg-vault-color px-3 py-1.5 text-xs font-semibold text-white hover:bg-vault-color/90"
                    >
                      답변
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* 문의 등록 모달 */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="문의하기">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="inq-title" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">제목</label>
            <input
              id="inq-title"
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="문의 제목"
              maxLength={100}
              className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="inq-content" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">내용</label>
            <textarea
              id="inq-content"
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="문의 내용을 상세히 작성해주세요"
              rows={5}
              className="w-full resize-none rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <p className="text-xs text-navy/40 dark:text-gray-500">
              자세한 내용을 적어줄수록 정확한 답변을 드릴 수 있습니다.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
              스크린샷 첨부 (선택)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="text-sm text-navy/60 file:mr-3 file:rounded-xl file:border-0 file:bg-vault-color/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-vault-color hover:file:bg-vault-color/20"
            />
            {isUploading && <p className="mt-1 text-xs text-vault-color">업로드 중...</p>}
            {uploadedUrls.length > 0 && (
              <div className="mt-2 flex gap-2">
                {uploadedUrls.map((url, i) => (
                  <img key={i} src={url} alt={`첨부 ${i + 1}`} className="h-16 w-16 rounded-lg object-cover" />
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5">
              취소
            </button>
            <button
              type="submit"
              disabled={!formTitle.trim() || !formContent.trim()}
              className="rounded-xl bg-vault-color px-4 py-2.5 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
            >
              등록
            </button>
          </div>
        </form>
      </Modal>

      {/* 답변 모달 (관리자) */}
      <Modal
        isOpen={respondingInquiry !== null}
        onClose={() => setRespondingInquiry(null)}
        title="답변 작성"
      >
        <div className="space-y-4">
          {respondingInquiry && (
            <div className="rounded-xl bg-navy/5 p-3 text-sm dark:bg-white/5">
              <div className="font-semibold text-navy dark:text-gray-100">{respondingInquiry.title}</div>
              <p className="mt-1 text-navy/60 dark:text-gray-400">{respondingInquiry.content}</p>
            </div>
          )}
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="답변을 작성하세요"
            aria-label="답변 내용"
            rows={4}
            className="w-full resize-none rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setRespondingInquiry(null)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5">
              취소
            </button>
            <button
              type="button"
              onClick={handleRespond}
              disabled={!responseText.trim()}
              className="rounded-xl bg-vault-color px-4 py-2.5 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
            >
              답변
            </button>
          </div>
        </div>
      </Modal>

      {/* 상세 보기 모달 */}
      <Modal
        isOpen={selectedInquiry !== null}
        onClose={() => setSelectedInquiry(null)}
        title={selectedInquiry?.title ?? ''}
      >
        {selectedInquiry && (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap text-sm text-navy/80 dark:text-gray-300">
              {selectedInquiry.content}
            </div>
            {selectedInquiry.screenshotUrls && selectedInquiry.screenshotUrls.length > 0 && (
              <div className="flex gap-2">
                {selectedInquiry.screenshotUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`첨부 ${i + 1}`} className="h-24 w-24 rounded-lg object-cover" />
                  </a>
                ))}
              </div>
            )}
            {selectedInquiry.adminResponse && (
              <div className="rounded-xl bg-vault-color/5 p-3 dark:bg-vault-color/10">
                <div className="mb-1 text-xs font-semibold text-vault-color">관리자 답변</div>
                <p className="whitespace-pre-wrap text-sm text-navy/80 dark:text-gray-300">
                  {selectedInquiry.adminResponse}
                </p>
                {selectedInquiry.respondedAt && (
                  <div className="mt-1 text-xs text-navy/40 dark:text-gray-500">
                    {selectedInquiry.respondedAt.slice(0, 10).replace(/-/g, '.')}
                  </div>
                )}
                {/* 평가 */}
                {selectedInquiry.userId === user?.id && !selectedInquiry.userRating && (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRate(selectedInquiry.id, 'helpful')}
                      className="rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400"
                    >
                      {INQUIRY_RATING_LABELS.helpful}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRate(selectedInquiry.id, 'not_helpful')}
                      className="rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400"
                    >
                      {INQUIRY_RATING_LABELS.not_helpful}
                    </button>
                  </div>
                )}
                {selectedInquiry.userRating && (
                  <div className="mt-2 text-xs text-navy/40 dark:text-gray-500">
                    평가: {INQUIRY_RATING_LABELS[selectedInquiry.userRating]}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
