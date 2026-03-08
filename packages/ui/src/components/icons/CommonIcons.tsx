/**
 * @file 공통 유틸리티 아이콘 — RPG 모험 테마 (서브컬쳐 판타지 스타일)
 * @description Nebula 디자인 시스템 통합 아이콘. 모든 아이콘에 판타지 RPG 장식 요소 적용.
 * @module @pompcore/ui/icons/CommonIcons
 */
import type { ReactNode } from 'react';
import { type IconProps, svgDefaults } from './types';

// ============================================================
// 방향/네비게이션
// ============================================================

/** 위쪽 화살표 — 솟구치는 불꽃 (Rising Flames) */
export function IconArrowUp({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M12 19V5" />
      <path d="M5 10l7-7 7 7" />
      <path d="M8 17l-1 2m9-2l1 2" />
    </svg>
  );
}

/** 아래쪽 화살표 — 낙하하는 유성 (Meteor Descent) */
export function IconArrowDown({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M12 5v14" />
      <path d="M5 14l7 7 7-7" />
      <path d="M8 7l-1-2m9 2l1-2" />
    </svg>
  );
}

/** 왼쪽 화살표 — 엘프 화살 (Elven Arrow) */
export function IconArrowLeft({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M11 5L4 12l7 7" />
      <path d="M4 12h16" />
      <path d="M20 12l-2-1.5v3L20 12z" />
    </svg>
  );
}

/** 오른쪽 셰브론 — 룬 화살촉 (Rune Arrowhead) */
export function IconChevronRight({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} strokeWidth={2} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ============================================================
// 액션/상태
// ============================================================

/** 플러스 — 룬 십자 (Rune Cross) */
export function IconPlus({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} strokeWidth={2} {...props}>
      <path d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

/** 체크 — 승리의 징표 (Victory Mark) */
export function IconCheck({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} strokeWidth={2} {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/** 닫기 — 봉인 해제 (Seal Break) */
export function IconClose({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} strokeWidth={2} {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/** 검색 — 점술의 수정 구슬 (Scrying Orb) */
export function IconSearch({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M9 8l-1-1.5 1.5-.5.5-1.5.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5z" />
    </svg>
  );
}

/** 필터 — 연금술 깔때기 (Alchemist's Funnel) */
export function IconFilter({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 4h18l-7 8v6l-4 2V12L3 4z" />
      <path d="M12 16v2" />
      <circle cx="12" cy="19" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ============================================================
// 커뮤니케이션
// ============================================================

/** 알림 — 신전의 종 (Temple Bell) */
export function IconBell({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <path d="M12 2v1" />
      <circle cx="12" cy="2" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 메가폰 — 전쟁 뿔피리 (War Horn) */
export function IconMegaphone({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M4 9h3l9-5v14l-9-5H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
      <path d="M17 8.5c1.5 1 2.5 2 2.5 3.5s-1 2.5-2.5 3.5" />
      <path d="M7 13l-1.5 5 2.5-1.5" />
    </svg>
  );
}

/** 채팅 — 마력 구슬 대화 (Arcane Chat Orb) */
export function IconChat({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M4 12a8 8 0 0 1 14.93-4L21 8l-2.07-.5A8 8 0 0 0 4 12z" />
      <path d="M4 12a8 8 0 0 0 8 8c1.5 0 2.9-.4 4.1-1.1L20 20l-1.5-3.6A8 8 0 0 0 4 12z" />
      <path d="M9 12h.01M12 12h.01M15 12h.01" />
    </svg>
  );
}

// ============================================================
// 사용자/계정
// ============================================================

/** 사용자 — 모험가 실루엣 (Adventurer Silhouette) */
export function IconUser({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
      <path d="M9 5c-.5-1.5.5-3 2-3" />
    </svg>
  );
}

/** 사용자 그룹 — 모험가 파티 (Adventurer Party) */
export function IconUsers({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M9 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <path d="M16 5a2.5 2.5 0 0 1 0 5" />
      <path d="M18 14c2 .5 4 2 4 6" />
    </svg>
  );
}

// ============================================================
// 시스템/UI
// ============================================================

/** 설정 — 연금술 기어 (Alchemy Wheel) */
export function IconSettings({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M12 2l1.4 3.4 3.6-.8-1.2 3.4 3 2-3 2 1.2 3.4-3.6-.8L12 18l-1.4-3.4-3.6.8 1.2-3.4-3-2 3-2-1.2-3.4 3.6.8L12 2z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/** 휴지통 — 어둠의 가마솥 (Dark Cauldron) */
export function IconTrash({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M4 6h16" />
      <path d="M6 6l1.5 13a2 2 0 0 0 2 1.5h5a2 2 0 0 0 2-1.5L18 6" />
      <path d="M9 3.5c0-.5.5-1.5 1-1.5s.5 1 1 1.5.5 1 1 1 1-1 1-1.5" />
    </svg>
  );
}

/** 문서 — 고대 서판 (Ancient Tome) */
export function IconDocument({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-5-5H6z" />
      <path d="M13 3v5h5" />
      <path d="M9 13h6M9 17h4" />
      <path d="M9 9h2" />
    </svg>
  );
}

/** 태그 — 룬 문장 (Rune Emblem) */
export function IconTag({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 10V4a1 1 0 0 1 1-1h6l11 11-7 7L3 10z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

/** 슬라이더 — 마법봉 삼위 조율 (Tri-Wand Tuning) */
export function IconSliders({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M5 4v6m0 4v6" />
      <path d="M12 4v2m0 4v10" />
      <path d="M19 4v10m0 4v2" />
      <circle cx="5" cy="11" r="1.5" />
      <circle cx="12" cy="7" r="1.5" />
      <circle cx="19" cy="15" r="1.5" />
    </svg>
  );
}

/** 이체 — 마법 텔레포트 포탈 (Twin Portals) */
export function IconTransfer({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M7 16l-4-4 4-4" />
      <path d="M3 12h10" />
      <path d="M17 8l4 4-4 4" />
      <path d="M11 12h10" />
    </svg>
  );
}

// ============================================================
// 감정/피드백
// ============================================================

/** 하트 (채워진) — 생명의 결정 (Life Crystal) */
export function IconHeartFilled({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001z" />
    </svg>
  );
}

/** 하트 (빈) — 생명의 결정 외곽 (Life Crystal Outline) */
export function IconHeartOutline({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

/** 반짝임 — 마나의 별 (Mana Star) */
export function IconSparkle({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ============================================================
// 기타
// ============================================================

/** 링크 — 구속의 사슬 (Chain of Binding) */
export function IconLink({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/** 방패+체크 — 수호의 방패 (Guardian's Shield) */
export function IconShield({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** 열쇠 — 던전 열쇠 (Dungeon Key) */
export function IconKey({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11.3 11.7L15 8" />
      <path d="M15 8l3 3" />
      <path d="M18 8l-3 3" />
      <path d="M15 8v3" />
    </svg>
  );
}

/** 타겟 — 궁수의 과녁 (Archer's Mark) */
export function IconTarget({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 로켓 — 드래곤 비행 (Dragon Flight) */
export function IconRocket({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 12c2-4 5-6 8-6 2 0 4 1 5 2.5" />
      <path d="M16 8.5c1.5 1 3 3.5 3 5.5 0 1.5-1 2-2 1.5" />
      <path d="M11 6c0 0-1-2-2-2 0 1.5 0 3 2 4" />
      <path d="M13 7c0 0 2-1 3.5-.5-1 1-2 2.5-3.5 2" />
      <path d="M11 18l2-5 5 2.5-5.5 2.5L11 18z" />
    </svg>
  );
}

/** 차트 상승 — 별의 궤도 (Star Trail) */
export function IconTrendUp({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 17l5-6 4 3 5-8" />
      <path d="M15 6l4-2-2 4" />
      <path d="M6 11l-1-1.5 1.5-.5.5-1.5.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5z" />
    </svg>
  );
}

/** 클립보드 — 퀘스트 보드 (Quest Board) */
export function IconClipboard({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M12 8l.8 1.6 1.7.3-1.2 1.2.3 1.7L12 12l-1.6.8.3-1.7-1.2-1.2 1.7-.3L12 8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 홈 — 성채 (Fortress Gate) */
export function IconHome({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 21V10l9-8 9 8v11H3z" />
      <path d="M9 21v-6h6v6H9z" />
      <path d="M9 10h2v3H9zm4 0h2v3h-2z" />
    </svg>
  );
}

/** 동전 — 룬이 새겨진 금화 (Rune Coin) */
export function IconCoin({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v1m0 6v1m-3-4h.5m5 0h.5" />
      <path d="M10 10.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5-.9 1.5-2 1.5-2 .7-2 1.5.9 1.5 2 1.5 2-.7 2-1.5" />
    </svg>
  );
}

/** 보물 상자 — 통장/금고 (Treasure Chest) */
export function IconBank({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M5 7l1-3h12l1 3" />
      <path d="M3 7h18v3H3z" />
      <path d="M3 10h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9z" />
      <path d="M10.5 14.5a1.5 1.5 0 1 1 3 0v2h-3v-2z" />
    </svg>
  );
}

/** 마법 두루마리 — 거래 내역 (Quest Scroll) */
export function IconReceipt({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M8 3a2 2 0 0 0-2 2v14l2-1.5L10 19l2-1.5L14 19l2-1.5L18 19V5a2 2 0 0 0-2-2H8z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

/** 마법 보석 — 예/적금 (Arcane Crystal) */
export function IconGem({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M12 2l5 5-5 15-5-15 5-5z" />
      <path d="M7 7h10" />
      <path d="M9 7l3 4 3-4" />
    </svg>
  );
}

/** 코인 주머니 — 예산/지갑 (Coin Pouch) */
export function IconWallet({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M9 3c0 0 1 2 3 2s3-2 3-2" />
      <path d="M6 5c-1 .5-2 2-2 4.5v5C4 18 7.5 21 12 21s8-3 8-6.5v-5C20 7 19 5.5 18 5H6z" />
      <path d="M8 13h8M10 16h4" />
    </svg>
  );
}

/** 수정 구슬 — 통계/차트 (Crystal Orb) */
export function IconChart({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <circle cx="12" cy="11" r="7" />
      <path d="M8 13l2-4 3 2.5 2-4" />
      <path d="M5 20h14" />
      <path d="M9 20l3-2 3 2" />
    </svg>
  );
}

/** 룬 순환 — 정기결제 (Runic Cycle) */
export function IconRepeat({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M17.5 6A7.5 7.5 0 0 0 12 4.5" />
      <path d="M6.5 18A7.5 7.5 0 0 0 12 19.5" />
      <path d="M4.5 12a7.5 7.5 0 0 1 2-5l-2-1 1 3" />
      <path d="M19.5 12a7.5 7.5 0 0 1-2 5l2 1-1-3" />
      <path d="M12 10l1.5 2-1.5 2-1.5-2 1.5-2z" />
    </svg>
  );
}

/** 디바이스/폰 — 마법 수정판 (Magic Crystal Tablet) */
export function IconPhone({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M12 18h.01" />
      <path d="M10 6l2-1 2 1-1 2h-2l-1-2z" />
    </svg>
  );
}

/** 디바이스 — 마법 수정판 (Magic Crystal Tablet) */
export function IconDevice({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M12 18h.01" />
      <path d="M10 6l2-1 2 1-1 2h-2l-1-2z" />
    </svg>
  );
}

/** 퍼즐 — 마법 조각 (Arcane Puzzle) */
export function IconPuzzle({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M20 17v-2a2 2 0 0 0-2-2h-1a1.5 1.5 0 0 1 0-3h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2a1.5 1.5 0 0 1-3 0H9a1.5 1.5 0 0 1-3 0H4a2 2 0 0 0-2 2v2a1.5 1.5 0 0 1 0 3v1a1.5 1.5 0 0 1 0 3v2a2 2 0 0 0 2 2h2a1.5 1.5 0 0 1 3 0h4a1.5 1.5 0 0 1 3 0h2a2 2 0 0 0 2-2z" />
    </svg>
  );
}

/** 방패 심플 — 수호 (Protection Shield) */
export function IconProtect({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" />
    </svg>
  );
}

/** 축하 — 승리의 연회 (Victory Feast) */
export function IconCelebration({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M5.8 11.3L2 22l10.7-3.8" />
      <path d="M4 3h.01" />
      <path d="M22 8h.01" />
      <path d="M15 2h.01" />
      <path d="M22 20h.01" />
      <path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 1.96L17.05 7l2.24-.75a2.9 2.9 0 0 0 1.96-1.96z" />
      <path d="M9.1 14.9L5.8 11.3a.5.5 0 0 1 .1-.7l6.3-4.5a.5.5 0 0 1 .7.1l3.7 4.6a.5.5 0 0 1-.1.7l-6.3 4.5a.5.5 0 0 1-.7-.1z" />
    </svg>
  );
}

/** 렌치 — 대장장이의 도구 (Blacksmith's Tool) */
export function IconWrench({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** 팔레트 — 마법 지팡이 (Enchanted Wand) */
export function IconPalette({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M4 20l13-13" />
      <path d="M15 5l2 2" />
      <path d="M17 3l4 4-2 2-4-4 2-2z" />
      <path d="M4 20c-1 0-2-1-2-2 0-2 3-3 4-1l.5 2.5L4 20z" />
      <path d="M11 3l1 1m3 3l1 1m-7-1l1 1" />
    </svg>
  );
}

/** 코드 — 마법 주문서 (Spell Script) */
export function IconCode({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

// ============================================================
// Vault 도메인 아이콘 (카테고리용)
// ============================================================

/** 음식 — 여관 만찬 (Tavern Fare) */
export function IconUtensils({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M8 3v8l-2 2v8" />
      <path d="M11 3v4a3 3 0 0 0 6 0V3m-3 7v11" />
    </svg>
  );
}

/** 교통 — 상인 마차 (Merchant Caravan) */
export function IconBus({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M2 9l2-4h14l2 4v7a1 1 0 0 1-1 1h-1" />
      <path d="M3 9h18v8H3z" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M9 17h6M6 13h3m4 0h3" />
    </svg>
  );
}

/** 쇼핑 — 모험가 배낭 (Adventurer Sack) */
export function IconCart({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M9 3h6l2 6H7L9 3z" />
      <path d="M7 9l-1 9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l-1-9" />
      <path d="M10 14h4" />
    </svg>
  );
}

/** 주거 — 여관 (Tavern/Inn) */
export function IconHouse({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
      <path d="M15 8l1 1" />
    </svg>
  );
}

/** 통신 — 마법 수정 거울 (Magic Mirror) */
export function IconSmartphone({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M8 2a3 3 0 0 0-2 1L4 5v14l2 2a3 3 0 0 0 2 1h8a3 3 0 0 0 2-1l2-2V5l-2-2a3 3 0 0 0-2-1H8z" />
      <path d="M12 18h.01" />
      <path d="M10 7l2-1.5L14 7l-1 2.5h-2L10 7z" />
    </svg>
  );
}

/** 의료 — 회복의 물약 (Healing Potion) */
export function IconMedical({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M9 3h6v3l2 3v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l2-3V3z" />
      <path d="M9 6h6" />
      <path d="M12 11v5m-2.5-2.5h5" />
    </svg>
  );
}

/** 여가 — 연극 가면 (Theatrical Mask) */
export function IconFilm({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M14 4a6 6 0 0 1 4 10.5 6 6 0 0 1-4 1.5" />
      <path d="M10 4a6 6 0 0 0-4 10.5A6 6 0 0 0 10 16" />
      <path d="M10 16a6 6 0 0 0 4 0" />
      <path d="M9 9c.5.5 1 .5 1.5 0m4 0c.5.5 1 .5 1.5 0" />
      <path d="M9 12c.5 1 2 1.5 3 1.5s2.5-.5 3-1.5" />
    </svg>
  );
}

/** 교육 — 마법서 (Arcane Grimoire) */
export function IconBook({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
      <path d="M4 18h16" />
      <path d="M12 6l1 2h2l-1.5 1.5.5 2L12 10.5 10 11.5l.5-2L9 8h2l1-2z" />
    </svg>
  );
}

/** 카페 — 여관 에일 머그 (Tavern Mug) */
export function IconCoffee({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M5 8h11l-1 10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 8z" />
      <path d="M16 11h2a2 2 0 0 1 0 4h-2" />
      <path d="M8 5c0 0 0-2 2-2s2 2 2 2m2-1c0 0 0-1.5 1.5-1.5" />
    </svg>
  );
}

/** 게임 — RPG 주사위 (Adventure Dice) */
export function IconGamepad({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M5 7l7-4 7 4v10l-7 4-7-4V7z" />
      <path d="M12 3v18M5 7l7 4 7-4" />
      <path d="M8.5 9h.01M15.5 9h.01M12 14h.01" />
    </svg>
  );
}

/** 여행 — 드래곤 비행 (Dragon in Flight) */
export function IconPlane({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 12c2-4 5-6 8-6 2 0 4 1 5 2.5" />
      <path d="M16 8.5c1.5 1 3 3.5 3 5.5 0 1.5-1 2-2 1.5" />
      <path d="M11 6c0 0-1-2-2-2 0 1.5 0 3 2 4" />
      <path d="M13 7c0 0 2-1 3.5-.5-1 1-2 2.5-3.5 2" />
      <path d="M11 18l2-5 5 2.5-5.5 2.5L11 18z" />
    </svg>
  );
}

/** 선물 — 마법 봉인 상자 (Enchanted Box) */
export function IconGift({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 10h18v2H3z" />
      <path d="M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" />
      <path d="M12 10V21" />
      <path d="M12 10c0 0-2-3-4-3s-2 3 0 3h4z" />
      <path d="M12 10c0 0 2-3 4-3s2 3 0 3h-4z" />
    </svg>
  );
}

/** 지폐 — 왕실 칙령 (Royal Decree Scroll) */
export function IconBanknote({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9h.01M18 9h.01M6 15h.01M18 15h.01" />
    </svg>
  );
}

/** 저금통 — 미니 보물 상자 (Mini Treasure Chest) */
export function IconPiggyBank({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M6 9h12v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z" />
      <path d="M6 9a3 3 0 0 1 6 0" />
      <path d="M12 9a3 3 0 0 0 6 0" />
      <path d="M11 13h2v2h-2z" />
      <path d="M10 4.5c.5-1 1.5-1.5 2-1.5s1.5.5 2 1.5" />
    </svg>
  );
}

/** 투자 — 상승 마력 수정 (Rising Mana Crystals) */
export function IconInvestment({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M5 19l3-6 1 6" />
      <path d="M11 19l3-10 3 10" />
      <path d="M4 19h17" />
      <path d="M8 13l-1.5-.5 1.5-.5.5-1.5.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5z" />
    </svg>
  );
}

/** 부동산 — 석조 성채 (Stone Fortress) */
export function IconRealEstate({ size = 24, ...props }: IconProps): ReactNode {
  return (
    <svg {...svgDefaults(size)} {...props}>
      <path d="M2 21h20" />
      <path d="M4 21V9l5-5 5 5v12" />
      <path d="M14 21v-7h6v7" />
      <path d="M7 13h4M16 14h2" />
      <path d="M4 9H2m3 0h-.5M14 14h.5m5.5-5h2m-3 0h.5" />
    </svg>
  );
}
