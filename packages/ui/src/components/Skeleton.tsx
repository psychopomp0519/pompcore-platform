/**
 * @file Skeleton — CSS pulse loading placeholder
 * @module @pompcore/ui/Skeleton
 */

import type { ReactNode } from 'react';

interface SkeletonProps {
  /** 너비 (Tailwind 클래스 또는 CSS 값) */
  readonly width?: string;
  /** 높이 (Tailwind 클래스 또는 CSS 값) */
  readonly height?: string;
  /** 원형 여부 */
  readonly circle?: boolean;
  /** 추가 CSS 클래스 */
  readonly className?: string;
}

/** 로딩 상태를 나타내는 펄스 스켈레톤 */
export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  circle = false,
  className = '',
}: SkeletonProps): ReactNode {
  const shape = circle ? 'rounded-full' : 'rounded-lg';
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-white/10 ${shape} ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
}
