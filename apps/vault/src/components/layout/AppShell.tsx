/**
 * @file AppShell.tsx
 * @description 앱 메인 레이아웃 - 사이드바 + 헤더 + 컨텐츠 + 하단탭
 * @module components/layout/AppShell
 */

import { Outlet } from 'react-router-dom';
import { ThemeBackground } from './ThemeBackground';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { BottomNav } from './BottomNav';

// ============================================================
// AppShell
// ============================================================

/** 인증된 사용자용 메인 레이아웃 */
export function AppShell(): React.ReactNode {
  return (
    <div className="relative flex min-h-screen">
      {/* 스킵 네비게이션 (접근성) */}
      <a href="#main-content" className="skip-nav">본문으로 건너뛰기</a>

      <ThemeBackground />

      {/* 데스크톱 사이드바 */}
      <Sidebar />

      {/* 모바일 사이드바 (오버레이) */}
      <MobileSidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main id="main-content" className="flex-1 overflow-y-auto p-4 pb-24 tablet:p-5 tablet:pb-5 desktop:p-6 desktop:pb-6">
          <Outlet />
        </main>
      </div>

      {/* 모바일 하단 탭 */}
      <BottomNav />
    </div>
  );
}
