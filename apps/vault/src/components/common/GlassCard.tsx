/**
 * @file GlassCard.tsx
 * @description Nebula 테마 글래스모피즘 카드 컴포넌트
 * @module components/common/GlassCard
 */

import type { ReactNode } from 'react';

// ============================================================
// 타입
// ============================================================

interface GlassCardProps {
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 호버 효과 여부 */
  hoverable?: boolean;
  /** 패딩 크기 */
  padding?: 'sm' | 'md' | 'lg';
}

// ============================================================
// 상수
// ============================================================

const PADDING_MAP = {
  sm: 'p-3',
  md: 'p-4 desktop:p-5',
  lg: 'p-6 desktop:p-8',
} as const;

// ============================================================
// GlassCard
// ============================================================

/** 글래스모피즘 카드 */
export function GlassCard({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
}: GlassCardProps): ReactNode {
  const hoverClass = hoverable
    ? 'transition-shadow hover:shadow-card-hover cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/80 shadow-card backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-card-dark ${PADDING_MAP[padding]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
