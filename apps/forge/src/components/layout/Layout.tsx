/**
 * @file Layout.tsx
 * @description 앱 셸 레이아웃 — 헤더 + 사이드바 + 메인 콘텐츠 영역
 * @module components/layout/Layout
 */

import { Outlet, NavLink } from 'react-router-dom';
import { IconHome, IconTarget, IconCheck, IconClipboard, IconRepeat } from '@pompcore/ui';
import { Header } from './Header';
import { useUiStore } from '../../stores/uiStore';
import { ROUTES } from '../../constants/routes';

// ============================================================
// 사이드바 네비게이션 항목
// ============================================================

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: '대시보드', icon: IconHome },
  { to: ROUTES.GOALS, label: '목표', icon: IconTarget },
  { to: ROUTES.TASKS, label: '작업', icon: IconCheck },
  { to: ROUTES.DEBT, label: '작업 부채', icon: IconClipboard },
  { to: ROUTES.REVIEW, label: '주간 회고', icon: IconRepeat },
] as const;

// ============================================================
// Layout Component
// ============================================================

/** 앱 레이아웃 — 대장간 구조 */
export function Layout(): React.ReactNode {
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1">
        {/* 오버레이 (모바일) */}
        {isSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={closeSidebar}
            aria-label="사이드바 닫기"
          />
        )}

        {/* 사이드바 */}
        <aside
          className={`
            fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-60 transform border-r border-slate-200
            bg-white/90 backdrop-blur-md transition-transform duration-300
            dark:border-white/10 dark:bg-surface-card-dark/90
            lg:sticky lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="flex flex-col gap-1 p-3" aria-label="주요 네비게이션">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-forge-color/10 text-forge-color'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
