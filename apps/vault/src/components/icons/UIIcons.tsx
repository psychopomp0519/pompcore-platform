/**
 * @file UIIcons.tsx
 * @description UI용 SVG 아이콘 (EmptyState, 카드, 상세 등) — 서브컬쳐 모험 RPG 테마
 * @module components/icons/UIIcons
 */

interface IconProps {
  className?: string;
}

/** 수입 (낙하하는 유성) */
export function IconArrowDown({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 14l7 7 7-7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-1-2m9 2l1-2" />
    </svg>
  );
}

/** 지출 (솟구치는 불꽃) */
export function IconArrowUp({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7 7 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l-1 2m9-2l1 2" />
    </svg>
  );
}

/** 이체 → 마법 텔레포트 포탈 (Twin Portals) */
export function IconTransfer({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4 4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 12h10" />
    </svg>
  );
}

/** 하트 (채워진) */
export function IconHeartFilled({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

/** 하트 (빈) */
export function IconHeartOutline({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

/** 저금통 → 미니 보물 상자 (Mini Treasure Chest) */
export function IconPiggyBank({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h12v9a2 2 0 01-2 2H8a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9a3 3 0 016 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 006 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 13h2v2h-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5c.5-1 1.5-1.5 2-1.5s1.5.5 2 1.5" />
    </svg>
  );
}

/** 집 → 여관 (Tavern/Inn) */
export function IconHouse({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v10h14V10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v-6h6v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 8l1 1" />
    </svg>
  );
}

/** 동전 → 룬이 새겨진 금화 (Rune Coin) */
export function IconCoin({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v1m0 6v1m-3-4h.5m5 0h.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 10.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5-.9 1.5-2 1.5-2 .7-2 1.5.9 1.5 2 1.5 2-.7 2-1.5" />
    </svg>
  );
}

/** 선물 → 마법 봉인 상자 (Enchanted Box) */
export function IconGift({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18v2H3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a1 1 0 001 1h14a1 1 0 001-1v-8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10V21" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10c0 0-2-3-4-3s-2 3 0 3h4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10c0 0 2-3 4-3s2 3 0 3h-4z" />
    </svg>
  );
}

/** 지폐 → 왕실 칙령 (Royal Decree Scroll) */
export function IconBanknote({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" />
      <circle cx="12" cy="12" r="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h.01M18 9h.01M6 15h.01M18 15h.01" />
    </svg>
  );
}

/** 음식 → 여관 만찬 (Tavern Fare — crossed dagger & goblet) */
export function IconUtensils({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v8l-2 2v8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3v4a3 3 0 006 0V3m-3 7v11" />
    </svg>
  );
}

/** 버스 → 상인 마차 (Merchant Caravan) */
export function IconBus({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 9l2-4h14l2 4v7a1 1 0 01-1 1h-1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18v8H3z" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17h6M6 13h3m4 0h3" />
    </svg>
  );
}

/** 장바구니 → 모험가 배낭 (Adventurer Sack) */
export function IconCart({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l2 6H7L9 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 9l-1 9a1 1 0 001 1h10a1 1 0 001-1l-1-9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14h4" />
    </svg>
  );
}

/** 병원 → 회복의 물약 (Healing Potion) */
export function IconMedical({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6v3l2 3v9a2 2 0 01-2 2H9a2 2 0 01-2-2V9l2-3V3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v5m-2.5-2.5h5" />
    </svg>
  );
}

/** 영화 → 연극 가면 (Theatrical Mask) */
export function IconFilm({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4a6 6 0 014 10.5 6 6 0 01-4 1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4a6 6 0 00-4 10.5A6 6 0 0010 16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 16a6 6 0 004 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9c.5.5 1 .5 1.5 0m4 0c.5.5 1 .5 1.5 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12c.5 1 2 1.5 3 1.5s2.5-.5 3-1.5" />
    </svg>
  );
}

/** 책 → 마법서 (Arcane Grimoire) */
export function IconBook({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6l1 2h2l-1.5 1.5.5 2L12 10.5 10 11.5l.5-2L9 8h2l1-2z" />
    </svg>
  );
}

/** 커피 → 여관 에일 머그 (Tavern Mug) */
export function IconCoffee({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h11l-1 10a1 1 0 01-1 1H7a1 1 0 01-1-1L5 8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11h2a2 2 0 010 4h-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5c0 0 0-2 2-2s2 2 2 2m2-1c0 0 0-1.5 1.5-1.5" />
    </svg>
  );
}

/** 게임패드 → RPG 주사위 (Adventure Dice) */
export function IconGamepad({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l7-4 7 4v10l-7 4-7-4V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 7l7 4 7-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 9h.01M15.5 9h.01M12 14h.01" />
    </svg>
  );
}

/** 비행기 → 드래곤 비행 (Dragon in Flight) */
export function IconPlane({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c2-4 5-6 8-6 2 0 4 1 5 2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8.5c1.5 1 3 3.5 3 5.5 0 1.5-1 2-2 1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 6c0 0-1-2-2-2 0 1.5 0 3 2 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7c0 0 2-1 3.5-.5-1 1-2 2.5-3.5 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 18l2-5 5 2.5-5.5 2.5L11 18z" />
    </svg>
  );
}

/** 스마트폰 → 마법 수정 거울 (Magic Mirror) */
export function IconSmartphone({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2a3 3 0 00-2 1L4 5v14l2 2a3 3 0 002 1h8a3 3 0 002-1l2-2V5l-2-2a3 3 0 00-2-1H8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 7l2-1.5L14 7l-1 2.5h-2L10 7z" />
    </svg>
  );
}

/** 차트 상승 → 별의 궤도 (Star Trail) */
export function IconTrendUp({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l5-6 4 3 5-8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l4-2-2 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 11l-1-1.5 1.5-.5.5-1.5.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5z" />
    </svg>
  );
}

/** 플러스 → 룬 십자 (Rune Cross) */
export function IconPlus({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

/** 확인 체크 → 승리의 징표 (Victory Mark) */
export function IconCheck({ className = 'h-5 w-5' }: IconProps): React.ReactNode {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
