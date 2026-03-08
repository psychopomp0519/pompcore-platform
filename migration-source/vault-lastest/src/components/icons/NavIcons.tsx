/**
 * @file NavIcons.tsx
 * @description 네비게이션용 SVG 아이콘 컴포넌트 — 서브컬쳐 모험 RPG 테마
 * @module components/icons/NavIcons
 */

interface IconProps {
  className?: string;
}

/** 대시보드 (홈) → 성채 (Fortress Gate) */
export function IconHome({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V10l9-8 9 8v11H3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-6h6v6H9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h2v3H9zm4 0h2v3h-2z" />
    </svg>
  );
}

/** 통장 → 보물 상자 (Treasure Chest) */
export function IconBank({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l1-3h12l1 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v3H3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 14.5a1.5 1.5 0 113 0v2h-3v-2z" />
    </svg>
  );
}

/** 거래내역 → 마법 두루마리 (Quest Scroll) */
export function IconReceipt({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3a2 2 0 00-2 2v14l2-1.5L10 19l2-1.5L14 19l2-1.5L18 19V5a2 2 0 00-2-2H8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

/** 정기결제 → 룬 순환 (Runic Cycle) */
export function IconRepeat({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6A7.5 7.5 0 0112 4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 18A7.5 7.5 0 0112 19.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 012-5l-2-1 1 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 01-2 5l2 1-1-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10l1.5 2-1.5 2-1.5-2 1.5-2z" />
    </svg>
  );
}

/** 예/적금 → 마법 보석 (Arcane Crystal) */
export function IconGem({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l5 5-5 15-5-15 5-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7l3 4 3-4" />
    </svg>
  );
}

/** 예산 → 코인 주머니 (Coin Pouch) */
export function IconWallet({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3c0 0 1 2 3 2s3-2 3-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 5c-1 .5-2 2-2 4.5v5C4 18 7.5 21 12 21s8-3 8-6.5v-5C20 7 19 5.5 18 5H6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 13h8M10 16h4" />
    </svg>
  );
}

/** 통계 → 수정 구슬 (Crystal Orb) */
export function IconChart({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="11" r="7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 13l2-4 3 2.5 2-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l3-2 3 2" />
    </svg>
  );
}

/** 공지사항 → 전쟁 뿔피리 (War Horn) */
export function IconMegaphone({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h3l9-5v14l-9-5H4a1 1 0 01-1-1v-2a1 1 0 011-1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8.5c1.5 1 2.5 2 2.5 3.5s-1 2.5-2.5 3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l-1.5 5 2.5-1.5" />
    </svg>
  );
}

/** 문의 → 마력 구슬 대화 (Arcane Chat Orb) */
export function IconChat({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0114.93-4L21 8l-2.07-.5A8 8 0 014 12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 008 8c1.5 0 2.9-.4 4.1-1.1L20 20l-1.5-3.6A8 8 0 014 12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h.01M12 12h.01M15 12h.01" />
    </svg>
  );
}

/** 설정 → 연금술 기어 (Alchemy Wheel) */
export function IconSettings({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l1.4 3.4 3.6-.8-1.2 3.4 3 2-3 2 1.2 3.4-3.6-.8L12 18l-1.4-3.4-3.6.8 1.2-3.4-3-2 3-2-1.2-3.4 3.6.8L12 2z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/** 휴지통 → 어둠의 가마솥 (Dark Cauldron) */
export function IconTrash({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l1.5 13a2 2 0 002 1.5h5a2 2 0 002-1.5L18 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.5c0-.5.5-1.5 1-1.5s.5 1 1 1.5.5 1 1 1 1-1 1-1.5" />
    </svg>
  );
}

/** 프로필 → 모험가 (Adventurer Silhouette) */
export function IconUser({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a4 4 0 100 8 4 4 0 000-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 21c0-4 3-7 7-7s7 3 7 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5c-.5-1.5.5-3 2-3" />
    </svg>
  );
}

/** 메뉴 (스마트폰) → 마법 수정판 (Magic Crystal Tablet) */
export function IconPhone({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6l2-1 2 1-1 2h-2l-1-2z" />
    </svg>
  );
}

/** 카테고리 (태그) → 룬 문장 (Rune Emblem) */
export function IconTag({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V4a1 1 0 011-1h6l11 11-7 7L3 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01" />
    </svg>
  );
}

/** 환경설정 (슬라이더) → 마법봉 삼위 (Tri-Wand Tuning) */
export function IconSliders({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 4v6m0 4v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 4v10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 4v10m0 4v2" />
      <circle cx="5" cy="11" r="1.5" />
      <circle cx="12" cy="7" r="1.5" />
      <circle cx="19" cy="15" r="1.5" />
    </svg>
  );
}

/** 테마 (팔레트) → 마법 지팡이 (Enchanted Wand) */
export function IconPalette({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20l13-13" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l2 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 3l4 4-2 2-4-4 2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c-1 0-2-1-2-2 0-2 3-3 4-1l.5 2.5L4 20z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3l1 1m3 3l1 1m-7-1l1 1" />
    </svg>
  );
}

/** 크레딧 (문서) → 고대 서판 (Ancient Tome) */
export function IconDocument({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8l-5-5H6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h2" />
    </svg>
  );
}

/** 친구 → 모험가 파티 (Adventurer Party) */
export function IconUsers({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7a3 3 0 100 6 3 3 0 000-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 5a2.5 2.5 0 010 5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 14c2 .5 4 2 4 6" />
    </svg>
  );
}

/** 뒤로가기 → 엘프 화살 (Elven Arrow) */
export function IconArrowLeft({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L4 12l7 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12l-2-1.5v3L20 12z" />
    </svg>
  );
}

/** 투자 (주식/암호화폐) → 상승 마력 수정 (Rising Mana Crystals) */
export function IconInvestment({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19l3-6 1 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l3-10 3 10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h17" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 13l-1.5-.5 1.5-.5 .5-1.5.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5z" />
    </svg>
  );
}

/** 부동산 → 석조 성채 (Stone Fortress) */
export function IconRealEstate({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 21h20" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V9l5-5 5 5v12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 21v-7h6v7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 13h4M16 14h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9H2m3 0h-.5M14 14h.5m5.5-5h2m-3 0h.5" />
    </svg>
  );
}

/** 셰브론 오른쪽 */
export function IconChevronRight({ className = 'h-4 w-4' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
