/**
 * 패치노트 페이지
 * - constants/patchnotes.ts 데이터를 자동으로 렌더링
 * - 버전별 타임라인 형태로 변경 이력 표시
 */
import { useState } from 'react';
import { PATCH_NOTES, CHANGE_TYPE_CONFIG } from '../../constants/patchnotes';
import type { PatchNoteChange } from '../../constants/patchnotes';

/** 변경 타입 배지 */
function ChangeBadge({ type }: { type: PatchNoteChange['type'] }) {
  const config = CHANGE_TYPE_CONFIG[type];
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function PatchNotes() {
  /** 최신 버전은 기본 펼침 */
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set([PATCH_NOTES[0]?.version]),
  );

  /** 버전 접기/펼치기 토글 */
  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* 페이지 헤더 */}
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          <span className="text-gradient">패치노트</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          PompCore 플랫폼의 업데이트 이력을 확인하세요.
        </p>
      </div>

      {/* 타임라인 */}
      {PATCH_NOTES.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 dark:text-slate-500">등록된 패치노트가 없습니다.</p>
        </div>
      ) : (
      <div className="space-y-8">
        {PATCH_NOTES.map((note, idx) => (
          <article
            key={note.version}
            className="card p-4 sm:p-6 md:p-8 rounded-2xl"
          >
            {/* 버전 헤더 (클릭하여 접기/펼치기) */}
            <button
              type="button"
              onClick={() => toggleVersion(note.version)}
              className="w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded-lg"
              aria-expanded={expandedVersions.has(note.version)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 text-sm font-bold">
                      v{note.version}
                    </span>
                    {idx === 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-medium">
                        최신
                      </span>
                    )}
                  </div>
                  <time className="text-sm text-slate-400 dark:text-slate-500">
                    {note.date}
                  </time>
                </div>

                {/* 쉐브론 아이콘 */}
                <span
                  className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                    expandedVersions.has(note.version) ? 'rotate-180' : ''
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 8 10 12 14 8" />
                  </svg>
                </span>
              </div>

              {/* 요약 */}
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-4">
                {note.summary}
              </h2>
            </button>

            {/* 변경 항목 목록 (접기/펼치기) */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedVersions.has(note.version) ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-3">
                {note.changes.map((change, changeIdx) => (
                  <li key={changeIdx} className="flex items-start gap-3">
                    <ChangeBadge type={change.type} />
                    <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {change.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      )}
    </section>
  );
}
