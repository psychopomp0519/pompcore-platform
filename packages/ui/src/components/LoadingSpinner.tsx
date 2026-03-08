/**
 * @file LoadingSpinner — Spinning loader component
 * @module @pompcore/ui/LoadingSpinner
 */

import type { ReactNode } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const SIZE_MAP = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
} as const;

/** 로딩 스피너 */
export function LoadingSpinner({
  size = 'md',
  fullScreen = false,
}: LoadingSpinnerProps): ReactNode {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-app-accent border-t-transparent ${SIZE_MAP[size]}`}
      role="status"
      aria-label="로딩 중"
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  );
}
