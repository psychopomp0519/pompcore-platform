/**
 * @file CategoryIcons.tsx
 * @description 카테고리용 아이콘 매핑 시스템 — @pompcore/ui 공유 아이콘 사용
 * @module components/icons/CategoryIcons
 */

import type { ReactNode } from 'react';
import type { IconProps } from '@pompcore/ui';
import {
  IconCoin, IconBanknote, IconGift, IconArrowDown, IconTrendUp,
  IconUtensils, IconBus, IconCart, IconHouse, IconSmartphone,
  IconMedical, IconFilm, IconBook, IconArrowUp, IconCoffee,
  IconGamepad, IconPlane, IconBank, IconGem, IconTag,
  IconShield, IconPiggyBank, IconUsers,
} from '@pompcore/ui';

// ============================================================
// 아이콘 레지스트리
// ============================================================

interface CategoryIconEntry {
  key: string;
  label: string;
  component: React.ComponentType<IconProps>;
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
const ALL_ICONS = new Map<string, React.ComponentType<IconProps>>();
[...INCOME_ICON_SET, ...EXPENSE_ICON_SET].forEach((entry) => {
  ALL_ICONS.set(entry.key, entry.component);
});

/**
 * 레거시 lucide 아이콘 이름 → 내부 키 매핑
 * DB에 "UtensilsCrossed", "Car" 등 lucide 이름이 저장된 경우 대응
 */
const LEGACY_ICON_ALIASES: Record<string, React.ComponentType<IconProps>> = {
  UtensilsCrossed: IconUtensils,
  Car: IconBus,
  Home: IconHouse,
  Smartphone: IconSmartphone,
  Shirt: IconTag,
  Heart: IconMedical,
  Music: IconFilm,
  GraduationCap: IconBook,
  Users: IconUsers,
  Shield: IconShield,
  PiggyBank: IconPiggyBank,
  MoreHorizontal: IconTag,
  Coins: IconCoin,
  Banknote: IconBanknote,
  Gift: IconGift,
  Building2: IconBank,
  TrendingUp: IconTrendUp,
  ArrowDownCircle: IconArrowDown,
};

// ============================================================
// 렌더러
// ============================================================

/** 카테고리 아이콘 키로 SVG 아이콘 렌더링 (레거시 lucide 이름 + 이모지 폴백 지원) */
export function renderCategoryIcon(iconKey: string | null | undefined, className?: string): ReactNode {
  const cls = className ?? 'h-5 w-5';

  if (!iconKey) {
    return <IconTag className={cls} />;
  }

  /* 1. 정규 아이콘 키 (utensils, bus, ...) */
  const Component = ALL_ICONS.get(iconKey);
  if (Component) {
    return <Component className={cls} />;
  }

  /* 2. 레거시 lucide 이름 (UtensilsCrossed, Car, ...) */
  const Legacy = LEGACY_ICON_ALIASES[iconKey];
  if (Legacy) {
    return <Legacy className={cls} />;
  }

  /* 3. 이모지 값 — 텍스트로 표시 */
  if (/\p{Emoji}/u.test(iconKey)) {
    return <span className="text-base leading-none">{iconKey}</span>;
  }

  /* 4. 알 수 없는 값 — 기본 아이콘 */
  return <IconTag className={cls} />;
}
