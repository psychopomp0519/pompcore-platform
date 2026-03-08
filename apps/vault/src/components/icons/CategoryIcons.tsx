/**
 * @file CategoryIcons.tsx
 * @description 카테고리용 아이콘 매핑 시스템
 * @module components/icons/CategoryIcons
 */

import type { ReactNode } from 'react';
import {
  IconCoin, IconBanknote, IconGift, IconArrowDown, IconTrendUp,
  IconUtensils, IconBus, IconCart, IconHouse, IconSmartphone,
  IconMedical, IconFilm, IconBook, IconArrowUp, IconCoffee,
  IconGamepad, IconPlane,
} from './UIIcons';
import { IconBank, IconGem, IconTag } from './NavIcons';

// ============================================================
// 아이콘 레지스트리
// ============================================================

interface CategoryIconEntry {
  key: string;
  label: string;
  component: (props: { className?: string }) => ReactNode;
}

/** 수입 카테고리 아이콘 */
export const INCOME_ICON_SET: CategoryIconEntry[] = [
  { key: 'coin', label: '화폐', component: IconCoin },
  { key: 'banknote', label: '지폐', component: IconBanknote },
  { key: 'gift', label: '선물', component: IconGift },
  { key: 'bank', label: '은행', component: IconBank },
  { key: 'arrow-down', label: '입금', component: IconArrowDown },
  { key: 'gem', label: '보석', component: IconGem },
  { key: 'trend-up', label: '상승', component: IconTrendUp },
  { key: 'tag', label: '태그', component: IconTag },
];

/** 지출 카테고리 아이콘 */
export const EXPENSE_ICON_SET: CategoryIconEntry[] = [
  { key: 'utensils', label: '음식', component: IconUtensils },
  { key: 'bus', label: '교통', component: IconBus },
  { key: 'cart', label: '쇼핑', component: IconCart },
  { key: 'house', label: '주거', component: IconHouse },
  { key: 'smartphone', label: '통신', component: IconSmartphone },
  { key: 'medical', label: '의료', component: IconMedical },
  { key: 'film', label: '여가', component: IconFilm },
  { key: 'book', label: '교육', component: IconBook },
  { key: 'arrow-up', label: '출금', component: IconArrowUp },
  { key: 'coffee', label: '카페', component: IconCoffee },
  { key: 'gamepad', label: '게임', component: IconGamepad },
  { key: 'plane', label: '여행', component: IconPlane },
];

/** 전체 아이콘 맵 (키 → 컴포넌트) */
const ALL_ICONS = new Map<string, (props: { className?: string }) => ReactNode>();
[...INCOME_ICON_SET, ...EXPENSE_ICON_SET].forEach((entry) => {
  ALL_ICONS.set(entry.key, entry.component);
});

// ============================================================
// 렌더러
// ============================================================

/** 카테고리 아이콘 키로 SVG 아이콘 렌더링 (이전 이모지 값은 기본 아이콘으로 폴백) */
export function renderCategoryIcon(iconKey: string | null | undefined, className?: string): ReactNode {
  if (!iconKey) {
    return <IconTag className={className ?? 'h-5 w-5'} />;
  }

  const Component = ALL_ICONS.get(iconKey);
  if (Component) {
    return <Component className={className ?? 'h-5 w-5'} />;
  }

  /* 이전 이모지 값 폴백: 기본 아이콘 표시 */
  return <IconTag className={className ?? 'h-5 w-5'} />;
}
