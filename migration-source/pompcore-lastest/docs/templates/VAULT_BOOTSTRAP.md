# Vault 프로젝트 부트스트랩 문서

> PompCore 메인 프로젝트에서 Vault(가계부) 독립 프로젝트로 이식할 때 참조하는 문서.
> 새 프로젝트의 CLAUDE.md 또는 첫 세션에서 이 문서를 전달하면 동일한 환경이 구성된다.

---

## 1. 프로젝트 개요

- **서비스명**: Vault (가계부 앱)
- **소속**: PompCore 서브 프로젝트
- **고유 컬러**: Green `#10B981` (light: `#34D399`)
- **로고**: `vault.svg` (워드마크), `vaultlogo.svg` (정사각형 아이콘)

---

## 2. 기술 스택

| 항목 | 버전/도구 |
|------|-----------|
| 프레임워크 | React 19 + TypeScript 5.9 |
| 빌드 | Vite 7 |
| 스타일링 | Tailwind CSS 3 + @tailwindcss/forms |
| DB/Auth | Supabase (supabase-js ^2.98) |
| 상태관리 | Zustand 5 |
| 라우팅 | react-router-dom 7 |
| 린트 | ESLint 9 + typescript-eslint |

### package.json 의존성 (복사용)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.98.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.1",
    "zustand": "^5.0.11"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/forms": "^0.5.11",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.27",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1"
  }
}
```

---

## 3. Supabase 설정

PompCore와 동일한 Supabase 프로젝트를 공유한다.

### 환경변수 (.env)

```env
# Supabase 설정
VITE_SUPABASE_URL=https://daikqggholumhfxtroln.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaWtxZ2dob2x1bWhmeHRyb2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzMxNzAsImV4cCI6MjA4ODIwOTE3MH0.IjlfvTiMz7o0fjLzU-CBNtQiit-JY6U4VPHcRX-RRek
```

### 인증 구조

- **방식**: Email/Password + Google OAuth (Supabase Auth)
- **역할 체계**: `leader`(팀장) / `member`(팀원) / `user`(사용자)
- **역할 저장 위치**: `user_metadata.role` (Supabase Auth)
- **DB 테이블**: 현재 커스텀 테이블 없음 (Auth만 사용). Vault에서 가계부 테이블 새로 생성 필요

### Supabase 클라이언트 패턴 (복사용)

```typescript
// src/services/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('[Vault] Supabase 환경변수가 설정되지 않았습니다.');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
);
```

### 인증 타입 정의 (복사용)

```typescript
// src/types/auth.types.ts
export type UserRole = 'leader' | 'member' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
```

---

## 4. 디자인 시스템 (Nebula 테마)

### 컬러 팔레트

| 용도 | 토큰 | 값 |
|------|------|-----|
| 브랜드 메인 | `brand` | `#7C3AED` (Violet) |
| 브랜드 라이트 | `brand-light` | `#A855F7` |
| 브랜드 다크 | `brand-dark` | `#5B21B6` |
| 골드 액센트 | `accent-gold` | `#FFD700` |
| 핑크 액센트 | `accent-pink` | `#EC4899` |
| **Vault 고유** | `vault-color` | `#10B981` (Green) |
| 네이비 | `navy` | `#2B3442` |
| 라이트 배경 | `surface-light` | `#FAF8FF` |
| 다크 배경 1단계 | `surface-dark-1` | `#0C0818` |
| 다크 배경 2단계 | `surface-dark-2` | `#110D20` |
| 다크 배경 3단계 | `surface-dark-3` | `#150F28` |
| 카드 (라이트) | `surface-light-card` | `#FFFFFF` |
| 카드 (다크) | `surface-card-dark` | `rgba(30, 41, 59, 0.5)` |

### 하늘 색상 (라이트 모드 배경용)

| 토큰 | 값 |
|------|-----|
| `sky-deep` | `#87CEEB` |
| `sky-mid` | `#A8D5FF` |
| `sky-light` | `#B8DEFF` |
| `sky-pale` | `#D0EAFF` |
| `sky-faint` | `#E8F4FD` |

### 폰트

| 용도 | 폰트 |
|------|------|
| 본문 (sans) | Pretendard, Noto Sans KR, system-ui |
| 디스플레이 (display) | Nunito, Pretendard |

### 그림자

```
card:       0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)
card-hover: 0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)
glass:      0 8px 32px rgba(0,0,0,0.12)
glass-lg:   0 16px 48px rgba(0,0,0,0.2)
glow:       0 0 20px rgba(124,58,237,0.3)
glow-gold:  0 0 20px rgba(255,215,0,0.2)
```

### 테마 컨셉

- **라이트 모드**: 푸른 하늘 + 구름 (sky gradient 배경)
- **다크 모드**: 밤하늘 + 별 (twinkle 파티클 애니메이션)
- **디자인 영감**: 판타지 RPG (Genshin Impact 스타일), 글래스모피즘

---

## 5. Tailwind 설정 (전체 복사용)

아래 설정을 `tailwind.config.ts`에 복사하여 사용한다.
Vault 전용 색상/애니메이션은 추가로 확장한다.

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
          DEFAULT: '#7C3AED',
          light: '#A855F7',
          dark: '#5B21B6',
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe',
          300: '#c4b5fd', 400: '#a78bfa', 500: '#7C3AED',
          600: '#7C3AED', 700: '#5B21B6', 800: '#4c1d95',
          900: '#3b0764', 950: '#2e1065',
        },
        'accent-gold': '#FFD700',
        'accent-pink': '#EC4899',
        'vault-color': { DEFAULT: '#10B981', light: '#34D399' },
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
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.2)',
        glow: '0 0 20px rgba(124,58,237,0.3)',
        'glow-gold': '0 0 20px rgba(255,215,0,0.2)',
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
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        twinkle: { '0%, 100%': { opacity: '0.2' }, '50%': { opacity: '1' } },
        scrollPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(6px)' },
        },
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

## 6. 작업 규칙 (Claude Code 환경)

### 핵심 원칙

1. **계획 -> 승인 -> 실행 -> 기록** (코드 작성 전 반드시 계획서 제출)
2. **극단적 모듈화** + 방어적 프로그래밍 + 가독성 주석
3. **환경변수 분리** (.env에 민감 정보)
4. **디버깅**: 원인 분석 -> 보고 -> 승인 후 수정

### 코딩 컨벤션 (clean-code 스킬)

1. 단일 책임, 함수 20줄 이내
2. JSDoc 주석, 파일 헤더, 섹션 구분
3. 매직 넘버 금지 (상수 추출)
4. 환경변수로 설정 분리
5. LSP 친화적 (명시적 타입, `any` 금지, 반환 타입 명시)

### 특수 명령어

- **"프로젝트 검증해줘"**: 8단계 QA 파이프라인 실행
- **"세션 요약해줘"**: 프로젝트 현황 요약 출력

### 문서 구조

```
docs/
  templates/     - 템플릿 (AI_WORK_RULES.md 등)
  patchnotes/    - 패치노트
  completed/     - 완료된 작업
  roadmap/       - 예정된 작업
  memory/        - 기억할 내용
```

---

## 7. 커스텀 스킬 (6개)

새 프로젝트의 `.claude/skills/` 디렉토리에 아래 스킬들을 각각 `SKILL.md` 파일로 생성한다.
또는 기존 프로젝트의 `.claude/skills/` 디렉토리를 통째로 복사해도 된다.

| 스킬 | 트리거 | 설명 |
|------|--------|------|
| plan-first | 모든 실행 작업 | 조사->계획->확인->실행 |
| clean-code | 코드 작성/수정 | 5원칙 (모듈화, 주석, 상수화, env, LSP) |
| code-verifier | "검증해줘" 요청 시 | 8단계 코드 검증 |
| project-docs | 코드 변경 후 | docs/ 자동 업데이트 |
| uxui-optimizer | UI/UX 작업 시 | 디자인 시스템 가이드라인 |
| seo-geo-adsense | SEO/수익화 요청 시 | SEO/GEO/AdSense 최적화 |

---

### 7-1. plan-first

> 파일: `.claude/skills/plan-first/SKILL.md`

```markdown
---
name: plan-first
description: 모든 지시를 수행하기 전에 반드시 "조사 -> 계획 -> 확인 -> 실행" 워크플로우를 따르는 스킬. 사용자의 지시를 받으면 바로 실행하지 않고, 먼저 프로젝트 파일과 코드 구조를 파악하고, 부족한 정보는 웹 검색으로 보충하고, 불명확한 점은 사용자에게 질문하여 확인한 뒤, 수행 계획을 세워 사용자의 승인을 받고 나서 실행한다. 코딩, 문서 작성, 분석, 리서치, 디자인, 설정 변경 등 모든 종류의 작업에 적용한다. 사용자가 어떤 작업을 요청하든 이 스킬을 반드시 사용해야 한다. "만들어줘", "수정해줘", "분석해줘", "작성해줘", "해줘" 등 실행을 요구하는 모든 지시에 적용된다. 단, "이게 뭐야?", "설명해줘" 같은 단순 질문이나 가벼운 대화에는 적용하지 않는다.
---

# Plan First -- 조사 -> 계획 -> 확인 -> 실행

## 개요

이 스킬은 모든 작업에 "먼저 조사하고, 계획을 세우고, 확인받고, 실행한다"는 원칙을 적용한다.

## 적용 시점

사용자가 실행을 수반하는 지시를 내릴 때 항상 적용한다.

적용하는 경우:
- 코드 작성, 수정, 버그 수정, 리팩토링
- 문서 작성, 보고서 작성
- 데이터 분석, 리서치
- 파일 생성, 구조 변경, 설정 수정
- 그 외 실행이 필요한 모든 작업

적용하지 않는 경우:
- 단순 질문에 대한 답변
- 개념 설명 요청
- 가벼운 대화
- 이전 작업에 대한 후속 질문

## 워크플로우

### 1단계: 조사 (Research)

세 가지 경로로 진행:

**1-1: 프로젝트 컨텍스트 파악**
- 프로젝트 디렉토리 구조
- 기존 코드의 아키텍처와 패턴
- 설정 파일 (package.json 등)
- README나 문서 파일
- 관련 있는 기존 코드

**1-2: 외부 정보 조사**
- 라이브러리/API의 최신 사용법
- 모범 사례(best practice)
- 오류 해결책
- 도메인 지식

**1-3: 사용자에게 확인 질문**
- 질문이 필요한 경우만 (모호할 때, 선호 불분명할 때)
- 한 번에 필요한 질문을 모아서 묻는다
- 각 질문에 추천/기본값을 제시한다

### 2단계: 계획 (Plan)

계획 형식:
- 조사 결과 요약
- 수행 단계 (번호 매겨 정리)
  - 무엇을 하는가
  - 어떤 파일/도구를 사용하는가
  - 예상 결과물
- "이 계획대로 진행할까요?"

### 3단계: 확인 (Confirm)

계획을 사용자에게 제시하고 반드시 승인을 받은 후에 실행한다.
이 단계는 절대 건너뛰지 않는다.

### 4단계: 실행 (Execute)

승인받은 계획에 따라 한 단계씩 작업을 수행한다.

각 단계마다:
1. 사전 승인 (해당 단계 내용 알리고 승인)
2. 실행
3. 결과 보고 및 다음 단계 확인

실행 중 불명확하면 즉시 멈추고 질문한다.
계획 변경이 필요하면 변경 이유와 수정 계획을 사용자에게 설명하고 승인 받는다.

## 중요한 원칙

- 조사 먼저: 절대 조사 없이 작업을 시작하지 않는다
- 확인 필수: 계획 후 반드시 사용자 승인
- 단계별 실행: 한 번에 모두 실행하지 않는다
- 계획 준수: 승인받은 계획대로 실행
- 모르면 멈추고 질문
- 질문은 한 번에 모아서
```

---

### 7-2. clean-code

> 파일: `.claude/skills/clean-code/SKILL.md`

```markdown
---
name: clean-code
description: >
  개발자 친화적인 코드를 작성하는 스킬. 코드를 새로 작성하거나 수정/리뷰할 때 반드시 사용한다.
  TypeScript/JavaScript에 최적화되어 있으며 다른 언어에도 동일한 원칙을 적용한다.
---

# Clean Code Skill

코드를 작성하거나 수정할 때 항상 아래 5가지 원칙을 전부 적용한다.

## 원칙 1: 모듈화 (Modularization)

- 하나의 함수/클래스는 하나의 책임만 (Single Responsibility)
- 파일은 역할에 따라 분리: utils/ / services/ / types/ / constants/ / config/
- 함수는 20줄 이하 목표
- 재사용 가능한 로직은 별도 함수로 추출

## 원칙 2: 구조화된 주석 (Structured Comments)

- 파일 상단: @file, @description, @module (JSDoc)
- 섹션 구분자: ============ 로 영역 구분
- 함수: JSDoc으로 LSP 연동 (@param, @returns, @throws)
- 복잡한 로직: 왜(why) 중심으로 설명

## 원칙 3: 하드코딩 금지 (No Magic Values)

- 반복되거나 의미 있는 값은 반드시 상수/변수로 추출
- 같은 값이 2곳 이상 나오면 즉시 상수로 분리

## 원칙 4: 환경변수 분리 (Environment Variables)

- 보안 값, 환경별 설정은 절대 코드에 직접 작성하지 않음
- .env는 .gitignore에 추가
- .env.example은 항상 최신 상태 유지
- config 객체를 통해서만 접근

## 원칙 5: LSP 최적화 (LSP-Friendly Code)

- 타입을 명시적으로 선언 (any 금지)
- 공유 타입은 types/ 폴더에 중앙 관리
- 반환 타입 항상 명시
- enum 대신 const object (tree-shaking + 더 나은 타입 추론)

## 체크리스트

- [ ] 함수가 하나의 역할만 하는가?
- [ ] 파일이 역할에 맞는 폴더에 있는가?
- [ ] 의미 있는 숫자/문자열이 상수로 분리되어 있는가?
- [ ] 비밀키/URL/설정값이 .env로 분리되어 있는가?
- [ ] 모든 함수에 JSDoc 주석이 있는가?
- [ ] 타입이 명시적으로 선언되어 있는가?
- [ ] any 타입을 사용하지 않았는가?
- [ ] 반환 타입이 명시되어 있는가?
```

---

### 7-3. code-verifier

> 파일: `.claude/skills/code-verifier/SKILL.md`

```markdown
---
name: code-verifier
description: 코드 검증 및 수정 스킬. 사용자가 "검증해줘", "코드 리뷰", "확인해봐", "점검해줘" 등 명시적으로 요청할 때만 실행한다.
---

# Code Verifier -- 코드 자동 검증 및 수정

핵심 원칙: 사용자가 명시적으로 요청할 때만 실행한다.

## 검증 파이프라인 (8단계)

### 1단계: 요구사항 충족 검증
- 사용자가 요청한 기능이 모두 구현되었는가
- 입력/출력 형식이 요구사항과 일치하는가
- 누락된 기능이나 부분적으로만 구현된 기능은 없는가

### 2단계: 문법 및 구문 오류 검증
- 문법 오류, 타입 오류
- 임포트/의존성 누락
- 도구: tsc --noEmit, eslint 등

### 3단계: 보안 취약점 / 의존성 / 라이센스 통합 검사
- SQL Injection, XSS, CSRF 등 주요 취약점
- 하드코딩된 비밀번호, API 키
- 패키지 취약점, deprecated 패키지
- 라이센스 호환성

### 4단계: 로직 / 에러핸들링 / 강건성 통합 검증
- Off-by-one, Null/undefined 처리, 무한 루프
- 모든 예외가 적절히 catch되는가
- 외부 의존성 실패 시 graceful degradation

### 5단계: 코드 품질 통합 검증 (스타일 / 모듈화 / 문서화)
- 네이밍 컨벤션, 매직 넘버
- 단일 책임 원칙, 관심사 분리
- JSDoc 주석 누락 확인

### 6단계: 성능 및 복잡도 분석
- O(n^2) 이상 불필요한 루프
- N+1 쿼리 문제
- 불필요한 연산 반복

### 7단계: 테스트 검증 및 자동 생성
- 기존 테스트 실행
- 새 코드에 대한 테스트 자동 생성 (happy path, 경계값, 에러 케이스)

### 8단계: 사용자 관점 통합 분석 (실행 흐름 / UI/UX)
- 주요 시나리오 실행 흐름 추적
- UI/UX 편의성 (로딩 상태, 오류 메시지, 접근성 등)

### 최종: 검증 리포트 생성
- 파일명: verification-report.md
- 각 단계별 결과 (통과/수정) 기록
```

---

### 7-4. project-docs

> 파일: `.claude/skills/project-docs/SKILL.md`

```markdown
---
name: project-docs
description: >
  코드 작성/수정 후 자동으로 프로젝트 문서를 최신 상태로 유지하는 스킬.
  프로젝트 루트의 docs/ 폴더 안에 INDEX.md(개요)와 상세 문서들을 함께 관리한다.
  코드를 작성하거나 수정한 직후 반드시 이 스킬을 사용해야 한다.
---

# Project Docs 스킬

코딩 작업 중 프로젝트 문서를 두 레벨(개요 + 상세)로 자동 유지/관리한다.

## 언제 실행하는가

1. 코드 작성/수정 직후
2. 사용자가 명시적으로 요청할 때

## 문서 구조

docs/
- INDEX.md: 개요 (모든 문서의 핵심 요약 + 링크)
- todo.md: 미구현 항목 (우선순위별)
- done.md: 완료 내역 (날짜 역순)
- guidelines.md: 코딩 규칙 및 패턴
- architecture.md: 시스템 구조 설명
- decisions.md: 기술적 결정과 이유

핵심 원칙: INDEX.md만 읽어도 프로젝트 현황 파악이 가능해야 한다.

## 실행 절차

1. docs/ 폴더 및 파일 확인 (없으면 생성)
2. 현재 작업 내용 분석 -> 각 파일에 무엇을 추가/수정할지 결정
3. 상세 파일 먼저 업데이트, INDEX.md는 마지막에 갱신
4. 변경 사항이 있는 파일만 보고

## 주의 사항

- 중복 금지
- 추론은 명시 (추론) 또는 (코드 분석) 태그
- INDEX는 요약만
- 사실만 기록
```

---

### 7-5. uxui-optimizer

> 파일: `.claude/skills/uxui-optimizer/SKILL.md`

```markdown
---
name: uxui-optimizer
description: UX/UI 최적화 스킬. UI 컴포넌트, 화면, 앱, 웹사이트의 UX/UI를 개선하거나 검토할 때 사용한다. 국내외 주요 디자인 시스템의 원칙을 종합하여 적용한다.
---

# UX/UI 최적화 스킬

## 참고 디자인 시스템

| 카테고리 | 시스템 |
|---|---|
| 플랫폼 | Material Design 3 (Google), Apple HIG, Fluent 2 (Microsoft) |
| UI 라이브러리 | MUI, Bootstrap 5, Chakra UI |
| 국내 | SOLID 2.0 (신한은행), KRDS (디지털정부서비스) |

## 워크플로우

### 1단계: 컨텍스트 파악
- 플랫폼, 대상 사용자, 도메인, 요청 유형

### 2단계: 적용할 가이드라인 선택
- 모바일 Android -> Material Design 3
- 모바일 iOS -> Apple HIG
- 웹/데스크탑 -> Fluent 2 또는 MUI
- 공공 서비스 -> KRDS
- 금융 서비스 -> SOLID 2.0

### 3단계: UX/UI 분석 및 개선

핵심 체크리스트:

**정보 구조 & 내비게이션**
- 현재 위치 파악 가능? 3번 이내 탭/클릭으로 도달? 뒤로가기/취소 명확?

**컴포넌트 & 인터랙션**
- 터치 타깃 44x44pt 이상? 로딩/빈 상태 정의? 오류 메시지 친절?

**타이포그래피 & 레이아웃**
- 시각적 계층구조 명확? 여백 일관된 스케일(4/8px)?

**색상 & 접근성**
- WCAG AA 대비(4.5:1)? 색상만으로 정보 전달하지 않는가?

**피드백 & 상태**
- 즉각적 피드백? 진행 상황 표시? 성공/실패 메시지 명확?

**국내 사용자 특화**
- 한글 최소 14px, 행간 1.5배? 국내 관습 반영?

## 컴포넌트별 가이드

- 버튼: Primary 화면당 1개, 터치환경은 lg(48px)
- 폼: 라벨은 인풋 위에, 플레이스홀더만으로 대체 금지
- 카드: 호버 시 섀도우 상승 + translateY(-2px)
- 모달: ESC/오버레이 클릭/X 버튼 모두 닫기 지원
- 네비게이션: 모바일은 하단 탭바, 웹은 좌측 사이드바 또는 상단 GNB
- 빈 상태: 일러스트 + 제목 + 설명 + CTA 버튼

## 코드 품질 기준

- CSS 변수 기반 테마 관리
- 반응형: 모바일 퍼스트 (min-width)
- 접근성: aria-label, role, tabindex
- 포커스: :focus-visible 활용
- 애니메이션: prefers-reduced-motion 대응
```

---

### 7-6. seo-geo-adsense

> 파일: `.claude/skills/seo-geo-adsense/SKILL.md`

```markdown
---
name: seo-geo-adsense
description: >
  Google AdSense 수익화 최적화, SEO(검색엔진 최적화), GEO(생성형 엔진 최적화)를 종합적으로 안내하는 스킬.
---

# SEO / GEO / AdSense 최적화 스킬

## 1. AdSense 최적화 원칙

- 중복 콘텐츠 금지, 독창적 콘텐츠 제공
- 광고는 콘텐츠의 보조 역할 (콘텐츠보다 눈에 띄면 안 됨)
- 콘텐츠 없는 페이지에 광고 금지

## 2. SEO (검색엔진 최적화)

### 기술적 SEO 체크리스트
- HTTPS, sitemap.xml, robots.txt, 모바일 반응형
- Core Web Vitals (LCP, FID, CLS)
- canonical tag, Schema.org 구조화 데이터, 메타 태그

### 콘텐츠 SEO
- E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness
- 검색 의도에 맞는 콘텐츠 (정보형/탐색형/거래형)
- 내부 링크, 백링크

### 구글 vs 네이버 차이
- 구글: 백링크 매우 중요, Schema.org 중요
- 네이버: 최신 콘텐츠 우대, 네이버 플랫폼 우대

## 3. GEO (생성형 엔진 최적화)

AI 검색 답변에 인용되도록 최적화:

- 각 단락이 독립적으로 의미 통하도록 작성
- "위에서 언급했듯이" 같은 문맥 의존 표현 최소화
- FAQ, 요약 섹션 추가
- E-E-A-T 강화
- 구조화 데이터 (Schema.org FAQPage 등)
- 오리지널 리서치 발행

## 4. 통합 액션 플랜

즉시: Search Console 등록, HTTPS, 사이트맵, 모바일 최적화
단기: E-E-A-T 강화, FAQ 추가, Schema.org, 광고 배치 검토
중장기: 오리지널 리서치, 백링크 확보, 멀티채널 확장
```

---

## 8. AI 페르소나 및 개발 환경 선호

> 스킬에 포함되지 않은 고유 설정. CLAUDE.md 또는 첫 세션에서 전달한다.

### AI 페르소나

```
너는 나의 '수석 소프트웨어 아키텍트이자 페어 프로그래머'이다.
무조건적인 동의보다는 객관적인 시선에서 요청을 평가하고,
불가능하거나 비효율적인 구조라면 명확히 불가능하다고 말하고 대안을 제시해라.
```

### 사용자 개발 환경 선호

- **LSP 최적화 코딩**: 항상 LSP 친화적으로 코드 작성 (명시적 타입, named export 선호, 자동완성 잘 되는 구조)
- **LSP 활용 필수**: 검색, 코드 검증 시 LSP(tsc --noEmit, eslint 등) 적극 활용
- **VSCode 설정**: `.vscode/settings.json`에 TS/ESLint/Tailwind LSP 최적화 설정 적용
- **추천 확장**: ESLint, Tailwind CSS IntelliSense, Prettier (`.vscode/extensions.json`)

### Google OAuth 주의사항

- Supabase Dashboard에서 Google Provider를 별도로 활성화해야 한다
- `signInWithOAuth({ provider: 'google' })` 사용
- `redirectTo`에 `window.location.origin` 설정

### ErrorBoundary 패턴

- App.tsx 최상위에서 ErrorBoundary로 래핑
- 런타임 에러 발생 시 사용자 친화적 폴백 UI 표시
- 새 프로젝트에서도 동일 패턴 적용 권장

### 접근성 기준

- WCAG 2.1 AA 준수 (KRDS 기반)
- Pretendard 폰트 사용 (한글 가독성)
- `prefers-reduced-motion` 미디어쿼리 대응

---

## 9. Git 설정

- **GitHub**: psychopomp0519 계정
- **Push 방법**: `$GH_TOKEN` 환경변수 사용 (HTTPS)
- **커밋 메시지**: 한국어
- **방법**:
  ```bash
  git remote set-url origin https://$GH_TOKEN@github.com/psychopomp0519/{REPO_NAME}.git
  git push origin main
  # push 후 URL 복원
  git remote set-url origin https://github.com/psychopomp0519/{REPO_NAME}.git
  ```

---

## 10. 비즈니스 목표

- **수익화**: Google AdSense + Polar 구독
- **분석**: Microsoft Clarity
- **SEO**: 메타 태그, sitemap, robots.txt, JSON-LD
- **GEO**: AI 검색엔진 대응 (구조화된 콘텐츠)
- **최종 목표**: 구글 검색 유기적 트래픽 증가

---

## 11. 이식 체크리스트

새 Vault 프로젝트를 시작할 때 아래 순서로 진행:

- [ ] GitHub 레포 생성
- [ ] `npm create vite@latest vault -- --template react-ts`
- [ ] 의존성 설치 (섹션 2 참조)
- [ ] `tailwind.config.ts` 복사 (섹션 5)
- [ ] `.env` 생성 (섹션 3)
- [ ] Supabase 클라이언트 + Auth 타입 복사 (섹션 3)
- [ ] `.claude/skills/` 디렉토리 복사 (섹션 7)
- [ ] `CLAUDE.md` 작성 (Vault 버전)
- [ ] `docs/` 구조 초기화 (섹션 6)
- [ ] Pretendard + Nunito 폰트 설정 (CDN 또는 로컬)
- [ ] 다크 모드 토글 구현
- [ ] Vault 전용 DB 테이블 설계
