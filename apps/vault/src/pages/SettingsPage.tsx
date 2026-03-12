/**
 * @file SettingsPage.tsx
 * @description 설정 메인 페이지 (메뉴 허브)
 * @module pages/SettingsPage
 */

import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { GlassCard } from '@pompcore/ui';
import {
  IconUser, IconPhone, IconTag, IconSliders,
  IconPalette, IconDocument, IconUsers, IconChevronRight,
} from '@pompcore/ui';

// ============================================================
// 메뉴 항목
// ============================================================

interface MenuItem {
  path: string;
  icon: (props: { className?: string }) => ReactNode;
  label: string;
  description: string;
}

const MENU_ITEMS: MenuItem[] = [
  { path: ROUTES.SETTINGS_PROFILE, icon: IconUser, label: '프로필', description: '닉네임, 생년월일, 비밀번호' },
  { path: ROUTES.SETTINGS_MENU, icon: IconPhone, label: '메뉴 설정', description: '하단 탭 순서 커스터마이징' },
  { path: ROUTES.SETTINGS_CATEGORIES, icon: IconTag, label: '카테고리', description: '수입/지출 카테고리 관리' },
  { path: ROUTES.SETTINGS_PREFERENCES, icon: IconSliders, label: '환경설정', description: '주 통화, 정기결제 단위' },
  { path: ROUTES.SETTINGS_THEME, icon: IconPalette, label: '테마', description: '액센트 컬러, 배경 애니메이션' },
  { path: ROUTES.SETTINGS_CREDITS, icon: IconDocument, label: '크레딧', description: '개발자 정보, 오픈소스' },
  { path: ROUTES.SETTINGS_FRIENDS, icon: IconUsers, label: '친구', description: '가계부 공유, 초대 관리' },
];

// ============================================================
// SettingsPage
// ============================================================

/** 설정 메인 페이지 */
export function SettingsPage(): ReactNode {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">설정</h1>

      {/* 활성 메뉴 */}
      <div className="space-y-4">
        {MENU_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path}>
            <GlassCard hoverable padding="md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-vault-color/10 text-vault-color dark:bg-vault-color/20">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy dark:text-gray-100">{item.label}</div>
                  <div className="text-xs text-navy/50 dark:text-gray-400">{item.description}</div>
                </div>
                <IconChevronRight className="h-4 w-4 text-navy/30 dark:text-gray-500" />
              </div>
            </GlassCard>
          </NavLink>
        ))}
      </div>

    </div>
  );
}
