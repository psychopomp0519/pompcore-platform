/**
 * @file Tooltip — Simple CSS hover tooltip
 * @module @pompcore/ui/Tooltip
 */

import type { ReactNode } from 'react';

interface TooltipProps {
  /** 툴팁에 표시할 텍스트 */
  readonly text: string;
  /** 감싸는 자식 요소 */
  readonly children: ReactNode;
  /** 추가 CSS 클래스 */
  readonly className?: string;
}

/** 호버 시 텍스트를 보여주는 툴팁 래퍼 */
export function Tooltip({ text, children, className = '' }: TooltipProps): ReactNode {
  return (
    <span className={`group relative inline-block ${className}`}>
      {children}
      <span
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-slate-700"
        role="tooltip"
      >
        {text}
      </span>
    </span>
  );
}
