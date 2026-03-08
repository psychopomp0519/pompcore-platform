/**
 * @file ThemeToggle.tsx
 * @description 테마 전환 토글 버튼 - 애니메이티드 SVG 해/달 모핑
 * @module components/common/ThemeToggle
 */

import { useState, type ReactNode } from 'react';
import { useThemeStore } from '../../stores/themeStore';

// ============================================================
// 상수
// ============================================================

/** 전환 애니메이션 지속 시간 (ms) */
const ANIMATION_DURATION_MS = 500;

/** 태양 광선 좌표 (8방향) */
const SUN_RAYS = [
  { x1: 12, y1: 1, x2: 12, y2: 3 },
  { x1: 12, y1: 21, x2: 12, y2: 23 },
  { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 },
  { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 },
  { x1: 1, y1: 12, x2: 3, y2: 12 },
  { x1: 21, y1: 12, x2: 23, y2: 12 },
  { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 },
  { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 },
] as const;

/** 별 위치 데이터 (다크 모드 장식) */
const STARS = [
  { cx: 19, cy: 5, r: 0.8, delay: 150 },
  { cx: 6, cy: 4, r: 0.6, delay: 250 },
  { cx: 20, cy: 17, r: 0.5, delay: 350 },
] as const;

// ============================================================
// 타입
// ============================================================

interface ThemeToggleProps {
  /** 추가 CSS 클래스 */
  className?: string;
}

// ============================================================
// ThemeToggle
// ============================================================

/** 애니메이티드 테마 전환 토글 버튼 (SVG 해/달 모핑) */
export function ThemeToggle({ className = '' }: ThemeToggleProps): ReactNode {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isAnimating, setIsAnimating] = useState(false);

  /** 클릭 핸들러: 애니메이션 상태 관리 + 테마 전환 */
  function handleToggle(): void {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION_MS);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group relative p-2 rounded-xl transition-all duration-300 text-amber-500 hover:bg-amber-50 active:scale-90 dark:text-indigo-300 dark:hover:bg-indigo-500/10 motion-reduce:active:scale-100 ${className}`}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {/* 배경 글로우 */}
      <span
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500 motion-reduce:transition-none"
        style={{
          opacity: isAnimating ? 1 : 0,
          background: isDark
            ? 'radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
        }}
      />

      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative"
        style={{
          transition: `transform ${ANIMATION_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
          transform: isAnimating
            ? `rotate(${isDark ? -45 : 45}deg) scale(1.1)`
            : 'rotate(0deg) scale(1)',
        }}
      >
        {/* 메인 원: 해(r=5, filled) -> 달(r=4, stroked) */}
        <circle
          cx="12"
          cy="12"
          r={isDark ? 4 : 5}
          fill={isDark ? 'none' : 'currentColor'}
          style={{
            transition: `r ${ANIMATION_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1), fill ${ANIMATION_DURATION_MS}ms ease`,
          }}
          className="motion-reduce:!transition-none"
        />

        {/* 달 마스크: 다크 모드에서 원의 일부를 가려 초승달 형태 */}
        <circle
          cx={isDark ? 15 : 12}
          cy={isDark ? 9 : 12}
          r={isDark ? 4 : 0}
          fill="var(--mask-fill, #fff)"
          stroke="none"
          className="dark:[--mask-fill:#0C0818] motion-reduce:!transition-none"
          style={{
            transition: `cx ${ANIMATION_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1), cy ${ANIMATION_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1), r ${ANIMATION_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}
        />

        {/* 태양 광선: 라이트 모드에서 표시, 다크에서 회전+축소+사라짐 */}
        <g
          className="motion-reduce:!transition-none"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'scale(0) rotate(90deg)' : 'scale(1) rotate(0deg)',
            transformOrigin: 'center',
            transition: `opacity ${ANIMATION_DURATION_MS * 0.6}ms ease ${isDark ? '0ms' : `${ANIMATION_DURATION_MS * 0.3}ms`}, transform ${ANIMATION_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}
        >
          {SUN_RAYS.map((ray, i) => (
            <line
              key={i}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              style={{
                transition: `opacity ${ANIMATION_DURATION_MS * 0.4}ms ease`,
                transitionDelay: isDark ? '0ms' : `${i * 30}ms`,
              }}
            />
          ))}
        </g>

        {/* 별 장식: 다크 모드에서 순차적으로 나타남 */}
        <g className="motion-reduce:!transition-none">
          {STARS.map((star, i) => (
            <circle
              key={i}
              cx={star.cx}
              cy={star.cy}
              r={isDark ? star.r : 0}
              fill="currentColor"
              stroke="none"
              style={{
                opacity: isDark ? 1 : 0,
                transition: `r ${ANIMATION_DURATION_MS * 0.5}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${isDark ? star.delay : 0}ms, opacity ${ANIMATION_DURATION_MS * 0.3}ms ease ${isDark ? star.delay : 0}ms`,
              }}
            />
          ))}
        </g>
      </svg>
    </button>
  );
}
