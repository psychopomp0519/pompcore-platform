/**
 * 지원서 관리 페이지 (팀장 전용)
 * - RoleGuard로 view_applications 권한 확인
 * - localStorage에 저장된 지원서를 열람/삭제
 * - 향후 Supabase 연동 시 RLS 기반으로 전환
 */
import { useState, useEffect } from 'react';
import type { ApplicationForm } from '../../constants/recruitment';
import { loadApplications, deleteApplication } from '../../services/recruitStorage';
import RoleGuard from '../../components/common/RoleGuard';

export default function RecruitAdmin() {
  const [applications, setApplications] = useState<ApplicationForm[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationForm | null>(null);

  useEffect(() => {
    setApplications(loadApplications());
  }, []);

  /** 지원서 삭제 */
  const handleDelete = (index: number) => {
    const updated = deleteApplication(index);
    setApplications(updated);
    setSelectedApp(null);
  };

  return (
    <RoleGuard requires="view_applications">
      <section className="bg-surface-light dark:bg-surface-dark-1 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-[28px] font-bold text-[#1A1A2E] dark:text-white">
              지원서 관리
            </h1>
            <span className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">
              총 {applications.length}건
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#5C5C7A] dark:text-[#6A5490]">아직 접수된 지원서가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 지원서 목록 */}
              <div className="lg:col-span-1 space-y-3">
                {applications.map((app, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedApp(app)}
                    className={`
                      w-full text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer
                      ${selectedApp === app
                        ? 'border-[#7C3AED]/30 bg-[#7C3AED]/[0.05]'
                        : 'border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-white/[0.02] hover:border-[#7C3AED]/15'
                      }
                    `}
                  >
                    <p className="text-sm font-medium text-[#1A1A2E] dark:text-white">{app.name}</p>
                    <p className="text-xs text-[#5C5C7A] dark:text-[#6A5490] mt-0.5">{app.position}</p>
                    <p className="text-[10px] text-[#757585] dark:text-[#5A4A7A] mt-1">
                      {new Date(app.submittedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </button>
                ))}
              </div>

              {/* 지원서 상세 */}
              <div className="lg:col-span-2">
                {selectedApp ? (
                  <div className="rounded-2xl p-6 md:p-8 bg-white/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="font-display text-lg font-bold text-[#1A1A2E] dark:text-white">
                          {selectedApp.name}
                        </h2>
                        <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">{selectedApp.email}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(applications.indexOf(selectedApp))}
                        className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="space-y-4">
                      <InfoRow label="포지션" value={selectedApp.position} />
                      <InfoRow label="관심 서비스" value={selectedApp.interestedService || '미선택'} />
                      <InfoRow label="포트폴리오" value={selectedApp.portfolio || '미입력'} isLink={!!selectedApp.portfolio} />
                      <InfoRow label="제출 일시" value={new Date(selectedApp.submittedAt).toLocaleString('ko-KR')} />
                      <div>
                        <p className="text-[11px] tracking-wide text-[#5C5C7A] dark:text-[#6A5490] uppercase mb-2">
                          자기소개
                        </p>
                        <p className="text-sm text-[#1A1A2E] dark:text-white/90 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-white/[0.02] rounded-xl p-4 border border-slate-100 dark:border-white/[0.04]">
                          {selectedApp.introduction}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px] text-[#5C5C7A] dark:text-[#6A5490] text-sm">
                    좌측에서 지원서를 선택하세요
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </RoleGuard>
  );
}

/** 정보 행 컴포넌트 */
function InfoRow({ label, value, isLink = false }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <p className="text-[11px] tracking-wide text-[#5C5C7A] dark:text-[#6A5490] uppercase mb-1">
        {label}
      </p>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#7C3AED] dark:text-[#A78BFA] hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm text-[#1A1A2E] dark:text-white/90">{value}</p>
      )}
    </div>
  );
}
