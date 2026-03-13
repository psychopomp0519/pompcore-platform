/**
 * @file MobileSidebar.tsx
 * @description 모바일 슬라이드 사이드바 (오버레이)
 * @module components/layout/MobileSidebar
 */

import { useEffect, useCallback, useRef, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useUiStore } from '../../stores/uiStore';
import {
  IconHome, IconBank, IconReceipt, IconRepeat, IconGem,
  IconWallet, IconChart, IconMegaphone, IconChat, IconSettings, IconTrash,
} from '@pompcore/ui';

// ============================================================
// 네비게이션 항목
// ============================================================

interface NavItem {
  path: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: ROUTES.DASHBOARD, label: '대시보드', icon: IconHome },
  { path: ROUTES.ACCOUNTS, label: '통장', icon: IconBank },
  { path: ROUTES.TRANSACTIONS, label: '거래내역', icon: IconReceipt },
  { path: ROUTES.RECURRING, label: '정기결제', icon: IconRepeat },
  { path: ROUTES.SAVINGS, label: '예/적금', icon: IconGem },
  { path: ROUTES.BUDGET, label: '예산', icon: IconWallet },
  { path: ROUTES.STATISTICS, label: '통계', icon: IconChart },
  { path: ROUTES.ANNOUNCEMENTS, label: '공지사항', icon: IconMegaphone },
  { path: ROUTES.INQUIRIES, label: '문의', icon: IconChat },
  { path: ROUTES.SETTINGS, label: '설정', icon: IconSettings },
  { path: ROUTES.TRASH, label: '휴지통', icon: IconTrash },
];

// ============================================================
// NavLink 스타일
// ============================================================

function getNavLinkClass({ isActive }: { isActive: boolean }): string {
  const base = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors';
  if (isActive) {
    return `${base} bg-vault-color/10 text-vault-color dark:bg-vault-color/20`;
  }
  return `${base} text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5`;
}

// ============================================================
// MobileSidebar
// ============================================================

/** 포커스 가능 요소 선택자 */
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])' as const;

/** 모바일 사이드바 (오버레이) */
export function MobileSidebar(): ReactNode {
  const { isMobileSidebarOpen, closeMobileSidebar } = useUiStore();
  const location = useLocation();
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  /** 페이지 이동 시 사이드바 자동 닫기 */
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname, closeMobileSidebar]);

  /** 사이드바 열릴 때 트리거 요소 저장 + 포커스 이동 */
  useEffect(() => {
    if (isMobileSidebarOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isMobileSidebarOpen]);

  /** 포커스 트래핑 + Escape 닫기 */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileSidebar();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    },
    [closeMobileSidebar],
  );

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileSidebarOpen, handleKeyDown]);

  return (
    <div
      className={`fixed inset-0 z-50 tablet:hidden desktop:hidden ${isMobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* 오버레이 */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      {/* 사이드바 패널 */}
      <aside
        ref={panelRef}
        className={`absolute left-0 top-0 flex h-full w-64 flex-col bg-white/95 shadow-glass-lg backdrop-blur-[16px] transition-transform duration-300 ease-in-out dark:bg-surface-dark/95 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* 헤더 */}
        <div className="flex h-14 items-center justify-between border-b border-navy/10 px-4 dark:border-white/10">
          <img src="/logo.svg" alt="Vault" className="h-7" />
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
            aria-label="메뉴 닫기"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 네비게이션 */}
        <nav aria-label="사이드바 네비게이션" className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} className={getNavLinkClass} end={item.path === ROUTES.DASHBOARD}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
