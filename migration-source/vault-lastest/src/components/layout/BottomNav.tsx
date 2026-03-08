/**
 * @file BottomNav.tsx
 * @description 모바일 하단 탭 네비게이션 (5개 탭, 중앙=대시보드 고정)
 *              사용자 설정의 tabOrder가 있으면 커스텀 순서를 반영한다.
 * @module components/layout/BottomNav
 */

import { useMemo, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import {
  IconHome, IconBank, IconReceipt, IconRepeat, IconChart,
  IconGem, IconWallet, IconMegaphone,
} from '../icons/NavIcons';

// ============================================================
// 타입
// ============================================================

interface TabItem {
  path: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
}

// ============================================================
// 탭 레지스트리 (key → TabItem 매핑)
// ============================================================

/** 탭 키에 대응하는 경로·라벨·아이콘 레지스트리 */
const TAB_REGISTRY: Record<string, TabItem> = {
  accounts:      { path: ROUTES.ACCOUNTS,      label: '통장',     icon: IconBank },
  transactions:  { path: ROUTES.TRANSACTIONS,  label: '거래',     icon: IconReceipt },
  dashboard:     { path: ROUTES.DASHBOARD,     label: '홈',       icon: IconHome },
  recurring:     { path: ROUTES.RECURRING,     label: '정기',     icon: IconRepeat },
  statistics:    { path: ROUTES.STATISTICS,    label: '통계',     icon: IconChart },
  savings:       { path: ROUTES.SAVINGS,       label: '예/적금',  icon: IconGem },
  budget:        { path: ROUTES.BUDGET,        label: '예산',     icon: IconWallet },
  announcements: { path: ROUTES.ANNOUNCEMENTS, label: '공지',     icon: IconMegaphone },
} as const;

/** 기본 하단 탭 구성 (비로그인 또는 커스텀 설정 없을 때 사용) */
const DEFAULT_TABS: TabItem[] = [
  TAB_REGISTRY.accounts,
  TAB_REGISTRY.transactions,
  TAB_REGISTRY.dashboard,
  TAB_REGISTRY.recurring,
  TAB_REGISTRY.statistics,
];

/** 탭 슬롯 수 (dashboard 포함 총 5개) */
const EXPECTED_TAB_COUNT = 5;

// ============================================================
// 유틸
// ============================================================

/**
 * 저장된 tabOrder 배열을 TabItem[] 로 변환한다.
 * 유효하지 않은 키는 무시하며, 결과가 기대 길이에 미달하면 null을 반환한다.
 */
function resolveTabOrder(tabOrder: string[]): TabItem[] | null {
  const resolved = tabOrder
    .filter((key) => key in TAB_REGISTRY)
    .map((key) => TAB_REGISTRY[key]);

  if (resolved.length !== EXPECTED_TAB_COUNT) {
    return null;
  }
  return resolved;
}

// ============================================================
// NavLink 스타일
// ============================================================

/** 일반 탭 스타일 */
function getTabClass({ isActive }: { isActive: boolean }): string {
  const base = 'flex flex-1 flex-col items-center gap-0.5 py-3.5 text-xs font-medium transition-colors';
  if (isActive) {
    return `${base} text-vault-color`;
  }
  return `${base} text-navy/50 dark:text-gray-500`;
}

/** 중앙 탭(홈) 여부 판별 */
function isHomeTab(tab: TabItem): boolean {
  return tab.path === ROUTES.DASHBOARD;
}

// ============================================================
// BottomNav
// ============================================================

/** 모바일 하단 탭 네비게이션 */
export function BottomNav(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const tabOrder = useSettingsStore((s) => s.settings?.tabOrder ?? null);

  /** 사용자 설정이 있으면 커스텀 탭, 없으면 기본 탭 */
  const tabs = useMemo<TabItem[]>(() => {
    if (!user || !tabOrder || tabOrder.length === 0) {
      return DEFAULT_TABS;
    }
    return resolveTabOrder(tabOrder) ?? DEFAULT_TABS;
  }, [user, tabOrder]);

  return (
    <nav aria-label="하단 네비게이션" className="fixed bottom-0 left-0 right-0 z-40 flex items-end border-t border-navy/10 bg-white/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-dark/80 tablet:hidden desktop:hidden">
      {tabs.map((tab) => {
        if (isHomeTab(tab)) {
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end
              className="flex flex-1 items-center justify-center py-1.5"
            >
              {({ isActive }) => (
                <div className={`-mt-5 flex h-14 w-14 flex-col items-center justify-center rounded-full shadow-lg transition-all ${
                  isActive
                    ? 'bg-vault-color text-white shadow-vault-color/30'
                    : 'bg-vault-color/80 text-white/90 shadow-vault-color/20'
                }`}>
                  <tab.icon className="h-6 w-6" />
                  <span className="text-[10px] font-bold leading-tight">{tab.label}</span>
                </div>
              )}
            </NavLink>
          );
        }
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={getTabClass}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
