# Vault - 프로젝트 문서 허브

> 이 문서는 모든 상세 문서로의 진입점이다. 원하는 주제만 골라 읽으면 된다.

**서비스**: Vault — 개인 재무 통합 관리 웹앱 (PompCore 서브 프로젝트)
**스택**: React 19 · TypeScript 5.9 · Vite 7 · Tailwind CSS 3 · Supabase · Zustand 5
**버전**: v1.1.1 | **최종 완료 단계**: Phase 0~5 전체 구현
**현재 상태**: tsc 0 에러, ESLint 0 에러

---

## 문서 목록

| 문서 | 다루는 내용 |
|------|-------------|
| [FEATURES.md](FEATURES.md) | 구현된 기능 전체 명세 (24개 섹션) |
| [architecture.md](architecture.md) | 기술 아키텍처, 디렉토리 구조, DB 설계, 페이지 목록 |
| [guidelines.md](guidelines.md) | 코딩 컨벤션, 네이밍, 주요 패턴, 버전 관리 규칙 |
| [decisions.md](decisions.md) | 기술적 의사결정 이유 (날짜별 기록) |
| [todo.md](todo.md) | 미구현 항목 및 미래 과제 |
| [done.md](done.md) | 완료된 작업 내역 (날짜 역순) |
| [roadmap/pompcore-integration-checklist.md](roadmap/pompcore-integration-checklist.md) | PompCore ↔ Vault 연동 작업 체크리스트 |
| [roadmap/design-improvements.md](roadmap/design-improvements.md) | 디자인 개선 계획 |

---

## 기능별 빠른 참조

| 찾는 것 | 바로가기 |
|---------|---------|
| 인증 / OAuth | [FEATURES.md #3](FEATURES.md#3-인증-시스템) |
| 통장 관리 | [FEATURES.md #5](FEATURES.md#5-통장-관리) |
| 거래내역 | [FEATURES.md #6](FEATURES.md#6-거래내역) |
| 정기결제 | [FEATURES.md #7](FEATURES.md#7-정기결제) |
| 예/적금 | [FEATURES.md #8](FEATURES.md#8-예적금) |
| 예산 | [FEATURES.md #9](FEATURES.md#9-예산) |
| 통계 차트 | [FEATURES.md #10](FEATURES.md#10-통계) |
| 공지사항 / 문의 | [FEATURES.md #11-12](FEATURES.md#11-공지사항) |
| 설정 (프로필, 카테고리) | [FEATURES.md #13](FEATURES.md#13-설정) |
| 휴지통 | [FEATURES.md #14](FEATURES.md#14-휴지통) |
| 투자 포트폴리오 | [FEATURES.md #25](FEATURES.md) |
| 부동산 관리 | [FEATURES.md #26](FEATURES.md) |
| 테마 시스템 (다크/라이트) | [FEATURES.md #16](FEATURES.md#16-테마-시스템) |
| DB 테이블 구조 | [FEATURES.md #18](FEATURES.md#18-데이터베이스-구조) |
| 보안 패치 내역 | [FEATURES.md #19](FEATURES.md#19-보안) |
| SEO / Analytics | [FEATURES.md #20](FEATURES.md#20-seo--analytics) |
| 라우팅 맵 | [FEATURES.md #23](FEATURES.md#23-라우팅-맵) |
| 코딩 패턴 (Override, userId) | [guidelines.md](guidelines.md#주요-패턴) |
| 버전 업데이트 방법 | [guidelines.md](guidelines.md#버전-관리-규칙) |
| 디렉토리 구조 | [architecture.md](architecture.md#디렉토리-구조) |
| Supabase 인증 구조 | [architecture.md](architecture.md#인증-구조) |
| PompCore 연동 방법 | [roadmap/pompcore-integration-checklist.md](roadmap/pompcore-integration-checklist.md) |

---

## 주요 소스 파일 위치

| 역할 | 파일 |
|------|------|
| 환경변수/설정 | `src/config/appConfig.ts` |
| 라우트 상수 | `src/constants/routes.ts` |
| Supabase 클라이언트 | `src/services/supabase.ts` |
| 쿠키 스토리지 (PompCore 연동) | `src/utils/cookieStorage.ts` |
| 인증 서비스 | `src/services/auth.service.ts` |
| 테마 스토어 | `src/stores/themeStore.ts` |
| 앱 진입점 (라우팅) | `src/App.tsx` |
| 글로벌 CSS | `src/index.css` |
| Tailwind 설정 (컬러 토큰) | `tailwind.config.ts` |
