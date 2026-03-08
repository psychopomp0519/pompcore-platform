# Light/Dark Mode Theme System - Portable Guide

React 19 + TypeScript + Vite + Tailwind CSS 3 + Zustand 기반의 라이트/다크 모드 전환 시스템.
다른 프로젝트에 그대로 이식할 수 있도록 실제 코드와 함께 정리한 문서.

---

## 목차

1. [아키텍처 개요](#1-아키텍처-개요)
2. [필수 의존성](#2-필수-의존성)
3. [Tailwind 설정](#3-tailwind-설정)
4. [테마 상태 관리 (Zustand Store)](#4-테마-상태-관리-zustand-store)
5. [글로벌 CSS](#5-글로벌-css)
6. [테마 토글 버튼 컴포넌트](#6-테마-토글-버튼-컴포넌트)
7. [다크모드 스타일링 패턴](#7-다크모드-스타일링-패턴)
8. [테마별 조건부 렌더링](#8-테마별-조건부-렌더링)
9. [접근성](#9-접근성)
10. [이식 체크리스트](#10-이식-체크리스트)

---

## 1. 아키텍처 개요

```
[사용자 클릭] -> ThemeToggle 컴포넌트
    -> useThemeStore.toggleTheme()
        -> applyTheme(next)
            -> document.documentElement.classList.add/remove('dark')
            -> localStorage.setItem('pompcore-theme', theme)
            -> theme-transitioning 클래스로 전환 애니메이션
        -> Zustand state 업데이트 -> 리렌더링

[페이지 로드]
    -> getInitialTheme()
        -> localStorage에서 저장값 읽기
        -> 없으면 기본값 'light'
    -> applyTheme(initialTheme)
        -> HTML에 dark 클래스 적용 (초기 로드 시 애니메이션 없음)
    -> Tailwind darkMode: 'class' -> dark: 프리픽스 활성화
```

핵심 포인트:
- **Tailwind `darkMode: 'class'`** - `<html class="dark">`로 전체 앱의 다크모드 제어
- **Zustand** - 전역 상태 관리 (React 리렌더링 트리거)
- **localStorage** - 사용자 선택 영속화
- **CSS transition** - 테마 전환 시 500ms 부드러운 애니메이션

---

## 2. 필수 의존성

```bash
npm install zustand tailwindcss @tailwindcss/forms
# 또는
pnpm add zustand tailwindcss @tailwindcss/forms
```

---

## 3. Tailwind 설정

### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // 핵심: 클래스 기반 다크모드
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // 라이트 모드 배경용 (하늘색 계열 - 필요 시 커스터마이즈)
        sky: {
          deep: '#87CEEB',
          mid: '#A8D5FF',
          light: '#B8DEFF',
          pale: '#D0EAFF',
          faint: '#E8F4FD',
          mist: '#E0F0FF',
          soft: '#D6EDFF',
        },
        // 다크 모드 배경용 (표면 색상 - 단계별 깊이)
        surface: {
          DEFAULT: '#FAF8FF',        // 라이트 기본
          dark: '#0f172a',
          'dark-1': '#0C0818',       // 가장 어두운 배경
          'dark-2': '#110D20',       // 중간
          'dark-3': '#150F28',       // 약간 밝은 어둠
          light: '#FAF8FF',
          'light-card': '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.8)',
          'card-dark': 'rgba(30, 41, 59, 0.5)',
        },
        // 브랜드 컬러 (프로젝트에 맞게 변경)
        brand: {
          DEFAULT: '#7C3AED',
          light: '#A855F7',
          dark: '#5B21B6',
          400: '#A78BFA',
          500: '#7C3AED',
          600: '#6D28D9',
        },
      },

      // 테마 관련 애니메이션
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        twinkle: 'twinkle 4s ease-in-out infinite',            // 다크: 별 깜빡임
        'cloud-drift': 'cloudDrift 20s ease-in-out infinite',  // 라이트: 구름 이동
        'cloud-drift-slow': 'cloudDriftSlow 30s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        cloudDrift: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(30px)' },
          '100%': { transform: 'translateX(0)' },
        },
        cloudDriftSlow: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(15px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },

      // 그림자 (카드용)
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.08)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 4. 테마 상태 관리 (Zustand Store)

### `src/store/themeStore.ts`

```typescript
import { create } from 'zustand';

// ── 타입 ──
type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// ── localStorage 키 (프로젝트명에 맞게 변경) ──
const STORAGE_KEY = 'pompcore-theme';

// ── 초기 테마 결정 ──
function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // SSR 또는 localStorage 접근 불가
  }
  return 'light'; // 기본값
}

// ── HTML 요소에 테마 적용 ──
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // 초기 로드가 아닌 경우에만 전환 애니메이션 실행
  if (root.dataset.themeReady) {
    root.classList.add('theme-transitioning');
  }

  // dark 클래스 토글 (Tailwind darkMode: 'class'의 핵심)
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // 전환 애니메이션 완료 후 클래스 제거 (500ms)
  if (root.dataset.themeReady) {
    setTimeout(() => root.classList.remove('theme-transitioning'), 500);
  }

  // 초기 로드 완료 표시 (이후 전환부터 애니메이션 활성화)
  root.dataset.themeReady = '1';

  // 사용자 선택 저장
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 무시
  }
}

// ── 초기화 ──
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

// ── Store 정의 ──
export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return { theme: next };
    }),

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
```

**동작 흐름:**

| 시점 | HTML 상태 | 설명 |
|------|-----------|------|
| 초기 로드 | `<html>` 또는 `<html class="dark">` | 애니메이션 없이 즉시 적용 |
| 전환 시작 | `<html class="dark theme-transitioning">` | 500ms 전환 애니메이션 |
| 전환 완료 | `<html class="dark">` | `theme-transitioning` 제거 |

---

## 5. 글로벌 CSS

### `src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ================================================================
   1. 기본 스타일
   ================================================================ */
@layer base {
  html {
    @apply scroll-smooth;
  }

  /* 라이트 모드 기본 */
  body {
    @apply font-sans antialiased;
    @apply bg-surface text-slate-900;
    @apply transition-colors duration-300;
    word-break: keep-all; /* 한국어 줄바꿈 최적화 (필요 시) */
  }

  /* 다크 모드 */
  .dark body {
    background-color: #0C0818;
    color: #e2e8f0; /* 순백 대신 오프화이트 (눈 피로 감소) */
  }

  /* 포커스 스타일 */
  *:focus-visible {
    @apply outline-2 outline-offset-2 outline-brand-500;
  }
}

/* ================================================================
   2. 카드 컴포넌트
   ================================================================ */
@layer components {
  /* 라이트 카드 */
  .card {
    @apply bg-white border border-slate-200 rounded-2xl shadow-card;
    @apply transition-all duration-300;
  }
  .card:hover {
    @apply shadow-card-hover;
  }

  /* 다크 카드: 글래스모피즘 */
  .dark .card {
    @apply bg-surface-card-dark backdrop-blur-[16px] border-white/10 shadow-glass;
  }

  /* 글래스모피즘 카드 */
  .glass {
    @apply bg-surface-card backdrop-blur-[16px] border border-slate-200 rounded-2xl;
  }
  .dark .glass {
    @apply bg-surface-card-dark border-white/10;
  }
}

/* ================================================================
   3. 그라디언트 텍스트
   ================================================================ */
.text-gradient {
  @apply bg-gradient-to-r from-[#9B59B6] via-[#D4A017] to-[#E0598B]
         bg-clip-text text-transparent;
}
.dark .text-gradient {
  @apply from-[#E0C0FF] via-[#FFD700] to-[#FF90D0];
}

/* ================================================================
   4. 테마 전환 애니메이션 (핵심!)
   ================================================================
   themeStore의 applyTheme()에서 theme-transitioning 클래스를
   추가/제거하여 전체 페이지에 부드러운 전환 효과 적용.
   ================================================================ */
html.theme-transitioning,
html.theme-transitioning *,
html.theme-transitioning *::before,
html.theme-transitioning *::after {
  transition: background-color 500ms ease,
              color 500ms ease,
              border-color 500ms ease,
              box-shadow 500ms ease,
              fill 500ms ease,
              stroke 500ms ease !important;
}

/* ================================================================
   5. 접근성: 모션 감소 선호
   ================================================================ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. 테마 토글 버튼 컴포넌트

### `src/components/common/ThemeToggle.tsx`

해(Sun) <-> 달(Moon) 모핑 SVG 애니메이션 버튼.

```tsx
import { useThemeStore } from '../../store/themeStore';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg transition-colors
        text-slate-500 hover:text-amber-500 hover:bg-slate-100
        dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-white/10
        ${className}
      `}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* 중심 원: 해(r=5) -> 달(r=4) */}
        <circle
          cx="12"
          cy="12"
          r={isDark ? 4 : 5}
          className="transition-all duration-300 motion-reduce:transition-none"
          fill={isDark ? 'none' : 'currentColor'}
        />

        {/* 달 마스크: 다크 모드에서 원의 일부를 가려 초승달 형태 */}
        <circle
          cx={isDark ? 15 : 12}
          cy={isDark ? 9 : 12}
          r={isDark ? 4 : 0}
          fill="var(--mask-fill, #fff)"
          className="transition-all duration-300 motion-reduce:transition-none
                     dark:[--mask-fill:#0C0818]"
        />

        {/* 태양 광선: 라이트에서 보이고 다크에서 축소+사라짐 */}
        <g
          className="transition-all duration-300 motion-reduce:transition-none"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark
              ? 'scale(0) rotate(45deg)'
              : 'scale(1) rotate(0deg)',
            transformOrigin: 'center',
          }}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>

        {/* 별: 다크 모드에서 나타남 */}
        <g
          className="transition-all duration-300 motion-reduce:transition-none"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'scale(1)' : 'scale(0)',
            transformOrigin: 'center',
          }}
        >
          <circle cx="19" cy="5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="6" cy="4" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="20" cy="17" r="0.5" fill="currentColor" stroke="none" />
        </g>
      </svg>
    </button>
  );
}
```

### 사용 예시 (Header에 배치)

```tsx
import ThemeToggle from '../common/ThemeToggle';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300
      bg-white/80 dark:bg-[#0C0818]/80 backdrop-blur-xl
      border-b border-slate-200 dark:border-white/10">
      <nav className="flex items-center justify-between px-6 py-3">
        <Logo />
        <div className="flex items-center gap-4">
          <NavLinks />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
```

---

## 7. 다크모드 스타일링 패턴

Tailwind의 `dark:` 프리픽스를 사용한 일관된 패턴 모음.

### 7.1 배경색

```tsx
// 페이지 배경 그라데이션
className="bg-gradient-to-b from-sky-light via-sky-pale to-sky-faint
           dark:from-surface-dark-1 dark:via-surface-dark-1 dark:to-surface-dark-1"

// 카드/컨테이너
className="bg-white/80 dark:bg-white/[0.02]"
className="bg-white dark:bg-slate-900/50"

// 헤더 (스크롤 시 반투명)
className="bg-white/80 dark:bg-[#0C0818]/80 backdrop-blur-xl"
```

### 7.2 텍스트색

```tsx
// 기본 텍스트
className="text-slate-900 dark:text-white"

// 보조 텍스트
className="text-slate-500 dark:text-slate-400"

// 호버 포함
className="text-slate-500 hover:text-slate-900
           dark:text-slate-400 dark:hover:text-white"

// 커스텀 컬러
className="text-[#1A1A2E] dark:text-[#E8E0F0]"
className="text-[#5C5C7A] dark:text-[#7A6A9A]"
```

### 7.3 보더

```tsx
// 기본 보더
className="border border-slate-200 dark:border-white/10"

// 미묘한 보더
className="border border-slate-200 dark:border-white/[0.06]"

// 브랜드 보더
className="border border-brand/[0.08] hover:border-brand/20"
```

### 7.4 이미지/SVG 반전

SVG 로고 등 라이트 모드 기준으로 제작된 이미지를 다크에서 반전:

```tsx
<img src={logo} alt="Logo" className="h-6 w-6 dark:invert" />
```

### 7.5 글래스모피즘 (다크모드 카드)

```tsx
<div className="
  rounded-2xl p-6
  bg-white/80 dark:bg-white/[0.02]
  border border-slate-200 dark:border-white/[0.06]
  backdrop-blur-[16px]
  shadow-card dark:shadow-glass
  transition-all duration-300
  hover:border-brand/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)]
">
  {children}
</div>
```

### 7.6 색상 대응표 (빠른 참조)

| 용도 | 라이트 | 다크 |
|------|--------|------|
| 페이지 배경 | `#FAF8FF` (surface) | `#0C0818` (surface-dark-1) |
| 기본 텍스트 | `slate-900` / `#1A1A2E` | `#e2e8f0` / `white` |
| 보조 텍스트 | `slate-500` / `#5C5C7A` | `slate-400` / `#7A6A9A` |
| 카드 배경 | `white/80` | `white/[0.02]` + backdrop-blur |
| 보더 | `slate-200` | `white/10` |
| 브랜드 텍스트 | `brand-600` | `brand-400` |
| 그림자 | `shadow-card` | `shadow-glass` |

---

## 8. 테마별 조건부 렌더링

라이트/다크에서 완전히 다른 요소를 보여줄 때 사용하는 패턴.

### 8.1 CSS로 전환 (권장 - 간단한 경우)

```tsx
{/* 라이트 전용: 구름 */}
<div className="dark:hidden absolute inset-0 pointer-events-none" aria-hidden="true">
  <div className="animate-cloud-drift" style={{ animationDelay: '0s' }}>
    <div className="absolute top-[6%] left-[8%] w-[220px] md:w-[380px] h-[60px] md:h-[90px]
      bg-white/45 rounded-full blur-[28px]" />
    <div className="absolute top-[6.5%] left-[10%] w-[160px] md:w-[280px] h-[45px] md:h-[65px]
      bg-white/80 rounded-full blur-[12px]" />
  </div>
  {/* 추가 구름들... */}
</div>

{/* 다크 전용: 별 파티클 */}
<div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
  {Array.from({ length: 25 }).map((_, i) => (
    <span
      key={`star-${i}`}
      className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle"
      style={{
        top: `${3 + (i * 3.7) % 92}%`,
        left: `${2 + (i * 4.1) % 95}%`,
        animationDelay: `${(i * 0.17).toFixed(2)}s`,
        opacity: 0.2 + (i % 4) * 0.15,
      }}
    />
  ))}
  {/* 중간 별(3px), 큰 별(4px, 글로우) 추가 가능 */}
</div>
```

**핵심 클래스:**
- `dark:hidden` - 다크 모드에서 숨김 (라이트 전용)
- `hidden dark:block` - 라이트에서 숨기고 다크에서 표시 (다크 전용)

### 8.2 JS로 전환 (복잡한 로직이 필요한 경우)

```tsx
import { useThemeStore } from '../../store/themeStore';

function ThemedBackground() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return isDark ? <StarField /> : <CloudField />;
}
```

### 8.3 배경 글로우 (양쪽 모두, 색상만 다르게)

```tsx
{/* 라이트: 하늘색 글로우 / 다크: 브랜드 컬러 글로우 */}
<div className="absolute top-[10%] left-1/2 -translate-x-1/2
  w-[300px] md:w-[500px] h-[300px] md:h-[500px]
  bg-[#87CEEB]/[0.12] dark:bg-[#7C3AED]/[0.07]
  rounded-full blur-[120px] pointer-events-none" />

<div className="absolute bottom-[15%] right-[10%]
  w-[250px] md:w-[350px] h-[250px] md:h-[350px]
  bg-[#B0E0FF]/[0.08] dark:bg-[#FFD700]/[0.025]
  rounded-full blur-[100px] pointer-events-none" />
```

---

## 9. 접근성

### 9.1 모션 감소 (prefers-reduced-motion)

globals.css에서 전역 처리 (섹션 5 참조) + 개별 컴포넌트에서 추가 처리:

```tsx
className="transition-all duration-300 motion-reduce:transition-none"
```

### 9.2 ARIA

```tsx
<button
  onClick={toggleTheme}
  aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
>
```

### 9.3 포커스 스타일

```css
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-brand-500;
}
```

### 9.4 다크모드 텍스트 대비

- 순백(`#FFFFFF`) 대신 오프화이트(`#e2e8f0`) 사용 -> 눈 피로 감소
- WCAG 2.1 AA 기준 4.5:1 이상 명도 대비 유지

---

## 10. 이식 체크리스트

다른 프로젝트에 이 시스템을 적용할 때의 단계별 가이드.

### Step 1: 의존성 설치

```bash
npm install zustand
# tailwindcss는 이미 설치되어 있다고 가정
```

### Step 2: Tailwind 설정 수정

`tailwind.config.ts`에 추가:

```typescript
darkMode: 'class',
theme: {
  extend: {
    colors: {
      surface: {
        DEFAULT: '#FAF8FF',
        'dark-1': '#0C0818',
        'dark-2': '#110D20',
        'dark-3': '#150F28',
        card: 'rgba(255, 255, 255, 0.8)',
        'card-dark': 'rgba(30, 41, 59, 0.5)',
      },
      // 프로젝트에 맞는 색상 추가
    },
    // 애니메이션 (선택사항 - 별/구름 사용 시)
  },
},
```

### Step 3: 파일 복사

1. `src/store/themeStore.ts` - 그대로 복사, `STORAGE_KEY`만 변경
2. `src/components/common/ThemeToggle.tsx` - 그대로 복사
3. `src/styles/globals.css` - 테마 전환 애니메이션 섹션 복사

### Step 4: globals.css에 필수 CSS 추가

최소 필수:

```css
/* 다크 모드 기본 */
.dark body {
  background-color: #0C0818;
  color: #e2e8f0;
}

/* 테마 전환 애니메이션 */
html.theme-transitioning,
html.theme-transitioning *,
html.theme-transitioning *::before,
html.theme-transitioning *::after {
  transition: background-color 500ms ease,
              color 500ms ease,
              border-color 500ms ease,
              box-shadow 500ms ease !important;
}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 5: 컴포넌트에 dark: 클래스 추가

기존 컴포넌트에 `dark:` 변형 추가:

```tsx
// Before
className="bg-white text-gray-900 border-gray-200"

// After
className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-white/10"
```

### Step 6: ThemeToggle 배치

Header, Sidebar, 또는 원하는 위치에 배치:

```tsx
import ThemeToggle from '../common/ThemeToggle';

// Header 내부
<ThemeToggle className="ml-4" />
```

### Step 7: 확인 사항

- [ ] `tailwind.config.ts`에 `darkMode: 'class'` 설정
- [ ] `themeStore.ts` 복사 및 STORAGE_KEY 변경
- [ ] `ThemeToggle.tsx` 복사
- [ ] globals.css에 전환 애니메이션 CSS 추가
- [ ] `.dark body` 스타일 정의
- [ ] 주요 컴포넌트에 `dark:` 변형 추가
- [ ] `prefers-reduced-motion` 대응
- [ ] 다크모드에서 이미지/SVG `dark:invert` 필요 여부 확인
- [ ] localStorage 키 충돌 없는지 확인

---

## 부록: 전체 파일 구조

```
src/
  store/
    themeStore.ts          # 테마 상태 관리 (Zustand)
  components/
    common/
      ThemeToggle.tsx       # 해/달 모핑 토글 버튼
    layout/
      Header.tsx            # ThemeToggle 배치, 다크 배경 처리
      Footer.tsx            # 다크모드 대응
  styles/
    globals.css             # 전역 다크모드 CSS, 전환 애니메이션
  pages/
    Home/
      HeroSection.tsx       # 구름(라이트) / 별(다크) 파티클
      ServicesSection.tsx    # 테마별 배경 글로우
      WhySection.tsx        # 테마별 배경 글로우
tailwind.config.ts          # darkMode: 'class', 색상/애니메이션 정의
```
