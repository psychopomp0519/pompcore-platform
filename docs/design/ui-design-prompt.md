# PompCore UI Design Prompt

> AI 도구에 입력하여 메인 사이트 + Vault의 UI를 서브컬쳐 오픈월드 RPG 감성으로 리디자인하기 위한 프롬프트
>
> 최종 업데이트: 2026-03-13

---

## 1. 디자인 철학

### 1.1 핵심 컨셉

PompCore는 **"실용적인 판타지"**를 지향한다. 서브컬쳐 오픈월드 RPG 게임(원신, 명일방주, 블루아카이브)의 미학을 차용하되, 실제로 일상에서 사용하는 생산성 도구이다.

**디자인 원칙:**
- **몰입적이되 방해하지 않는다** — 배경과 장식은 분위기를 만들고, 콘텐츠는 명확하게 읽힌다
- **게임 UI처럼 구조화한다** — 정보 위계가 명확하고, 카드/패널/뱃지 시스템으로 구분한다
- **판타지 세계의 인터페이스처럼 느껴진다** — 마치 RPG 게임 내 메뉴를 조작하는 듯한 느낌

### 1.2 영감 레퍼런스

| 게임 | 참고 요소 |
|------|-----------|
| **원신 (Genshin Impact)** | 캐릭터 상세 패널, 인벤토리 UI, 원소 컬러 시스템, 퀘스트 로그 |
| **명일방주 (Arknights)** | 미니멀 다크 UI, 기하학적 장식선, 정보 밀도 높은 카드 |
| **블루아카이브 (Blue Archive)** | 밝은 라이트 모드, 경쾌한 컬러, 학교/길드 느낌 카드 |
| **호요버스 HoYoLAB** | 통합 플랫폼 네비게이션, 서비스 전환 UI |
| **붕괴: 스타레일 (HSR)** | 열차 패스/보상 화면, 진행률 바, 배지 시스템 |

---

## 2. 공통 디자인 시스템 (Nebula)

### 2.1 배경 시스템

```
=== LIGHT MODE ===
- Base: 하늘색 그라디언트 (sky-deep → sky-mid → sky-pale)
- 장식: 복합 구름 시스템 (2-레이어 입체 구름, 느린 드리프트 애니메이션)
- 느낌: 맑은 하늘 아래 모험을 시작하는 아침

=== DARK MODE ===
- Base: 딥 다크 그라디언트 (#0C0818 → #110D20 → #150F28)
- 장식 1: 별 파티클 3티어 (소 25개, 중 12개, 대 5개) + twinkle 애니메이션
- 장식 2: 글로우 오브 3개 (Violet 5%, Gold 2.5%, Pink 3% 불투명도)
- 느낌: 성운이 빛나는 밤하늘, RPG 월드맵의 밤
```

### 2.2 카드 시스템 (GlassCard)

```
=== GLASSMORPHISM CARD ===
- 라이트: bg-white/80 + border-slate-200 + backdrop-blur-16px + shadow-card
- 다크: bg-surface-card-dark(rgba(30,41,59,0.5)) + border-white/10 + backdrop-blur-16px
- 모서리: rounded-2xl (16px)
- 호버: shadow 강화 + 미세 scale

=== RPG 강화 방향 ===
카드를 "게임 내 정보 패널"처럼 느끼게 하려면:
- 카드 상단에 미세한 그라디언트 라인 (서비스 컬러, 2px)
- 모서리 4곳에 L자 장식선 (brand/10 불투명도)
- 호버 시 보더가 서비스 컬러로 미세하게 발광
- 카드 내부 섹션 구분에 점선 또는 미세한 디바이더
```

### 2.3 버튼 시스템

```
=== PRIMARY BUTTON ===
- RPG "수락" 버튼 느낌
- 서비스 컬러 배경 + 흰색 텍스트
- 호버: 밝아지면서 미세한 글로우 (box-shadow: 0 0 12px color/30)
- rounded-xl, font-semibold

=== SECONDARY/OUTLINE BUTTON ===
- RPG "취소/뒤로" 버튼 느낌
- 투명 배경 + 서비스 컬러 보더 + 서비스 컬러 텍스트
- 호버: 서비스 컬러/10 배경

=== GHOST BUTTON ===
- 텍스트만, 호버 시 배경 미세 표시
```

### 2.4 뱃지/태그 시스템

```
- 카테고리 뱃지: rounded-full, bg-color/15 + text-color
- 상태 뱃지: 작은 도트(●) + 라벨 조합
- RPG 강화: 뱃지에 미세한 inner glow 또는 미세한 보더 그라디언트
```

### 2.5 타이포그래피

```
- 디스플레이 (페이지 제목): font-display (Nunito), text-xl~2xl, font-bold
- 본문: Pretendard, text-sm~base
- 캡션/라벨: text-xs, font-medium, 불투명도 60%
- 숫자: tabular-nums (고정폭 숫자)
- RPG 강화: 주요 제목에 text-gradient 클래스 (brand→gold→pink 그라디언트)
```

### 2.6 로고/워드마크 자산 규칙

```
- UI 목업에 등장하는 PompCore 및 서비스 로고는 모두 "커스텀 타이포그래피 로고"로 취급한다
- 로고 파일은 일반 텍스트 레이어나 기본 폰트 타이핑으로 만들지 않는다
- 최종 로고 자산은 글자를 직접 그린 SVG path/outline 기반 워드마크 또는 이니셜이어야 한다
- 헤더, 히어로, 카드에 로고를 배치할 때도 "폰트로 적은 브랜드명"처럼 보이지 않게 한다
```

---

## 3. 메인 사이트 (apps/web) UI 디자인 프롬프트

### 3.1 전체 분위기

```
The PompCore main website is the "Guild Lobby" — the gateway into the RPG world.
It should feel like walking into a fantasy adventurers' guild hall where you choose
your next adventure (service).

Key atmosphere:
- Grand but welcoming — not intimidating
- Information laid out like a quest board
- Service cards feel like choosing your class/path
- CTA buttons feel like "Accept Quest"
- Overall: Premium fantasy portal, not a generic SaaS landing page
```

### 3.2 Hero Section

```
Design the hero section of an RPG-themed lifestyle platform landing page.

Current layout:
- Full viewport height (100vh - header)
- Centered content with decorative frame
- Custom-drawn logo emblem or compact monogram at top (outlined vector lettering, not typed text)
- Main heading with gradient text
- Gold divider line
- Tagline + CTA buttons
- Service preview mini-cards at bottom

RPG Enhancement Direction:
- The decorative frame should feel like a "quest notification" or "system message" border
  in an RPG game — L-corner marks, diamond accents, subtle gradient lines
- If the hero includes the PompCore logo or wordmark, it should look like bespoke SVG lettering
  drawn for the brand, not a default font typed into the mockup
- The heading "모험가여, 당신의 일상이 모험이 됩니다" should use gradient text
  (brand violet → gold → pink) like a game's main title screen
- CTA buttons should look like RPG action buttons:
  - Primary: "모험 시작하기" — solid brand color + subtle glow on hover
  - Secondary: "더 알아보기" — outline style with brand border
- Service mini-cards should look like "party member" or "class selection" cards:
  - Service icon + name + category label
  - Stat bars showing service capabilities (like character stats)
  - Hover: Card lifts with subtle glow border

Color: Brand violet (#7C3AED) primary, Gold (#FFD700) accents
Background: Sky gradient + clouds (light) / Night sky + stars (dark)
Font: Display headings in Nunito bold, body in Pretendard
```

### 3.3 Services Section

```
Design the services showcase section. Each service is presented like choosing
a "path" or "class" in an RPG character selection screen.

Layout: 2-column card grid (1 col mobile)

Each service card:
- Service logo/icon in a circular container with service accent color
  - Prefer a custom-drawn initial mark or wordmark fragment, not a typed letter placeholder
- Service name (large, bold) + sub-name below
- Category label badge (e.g., "FINANCE · 모험가의 금고")
- Description paragraph
- Feature list (4 items) with subtle bullet markers
- Stat display: 4 stat bars (like RPG character stats)
  - Each stat: Label + value (0-100) + colored fill bar
  - Bar color: Service accent color
- Status badge: "서비스 중" (green) / "출시 예정" (amber)
- CTA: "입장하기" or "자세히 보기"

Card styling:
- Glass card (white/80, border, blur)
- Top border accent: 2px gradient line in service color
- Hover: Border glow in service color, lift shadow
- RPG feel: Subtle corner decorations, stat display like character sheet

Service colors:
- Vault: #10B981 (Emerald)
- Quest: #3B82F6 (Blue)
```

### 3.4 Why Section

```
Design the "Why PompCore" section showcasing 4 core values.

Present the 4 values like "passive skills" or "guild perks" in an RPG:
1. 몰입 (Immersion) — icon: magic sparkle
2. 접근성 (Accessibility) — icon: open gate
3. 민첩성 (Agility) — icon: lightning
4. 공동 성장 (Co-growth) — icon: growing tree

Layout: 4-column grid (1 col mobile → 2 col tablet → 4 col desktop)

Each card:
- Large icon in circular container (48px, brand/8 background)
- Value name (bold)
- Description (small, muted)
- Subtle brand tint background
- Hover: Border brightens, icon container glows

RPG feel: Each value card looks like a "skill card" or "talent node"
```

### 3.5 Upcoming Section

```
Design the upcoming services section like an "unreleased content" preview
in a game — teasing what's coming next.

- Section title: "출시 예정" with a subtle animated indicator
- Cards: Semi-transparent, locked/preview feel
  - Service icon (muted/greyed slightly)
  - Service name + category
  - "준비 중" or "곧 출시" badge with pulsing dot
- Alert bar: Gold-tinted notification like a "developer notice" in-game

RPG feel: Like a game roadmap screen showing locked content
```

### 3.6 FAQ Section

```
Design the FAQ as an RPG "NPC dialogue" or "guild board Q&A" style.

- Each question: Clickable accordion
- Q marker: Gold colored "Q" label
- Expand animation: Smooth height transition
- Answer area: Slightly indented, different background tint
- Icon: Rotating chevron/arrow

RPG feel: Like reading a notice board at a guild hall
```

### 3.7 CTA Banner

```
Design the final CTA banner as a "quest acceptance" screen.

- Full-width gradient background (brand → purple)
- Gold radial overlay glow
- Geometric diamond pattern overlay (subtle, 20px repeat)
- Corner L-border decorations (white/18)
- Heading: "모험을 시작할 준비가 되셨나요?"
- CTA button: Large, white text on transparent border, glowing hover

RPG feel: The final "Accept Quest?" confirmation screen in an RPG
```

### 3.8 Header

```
Design a sticky navigation header.

- Transparent on scroll=0, gains bg + blur on scroll
- Logo (PompCore custom-drawn wordmark SVG) on left, never plain typed text
- Navigation links: 소개, 프로젝트, 공지사항, 채용, 내부
- Active link: Brand color with subtle underline indicator
- Right side: Theme toggle (sun/moon) + Login button
- Mobile: Hamburger → slide-down full-width menu

RPG feel: Like a game's top HUD bar — minimal, functional, always accessible
```

---

## 4. Vault (apps/vault) UI 디자인 프롬프트

### 4.1 전체 분위기

```
Vault is the "Treasure Hall" — a personal finance management tool that feels
like managing your adventure party's gold and inventory.

Key atmosphere:
- Organized and clear — financial data needs precision
- RPG inventory/character sheet feel
- Numbers should feel valuable, like counting gold coins
- Charts feel like battle statistics
- Actions feel like managing resources before a quest
- Color: Emerald green (#10B981) as primary accent throughout
```

### 4.2 Sidebar

```
Design a sidebar navigation for a finance app with RPG aesthetics.

Desktop: 240px expanded / 64px collapsed (toggle)
Mobile: Overlay panel (256px) with slide-in animation

Navigation items (11):
- 대시보드 (Dashboard) — icon: grid/home
- 통장 (Accounts) — icon: bank/vault
- 거래내역 (Transactions) — icon: list/scroll
- 정기결제 (Recurring) — icon: repeat/cycle
- 예적금 (Savings) — icon: piggy/chest
- 예산 (Budget) — icon: target/shield
- 통계 (Statistics) — icon: chart/compass
- 투자 (Investments) — icon: trending/sword
- 부동산 (Real Estate) — icon: building/castle
- 공지사항 (Announcements) — icon: bell/horn
- 문의 (Inquiries) — icon: chat/scroll

Bottom fixed: 설정 (Settings) — icon: gear/anvil

Active state: bg-vault-color/10, text-vault-color, left border accent
Inactive: text-navy/60, hover: bg-navy/5
Collapsed: Icon only + tooltip on hover

RPG feel: Like a game's side menu — category icons, active state highlights,
clean hierarchy. Think of Genshin's Paimon Menu or Arknights' left nav.
```

### 4.3 Dashboard

```
Design a finance dashboard that feels like an RPG "party status" screen.

Layout: max-width 896px (4xl), centered, vertical stack with gaps

Section 1 — Total Assets (Hero Card):
- Large GlassCard with "lg" padding
- Title: "총 자산" with subtle gradient or vault-color
- Primary amount: Large, bold, tabular-nums (like a gold counter)
- Currency breakdown: Multiple currency rows
- Month-over-month delta: Green (up arrow) / Red (down arrow)
- Asset type breakdown grid (3 cols):
  - Bank accounts total
  - Investment total
  - Real estate total
  Each: Icon + label + amount, mini stat card style

RPG feel: Like checking your total inventory value / party resources

Section 2 — Income/Expense Summary (2-col grid):
- Two GlassCards side by side
- Income card: Green tinted header, amount, mini chart
- Expense card: Red/orange tinted header, amount, mini chart
RPG feel: Like "resources gained" vs "resources spent" in a session summary

Section 3 — Recent Transactions:
- GlassCard with scrollable list
- Each transaction: Icon + name + amount + date
- Color-coded: Green (income), Red (expense)
RPG feel: Like a "recent activity log" or "adventure journal"

Section 4 — Upcoming Recurring Payments:
- GlassCard with next 5 upcoming payments
- Each: Name + amount + date + days until
RPG feel: Like "upcoming quests" or "scheduled events"

Section 5 — Attendance Check-in:
- Mini calendar grid (7-col, current month)
- Streak counter with fire/star icon
- Check-in button (vault-color, disabled if already checked)
RPG feel: Like a daily login reward / attendance board

Section 6 — Quick Actions (3-col grid):
- 거래 추가 / 이체 / 통계
- Each: Icon + label, vault-color accent
RPG feel: Like quick-action shortcuts on a game HUD
```

### 4.4 Accounts Page

```
Design the accounts page like an RPG "inventory" or "party wallet" view.

Header:
- Title: "통장" with total balance per currency below
- Action buttons: 내보내기, 이체, 통장 추가
- Buttons styled as RPG action buttons (vault-color accent)

Account Cards (2-col grid):
- Each card = one account (bank, credit card, savings, investment)
- Header: Bank icon + account name + type badge + favorite star
- Action buttons: Star (toggle), Edit, Delete
- Balance list: Currency rows, each clickable for edit
  - Currency code + formatted amount
  - Converted amount in primary currency (if different)
- Credit card: Usage bar (percentage, color changes at 80%+)

RPG feel: Like managing multiple "wallets" or "storage chests"
Each account is a different container with its own inventory
```

### 4.5 Statistics Page

```
Design the statistics page like an RPG "battle report" or "adventure summary".

4 chart sections:
1. Income vs Expense bar chart (monthly comparison)
2. Category breakdown pie/donut chart
3. Account distribution chart
4. Asset trend line chart (time series)

Each chart in a GlassCard with:
- Title + period selector
- Interactive chart (Nivo library)
- Legend with color dots

RPG feel: Like reviewing combat statistics or quest completion rates
Charts should use service colors and feel like data visualizations
from a game's stats screen
```

### 4.6 Settings Pages

```
Design settings pages like an RPG "options menu" or "character settings".

Settings menu (left sidebar or top tabs):
- 프로필 (Profile)
- 메뉴 커스텀 (Menu Customization)
- 환경설정 (Preferences)
- 테마 (Theme)
- 친구/공유 (Friends/Sharing)
- 크레딧 (Credits)
- 비밀번호 변경 (Password Change)

Each settings section:
- Clean form layout with labels
- Input fields: rounded-xl, border, focus:vault-color ring
- Toggle switches: vault-color when on
- Save buttons: vault-color primary

Theme page special: Accent color palette with 6 presets (swatches in a grid)
Credits page: Scrollable credit list with categories

RPG feel: Like a game's settings/options menu — organized, clean, systematic
```

---

## 5. 반응형 디자인 가이드

```
=== MOBILE (< 768px) ===
- Web: Full-width, single column, hamburger menu
- Vault: BottomNav (5 tabs) + Header + MobileSidebar overlay
- Cards: Full width, reduced padding
- Font: Slightly smaller headings

=== TABLET (768px - 1199px) ===
- Web: 2-column grids, wider containers
- Vault: Collapsed sidebar (64px icons only) + Header
- Cards: 2-column grid

=== DESKTOP (1200px+) ===
- Web: Max-width containers, 3-4 column grids
- Vault: Expanded sidebar (240px) + Header
- Cards: 2-3 column grids depending on content
```

---

## 6. 접근성 가이드

```
- 최소 폰트 14px (한글), WCAG 2.1 AA 대비
- 포커스 링: 2px outline, 2px offset, vault-color
- 키보드 네비게이션: Tab, Shift+Tab, Escape, Enter/Space
- prefers-reduced-motion: 애니메이션 → 1ms (사실상 비활성)
- 스크린 리더: aria-label, role, semantic HTML
- Skip navigation: 키보드 전용 "본문으로 이동" 링크
```

---

*이 문서는 AI 디자인 도구에 입력하여 PompCore 메인 사이트와 Vault의 UI를 리디자인하기 위한 프롬프트입니다.*
