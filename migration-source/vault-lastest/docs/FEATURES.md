# Vault - 전체 구현 기능 명세서

> **버전**: v1.1.1 | **최종 업데이트**: 2026-03-07 | **소속**: PompCore

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [인증 시스템](#3-인증-시스템)
4. [대시보드](#4-대시보드)
5. [통장 관리](#5-통장-관리)
6. [거래내역](#6-거래내역)
7. [정기결제](#7-정기결제)
8. [예/적금](#8-예적금)
9. [예산](#9-예산)
10. [통계](#10-통계)
11. [공지사항](#11-공지사항)
12. [문의](#12-문의)
13. [설정](#13-설정)
14. [휴지통](#14-휴지통)
15. [카테고리 관리](#15-카테고리-관리)
16. [테마 시스템](#16-테마-시스템)
17. [공통 UI 컴포넌트](#17-공통-ui-컴포넌트)
18. [데이터베이스 구조](#18-데이터베이스-구조)
19. [보안](#19-보안)
20. [SEO / Analytics](#20-seo--analytics)
21. [접근성](#21-접근성)
22. [성능 최적화](#22-성능-최적화)
23. [라우팅 맵](#23-라우팅-맵)
24. [미구현 / 예정 기능](#24-미구현--예정-기능)

---

## 1. 프로젝트 개요

**Vault**는 개인 재무를 통합 관리하는 웹 애플리케이션입니다.
통장, 거래내역, 정기결제, 예/적금, 예산, 통계를 한곳에서 관리하며,
다중 통화를 지원합니다.

- **브랜드 컬러**: `#10B981` (Emerald)
- **디자인 테마**: Nebula (글래스모피즘 + 판타지 RPG 영감)
- **폰트**: Pretendard (본문) + Nunito (디스플레이)

---

## 2. 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| **프론트엔드** | React + TypeScript | 19 / 5.9 |
| **빌드** | Vite | 7 |
| **스타일링** | Tailwind CSS + @tailwindcss/forms | 3 |
| **상태관리** | Zustand | 5 |
| **라우팅** | react-router-dom | 7 |
| **백엔드** | Supabase (Auth + PostgreSQL + Storage + Edge Functions) | supabase-js 2 |
| **차트** | Nivo (@nivo/bar, @nivo/line, @nivo/pie) | - |
| **린팅** | ESLint + typescript-eslint | 9 |

---

## 3. 인증 시스템

| 기능 | 설명 |
|------|------|
| **이메일/비밀번호 로그인** | 기본 이메일 + 비밀번호 인증 |
| **Google OAuth** | Google 계정 소셜 로그인 |
| **회원가입** | 닉네임, 이메일, 비밀번호(8자 이상) |
| **세션 관리** | Supabase Auth 자동 세션 유지 |
| **역할 시스템** | `user` / `member` / `leader` 3단계 |
| **인증 라우트 보호** | `ProtectedRoute`로 미인증 접근 차단 |
| **리다이렉트** | 로그인 후 원래 페이지로 이동 (경로 검증 포함) |

**관련 파일**: `src/services/auth.service.ts`, `src/stores/authStore.ts`, `src/pages/LoginPage.tsx`, `src/pages/RegisterPage.tsx`

---

## 4. 대시보드

경로: `/`

| 기능 | 설명 |
|------|------|
| **총 자산 현황** | 통화별 전체 자산 합계 + 전월 대비 변동액 |
| **월별 수입/지출** | 이번 달 수입/지출 통화별 요약 |
| **최근 거래내역** | 현월 최신 5건 거래 미리보기 |
| **다가오는 정기결제** | 7일 이내 정기결제 알림 |
| **고정 공지사항** | 관리자 고정 공지 배너 (최대 3개) |
| **빠른 액션** | 거래 추가, 이체, 통계 바로가기 버튼 |

**관련 파일**: `src/pages/DashboardPage.tsx`

---

## 5. 통장 관리

경로: `/accounts`

| 기능 | 설명 |
|------|------|
| **통장 CRUD** | 생성, 수정, 삭제(소프트 삭제) |
| **다중 통화** | 계좌당 여러 통화의 잔액 관리 (KRW, USD, JPY 등) |
| **즐겨찾기** | 즐겨찾기 통장 우선 정렬 |
| **잔액 직접 수정** | 초기 잔액 설정 또는 오차 보정 |
| **이체** | 계좌 간 이체 (동일 통화 또는 환율 입력) |
| **이체 레코드** | 이체 내역 자동 추적 및 거래내역 연동 |
| **통장 카드 UI** | 통화별 잔액 표시, 즐겨찾기 ★ 표시 |

**관련 파일**: `src/pages/AccountsPage.tsx`, `src/services/account.service.ts`, `src/stores/accountStore.ts`, `src/components/accounts/`

---

## 6. 거래내역

경로: `/transactions`

| 기능 | 설명 |
|------|------|
| **거래 CRUD** | 생성, 수정, 삭제(소프트 삭제) |
| **수입/지출 구분** | 타입별 관리 (income / expense) |
| **월 단위 네비게이션** | 이전월/다음월/현월 이동 |
| **필터링** | 전체 / 수입 / 지출 탭 전환 |
| **카테고리 지정** | 선택적 카테고리 할당 |
| **예산 연결** | 거래를 특정 예산에 연결 가능 |
| **기본 카테고리 자동 선택** | 폼 열 때 기본 카테고리 자동 적용 |
| **기본 통화 Fallback** | 사용자 주 통화로 자동 설정 |
| **미래 거래 투명도** | 오늘 이후 날짜 거래는 opacity-50 |
| **날짜별 그룹핑** | 동일 날짜 거래 그룹 표시 |
| **메모** | 거래별 메모 저장 |
| **월 요약** | 수입/지출 통화별 합계 표시 |
| **거래 출처 표시** | 정기결제(정기), 이체(이체) 배지 |

**관련 파일**: `src/pages/TransactionsPage.tsx`, `src/services/transaction.service.ts`, `src/stores/transactionStore.ts`, `src/components/transactions/`

---

## 7. 정기결제

경로: `/recurring`

| 기능 | 설명 |
|------|------|
| **정기결제 CRUD** | 생성, 수정, 삭제(소프트 삭제) |
| **자동 실현** | 페이지 로드 시 미실현 거래 자동 생성 |
| **유연한 주기** | daily / weekly / monthly / yearly |
| **오버라이드** | 특정 회차 금액/이름 변경 또는 건너뛰기 |
| **활성화 토글** | 일시정지/재개 |
| **정렬 3종** | 남은 기간(daysUntilNext) / 일 평균(dailyAverage) / 다음 결제일(nextDate) |
| **정렬 방향 토글** | 오름차순/내림차순 전환 |
| **월 평균 계산** | 설정 기간별(월/주/일/년) 평균값 |
| **이름 선택적** | 미입력 시 "수입"/"지출" 기본값 |
| **기본 통화 Fallback** | 사용자 주 통화로 자동 설정 |
| **기본 카테고리 자동 선택** | 수입/지출 전환 시 기본 카테고리 자동 적용 |

**계산 로직**:
- `getNextOccurrence()` — 다음 발생일 (월말/윤년 처리)
- `getUnrealizedOccurrences()` — 미실현 회차 목록
- `getDailyAverage()` — 일일 평균 금액
- `getDaysUntilNext()` — 다음 결제까지 남은 일수

**관련 파일**: `src/pages/RecurringPage.tsx`, `src/services/recurring.service.ts`, `src/stores/recurringStore.ts`, `src/utils/recurringCalculator.ts`

---

## 8. 예/적금

경로: `/savings`

| 기능 | 설명 |
|------|------|
| **4가지 타입** | 정기예금(fixed_deposit), 적금(installment), 자유적금(free_savings), 청약(real_estate_backed) |
| **CRUD** | 생성, 수정, 삭제 |
| **탭 UI** | 타입별 탭 전환 |
| **이자율** | 이자율 입력 및 보관 |
| **세금 설정** | 비과세 여부 |
| **납입 기록** | 자유적금 납입 내역 추적 |
| **연동 계좌** | 원본 계좌 연결 (즐겨찾기 ★ 우선 정렬) |

**관련 파일**: `src/pages/SavingsPage.tsx`, `src/services/savings.service.ts`, `src/stores/savingsStore.ts`, `src/components/savings/`

---

## 9. 예산

경로: `/budget`

| 기능 | 설명 |
|------|------|
| **예산 CRUD** | 생성, 수정, 삭제(소프트 삭제) |
| **목표액** | 통화별 예산 목표 설정 |
| **진행액** | 현재 진행액 수동 업데이트 |
| **예산 타입** | Virtual(가상) / Actual(실제) |
| **계좌 연동** | 특정 계좌와 연결 가능 |
| **통화별 요약** | 전체 예산 진행률 표시 |
| **거래 연결** | 거래 생성 시 예산 선택 + 진행액 자동 갱신 |

**관련 파일**: `src/pages/BudgetPage.tsx`, `src/services/budget.service.ts`, `src/stores/budgetStore.ts`, `src/components/budget/`

---

## 10. 통계

경로: `/statistics`

| 차트 | 유형 | 설명 |
|------|------|------|
| **월별 수입/지출** | 막대 그래프 | 6개월 또는 12개월 수입/지출 비교 |
| **자산 추이** | 라인 차트 | 시간대별 누적 자산 변화 |
| **카테고리별 분석** | 도넛 차트 | 수입/지출 카테고리 비율 |
| **통장별 분포** | 도넛 차트 | 계좌별 자산 분포 |

| 기능 | 설명 |
|------|------|
| **기간 필터** | 6개월 / 12개월 선택 |
| **통화 필터** | 다중 통화 시 통화별 조회 |
| **초기 잔액 역산** | 현재 잔액 - 기간 내 변동액 |

**관련 파일**: `src/pages/StatisticsPage.tsx`, `src/services/statistics.service.ts`, `src/components/statistics/` (4개 차트 컴포넌트)

---

## 11. 공지사항

경로: `/announcements`, `/announcements/:id`

### 목록 페이지

| 기능 | 설명 |
|------|------|
| **공지 목록** | 최신순 정렬, 고정 공지 배지 |
| **좋아요 수** | 각 공지의 좋아요 카운트 표시 |
| **관리자 작성** | leader/member만 작성 가능 |
| **관리자 수정/삭제** | 기존 공지 편집, 소프트 삭제 |
| **고정 기능** | 최대 3개까지 고정 (pinOrder 1~3) |

### 상세 페이지

| 기능 | 설명 |
|------|------|
| **본문 표시** | 제목, 내용(줄바꿈 보존), 작성일 |
| **좋아요 토글** | 사용자별 좋아요/취소 |
| **댓글** | 작성, 삭제(본인만), 목록 표시 |

**관련 파일**: `src/pages/AnnouncementsPage.tsx`, `src/pages/AnnouncementDetailPage.tsx`, `src/services/announcement.service.ts`

---

## 12. 문의

경로: `/inquiries`

### 일반 사용자

| 기능 | 설명 |
|------|------|
| **문의 등록** | 제목, 내용, 스크린샷 첨부(선택) |
| **스크린샷 업로드** | Supabase Storage (JPEG/PNG/WebP/GIF, 5MB 제한) |
| **내 문의 조회** | 본인 문의 목록 확인 |
| **답변 확인** | 관리자 답변 조회 |
| **답변 평가** | 도움됨 / 도움안됨 평가 |

### 관리자 (leader/member)

| 기능 | 설명 |
|------|------|
| **전체 문의 조회** | 모든 사용자 문의 열람 |
| **상태 필터** | 대기(pending) / 답변완료(answered) |
| **답변 작성** | 텍스트 기반 답변 작성 → 상태 자동 변경 |

**관련 파일**: `src/pages/InquiriesPage.tsx`, `src/services/inquiry.service.ts`

---

## 13. 설정

경로: `/settings` (하위 5개 페이지)

| 페이지 | 경로 | 기능 |
|--------|------|------|
| **설정 메인** | `/settings` | 4개 활성 메뉴 + 3개 준비 중(테마, 친구, 크레딧) |
| **프로필** | `/settings/profile` | 닉네임(30자 제한), 생년월일, 비밀번호 변경, 로그아웃, 회원 탈퇴 |
| **메뉴 설정** | `/settings/menu` | 하단 탭(BottomNav) 순서 커스터마이징 |
| **카테고리** | `/settings/categories` | 수입/지출 카테고리 관리 (아래 15번 참조) |
| **환경설정** | `/settings/preferences` | 주 통화, 정기결제 평균 단위(월/주/일/년) |

### 회원 탈퇴

- Supabase Edge Function(`delete-account`)으로 Auth 사용자 삭제
- ON DELETE CASCADE로 모든 vault_* 테이블 데이터 자동 정리
- JWT 검증 → Service Role Key로 삭제 수행

**관련 파일**: `src/pages/Settings*.tsx`, `src/services/settings.service.ts`, `src/stores/settingsStore.ts`

---

## 14. 휴지통

경로: `/trash`

| 기능 | 설명 |
|------|------|
| **통합 조회** | 6개 테이블의 소프트 삭제 항목 통합 표시 |
| **지원 타입** | 통장, 카테고리, 거래내역, 정기결제, 예/적금, 예산 |
| **타입별 필터** | 각 타입별 필터링 |
| **복원** | 원래 상태로 복원 |
| **영구 삭제** | 데이터 완전 제거 (확인 필수) |
| **삭제일 표시** | 삭제된 날짜 표시 |

**관련 파일**: `src/pages/TrashPage.tsx`, `src/services/trash.service.ts`

---

## 15. 카테고리 관리

설정 > 카테고리에서 접근

| 기능 | 설명 |
|------|------|
| **CRUD** | 생성, 수정, 삭제(소프트 삭제) |
| **수입/지출 탭** | 타입별 분리 관리 |
| **즐겨찾기** | ★ 즐겨찾기 설정 → 우선 정렬 |
| **기본 카테고리** | 타입별 기본값 지정 → 폼에서 자동 선택 |
| **SVG 아이콘** | 카테고리별 아이콘 할당 |
| **순서 변경** | ▲ ▼ 버튼으로 정렬 순서 변경 |

**관련 파일**: `src/components/categories/CategoryManager.tsx`, `src/components/categories/CategoryItem.tsx`, `src/services/category.service.ts`, `src/stores/categoryStore.ts`

---

## 16. 테마 시스템

| 기능 | 설명 |
|------|------|
| **라이트 모드** | 푸른 하늘 + 구름 (sky gradient 배경) |
| **다크 모드** | 밤하늘 + 반짝이는 별 (twinkle 파티클) |
| **시스템 감지** | 초기 로드 시 OS 테마 설정 자동 적용 |
| **수동 전환** | ThemeToggle 버튼으로 전환 |
| **설정 영속** | localStorage에 선택 저장 |
| **글래스모피즘** | 반투명 카드 + backdrop-blur UI |

**관련 파일**: `src/stores/themeStore.ts`, `src/components/layout/ThemeBackground.tsx`, `src/components/common/ThemeToggle.tsx`

---

## 17. 공통 UI 컴포넌트

### 공용 컴포넌트 (`src/components/common/`)

| 컴포넌트 | 설명 |
|----------|------|
| **GlassCard** | 글래스모피즘 카드 (padding, hoverable, className) |
| **Modal** | 모달 다이얼로그 (title, maxWidth, isOpen, onClose) |
| **ConfirmDialog** | 확인/취소 다이얼로그 (isDangerous 위험 강조) |
| **LoadingSpinner** | 로딩 스피너 |
| **EmptyState** | 빈 상태 UI (아이콘, 제목, 설명, 액션 버튼) |
| **ThemeToggle** | 다크/라이트 모드 토글 버튼 |
| **ProtectedRoute** | 인증 필요 라우트 래퍼 |

### 레이아웃 (`src/components/layout/`)

| 컴포넌트 | 설명 |
|----------|------|
| **AppShell** | 메인 레이아웃 (헤더 + 사이드바 + 하단 탭 + 본문) |
| **Header** | 상단 헤더 (로고, 테마 토글, 사이드바 토글) |
| **Sidebar** | 좌측 네비게이션 (데스크탑) |
| **MobileSidebar** | 모바일 드로어 네비게이션 |
| **BottomNav** | 하단 탭 네비게이션 (순서 커스터마이징) |
| **ThemeBackground** | 테마 배경 (gradient + 파티클 애니메이션) |

### 아이콘 (`src/components/icons/`)

| 컴포넌트 | 설명 |
|----------|------|
| **NavIcons** | 네비게이션 SVG 아이콘 (30개+) |
| **UIIcons** | 범용 UI SVG 아이콘 (20개+) |
| **CategoryIcons** | 카테고리별 SVG 아이콘 + 렌더 헬퍼 |

---

## 18. 데이터베이스 구조

### Supabase 테이블 (15개)

| 테이블 | 설명 |
|--------|------|
| `vault_user_settings` | 사용자 설정 (주 통화, 탭 순서, 프로필) |
| `vault_accounts` | 통장 정보 |
| `vault_account_balances` | 통화별 잔액 |
| `vault_categories` | 수입/지출 카테고리 |
| `vault_transactions` | 거래내역 |
| `vault_budgets` | 예산 |
| `vault_recurring_payments` | 정기결제 |
| `vault_recurring_overrides` | 정기결제 오버라이드 |
| `vault_savings` | 예/적금 |
| `vault_savings_deposits` | 납입 기록 |
| `vault_transfers` | 이체 레코드 |
| `vault_announcements` | 공지사항 |
| `vault_announcement_comments` | 공지 댓글 |
| `vault_announcement_likes` | 공지 좋아요 |
| `vault_inquiries` | 문의 |

### Edge Functions

| 함수 | 설명 |
|------|------|
| `delete-account` | 회원 탈퇴 (JWT 검증 → Service Role로 Auth 삭제 → CASCADE) |

### RLS (Row Level Security)

- 모든 vault_* 테이블에 사용자별 데이터 격리 정책 적용
- `auth.uid() = user_id` 기반 SELECT/INSERT/UPDATE/DELETE 제한
- 공지사항: 모든 인증 사용자 읽기 가능, leader/member만 쓰기 가능

### SQL 마이그레이션

| 파일 | 설명 |
|------|------|
| `001_initial_schema.sql` | 15개 테이블 + 인덱스 생성 |
| `002_rls_policies.sql` | RLS 정책 설정 |
| `003_announcements_soft_delete.sql` | 공지사항 소프트 삭제 컬럼 추가 |
| `004_admin_and_category_cleanup.sql` | 관리자 권한 + 카테고리 정리 |

---

## 19. 보안

### v1.1.1 보안 패치

| 항목 | 조치 |
|------|------|
| **파일 업로드** | MIME 화이트리스트 (JPEG/PNG/WebP/GIF), 5MB 크기 제한, 확장자를 MIME에서 추출 |
| **CORS** | Edge Function `Access-Control-Allow-Origin: *` → Origin 기반 검증 |
| **CSP** | Content-Security-Policy 메타 태그 추가 (script/style/connect/frame 제한) |
| **Open Redirect** | 로그인 리다이렉트 경로 검증 (`/`로 시작 + `//` 차단) |
| **보안 헤더** | X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| **입력 검증** | 닉네임 30자 제한 + trim, 생년월일 YYYY-MM-DD 정규식 검증 |

### 기본 보안

| 항목 | 조치 |
|------|------|
| **소프트 삭제** | 모든 항목 `deleted_at`으로 소프트 삭제 (복원 가능) |
| **환경변수 분리** | API 키/토큰은 `.env`에 저장, `.gitignore` 적용 |
| **RLS** | 사용자별 데이터 자동 격리 |
| **비밀번호** | 최소 8자 이상, 상수 중앙 관리 (`constants/auth.ts`) |
| **JWT 검증** | Edge Function에서 Supabase Auth로 토큰 검증 |

---

## 20. SEO / Analytics

### SEO

| 항목 | 적용 |
|------|------|
| **메타 태그** | description, keywords, author, theme-color |
| **Open Graph** | og:type, og:title, og:description, og:image, og:locale |
| **Twitter Card** | summary_large_image |
| **JSON-LD** | WebApplication 구조화 데이터 (schema.org) |
| **robots.txt** | 크롤러 접근 규칙 |
| **sitemap.xml** | 사이트맵 |

### Analytics (환경변수로 조건부 활성화)

| 서비스 | 환경변수 |
|--------|----------|
| **Microsoft Clarity** | `VITE_CLARITY_ID` |
| **Google Analytics 4** | `VITE_GA_MEASUREMENT_ID` |
| **Google AdSense** | `VITE_ADSENSE_CLIENT` |

---

## 21. 접근성

| 항목 | 적용 |
|------|------|
| **WCAG 2.1 AA** | 기본 접근성 기준 충족 |
| **한글 최소 14px** | `text-xs` 이상 사용 (10px 금지) |
| **prefers-reduced-motion** | 애니메이션 회피 대응 |
| **ARIA 라벨** | 에러 닫기, 네비게이션, 입력 필드에 aria-label |
| **터치 타겟** | BottomNav/TrashPage 버튼 44px 이상 확보 |
| **시맨틱 HTML** | `<form>`, `<button>`, `<nav>` 등 명시적 사용 |

---

## 22. 성능 최적화

| 항목 | 적용 |
|------|------|
| **Lazy Loading** | 모든 페이지 `React.lazy()` 동적 임포트 |
| **Suspense** | 페이지 로드 중 LoadingSpinner 표시 |
| **코드 분할** | 페이지별 개별 번들 (Vite 자동 chunk) |
| **useMemo** | 복잡한 계산(필터링, 정렬, 집계) 메모이제이션 |
| **Promise.all** | 휴지통 등 복수 쿼리 병렬 실행 |
| **폰트 최적화** | Pretendard dynamic-subset (필요 글리프만 로드) |

---

## 23. 라우팅 맵

| 경로 | 페이지 | 인증 |
|------|--------|------|
| `/login` | 로그인 | - |
| `/register` | 회원가입 | - |
| `/` | 대시보드 | 필요 |
| `/accounts` | 통장 관리 | 필요 |
| `/transactions` | 거래내역 | 필요 |
| `/recurring` | 정기결제 | 필요 |
| `/savings` | 예/적금 | 필요 |
| `/budget` | 예산 | 필요 |
| `/statistics` | 통계 | 필요 |
| `/announcements` | 공지사항 목록 | 필요 |
| `/announcements/:id` | 공지사항 상세 | 필요 |
| `/inquiries` | 문의 | 필요 |
| `/settings` | 설정 메인 | 필요 |
| `/settings/profile` | 프로필 | 필요 |
| `/settings/menu` | 메뉴 설정 | 필요 |
| `/settings/categories` | 카테고리 | 필요 |
| `/settings/preferences` | 환경설정 | 필요 |
| `/trash` | 휴지통 | 필요 |
| `*` | 404 Not Found | - |

---

## 24. 미구현 / 예정 기능

| 기능 | 상태 | 설명 |
|------|------|------|
| 테마 커스터마이징 | 준비 중 | 설정 > 테마 (색상, 폰트 등) |
| 친구/공유 | 준비 중 | 설정 > 친구 (가계부 공유) |
| 크레딧 시스템 | 준비 중 | 설정 > 크레딧 |
| 이자 자동 계산 | 미구현 | 예/적금 만기 시 이자 자동 계산 |
| 알림 시스템 | 미구현 | 정기결제/예산 초과 푸시 알림 |
| 데이터 내보내기 | 미구현 | CSV/Excel 내보내기 |

---

## 상태관리 스토어 요약

| 스토어 | 파일 | 주요 상태 |
|--------|------|----------|
| authStore | `src/stores/authStore.ts` | user, isLoading |
| themeStore | `src/stores/themeStore.ts` | theme (light/dark) |
| uiStore | `src/stores/uiStore.ts` | sidebarOpen, toasts |
| accountStore | `src/stores/accountStore.ts` | accounts, balances, transfers |
| transactionStore | `src/stores/transactionStore.ts` | transactions, period, filters |
| recurringStore | `src/stores/recurringStore.ts` | payments, sortMode, autoRealize |
| savingsStore | `src/stores/savingsStore.ts` | savings, deposits, activeTab |
| budgetStore | `src/stores/budgetStore.ts` | budgets |
| categoryStore | `src/stores/categoryStore.ts` | categories, seedDefaults |
| settingsStore | `src/stores/settingsStore.ts` | settings, tabOrder |

---

*이 문서는 Vault v1.1.1 기준으로 작성되었습니다.*
