/**
 * 프로젝트 개요 열람 페이지 (팀원 이상 전용)
 * - PompCore_프로젝트_개요 문서를 구조화하여 표시
 * - RoleGuard로 view_project_overview 권한 확인
 * - 섹션별 아코디언 UI
 */
import { useState } from 'react';
import { PROJECT_OVERVIEW_SECTIONS } from '../../constants/projectOverview';
import type { OverviewSection } from '../../constants/projectOverview';
import { RoleGuard } from '@pompcore/auth';

/** 섹션 카드 컴포넌트 */
function SectionCard({ section }: { section: OverviewSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-white/[0.02] overflow-hidden">
      {/* 섹션 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left min-h-[44px] cursor-pointer"
      >
        <h2 className="font-display text-lg font-bold text-[#1A1A2E] dark:text-white">
          {section.title}
        </h2>
        <span
          className={`text-xs text-brand/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {/* 섹션 본문 — grid-rows 트랜지션 */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-5 md:px-6 pb-6 space-y-5">
            {/* 메인 콘텐츠 */}
            {section.content && (
              <p className="text-sm text-[#4A4A6A] dark:text-[#9A8ABB] leading-relaxed">
                {section.content}
              </p>
            )}

            {/* 메인 테이블 */}
            {section.table && <DataTable table={section.table} />}

            {/* 하위 섹션 */}
            {section.subsections?.map((sub, i) => (
              <div key={i} className="pl-4 border-l-2 border-brand/10 dark:border-brand/20 space-y-2">
                <h3 className="text-sm font-semibold text-[#1A1A2E] dark:text-white/90">
                  {sub.title}
                </h3>
                {sub.content && (
                  <p className="text-[13px] text-[#4A4A6A] dark:text-[#9A8ABB] leading-relaxed">
                    {sub.content}
                  </p>
                )}
                {sub.table && <DataTable table={sub.table} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 테이블 렌더러 */
function DataTable({ table }: { table: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-white/[0.04]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-white/[0.03]">
            {table.headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left text-[11px] tracking-wide text-[#4A4270] dark:text-[#6A5490] uppercase font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-slate-100 dark:border-white/[0.04]">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-[13px] text-[#4A4A6A] dark:text-[#9A8ABB]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProjectOverview() {
  return (
    <RoleGuard permission="view_project_overview">
      <section className="bg-surface-light dark:bg-surface-dark-1 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-24">
          {/* 페이지 헤더 */}
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[2px] text-accent-gold/70 uppercase mb-3 font-display">
              INTERNAL DOCUMENT
            </p>
            <h1 className="font-display text-[28px] md:text-[32px] font-bold text-[#1A1A2E] dark:text-white mb-3">
              프로젝트 <span className="text-gradient">종합 개요</span>
            </h1>
            <p className="text-sm text-[#4A4270] dark:text-[#6A5490]">
              PompCore — 일상을 플레이하다 | Project Overview v1.1
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/[0.06] dark:bg-white/[0.04] text-[11px] font-medium text-brand dark:text-purple-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              팀원 이상 열람 가능
            </div>
          </div>

          {/* 섹션 목록 */}
          <div className="space-y-4">
            {PROJECT_OVERVIEW_SECTIONS.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      </section>
    </RoleGuard>
  );
}
