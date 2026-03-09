/**
 * 공지사항 페이지
 * - constants/announcements.ts 데이터를 자동으로 렌더링
 * - 고정(pinned) 공지가 상단에 표시
 */
import { useState } from 'react';
import { ANNOUNCEMENTS, ANNOUNCEMENT_CATEGORY_CONFIG } from '../../constants/announcements';
import type { Announcement } from '../../constants/announcements';
import { DynamicIcon } from '../../components/icons/Icons';

/** 공지사항 카드 */
function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryConfig = ANNOUNCEMENT_CATEGORY_CONFIG[announcement.category];

  return (
    <article
      role="button"
      tabIndex={0}
      className="card p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
      onClick={() => setIsExpanded(!isExpanded)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}
      aria-expanded={isExpanded}
    >
      <div className="flex items-start gap-4">
        {/* 카테고리 아이콘 */}
        <span className="flex-shrink-0 mt-0.5 text-[#7C3AED] dark:text-[#A78BFA]">
          <DynamicIcon name={categoryConfig.icon} size={24} fallback={categoryConfig.icon} />
        </span>

        <div className="flex-1 min-w-0">
          {/* 상단: 배지 + 날짜 */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${categoryConfig.color}`}>
              {categoryConfig.label}
            </span>
            {announcement.pinned && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                📌 고정
              </span>
            )}
            <time className="text-xs text-slate-400 dark:text-slate-500">
              {announcement.date}
            </time>
          </div>

          {/* 제목 */}
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            {announcement.title}
          </h2>

          {/* 본문 (펼치기/접기) */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {announcement.content}
            </p>
          </div>

          {/* 펼치기 힌트 */}
          {!isExpanded && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              클릭하여 내용 보기
            </p>
          )}
        </div>

        {/* 펼침 화살표 */}
        <span
          className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </div>
    </article>
  );
}

export default function Announcements() {
  /** 고정 공지를 상단에, 나머지는 날짜 역순 */
  const sortedAnnouncements = [...ANNOUNCEMENTS].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.date.localeCompare(a.date);
  });

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* 페이지 헤더 */}
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          <span className="text-gradient">공지사항</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          PompCore의 소식과 공지를 확인하세요.
        </p>
      </div>

      {/* 공지 목록 */}
      {sortedAnnouncements.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 dark:text-slate-500">등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}
    </section>
  );
}
