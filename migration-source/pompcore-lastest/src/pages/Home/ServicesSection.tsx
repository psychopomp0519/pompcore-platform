/**
 * 서비스 요약 섹션
 * - 홈 페이지용 간략한 프로젝트 소개 카드
 * - 상세 정보는 Projects 페이지로 유도
 */
import { Link } from 'react-router-dom';
import { PROJECTS } from '../../constants/projects';
import { DynamicIcon } from '../../components/icons/Icons';
import BrandText from '../../components/common/BrandText';

export default function ServicesSection() {
  return (
    <section
      id="services-section"
      className="snap-section bg-gradient-to-b from-sky-faint to-sky-mist dark:from-surface-dark-2 dark:to-surface-dark-2 relative overflow-hidden py-12 flex flex-col justify-center"
    >
      {/* 배경 글로우 */}
      <div className="absolute top-[10%] left-[5%] w-[250px] md:w-[350px] lg:w-[400px] h-[250px] md:h-[350px] lg:h-[400px] bg-[#B0E0FF]/[0.1] dark:bg-[#10B981]/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[250px] md:w-[350px] lg:w-[400px] h-[250px] md:h-[350px] lg:h-[400px] bg-[#87CEEB]/[0.08] dark:bg-[#7C3AED]/[0.06] rounded-full blur-[120px] pointer-events-none" />
      {/* 구름 (라이트 전용) */}
      <div className="dark:hidden absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="animate-cloud-drift-slow" style={{ animationDelay: '2s' }}>
          <div className="absolute top-[5%] right-[12%] w-[200px] md:w-[340px] h-[55px] md:h-[85px] bg-white/42 rounded-full blur-[26px]" />
          <div className="absolute top-[5.5%] right-[14%] w-[140px] md:w-[240px] h-[40px] md:h-[60px] bg-white/78 rounded-full blur-[12px]" />
        </div>
        <div className="animate-cloud-drift" style={{ animationDelay: '8s' }}>
          <div className="absolute bottom-[8%] left-[8%] w-[220px] md:w-[360px] h-[60px] md:h-[90px] bg-white/40 rounded-full blur-[28px]" />
          <div className="absolute bottom-[8.5%] left-[10%] w-[150px] md:w-[260px] h-[42px] md:h-[62px] bg-white/76 rounded-full blur-[12px]" />
        </div>
        <div className="animate-cloud-drift" style={{ animationDelay: '5s' }}>
          <div className="absolute top-[40%] right-[25%] w-[90px] md:w-[150px] h-[30px] md:h-[45px] bg-white/80 rounded-full blur-[8px]" />
        </div>
      </div>
      {/* 별 (다크 전용) */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ top: `${5 + (i * 6.2) % 88}%`, left: `${3 + (i * 6.7) % 93}%`, animationDelay: `${(i * 0.27).toFixed(2)}s`, opacity: 0.2 + (i % 3) * 0.15 }} />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-display text-xl sm:text-[28px] font-bold text-[#1A1A2E] dark:text-white mb-3">
            우리의 <span className="text-gradient">프로젝트</span>
          </h2>
          <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">
            각 서비스를 마스터하고 경험치를 쌓아 레벨업하세요
          </p>
        </div>

        {/* 간략 카드 그리드 */}
        {PROJECTS.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">등록된 프로젝트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl p-5 sm:p-6 bg-white/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] transition-all duration-300 hover:border-[#7C3AED]/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  {project.logoSrc ? (
                    <img src={project.logoSrc} alt={project.name} className="h-10 w-10 dark:invert" />
                  ) : (
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `${project.accentGradientCSS ? project.accentGradientCSS.includes('#10B981') ? '#10B981' : '#7C3AED' : '#7C3AED'}15`, color: project.accentGradientCSS?.includes('#10B981') ? '#10B981' : '#7C3AED' }}
                    >
                      <DynamicIcon name={project.icon} size={24} fallback={project.icon} />
                    </div>
                  )}
                  <div>
                    <h3><BrandText brand={project.id} size="text-lg" /></h3>
                    <p className="text-[11px] tracking-wide text-[#5C5C7A] dark:text-[#6A5490] uppercase">
                      {project.categoryLabel ?? project.category}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#4A4270] dark:text-[#7A6A9A] leading-relaxed">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects 페이지로 이동 */}
        <div className="text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7C3AED] dark:text-[#A78BFA] hover:underline underline-offset-4 transition-colors"
          >
            모든 프로젝트 자세히 보기
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
