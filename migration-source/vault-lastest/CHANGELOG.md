# Changelog

모든 주요 변경사항을 이 파일에 기록합니다.
형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 기반,
버전 관리는 [Semantic Versioning](https://semver.org/lang/ko/) 을 따릅니다.

## [1.1.1] - 2026-03-07

### Security
- 파일 업로드 MIME 타입 화이트리스트 검증 추가 (JPEG/PNG/WebP/GIF만 허용)
- 파일 업로드 크기 제한 추가 (5MB)
- 파일 확장자를 MIME 타입에서 안전하게 추출 (파일명 조작 방지)
- Edge Function CORS 와일드카드(`*`) 제거, Origin 기반 검증으로 변경
- Content-Security-Policy(CSP) 메타 태그 추가 (XSS 방어)
- 로그인 리다이렉트 경로 검증 추가 (Open Redirect 방지)
- Vite 개발 서버 보안 헤더 추가 (X-Content-Type-Options, X-Frame-Options 등)
- 프로필 입력값 검증 강화 (닉네임 길이 제한, 생년월일 형식 검증)

## [1.1.0] - 2026-03-07

### Added
- 거래내역 수입/지출 필터 UI (TransactionsPage)
- 미래 거래 투명도 스타일링 (TransactionList opacity-50)
- 카테고리 순서 변경 UI - 위/아래 이동 버튼 (CategoryItem, CategoryManager)
- 정기결제 오름차순/내림차순 정렬 토글 버튼 (RecurringPage)
- 문의 폼 안내 텍스트 "자세한 내용을 적어줄수록 정확한 답변을 드릴 수 있습니다"
- 공지사항 고정 최대 3개 검증 (AnnouncementsPage)
- TransactionForm/RecurringForm `primaryCurrency` prop (통화 fallback 지원)
- 폼 생성 시 기본 카테고리 자동 선택 (TransactionForm, RecurringForm)

### Changed
- RecurringForm 이름 필드 선택적으로 변경 (생략 시 수입/지출 기본값)
- TransferDialog 통장 목록 즐겨찾기 우선 정렬 + ★ 표시
- SavingsForm 연결 통장 목록 즐겨찾기 우선 정렬 + ★ 표시
- RecurringPage next_date 정렬 로직 수정 (기존 return 0 → getDaysUntilNext 사용)

## [1.0.0] - 2026-03-06

### Added

**Phase 0: 기반 인프라**
- 디렉토리 구조 + Config 모듈 (appConfig.ts)
- ErrorBoundary + 폴백 UI
- 라우팅 설정 (react-router-dom 7, ProtectedRoute, lazy-loading)
- 다크모드 + UI 스토어 (Zustand 5)
- 레이아웃 시스템 (AppShell, Sidebar, MobileSidebar, BottomNav, Header)
- ThemeBackground (Nebula 테마: 하늘+구름, 밤하늘+별)
- 인증 (Email/PW + Google OAuth, Supabase Auth)
- 공통 컴포넌트 (GlassCard, Modal, ConfirmDialog, LoadingSpinner, EmptyState)

**Phase 0.5: DB 스키마**
- Supabase 15개 테이블 설계 (001_initial_schema.sql)
- RLS 정책 설정 (002_rls_policies.sql)
- TypeScript DB 타입 정의

**Phase 1: 핵심 기능**
- 카테고리 관리 (CRUD, 즐겨찾기, 기본 카테고리, 시드 데이터)
- 통장 (CRUD, 이체, 다중 통화 잔액)
- 거래내역 (CRUD, 월별 조회, 필터, 수입/지출 요약)
- 정기결제 (CRUD, 클라이언트 자동 실현, 정렬 3종)
- 정기결제 계산 유틸리티 (월말/윤년 처리, override 지원)

**Phase 2: 확장 기능**
- 예/적금 (예금, 적금, 자유적금, 청약 / 이자 계산)
- 예산 (하이브리드: 가상/실제, 진행률 바)
- 통계 (Nivo 차트 4종: 막대, 라인, 도넛 x2)

**Phase 3: 소셜/관리**
- 설정 (프로필, 메뉴 커스터마이징, 환경설정, 비밀번호 변경, 회원 탈퇴)
- 공지사항 (CRUD, 댓글, 좋아요, 고정)
- 문의 (등록, 스크린샷 첨부, 관리자 답변, 평가)
- 휴지통 (6개 테이블 통합 조회, 복원, 영구 삭제)

**Phase 4: 마무리**
- 대시보드 (총자산, 수입/지출, 최근 거래, 다가오는 결제, 퀵 액션)
- SEO (robots.txt, sitemap.xml, Open Graph, Twitter Card, JSON-LD)
- Analytics (Microsoft Clarity, Google AdSense / 환경변수 기반 조건부 로딩)

### Security
- MIN_PASSWORD_LENGTH 통일 (8자)
- 비밀번호 상수를 constants/auth.ts로 중앙 관리

### Performance
- 휴지통 쿼리 Promise.all 병렬화

### Accessibility
- 에러 닫기 버튼 aria-label 추가
- nav 요소 aria-label 추가 (BottomNav, Sidebar, MobileSidebar)
- 댓글/답변 입력 필드 aria-label 추가
- BottomNav/TrashPage 터치 타겟 44px 확보
- text-[10px] -> text-xs 변경 (한글 최소 크기 준수)
