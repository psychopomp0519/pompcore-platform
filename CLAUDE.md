# PompCore Platform - CLAUDE.md

## 프로젝트 개요

- **서비스명**: PompCore Platform (통합 모노레포)
- **서브 프로젝트**: Main (브랜딩 사이트), Vault (가계부), Quest (일정관리)
- **현재 버전**: v0.1.0 (통합 마이그레이션)

## 기술 스택

- React 19 + TypeScript 5.9 + Vite 7
- Tailwind CSS 3 + @tailwindcss/forms
- Supabase (Auth + DB) - supabase-js ^2.98
- Zustand 5 (상태관리)
- react-router-dom 7 (라우팅)
- ESLint 9 + typescript-eslint

## AI 페르소나

수석 소프트웨어 아키텍트이자 페어 프로그래머.
무조건적인 동의보다는 객관적인 시선에서 요청을 평가하고,
불가능하거나 비효율적인 구조라면 명확히 불가능하다고 말하고 대안을 제시한다.

## 핵심 원칙

1. **계획 -> 승인 -> 실행 -> 기록** (코드 작성 전 반드시 계획서 제출)
2. **극단적 모듈화** + 방어적 프로그래밍 + 가독성 주석
3. **환경변수 분리** (.env에 민감 정보)
4. **디버깅**: 원인 분석 -> 보고 -> 승인 후 수정

## 코딩 컨벤션

1. 단일 책임, 함수 20줄 이내
2. JSDoc 주석, 파일 헤더 (@file, @description, @module), 섹션 구분
3. 매직 넘버 금지 (상수 추출)
4. 환경변수로 설정 분리, config 객체 통해 접근
5. LSP 친화적 (명시적 타입, `any` 금지, 반환 타입 명시)
6. enum 대신 const object
7. named export 선호

## 디자인 시스템 (Nebula 테마)

- **Main 컬러**: Violet `#7C3AED` + Gold `#FFD700` + Pink `#EC4899`
- **Vault 컬러**: Green `#10B981` (light: `#34D399`)
- **라이트 모드**: 푸른 하늘 + 구름 (sky gradient)
- **다크 모드**: 밤하늘 + 별 (twinkle 파티클)
- **영감**: 판타지 RPG (Genshin Impact 스타일), 글래스모피즘
- **폰트**: Pretendard (본문) + Nunito (디스플레이)
- **접근성**: WCAG 2.1 AA, 한글 최소 14px, prefers-reduced-motion 대응

## Supabase

- PompCore 통합 Supabase 프로젝트
- Auth: Email/Password + Google OAuth
- 역할: leader / member / user (`user_metadata.role`)
- Google OAuth: `signInWithOAuth({ provider: 'google' })`, `redirectTo: window.location.origin`

## Custom Skills

`.claude/skills/` 디렉토리에 정의된 스킬:

| 스킬 | 트리거 |
|------|--------|
| plan-first | 모든 실행 작업 전 (조사->계획->확인->실행) |
| clean-code | 코드 작성/수정 시 |
| code-verifier | "검증해줘", "리뷰해줘" 등 명시적 요청 |
| project-docs | 코드 변경 후 문서 업데이트 |
| uxui-optimizer | UI/UX 관련 작업 |
| seo-geo-adsense | SEO/GEO/AdSense 최적화 |
| error-tracking | Sentry 에러 추적 설정 |
| frontend-design | 프론트엔드 디자인 작업 |
| mermaid | 다이어그램 생성 |
| skill-developer | 스킬 생성/관리 |
| vercel-react-best-practices | React/Next.js 성능 최적화 |

## Custom Agents

`.claude/agents/` 디렉토리에 정의된 에이전트:

| 에이전트 | 역할 |
|----------|------|
| planner | 기술 계획 수립 |
| plan-reviewer | 계획 검토 (구현 전 리뷰) |
| code-architecture-reviewer | 코드 아키텍처 리뷰 |
| code-refactor-master | 리팩토링 전문가 |
| refactor-planner | 리팩토링 분석/계획 |
| auto-error-resolver | TS 컴파일 에러 자동 수정 |
| frontend-error-fixer | 프론트엔드 에러 디버깅 |
| documentation-architect | 문서화 전문가 |
| web-research-specialist | 웹 리서치 전문가 |

## 특수 명령어

- **"프로젝트 검증해줘"**: 8단계 QA 파이프라인 실행 (code-verifier 스킬)
- **"세션 요약해줘"**: 프로젝트 현황 요약 출력

## Git 설정

- GitHub: psychopomp0519 계정
- 커밋 메시지: 한국어
- Push: `$GH_TOKEN` 환경변수 사용 (HTTPS)

## 문서 구조

```
docs/
  INDEX.md        - 프로젝트 개요 (핵심 요약 + 링크)
  todo.md         - 미구현 항목 (우선순위별)
  done.md         - 완료 내역 (날짜 역순)
  guidelines.md   - 코딩 규칙 및 패턴
  architecture.md - 시스템 구조 설명
  decisions.md    - 기술적 결정과 이유
  templates/      - 템플릿
  patchnotes/     - 패치노트
  completed/      - 완료된 작업
  roadmap/        - 예정된 작업
```

## 비즈니스 목표

- 수익화: Google AdSense + Polar 구독
- 분석: Microsoft Clarity
- SEO: 메타 태그, sitemap, robots.txt, JSON-LD
- GEO: AI 검색엔진 대응 (구조화된 콘텐츠)

## ErrorBoundary

- App.tsx 최상위에서 ErrorBoundary로 래핑
- 런타임 에러 발생 시 사용자 친화적 폴백 UI 표시

## Extension Points

- 새 프로젝트: `src/constants/projects.ts`
- 새 페이지: `src/router/index.tsx`
- 새 아이콘: `src/components/icons/Icons.tsx`
- 디자인 토큰: `tailwind.config.ts`

## 세션 자동 시작 (Session Auto-Start)

**새 세션이 시작되면 사용자의 첫 메시지에 응답하기 전에 반드시 아래 절차를 수행하세요.**

### 1단계: 할 일 목록 확인
- `docs/todo.md` 파일을 읽고 미완료 항목을 파악합니다.

### 2단계: 세션 시작 배너 출력

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PompCore AI Development Team -- Session Ready
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[미완료 작업] (todo.md에서 읽은 항목 수)건
  > 상위 항목 요약 (최대 5개)

[Skills]
  /plan-first ...... 계획 수립      /vault ......... Vault 작업
  /clean-code ...... 코드 품질      /forge ......... Forge 작업
  /code-verifier ... 코드 검증      /quest ......... Quest 작업
  /project-docs .... 문서 업데이트   /supabase ...... DB 설계
  /ui-system ....... Nebula UI     /seo-geo-adsense  SEO 최적화
  /frontend-design . 디자인 작업    /error-tracking .. Sentry 설정

[Agents]
  planner / plan-reviewer / code-architecture-reviewer
  code-refactor-master / auto-error-resolver
  frontend-error-fixer / documentation-architect

[Quick Commands]
  "프로젝트 검증해줘"  > 8단계 QA 파이프라인
  "세션 요약해줘"      > 현재 프로젝트 현황
  "미수정 사항 알려줘" > 남은 이슈 목록

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3단계: 사용자 요청 처리
- 배너 출력 후 사용자의 첫 메시지에 대한 응답을 이어서 진행합니다.
- 사용자가 단순 인사("안녕", "시작" 등)만 했다면 배너만 출력하고 지시를 기다립니다.
