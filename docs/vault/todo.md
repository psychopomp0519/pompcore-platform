# TODO - 미구현 항목

## Phase 0: 기반 인프라 (완료)

- [x] 디렉토리 구조 + Config 모듈
- [x] ErrorBoundary 컴포넌트
- [x] 라우팅 설정 + ProtectedRoute
- [x] 다크모드 + UI 스토어 (Zustand)
- [x] 레이아웃 시스템 (AppShell, Sidebar, BottomNav, Header)
- [x] ThemeBackground (하늘/별 배경)
- [x] 인증 (서비스, 스토어, 로그인/회원가입 페이지)
- [x] 공통 컴포넌트 (GlassCard, Modal, ConfirmDialog, LoadingSpinner, EmptyState)

## Phase 0.5: DB 스키마 (완료)

- [x] Supabase 테이블 설계 및 생성 (15개 테이블, 001_initial_schema.sql)
- [x] RLS 정책 설정 (002_rls_policies.sql)
- [x] TypeScript DB 타입 정의 (src/types/database.types.ts)

## Phase 1: 핵심 기능 (완료)

- [x] 카테고리 관리 (CRUD, 즐겨찾기, 시드 데이터)
- [x] 통장 (CRUD, 이체, 다중 통화)
- [x] 정기결제 계산 유틸리티
- [x] 거래내역 (CRUD, 필터, 월별 조회)
- [x] 정기결제 (CRUD, 정렬, 자동 실현)

## Phase 2: 확장 기능 (완료)

- [x] 예/적금 (예금, 적금, 자유적금, 청약)
- [x] 예산 (하이브리드 모델: 가상/실제)
- [x] 통계 (Nivo 차트 4종)

## Phase 3: 소셜/관리 (완료)

- [x] 설정 (프로필, 메뉴 커스터마이징, 환경설정, 비밀번호 변경, 회원 탈퇴)
- [x] 공지사항 (CRUD, 댓글, 좋아요, 고정)
- [x] 문의 (등록, 스크린샷 첨부, 관리자 답변, 평가)
- [x] 휴지통 (통합 조회, 타입별 필터, 복원, 영구 삭제)

## Phase 4: 마무리 (완료)

- [x] 대시보드 (정보 중심형)
- [x] SEO / Analytics (sitemap, Clarity, AdSense)

## Phase 5: 투자/부동산 (완료)

- [x] 투자 포트폴리오 관리 (`/investments`)
- [x] 투자 상세 페이지 (`/investments/:id`)
- [x] 부동산 관리 (`/real-estate`)
- [x] 부동산 상세 페이지 (`/real-estate/:id`)
- [x] 국내/해외/암호화폐 자산 유형 지원
- [x] 소유자/임차인 관점 통합 부동산 관리
- [x] 무료 환율 API (frankfurter.app)
- [x] 다중 통화 통계 통합 뷰
- [x] 계산 유틸리티 (investmentCalculator, realEstateCalculator)
- [x] Supabase 마이그레이션 (006_investments_real_estate.sql)

## 미래 과제

- [x] 테스트 프레임워크 도입 (Vitest 4, 178개 테스트, 2026-03-12 완료)
- [x] 투자/부동산 대시보드 총 자산 통합 (2026-03-12 완료)
- [x] 휴지통에서 투자/부동산 항목 복원 지원 (이미 구현됨, 2026-03-12 확인)
- [ ] 서비스명 확정
- [ ] 로고 생성
