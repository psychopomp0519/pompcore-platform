/**
 * 프로젝트 카드 컴포넌트
 * - 각 서브 프로젝트(Vault, Quest 등)를 카드 형태로 표시
 * - 라이트/다크 모드 대응
 * - logoSrc가 있으면 SVG 아이콘 사용, 없으면 이모지 사용
 */
import type { Project } from '@pompcore/types';
import { GlassCard } from '@pompcore/ui';
import { PROJECT_STATUS_LABELS } from '../../constants/projects';
import BrandText from '../common/BrandText';
import { DynamicIcon } from '../icons/Icons';

interface ProjectCardProps {
  project: Project;
}

/** 상태별 배지 스타일 */
const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  coming_soon: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  beta: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  maintenance: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const { name, description, icon, status, accentColor, accentGradient, url, logoSrc } = project;

  const statusLabel = PROJECT_STATUS_LABELS[status] ?? status;

  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <GlassCard
      className={`group relative overflow-hidden ${url ? 'cursor-pointer' : ''}`}
      padding="lg"
      onClick={url ? handleClick : undefined}
    >
      {/* 배경 그라디언트 효과 (호버 시 나타남) */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${accentGradient} opacity-0
          group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500
        `}
      />

      {/* 상태 배지 + 아이콘 로고 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {logoSrc ? (
            <img src={logoSrc} alt={name} className="h-10 w-10" />
          ) : (
            <span className={accentColor}><DynamicIcon name={icon} size={40} fallback={icon} /></span>
          )}
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[status] ?? ''}`}>
          {statusLabel}
        </span>
      </div>

      {/* 프로젝트 정보 — 텍스트 로고 + 설명 */}
      <h3 className="mb-2">
        <BrandText brand={project.id} size="text-xl" />
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>

      {/* 링크 표시 */}
      {url && (
        <div className="mt-4 flex items-center text-sm text-brand-600 dark:text-brand-400 group-hover:text-brand-500 dark:group-hover:text-brand-300 transition-colors">
          <span>서비스 바로가기</span>
          <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
        </div>
      )}
    </GlassCard>
  );
}
