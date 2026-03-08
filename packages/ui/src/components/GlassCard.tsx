/**
 * @file GlassCard — Nebula theme glassmorphism card component
 * @module @pompcore/ui/GlassCard
 */

import type { ReactNode } from 'react';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const PADDING_MAP = {
  sm: 'p-3',
  md: 'p-4 desktop:p-5',
  lg: 'p-6 desktop:p-8',
} as const;

/** 글래스모피즘 카드 */
export function GlassCard({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  onClick,
}: GlassCardProps): ReactNode {
  const hoverClass = hoverable || onClick
    ? 'transition-shadow hover:shadow-card-hover cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/80 shadow-card backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-card-dark ${PADDING_MAP[padding]} ${hoverClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {children}
    </div>
  );
}
