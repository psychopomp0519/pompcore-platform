/**
 * 회사 소개 페이지
 * - PompCore 비전, 미션, 핵심 가치
 * - 프로젝트 개요 문서(v1.1) 기반 공식 내용
 * - WhySection(홈)과 차별화: 회사 철학 + 가치관 중심
 */
import { GlassCard } from '@pompcore/ui';
import { SparkleIcon, KeyIcon, RocketIcon, PuzzleIcon } from '../../components/icons/Icons';
import type { IconProps } from '../../components/icons/Icons';

/** 문서 기준 4대 핵심 가치 */
const VALUES: { IconComponent: React.ComponentType<IconProps>; title: string; subtitle: string; description: string }[] = [
  {
    IconComponent: SparkleIcon,
    title: '몰입',
    subtitle: 'Immersion',
    description: '서브컬쳐 게임의 세계관과 감성을 일상 도구에 자연스럽게 녹여냅니다.',
  },
  {
    IconComponent: KeyIcon,
    title: '접근성',
    subtitle: 'Accessibility',
    description: '누구나 무료로 핵심 기능을 사용할 수 있으며, 유료 구독은 편의성 향상에만 집중합니다.',
  },
  {
    IconComponent: RocketIcon,
    title: '민첩성',
    subtitle: 'Agility',
    description: 'AI 도구를 활용한 빠른 개발 사이클로 시장 변화에 즉각 대응합니다.',
  },
  {
    IconComponent: PuzzleIcon,
    title: '공동 성장',
    subtitle: 'Co-growth',
    description: '사용자 피드백을 최우선으로 수용하며, 커뮤니티와 함께 서비스를 발전시킵니다.',
  },
];

export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* 페이지 헤더 */}
      <div className="max-w-3xl mb-10 sm:mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          <span className="text-gradient">PompCore</span> 소개
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          PompCore는 서브컬쳐 게임의 몰입감과 감성을 일상 도구에 접목하여,
          사용자가 자신의 삶을 하나의 게임처럼 능동적으로 플레이할 수 있는
          통합 생활 플랫폼입니다.
        </p>
      </div>

      {/* 비전 & 미션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-16">
        <GlassCard padding="lg">
          <p className="text-[11px] tracking-[2px] text-accent-gold dark:text-accent-gold/70 uppercase mb-3">VISION</p>
          <h2 className="text-lg font-semibold text-[#1A1A2E] dark:text-white mb-2">일상을 플레이하다</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            서브컬쳐 게임의 몰입감과 감성을 일상 도구에 접목하여,
            사용자가 자신의 삶을 하나의 게임처럼 능동적으로 플레이할 수 있는
            통합 생활 플랫폼을 구축합니다.
          </p>
        </GlassCard>
        <GlassCard padding="lg">
          <p className="text-[11px] tracking-[2px] text-brand dark:text-purple-400 uppercase mb-3">MISSION</p>
          <h2 className="text-lg font-semibold text-[#1A1A2E] dark:text-white mb-2">게임 감성의 생활 도구</h2>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-accent-gold text-[10px] mt-1 shrink-0">✦</span>
              생활 필수 도구를 서브컬쳐 게임 감성 UI로 제공
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-gold text-[10px] mt-1 shrink-0">✦</span>
              무료 사용자도 핵심 기능에 불편함 없이 접근
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-gold text-[10px] mt-1 shrink-0">✦</span>
              AI 네이티브 개발로 소규모 팀의 고품질 서비스
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-gold text-[10px] mt-1 shrink-0">✦</span>
              사용자 피드백을 적극 수용하여 함께 성장
            </li>
          </ul>
        </GlassCard>
      </div>

      {/* 핵심 가치 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-[#1A1A2E] dark:text-white">핵심 가치</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {VALUES.map((value) => (
            <GlassCard key={value.title} padding="lg">
              <span className="text-brand dark:text-purple-400 mb-4 block"><value.IconComponent size={32} /></span>
              <h3 className="text-lg font-semibold text-[#1A1A2E] dark:text-white mb-0.5">{value.title}</h3>
              <p className="text-[11px] tracking-wide text-[#5C5C7A] dark:text-[#6A5490] uppercase mb-2">{value.subtitle}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{value.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
