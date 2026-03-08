/**
 * @file Sidebar.tsx
 * @description 데스크톱 좌측 사이드바 네비게이션
 * @module components/layout/Sidebar
 */

import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useUiStore } from '../../stores/uiStore';
import { useIsTablet } from '../../hooks/useMediaQuery';
import {
  IconHome, IconBank, IconReceipt, IconRepeat, IconGem,
  IconWallet, IconChart, IconMegaphone, IconChat, IconSettings, IconTrash,
  IconInvestment, IconRealEstate,
} from '../icons/NavIcons';

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
  { path: ROUTES.INVESTMENTS, label: '투자', icon: IconInvestment },
  { path: ROUTES.REAL_ESTATE, label: '부동산', icon: IconRealEstate },
  { path: ROUTES.ANNOUNCEMENTS, label: '공지사항', icon: IconMegaphone },
  { path: ROUTES.INQUIRIES, label: '문의', icon: IconChat },
  { path: ROUTES.SETTINGS, label: '설정', icon: IconSettings },
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
// Sidebar 컴포넌트
// ============================================================

/** 데스크톱/태블릿 사이드바 */
export function Sidebar(): ReactNode {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const isTablet = useIsTablet();

  /** 태블릿에서는 항상 축소 모드, 데스크톱에서는 사용자 설정 존중 */
  const isExpanded = isTablet ? false : isSidebarOpen;

  return (
    <aside
      className={`sticky top-0 h-screen hidden tablet:flex desktop:flex flex-col border-r border-navy/10 bg-white/60 backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-dark/60 transition-[width] duration-300 ${
        isExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* 로고 */}
      <div className="flex h-14 items-center border-b border-navy/10 px-4 dark:border-white/10">
        {isExpanded ? (
          <img src="/logo.svg" alt="Vault" className="h-6 dark:invert" />
        ) : (
          <img src="/icon.svg" alt="Vault" className="h-6 w-6 dark:invert" />
        )}
      </div>

      {/* 네비게이션 */}
      <nav aria-label="사이드바 네비게이션" className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={getNavLinkClass}
                end={item.path === ROUTES.DASHBOARD}
                {...(!isExpanded ? { title: item.label } : {})}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isExpanded && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* 하단 휴지통 링크 */}
      <div className="border-t border-navy/10 p-3 dark:border-white/10">
        <NavLink
          to={ROUTES.TRASH}
          className={getNavLinkClass}
          {...(!isExpanded ? { title: '휴지통' } : {})}
        >
          <IconTrash className="h-5 w-5 shrink-0" />
          {isExpanded && <span>휴지통</span>}
        </NavLink>
      </div>
    </aside>
  );
}
