# Vault - CLAUDE.md

## 프로젝트 개요

- **서비스명**: Vault
- **소속**: PompCore 서브 프로젝트
- **고유 컬러**: Green `#10B981` (light: `#34D399`)

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

- **라이트 모드**: 푸른 하늘 + 구름 (sky gradient)
- **다크 모드**: 밤하늘 + 별 (twinkle 파티클)
- **영감**: 판타지 RPG (Genshin Impact 스타일), 글래스모피즘
- **폰트**: Pretendard (본문) + Nunito (디스플레이)
- **접근성**: WCAG 2.1 AA, 한글 최소 14px, prefers-reduced-motion 대응
- **컬러**: tailwind.config.ts 참조

## Supabase

- PompCore와 동일 Supabase 프로젝트 공유
- Auth: Email/Password + Google OAuth
- 역할: leader / member / user (`user_metadata.role`)
- Google OAuth: `signInWithOAuth({ provider: 'google' })`, `redirectTo: window.location.origin`

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
  memory/         - 기억할 내용
```

## 비즈니스 목표

- 수익화: Google AdSense + Polar 구독
- 분석: Microsoft Clarity
- SEO: 메타 태그, sitemap, robots.txt, JSON-LD
- GEO: AI 검색엔진 대응 (구조화된 콘텐츠)

## ErrorBoundary

- App.tsx 최상위에서 ErrorBoundary로 래핑
- 런타임 에러 발생 시 사용자 친화적 폴백 UI 표시
