/**
 * @file 플랫폼 서비스 아이콘 — RPG 판타지 브랜드 정체성
 * @description 각 서비스를 대표하는 아이콘. 서비스 카드, 네비게이션, 소개 페이지 등에서 사용.
 * @module @pompcore/ui/icons/PlatformIcons
 */
import type { ReactNode } from 'react';
import { type IconProps, svgDefaults } from './types';

/** Vault — 마법 금고 (Enchanted Vault — 자물쇠+방패+룬) */
export function VaultIcon({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 18v1" />
    </svg>
  );
}

/** Quest — 전투의 쌍검 (Battle Dual Swords) */
export function QuestIcon({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M5.5 21l3-3" />
      <path d="M9 18l-1.5-1.5" />
      <path d="M14.5 3.5L20 9l-10 10L5 14z" />
      <path d="M18.5 5.5l-3-3" />
      <path d="M14.5 3.5l6 6" />
      <path d="M3 21l3.5-3.5" />
    </svg>
  );
}

/** Academy — 마법 학원 (Arcane Academy — 책+별) */
export function AcademyIcon({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
      <path d="M12 7l1.5 3 3 .5-2.2 2 .6 3L12 14.5 9.1 16l.6-3-2.2-2 3-.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Forge — 대장장이의 모루 (Blacksmith's Anvil — 모루+불꽃) */
export function ForgeIcon({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M4 18h16v2H4z" />
      <path d="M6 14h12l1 4H5l1-4z" />
      <path d="M10 14V9l-3-1 3-5h4l3 5-3 1v5" />
      <path d="M12 3v1" />
      <path d="M10 2l.5 1h3l.5-1" />
    </svg>
  );
}

/** PompCore — 마왕의 왕관 (Demon Lord's Crown — 왕관+마나별) */
export function PompCoreIcon({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 18l3-12 3 6 3-8 3 8 3-6 3 12H3z" />
      <path d="M12 2l.8 2.4 2.4.4-1.8 1.6.5 2.4L12 7.5 10.1 8.8l.5-2.4-1.8-1.6 2.4-.4L12 2z" fill="currentColor" stroke="none" />
    </svg>
  );
}
