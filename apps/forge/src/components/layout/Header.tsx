/**
 * @file Header.tsx
 * @description 상단 헤더 — 대장간 상단 바, 테마 토글 + 사용자 메뉴
 * @module components/layout/Header
 */

import { ThemeToggle, ForgeIcon, IconSettings } from '@pompcore/ui';
import { useAuthStore } from '@pompcore/auth';
import { useUiStore } from '../../stores/uiStore';
import { ROUTES } from '../../constants/routes';
import { Link } from 'react-router-dom';

// ============================================================
// Header Component
// ============================================================

/** 앱 상단 헤더 */
export function Header(): React.ReactNode {
  const user = useAuthStore((s) => s.user);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-white/10 dark:bg-surface-card-dark/80">
      {/* 좌측 — 로고 + 사이드바 토글 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
          aria-label="메뉴 토글"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>

        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <ForgeIcon size={28} />
          <span className="font-display text-lg font-bold text-forge-color">Forge</span>
        </Link>
      </div>

      {/* 우측 — 테마 토글 + 프로필 */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Link
          to={ROUTES.SETTINGS}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          aria-label="설정"
        >
          <IconSettings size={20} />
        </Link>

        {user && (
          <div className="ml-1 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forge-color/10 text-sm font-semibold text-forge-color">
              {user.displayName?.charAt(0) ?? '?'}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
