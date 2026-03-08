/**
 * 테마 토글 버튼 컴포넌트
 * - 해(Sun) ↔ 달(Moon) 모핑 애니메이션 SVG
 * - CSS transition으로 부드러운 전환 (300ms)
 * - prefers-reduced-motion 대응
 */
import { useThemeStore } from '../../store/themeStore';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg transition-colors
        text-slate-500 hover:text-amber-500 hover:bg-slate-100
        dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-white/10
        ${className}
      `}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 중심 원: 해 → 달 크기 변화 */}
        <circle
          cx="12"
          cy="12"
          r={isDark ? 4 : 5}
          className="transition-all duration-300 motion-reduce:transition-none"
          fill={isDark ? 'none' : 'currentColor'}
          stroke="currentColor"
        />

        {/* 달 마스크 (다크 모드에서 나타남) */}
        <circle
          cx={isDark ? 15 : 12}
          cy={isDark ? 9 : 12}
          r={isDark ? 4 : 0}
          fill="var(--mask-fill, #fff)"
          stroke="none"
          className="transition-all duration-300 motion-reduce:transition-none dark:[--mask-fill:#0C0818]"
        />

        {/* 태양 광선 (라이트 모드에서 보임, 다크에서 축소) */}
        <g
          className="transition-all duration-300 motion-reduce:transition-none"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'scale(0) rotate(45deg)' : 'scale(1) rotate(0deg)',
            transformOrigin: 'center',
          }}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>

        {/* 별 (다크 모드에서 나타남) */}
        <g
          className="transition-all duration-300 motion-reduce:transition-none"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'scale(1)' : 'scale(0)',
            transformOrigin: 'center',
          }}
        >
          <circle cx="19" cy="5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="6" cy="4" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="20" cy="17" r="0.5" fill="currentColor" stroke="none" />
        </g>
      </svg>
    </button>
  );
}
