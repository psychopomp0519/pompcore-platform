# PompCore UI Design System - 이식 가이드

> 이 문서 하나만으로 동일한 UI를 새 프로젝트에 구현할 수 있도록 작성되었습니다.

---

## 1. 기술 스택 & 의존성

```json
{
  "react": "^19.x",
  "tailwindcss": "^3.4.x",
  "@tailwindcss/forms": "^0.5.x",
  "zustand": "^5.x"
}
```

**필수 설정:**
- `darkMode: 'class'` (Tailwind)
- PostCSS + Autoprefixer

---

## 2. 컬러 팔레트 (Nebula Theme)

### 2-1. 브랜드 컬러 (Brand)

| 토큰 | 값 | 용도 |
|---|---|---|
| `brand-DEFAULT` / `brand-500` / `brand-600` | `#7C3AED` | 주요 액센트, 버튼, 링크 |
| `brand-light` / `brand-400` | `#A855F7` | 그라디언트 끝점, 호버 |
| `brand-dark` / `brand-700` | `#5B21B6` | 호버 강조 |
| `brand-50` | `#f5f3ff` | 호버 배경 |
| `brand-100` | `#ede9fe` | |
| `brand-200` | `#ddd6fe` | |
| `brand-300` | `#c4b5fd` | |
| `brand-800` | `#4c1d95` | |
| `brand-900` | `#3b0764` | |
| `brand-950` | `#2e1065` | |

### 2-2. 액센트 컬러

| 토큰 | 값 | 용도 |
|---|---|---|
| `accent-gold` | `#FFD700` | 장식, 디바이더, 알림 배지, Q 아이콘 |
| `accent-pink` | `#EC4899` | 그라디언트 보조 |

### 2-3. 서브 프로젝트 컬러

| 토큰 | 값 | 용도 |
|---|---|---|
| `vault-color` | `#10B981` | Vault(가계부) |
| `vault-color-light` | `#34D399` | |
| `quest-color` | `#7C3AED` | Quest(일정) |
| `quest-color-light` | `#C084FC` | |

### 2-4. 네이비 (로고/텍스트)

| 토큰 | 값 | 용도 |
|---|---|---|
| `navy` | `#2B3442` | 로고 기본색 |
| `navy-light` | `#3d4a5c` | |
| `navy-dark` | `#1a2332` | |

### 2-5. 하늘 컬러 (라이트 모드 배경)

| 토큰 | 값 | 용도 |
|---|---|---|
| `sky-deep` | `#87CEEB` | 배경 글로우 |
| `sky-mid` | `#A8D5FF` | |
| `sky-light` | `#B8DEFF` | Hero 상단 |
| `sky-pale` | `#D0EAFF` | Hero 중간 |
| `sky-faint` | `#E8F4FD` | Hero 하단, CTA 배경 |
| `sky-mist` | `#E0F0FF` | 섹션 배경 |
| `sky-soft` | `#D6EDFF` | 섹션 배경 |

### 2-6. 서피스 (배경면)

| 토큰 | 값 | 용도 |
|---|---|---|
| `surface` / `surface-light` | `#FAF8FF` | 라이트 기본 배경 |
| `surface-dark` | `#0f172a` | |
| `surface-dark-1` | `#0C0818` | 다크 기본 배경 (body) |
| `surface-dark-2` | `#110D20` | 다크 중간 |
| `surface-dark-3` | `#150F28` | 다크 강조 |
| `surface-light-card` | `#FFFFFF` | |
| `surface-card` | `rgba(255, 255, 255, 0.8)` | 라이트 카드 |
| `surface-card-dark` | `rgba(30, 41, 59, 0.5)` | 다크 글래스 카드 |

### 2-7. 텍스트 컬러 (하드코딩 값, Tailwind 미등록)

| 값 | 용도 |
|---|---|
| `#1A1A2E` | 라이트 모드 제목 |
| `#5C5C7A` | 라이트 모드 서브텍스트 |
| `#4A4270` | 라이트 모드 본문 |
| `#6A5490` | 다크 모드 서브텍스트 |
| `#7A6A9A` | 다크 모드 본문 |
| `#8A7AAA` | 다크 모드 뮤트 텍스트 |
| `#A090C0` | 다크 모드 secondary 버튼 텍스트 |
| `#E0D8F0` | 다크 모드 밝은 텍스트 |
| `#E8E0F0` | 다크 모드 밝은 제목 |
| `#e2e8f0` | 다크 모드 body 텍스트 (slate-200) |
| `#B8860B` | 라이트 모드 골드 텍스트 (FAQ Q 아이콘) |
| `#FFD700`/70 | 다크 모드 골드 텍스트 |
| `#A78BFA` | 다크 모드 브랜드 액센트 텍스트 |

---

## 3. 타이포그래피

### 3-1. 폰트 패밀리

```css
/* Google Fonts (반드시 Tailwind @tailwind 보다 먼저 선언) */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
```

| Tailwind 클래스 | 폰트 스택 | 용도 |
|---|---|---|
| `font-sans` | `Pretendard, Noto Sans KR, system-ui, -apple-system, sans-serif` | 본문, 기본 |
| `font-display` | `Nunito, Pretendard, sans-serif` | 제목, 섹션 헤더 |
| `font-display-deco` | `Nunito, Pretendard, sans-serif` | 엠블럼 등 장식 텍스트 |

### 3-2. 제목 스타일 패턴

```
섹션 헤더: font-display text-xl sm:text-[28px] font-bold
Hero 제목: font-display font-black text-[28px] sm:text-[34px] md:text-[42px]
Hero 서브라인: text-[24px] sm:text-[28px] md:text-[36px] opacity 70%
서브카피: text-sm leading-relaxed
카테고리: text-[11px] tracking-wide uppercase
```

### 3-3. 본문 행간 (CJK 최적화)

```css
p, li, dd {
  line-height: 1.75;
}
body {
  word-break: keep-all; /* 한국어 단어 단위 줄바꿈 */
}
```

---

## 4. 그라디언트 텍스트 (text-gradient)

```css
/* 라이트 */
.text-gradient {
  @apply bg-gradient-to-r from-[#9B59B6] via-[#D4A017] to-[#E0598B] bg-clip-text text-transparent;
}
/* 다크 */
.dark .text-gradient {
  @apply from-[#E0C0FF] via-[#FFD700] to-[#FF90D0];
}
```

---

## 5. 그림자 (Box Shadow)

| 토큰 | 값 | 용도 |
|---|---|---|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)` | 카드 기본 |
| `shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)` | 카드 호버 |
| `shadow-glass` | `0 8px 32px rgba(0,0,0,0.12)` | 글래스 카드 |
| `shadow-glass-lg` | `0 16px 48px rgba(0,0,0,0.2)` | |
| `shadow-glow` | `0 0 20px rgba(124,58,237,0.3)` | 다크 호버 글로우 |
| `shadow-glow-gold` | `0 0 20px rgba(255,215,0,0.2)` | 골드 글로우 |

---

## 6. 컴포넌트 스타일 상세

### 6-1. 카드 (.card)

**라이트:**
```
bg-white border border-slate-200 rounded-2xl shadow-card
hover: shadow-card-hover
```

**다크:**
```
bg-surface-card-dark (rgba(30,41,59,0.5)) backdrop-blur-[16px] border-white/10 shadow-glass
```

**패딩 변형:** `sm: p-4` | `md: p-6` | `lg: p-8`

### 6-2. 글래스 카드 (.glass)

```
bg-surface-card (rgba(255,255,255,0.8)) backdrop-blur-[16px] border border-slate-200 rounded-2xl
다크: bg-surface-card-dark border-white/10
```

### 6-3. 호버 리프트 (.hover-lift)

```
transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover
다크: hover:shadow-glow
```

### 6-4. 인라인 카드 (섹션 내 사용)

```
rounded-2xl p-5 sm:p-6
bg-white/80 dark:bg-white/[0.02]
border border-slate-200 dark:border-white/[0.06]
transition-all duration-300
hover:border-[#7C3AED]/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)]
```

### 6-5. 특징 카드 (Feature/Why 섹션)

```
rounded-2xl p-5 sm:p-8
bg-[#7C3AED]/[0.03] border border-[#7C3AED]/[0.08]
hover:border-[#7C3AED]/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] hover:bg-[#7C3AED]/[0.05]
```

아이콘 컨테이너:
```
w-12 h-12 rounded-[14px] bg-[#7C3AED]/[0.08] shadow-sm
flex items-center justify-center
text-[#7C3AED] dark:text-[#A78BFA]
```

---

## 7. 버튼 시스템

### 7-1. Variant

| Variant | 라이트 | 다크 |
|---|---|---|
| **primary** | `bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white` + `shadow-[0_4px_20px_rgba(124,58,237,0.2)]` | `shadow-[0_0_24px_rgba(124,58,237,0.25)]` |
| **primary hover** | `from-[#6D28D9] to-[#9333EA]` | |
| **secondary** | `bg-white border border-[#E0D8F0] text-[#7C3AED] hover:bg-brand-50` | `bg-white/[0.03] border-white/10 text-[#A090C0] hover:bg-white/[0.06]` |
| **ghost** | `text-slate-600 hover:text-slate-900 hover:bg-slate-100` | `text-slate-300 hover:text-white hover:bg-white/5` |
| **outline** | `border border-brand-500 text-brand-600 hover:bg-brand-50` | `text-brand-400 hover:bg-brand-500/10` |

### 7-2. Size (WCAG 터치 타겟 44px+)

| Size | 스타일 |
|---|---|
| **sm** | `px-4 py-2.5 text-sm rounded-lg min-h-[44px]` |
| **md** | `px-6 py-2.5 text-base rounded-xl min-h-[44px]` |
| **lg** | `px-8 py-3 text-lg rounded-xl min-h-[48px]` |

### 7-3. 공통 속성

```
inline-flex items-center justify-center font-medium
transition-all duration-300 cursor-pointer
disabled:opacity-50 disabled:cursor-not-allowed
```

### 7-4. CTA 특수 버튼 (CTA 배너 내)

```
bg-white/15 border border-white/25 text-white backdrop-blur-sm
shadow-[0_0_20px_rgba(255,255,255,0.1)]
hover:bg-white/25 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
rounded-xl min-h-[48px] px-6 sm:px-8 py-3
```

---

## 8. 레이아웃

### 8-1. 전체 구조

```
min-h-screen flex flex-col
bg-surface dark:bg-surface-dark
transition-colors duration-300
```

홈 페이지: `overflow-hidden h-screen` (fullpage 모드)

### 8-2. 컨테이너

```
max-w-7xl mx-auto px-4 sm:px-6    -- 넓은 레이아웃 (서비스, Why)
max-w-5xl mx-auto px-4 sm:px-6    -- 중간 (Upcoming, CTA)
max-w-2xl mx-auto px-4 sm:px-6    -- 좁은 (Hero 텍스트)
max-w-[640px] mx-auto px-4 sm:px-6 -- FAQ
```

### 8-3. 그리드

```
1열 → 2열: grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6
1열 → 2열 → 4열: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6
1열 → 2열 → 3열: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6
푸터: grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8
```

---

## 9. 헤더 (Header)

### 9-1. 기본 상태

```
fixed top-0 left-0 right-0 z-50
bg-transparent py-5
transition-all duration-300
```

### 9-2. 스크롤 상태 (scrollY > 20)

```
bg-white/80 dark:bg-[#0C0818]/80
backdrop-blur-xl shadow-sm
border-b border-slate-200 dark:border-white/10
py-3
```

### 9-3. 네비게이션 링크

```
text-sm font-medium transition-colors duration-200
기본: text-slate-500 hover:text-slate-900 | dark: text-slate-400 hover:text-white
활성: text-brand-600 | dark: text-brand-400
gap: gap-8 (데스크톱)
```

### 9-4. 모바일 메뉴

```
md:hidden
bg-white dark:bg-slate-900
border border-slate-200 dark:border-white/10
mt-2 mx-4 p-4 rounded-2xl shadow-lg animate-fade-in
```

햄버거: 3-line CSS 애니메이션 (rotate-45/opacity-0/-rotate-45)

---

## 10. 푸터 (Footer)

```
border-t border-slate-200 dark:border-white/10
bg-white dark:bg-slate-900/50
py-8 sm:py-12
```

하단 카피라이트:
```
border-t border-slate-200 dark:border-white/10 mt-8 pt-8 text-center
text-xs text-slate-400 dark:text-slate-500
```

---

## 11. 섹션 배경 패턴

### 11-1. 배경 그라디언트 (각 섹션별 sky 톤 교차)

```
Hero:     from-sky-light via-sky-pale to-sky-faint | dark: from/via/to-surface-dark-1
Services: from-sky-faint to-sky-mist             | dark: surface-dark-2
Why:      from-sky-mist to-sky-soft              | dark: surface-dark-1
Upcoming: from-sky-soft to-sky-mist              | dark: surface-dark-3
FAQ:      from-sky-mist to-sky-faint             | dark: surface-dark-1
CTA:      sky-faint                               | dark: surface-dark-3
```

### 11-2. 배경 글로우 오브 (Glow Orbs)

반투명 원형 + blur로 부드러운 배경 조명 효과:

```html
<!-- 라이트: 하늘빛 글로우 -->
<div class="absolute top-[10%] left-1/2 -translate-x-1/2
  w-[300px] md:w-[500px] lg:w-[600px]
  h-[300px] md:h-[500px] lg:h-[600px]
  bg-[#87CEEB]/[0.12] rounded-full blur-[120px] pointer-events-none" />

<!-- 다크: 보라빛 글로우 -->
<div class="... bg-[#7C3AED]/[0.07] ..." />
<!-- 다크: 골드 글로우 -->
<div class="... bg-[#FFD700]/[0.025] ..." />
<!-- 다크: 핑크 글로우 -->
<div class="... bg-[#EC4899]/[0.03] ..." />
```

**불투명도 범위:** 라이트 `0.08~0.15`, 다크 `0.03~0.07`
**블러:** `blur-[100px]` ~ `blur-[120px]`

### 11-3. 구름 (라이트 모드 전용)

복합 구름 = 외곽(연하고 넓음) + 코어(진하고 좁음):

```html
<div class="dark:hidden absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
  <div class="animate-cloud-drift" style={{ animationDelay: '0s' }}>
    <!-- 외곽: 넓고 연한 -->
    <div class="absolute top-[6%] left-[8%] w-[220px] md:w-[380px] h-[60px] md:h-[90px]
      bg-white/45 rounded-full blur-[28px]" />
    <!-- 코어: 좁고 진한 -->
    <div class="absolute top-[6.5%] left-[10%] w-[160px] md:w-[280px] h-[45px] md:h-[65px]
      bg-white/80 rounded-full blur-[12px]" />
  </div>
</div>
```

**규칙:**
- 외곽: `bg-white/36~45`, `blur-[22px~30px]`
- 코어: `bg-white/72~85`, `blur-[7px~14px]`
- 작은 단독 구름: `bg-white/76~85`, `blur-[7px~8px]`
- 각 섹션마다 2~5개, 서로 다른 `animationDelay`

### 11-4. 별 파티클 (다크 모드 전용)

```html
<div class="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
  <!-- 작은 별 (2px), 25개 -->
  {Array.from({ length: 25 }).map((_, i) => (
    <span class="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle"
      style={{
        top: `${3 + (i * 3.7) % 92}%`,
        left: `${2 + (i * 4.1) % 95}%`,
        animationDelay: `${(i * 0.17).toFixed(2)}s`,
        opacity: 0.2 + (i % 4) * 0.15,
      }} />
  ))}
  <!-- 중간 별 (3px), 12개 -->
  <!-- 큰 별 (4px) + 글로우, 5개 -->
  <!-- 큰 별: boxShadow: '0 0 6px 2px rgba(255,255,255,0.4)' -->
</div>
```

**밀도:** Hero 25+12+5, 서비스/Why/Upcoming 10~15, FAQ 8, CTA 6

---

## 12. 장식 요소

### 12-1. 코너 L자 프레임

```html
<div class="absolute inset-4 sm:inset-8 md:inset-16 pointer-events-none" aria-hidden="true">
  <div class="absolute top-0 left-0 w-9 h-9 border-t-[1.5px] border-l-[1.5px] border-[#7C3AED]/[0.12]" />
  <div class="absolute top-0 right-0 w-9 h-9 border-t-[1.5px] border-r-[1.5px] border-[#7C3AED]/[0.12]" />
  <div class="absolute bottom-0 left-0 w-9 h-9 border-b-[1.5px] border-l-[1.5px] border-[#7C3AED]/[0.12]" />
  <div class="absolute bottom-0 right-0 w-9 h-9 border-b-[1.5px] border-r-[1.5px] border-[#7C3AED]/[0.12]" />
</div>
```

### 12-2. 다이아몬드 장식

```html
<div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-[#7C3AED]/[0.15]" />
```

### 12-3. 그라디언트 라인 (상하 장식)

```html
<div class="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED]/10 to-transparent" />
```

### 12-4. 골드 디바이더

```html
<div class="w-[100px] h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent dark:via-[#FFD700]/30" />
```

### 12-5. 섹션 구분선

```css
.section-divider-gradient {
  height: 1px;
  background: linear-gradient(90deg, transparent 5%, rgba(124,58,237,0.2) 30%, rgba(255,215,0,0.12) 50%, rgba(124,58,237,0.2) 70%, transparent 95%);
}
```

### 12-6. 엠블럼

```html
<div class="w-16 h-16 rounded-full border border-[#7C3AED]/[0.18] bg-[#7C3AED]/[0.04]
  flex items-center justify-center dark:shadow-[0_0_30px_rgba(124,58,237,0.08)]">
  <span class="font-display-deco text-2xl font-bold
    bg-gradient-to-b from-[#C8A0FF] to-[#FFD700] bg-clip-text text-transparent">
    P
  </span>
</div>
```

---

## 13. 애니메이션

### Tailwind 등록 애니메이션

| 클래스 | 키프레임 | 설정 |
|---|---|---|
| `animate-fade-in` | `0%{opacity:0}→100%{opacity:1}` | `0.6s ease-out forwards` |
| `animate-slide-up` | `0%{opacity:0,translateY(20px)}→100%` | `0.6s ease-out forwards` |
| `animate-float` | `0%,100%{translateY(0)}→50%{translateY(-10px)}` | `6s ease-in-out infinite` |
| `animate-twinkle` | `0%,100%{opacity:0.2}→50%{opacity:1}` | `4s ease-in-out infinite` |
| `animate-scroll-pulse` | `0%,100%{opacity:0.4,translateY(0)}→50%{opacity:1,translateY(6px)}` | `2s ease-in-out infinite` |
| `animate-cloud-drift` | `0%{translateX(0)}→50%{translateX(30px)}→100%` | `20s ease-in-out infinite` |
| `animate-cloud-drift-slow` | `0%{translateX(0)}→50%{translateX(15px)}→100%` | `30s ease-in-out infinite` |

### 전역 트랜지션

- 테마 전환 시: 500ms ease (background-color, color, border-color, box-shadow, fill, stroke)
- 컴포넌트 기본: `transition-all duration-300`
- 네비게이션 링크: `transition-colors duration-200`

### 모션 감소 대응

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 14. FullPage 스크롤 시스템

```css
.fullpage-wrapper {
  height: calc(100vh - 5rem); /* 헤더 높이 제외 */
  overflow: hidden;
}
.fullpage-container {
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none; /* 스크롤바 숨김 */
}
.snap-section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  height: calc(100vh - 5rem);
  max-height: calc(100vh - 5rem);
  overflow-y: auto;
  overflow-x: hidden;
}
```

### 우측 네비게이션 인디케이터

- 위치: `fixed right-1.25rem top-50% z-40`
- 점: `10px` 원, 활성 시 `scale(1.3)` + 글로우
- 라벨: `11px`, 호버 시 표시
- 모바일: `right-0.5rem`, 라벨 숨김

```
기본: bg-[#7C3AED]/20 | dark: bg-white/20
활성: bg-[#7C3AED] + shadow 0 0 8px rgba(124,58,237,0.4)
      dark: bg-[#A78BFA] + shadow
호버: bg-[#7C3AED]/40 scale(1.15) | dark: bg-white/40
```

---

## 15. FAQ 아코디언

```html
<!-- 아코디언 아이템 -->
<div class="rounded-xl bg-[#7C3AED]/[0.025] border border-[#7C3AED]/[0.07] overflow-hidden">
  <button class="w-full flex items-center gap-3 p-4 min-h-[44px]">
    <span class="font-display text-sm font-bold text-[#B8860B] dark:text-[#FFD700]/70">Q</span>
    <span class="flex-1 text-sm text-[#1A1A2E] dark:text-[#E0D8F0]">{question}</span>
    <span class="text-xs text-[#7C3AED]/50 rotate-180(on open)">▼</span>
  </button>
  <!-- 답변: grid-template-rows 트랜지션 -->
  <div style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
    class="grid transition-[grid-template-rows] duration-300 ease-in-out">
    <div class="overflow-hidden">
      <div class="px-4 pb-4 pl-10">
        <p class="text-[13px] text-[#5C5C7A] dark:text-[#7A6A9A] leading-relaxed">{answer}</p>
      </div>
    </div>
  </div>
</div>
```

---

## 16. CTA 배너

```html
<div class="rounded-[20px] p-5 sm:p-10 md:px-10 md:py-14 text-center relative overflow-hidden">
  <!-- 배경 -->
  <div class="absolute inset-0 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] opacity-[0.92]" />
  <!-- 골드 radial -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.15),transparent_60%)]" />
  <!-- 다이아몬드 패턴 -->
  <div class="absolute inset-0 opacity-[0.04]" style={{
    backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,0.5) 0% 25%, transparent 0% 50%)',
    backgroundSize: '20px 20px',
  }} />
  <!-- 코너 L자 (white/[0.18]) -->
  <!-- 콘텐츠 (z-10) -->
</div>
```

---

## 17. 알림 배너

```html
<div class="rounded-2xl p-4 sm:p-6 md:p-8
  bg-[#FFD700]/[0.04] border border-[#FFD700]/10
  flex flex-col md:flex-row items-center gap-4 md:gap-6">
  <span class="text-[#FFD700]">{BellIcon}</span>
  <div class="flex-1 text-center md:text-left">
    <p class="text-sm font-medium text-[#1A1A2E] dark:text-white/90">제목</p>
    <p class="text-xs text-[#5C5C7A] dark:text-[#6A5490]">설명</p>
  </div>
  {CTA Button}
</div>
```

---

## 18. 상태 배지

```html
<span class="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full
  bg-[#7C3AED]/[0.06] dark:bg-white/[0.04]">
  <span class="w-1.5 h-1.5 rounded-full"
    style={{ background: status === 'coming_soon' ? '#10B981' : '#FBBF24' }} />
  <span class="text-[#4A4270] dark:text-[#8A7AAA]">{label}</span>
</span>
```

---

## 19. 테마 토글 버튼

SVG 기반 해(Sun) <-> 달(Moon) 모핑:
- 크기: `20x20` (viewBox `0 0 24 24`)
- 해: 채워진 원(r=5) + 8개 광선
- 달: 빈 원(r=4) + 마스크 원(cx=15, cy=9, r=4) + 3개 별
- 전환: `transition-all duration-300 motion-reduce:transition-none`
- 컨테이너: `p-2 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-100`
- 다크: `text-slate-400 hover:text-amber-300 hover:bg-white/10`

---

## 20. 접근성 (WCAG 2.1 AA)

- 키보드 포커스: `outline-2 outline-offset-2 outline-brand-500` (`*:focus-visible`)
- Skip Navigation: `.skip-nav` (본문 바로가기 링크)
- 모든 버튼: `min-h-[44px]` (터치 타겟)
- `aria-label`, `aria-expanded`, `aria-current`, `aria-hidden="true"` 적절히 사용
- 장식 요소: `pointer-events-none` + `aria-hidden="true"`
- `prefers-reduced-motion` 대응

---

## 21. 반응형 브레이크포인트

Tailwind 기본값 사용:
| 접두사 | 최소 너비 |
|---|---|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |

**주요 패턴:**
- 네비게이션: `hidden md:flex` (768px 이하 모바일 메뉴)
- 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4`
- Hero 텍스트: `text-[28px] sm:text-[34px] md:text-[42px]`
- 배경 글로우: `w-[300px] md:w-[500px] lg:w-[600px]`
- 구름: `w-[220px] md:w-[380px]`
- 패딩: `p-5 sm:p-6 md:p-8`

---

## 22. Tailwind Config 전체 (복사용)

```typescript
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7C3AED', light: '#A855F7', dark: '#5B21B6',
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#7C3AED', 600: '#7C3AED', 700: '#5B21B6',
          800: '#4c1d95', 900: '#3b0764', 950: '#2e1065',
        },
        'accent-gold': '#FFD700',
        'accent-pink': '#EC4899',
        'vault-color': { DEFAULT: '#10B981', light: '#34D399' },
        'quest-color': { DEFAULT: '#7C3AED', light: '#C084FC' },
        navy: { DEFAULT: '#2B3442', light: '#3d4a5c', dark: '#1a2332' },
        sky: {
          deep: '#87CEEB', mid: '#A8D5FF', light: '#B8DEFF',
          pale: '#D0EAFF', faint: '#E8F4FD', mist: '#E0F0FF', soft: '#D6EDFF',
        },
        surface: {
          DEFAULT: '#FAF8FF', dark: '#0f172a',
          'dark-1': '#0C0818', 'dark-2': '#110D20', 'dark-3': '#150F28',
          light: '#FAF8FF', 'light-card': '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.8)',
          'card-dark': 'rgba(30, 41, 59, 0.5)',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Nunito', 'Pretendard', 'sans-serif'],
        'display-deco': ['Nunito', 'Pretendard', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.08)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.2)',
        glow: '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.2)',
      },
      backdropBlur: { glass: '16px' },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
        'cloud-drift': 'cloudDrift 20s ease-in-out infinite',
        'cloud-drift-slow': 'cloudDriftSlow 30s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        twinkle: { '0%, 100%': { opacity: '0.2' }, '50%': { opacity: '1' } },
        scrollPulse: { '0%, 100%': { opacity: '0.4', transform: 'translateY(0)' }, '50%': { opacity: '1', transform: 'translateY(6px)' } },
        cloudDrift: { '0%': { transform: 'translateX(0)' }, '50%': { transform: 'translateX(30px)' }, '100%': { transform: 'translateX(0)' } },
        cloudDriftSlow: { '0%': { transform: 'translateX(0)' }, '50%': { transform: 'translateX(15px)' }, '100%': { transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [forms],
};

export default config;
```

---

## 23. globals.css 전체 (복사용)

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply scroll-smooth; }
  body {
    @apply font-sans antialiased bg-surface text-slate-900 transition-colors duration-300;
    word-break: keep-all;
  }
  .dark body { background-color: #0C0818; color: #e2e8f0; }
  p, li, dd { line-height: 1.75; }
  *:focus-visible { @apply outline-2 outline-offset-2 outline-brand-500; }
}

@layer components {
  .skip-nav {
    @apply absolute -top-full left-4 z-[100] px-4 py-2 rounded-b-lg
      bg-brand-600 text-white text-sm font-medium focus:top-0 transition-all;
  }
  .card {
    @apply bg-white border border-slate-200 rounded-2xl shadow-card transition-all duration-300;
  }
  .card:hover { @apply shadow-card-hover; }
  .dark .card {
    @apply bg-surface-card-dark backdrop-blur-[16px] border-white/10 shadow-glass;
  }
  .glass {
    @apply bg-surface-card backdrop-blur-[16px] border border-slate-200 rounded-2xl;
  }
  .dark .glass { @apply bg-surface-card-dark border-white/10; }
  .text-gradient {
    @apply bg-gradient-to-r from-[#9B59B6] via-[#D4A017] to-[#E0598B] bg-clip-text text-transparent;
  }
  .dark .text-gradient { @apply from-[#E0C0FF] via-[#FFD700] to-[#FF90D0]; }
  .hover-lift {
    @apply transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover;
  }
  .dark .hover-lift { @apply hover:shadow-glow; }
}

.section-divider-gradient {
  height: 1px;
  background: linear-gradient(90deg, transparent 5%, rgba(124,58,237,0.2) 30%, rgba(255,215,0,0.12) 50%, rgba(124,58,237,0.2) 70%, transparent 95%);
}

/* fullpage, nav dots, theme transition, reduced-motion 등은 필요 시 복사 */
```

---

## 24. 디자인 원칙 요약

1. **Nebula Theme**: Violet + Gold + Pink 삼색 체계, 판타지 RPG 분위기
2. **듀얼 테마**: 라이트(하늘+구름) / 다크(밤하늘+별), `class` 기반 토글
3. **글래스모피즘**: 다크 모드 카드에 `backdrop-blur-[16px]` + 반투명 배경
4. **미니멀 장식**: 코너 L자, 다이아몬드, 그라디언트 라인 (모두 낮은 불투명도)
5. **접근성 우선**: WCAG 2.1 AA, 44px 터치 타겟, focus-visible, skip-nav
6. **반응형**: Mobile-first, 3단계 브레이크포인트 (sm/md/lg)
7. **부드러운 전환**: 모든 인터랙션에 `transition-all duration-300`
8. **CJK 최적화**: Pretendard 폰트, `word-break: keep-all`, `line-height: 1.75`
