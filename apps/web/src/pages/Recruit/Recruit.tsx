/**
 * 팀원 모집 페이지
 * - 모집 포지션 소개 + 지원서 양식
 * - 지원서는 localStorage에 저장 (Supabase 연동 전 임시)
 * - /recruit/admin 경로에서 관리자가 지원서 열람 가능
 */
import { useState } from 'react';
import { RECRUIT_POSITIONS } from '../../constants/recruitment';
import type { ApplicationForm } from '../../constants/recruitment';
import { saveApplication } from '../../services/recruitStorage';
import RecruitPositions from './RecruitPositions';

export default function Recruit() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    interestedService: '',
    introduction: '',
    portfolio: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* 필수 필드 검증 */
    if (!formData.name.trim() || !formData.email.trim() || !formData.position || !formData.introduction.trim()) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    /* 이메일 형식 검증 */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    const application: ApplicationForm = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    saveApplication(application);
    setSubmitted(true);
  };

  return (
    <section className="bg-surface-light dark:bg-surface-dark-1 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* 페이지 헤더 */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="font-display text-xl sm:text-[24px] md:text-[32px] font-bold text-[#1A1A2E] dark:text-white mb-4">
            함께할 <span className="text-gradient">모험가</span>를 찾습니다
          </h1>
          <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490] max-w-xl mx-auto leading-relaxed">
            PompCore는 일상을 게임처럼, 관리를 모험처럼 만드는 플랫폼입니다.
            <br />
            AI 네이티브 개발 방식으로 함께 성장할 팀원을 모집합니다.
          </p>
        </div>

        {/* AI 네이티브 개발 안내 */}
        <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-[#7C3AED]/[0.03] border border-[#7C3AED]/[0.08] mb-12">
          <h2 className="font-display text-lg font-bold text-[#1A1A2E] dark:text-white mb-3">
            AI 네이티브 개발이란?
          </h2>
          <p className="text-sm text-[#4A4270] dark:text-[#7A6A9A] leading-relaxed mb-4">
            코드를 한 줄 한 줄 작성하는 대신, 서비스 기획과 아키텍처 설계에 집중하고,
            AI 도구가 정확한 결과를 내도록 프롬프트를 설계하는 방식입니다.
          </p>
          <ul className="space-y-2">
            {[
              '서비스 기획과 UX 설계',
              '기술적 의사결정과 아키텍처 설계',
              'AI 도구 프롬프트 작성 및 검증',
              '결과물의 품질 관리와 통합',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-[#4A4270] dark:text-[#7A6A9A]">
                <span className="text-[#FFD700] text-[10px]">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 모집 포지션 */}
        <RecruitPositions />

        {/* 함께하면 좋은 점 */}
        <div className="rounded-2xl p-6 md:p-8 bg-[#FFD700]/[0.04] border border-[#FFD700]/10 mb-16">
          <h2 className="font-display text-lg font-bold text-[#1A1A2E] dark:text-white mb-4">
            함께하면 이런 점이 좋아요
          </h2>
          <ul className="space-y-2">
            {[
              'AI 네이티브 개발이라는 새로운 방식을 경험할 수 있어요',
              '서브컬쳐 + 실용 서비스라는 독특한 포지셔닝의 프로젝트에 참여할 수 있어요',
              '기획/설계 중심이라 "생각하는 힘"을 키울 수 있어요',
              '포트폴리오에 차별화된 프로젝트를 추가할 수 있어요',
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm text-[#4A4270] dark:text-[#7A6A9A]">
                <span className="text-[#10B981] text-xs">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* 지원서 양식 */}
        <div id="apply" className="rounded-2xl p-6 md:p-8 bg-white/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
          <h2 className="font-display text-xl font-bold text-[#1A1A2E] dark:text-white mb-6">
            지원하기
          </h2>

          {submitted ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-4">✦</span>
              <h3 className="font-display text-lg font-bold text-[#1A1A2E] dark:text-white mb-2">
                지원이 완료되었습니다!
              </h3>
              <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">
                소중한 지원 감사합니다. 검토 후 연락드리겠습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* 이름 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#1A1A2E] dark:text-white/90 mb-1.5">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm text-[#1A1A2E] dark:text-white placeholder-slate-400 dark:placeholder-[#6A5490] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
                  placeholder="홍길동"
                  required
                />
              </div>

              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1A1A2E] dark:text-white/90 mb-1.5">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm text-[#1A1A2E] dark:text-white placeholder-slate-400 dark:placeholder-[#6A5490] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
                  placeholder="email@example.com"
                  required
                />
              </div>

              {/* 포지션 */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-[#1A1A2E] dark:text-white/90 mb-1.5">
                  지원 포지션 <span className="text-red-500">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm text-[#1A1A2E] dark:text-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
                  required
                >
                  <option value="">선택해주세요</option>
                  {RECRUIT_POSITIONS.map((pos) => (
                    <option key={pos.id} value={pos.title}>{pos.title}</option>
                  ))}
                </select>
              </div>

              {/* 관심 서비스 */}
              <div>
                <label htmlFor="interestedService" className="block text-sm font-medium text-[#1A1A2E] dark:text-white/90 mb-1.5">
                  관심 있는 서비스
                </label>
                <select
                  id="interestedService"
                  name="interestedService"
                  value={formData.interestedService}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm text-[#1A1A2E] dark:text-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
                >
                  <option value="">선택해주세요</option>
                  <option value="Vault">Vault (가계부)</option>
                  <option value="Quest">Quest (일정 관리)</option>
                  <option value="전체">전체</option>
                </select>
              </div>

              {/* 자기소개 */}
              <div>
                <label htmlFor="introduction" className="block text-sm font-medium text-[#1A1A2E] dark:text-white/90 mb-1.5">
                  간단한 자기소개 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm text-[#1A1A2E] dark:text-white placeholder-slate-400 dark:placeholder-[#6A5490] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors resize-none"
                  placeholder="본인의 경험, 관심 분야, 지원 동기 등을 자유롭게 작성해주세요."
                  required
                />
              </div>

              {/* 포트폴리오 */}
              <div>
                <label htmlFor="portfolio" className="block text-sm font-medium text-[#1A1A2E] dark:text-white/90 mb-1.5">
                  포트폴리오 / GitHub (선택)
                </label>
                <input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm text-[#1A1A2E] dark:text-white placeholder-slate-400 dark:placeholder-[#6A5490] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
                  placeholder="https://"
                />
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-3 text-base rounded-xl min-h-[48px] font-medium transition-all duration-300 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-[0_4px_20px_rgba(124,58,237,0.2)] dark:shadow-[0_0_24px_rgba(124,58,237,0.25)] hover:from-[#6D28D9] hover:to-[#9333EA] cursor-pointer"
              >
                ✦ 지원서 제출하기
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
