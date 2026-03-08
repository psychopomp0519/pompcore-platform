# DONE - 완료 내역

## 2026-03-07

### Phase 5: 투자/부동산 관리 + QA

- [x] DB 마이그레이션 (006_investments_real_estate.sql): 6개 테이블 + RLS 정책
  - `vault_investment_portfolios`, `vault_investment_trades`, `vault_investment_price_snapshots`
  - `vault_real_estate`, `vault_real_estate_leases`, `vault_real_estate_expenses`
- [x] 환율 서비스 (src/services/exchangeRate.service.ts): frankfurter.app, 1시간 캐시
- [x] 환율 훅 (src/hooks/useExchangeRates.ts): convert 함수, graceful fallback
- [x] 투자 타입 (src/types/investment.types.ts): Portfolio, InvestmentTrade, PriceSnapshot, Holding, HoldingWithPnL, PortfolioSummary
- [x] 투자 계산기 (src/utils/investmentCalculator.ts): 평균단가, 실현/미실현 손익, 수익률
- [x] 투자 서비스 (src/services/investment.service.ts): 포트폴리오/거래/스냅샷 CRUD
- [x] 투자 스토어 (src/stores/investmentStore.ts): Zustand 5
- [x] 투자 컴포넌트: PortfolioCard, PortfolioForm, TradeForm, HoldingsTable, TradeHistory
- [x] 투자 페이지: InvestmentsPage (`/investments`), InvestmentDetailPage (`/investments/:id`)
- [x] 부동산 타입 (src/types/realEstate.types.ts): RealEstate, RealEstateLease, RealEstateExpense, RealEstateSummary
- [x] 부동산 계산기 (src/utils/realEstateCalculator.ts): 수익률, D-day, 비용 집계
- [x] 부동산 서비스 (src/services/realEstate.service.ts): 물건/계약/비용 CRUD, 배치 쿼리
- [x] 부동산 스토어 (src/stores/realEstateStore.ts): Zustand 5
- [x] 부동산 컴포넌트: PropertyCard, PropertyForm, LeaseCard, LeaseForm, ExpenseList, ExpenseForm
- [x] 부동산 페이지: RealEstatePage (`/real-estate`), RealEstateDetailPage (`/real-estate/:id`)
- [x] 사이드바 신규 메뉴: 투자(IconInvestment), 부동산(IconRealEstate)
- [x] Web Interface Guidelines 적용: focus-visible, tabular-nums, motion-reduce, semantic button
- [x] 대시보드 개선: 통화 순서 통일, KRW 환산 합계 표시
- [x] 통계 개선: 다중 통화 통합 뷰 (주 통화 환산)
- [x] 로고 크기 조정 (Header h-5, Sidebar h-6)
- [x] 8단계 QA 검증: tsc 0 에러, ESLint 0 에러/경고
  - DashboardPage.tsx: JSX Fragment 누락 수정
  - useExchangeRates.ts: react-hooks/set-state-in-effect 규칙 준수 (cleanup 패턴)

## 2026-03-06

### Phase 4.2: SEO / Analytics

- [x] robots.txt (public/robots.txt: 전체 허용 + sitemap 링크)
- [x] sitemap.xml (public/sitemap.xml: 공개 페이지 3개)
- [x] SEO 메타 태그 (description, keywords, author, theme-color, Open Graph, Twitter Card)
- [x] JSON-LD 구조화 데이터 (WebApplication 스키마)
- [x] Microsoft Clarity 스크립트 (환경변수 VITE_CLARITY_ID 기반, 미설정 시 비활성)
- [x] Google AdSense 스크립트 (환경변수 VITE_ADSENSE_CLIENT 기반, 미설정 시 비활성)
- [x] .env.example 업데이트 (VITE_CLARITY_ID, VITE_ADSENSE_CLIENT 추가)

### Phase 4.1: 대시보드

- [x] 대시보드 페이지 (DashboardPage.tsx: 정보 중심형)
  - 고정 공지사항 배너
  - 총 자산 카드 (통화별 분리 + 전월 대비 변동)
  - 이번 달 수입/지출 요약
  - 최근 거래내역 5건
  - 다가오는 정기결제 (7일 이내)
  - 퀵 액션 버튼 (거래 추가, 이체, 통계)
- [x] App.tsx에서 PlaceholderPage 완전 제거, DashboardPage 라우트 연결
- [x] Phase 4 빌드 검증: lint 0 에러, tsc + vite build 성공

### Phase 3.4: 휴지통

- [x] 휴지통 서비스 (src/services/trash.service.ts: 소프트 삭제 6개 테이블 통합 조회, 복원, 영구 삭제)
- [x] 휴지통 페이지 (TrashPage.tsx: 타입별 필터, 복원/영구삭제 버튼)

### Phase 3.3: 문의

- [x] 문의 타입 정의 (src/types/inquiry.types.ts: Inquiry, InquiryFormData, 상태/평가 라벨)
- [x] 문의 서비스 (src/services/inquiry.service.ts: CRUD, 스크린샷 업로드, 답변, 평가)
- [x] 문의 페이지 (InquiriesPage.tsx: 목록, 등록 모달, 답변 모달, 상세 보기, 평가)

### Phase 3.2: 공지사항

- [x] 공지사항 타입 정의 (src/types/announcement.types.ts: Announcement, AnnouncementComment)
- [x] 공지사항 서비스 (src/services/announcement.service.ts: CRUD, 댓글, 좋아요 토글)
- [x] 공지사항 목록 페이지 (AnnouncementsPage.tsx: 고정 배지, 관리자 작성/수정/삭제)
- [x] 공지사항 상세 페이지 (AnnouncementDetailPage.tsx: 본문, 댓글, 좋아요)

### Phase 3.1: 설정

- [x] 설정 타입 정의 (src/types/settings.types.ts: UserSettings, ProfileFormData, PreferencesFormData)
- [x] 설정 서비스 (src/services/settings.service.ts: 프로필/환경설정/탭순서/비밀번호/탈퇴)
- [x] 설정 스토어 (src/stores/settingsStore.ts)
- [x] 설정 메인 페이지 (SettingsPage.tsx: 메뉴 허브, 준비 중 플레이스홀더)
- [x] 프로필 페이지 (SettingsProfilePage.tsx: 닉네임, 생년월일, 비밀번호, 로그아웃, 탈퇴)
- [x] 메뉴 설정 페이지 (SettingsMenuPage.tsx: 하단 탭 4개 선택, 미리보기)
- [x] 환경설정 페이지 (SettingsPreferencesPage.tsx: 주 통화, 정기결제 평균 단위)
- [x] Phase 3 빌드 검증: lint 0 에러, tsc + vite build 성공

### Phase 2.3: 통계

- [x] Nivo 차트 라이브러리 설치 (@nivo/core, @nivo/bar, @nivo/line, @nivo/pie)
- [x] 통계 서비스 (src/services/statistics.service.ts: 기간별 거래, 잔액, 카테고리 맵 조회)
- [x] 월별 수입/지출 막대 차트 (IncomeExpenseChart.tsx)
- [x] 총 자산 변동 추이 라인 차트 (AssetTrendChart.tsx)
- [x] 카테고리별 지출 도넛 차트 (CategoryBreakdownChart.tsx)
- [x] 통장별 자산 분포 차트 (AccountDistributionChart.tsx)
- [x] 통계 페이지 (StatisticsPage.tsx: 기간 선택, 통화 필터)
- [x] Phase 2.3 빌드 검증: lint 0 에러, tsc + vite build 성공

### Phase 2.2: 예산

- [x] 예산 타입 정의 (src/types/budget.types.ts: Budget, BudgetFormData, BUDGET_TYPE_LABELS)
- [x] 예산 서비스 (src/services/budget.service.ts: CRUD, 금액 수정)
- [x] 예산 스토어 (src/stores/budgetStore.ts)
- [x] 예산 컴포넌트 (BudgetCard.tsx: 진행률 바, BudgetForm.tsx: 가상/실제 타입 선택)
- [x] 예산 페이지 (BudgetPage.tsx: 통화별 요약, 금액 수정 모달)

### Phase 2.1: 예/적금

- [x] 이자 계산 유틸리티 (src/utils/interestCalculator.ts: 단리/복리/가변납입, 세금 15.4%)
- [x] 예/적금 타입 정의 (src/types/savings.types.ts: Savings, SavingsDeposit, 4가지 타입)
- [x] 예/적금 서비스 (src/services/savings.service.ts: CRUD, 납입 추가/삭제)
- [x] 예/적금 스토어 (src/stores/savingsStore.ts: 탭 관리, 납입 후 리로드)
- [x] 예/적금 컴포넌트 (SavingsCard.tsx: 이자 계산 표시, SavingsForm.tsx: 타입별 조건부 필드)
- [x] 예/적금 페이지 (SavingsPage.tsx: 4개 탭, 납입 모달)
- [x] Phase 2 빌드 검증: lint 0 에러, tsc + vite build 성공

### Phase 0: 기반 인프라

- [x] Phase 0.1: 디렉토리 구조 생성 (components, pages, stores, hooks, utils, constants, config)
- [x] Phase 0.1: Config 모듈 생성 (src/config/appConfig.ts)
- [x] Phase 0.1: 상수 파일 생성 (routes, currencies, categories, intervals)
- [x] Phase 0.1: Supabase 클라이언트를 config 모듈 기반으로 리팩토링
- [x] Phase 0.2: ErrorBoundary 컴포넌트 구현 (ErrorBoundary.tsx + ErrorFallback.tsx)
- [x] Phase 0.3: 라우팅 설정 (react-router-dom, ProtectedRoute, lazy-loading)
- [x] Phase 0.4: 다크모드 + UI 스토어 (uiStore.ts, useMediaQuery.ts)
- [x] Phase 0.5: 레이아웃 시스템 (AppShell, Sidebar, MobileSidebar, BottomNav, Header)
- [x] Phase 0.6: ThemeBackground (하늘+구름, 밤하늘+별, 시드 기반 순수 랜덤)
- [x] Phase 0.7: 인증 시스템 (auth.service.ts, authStore.ts, useAuthInit.ts, LoginPage, RegisterPage)
- [x] Phase 0.8: 공통 컴포넌트 (GlassCard, Modal, ConfirmDialog, LoadingSpinner, EmptyState)
- [x] Phase 0 빌드 검증: lint 0 에러, tsc + vite build 성공

### Phase 1.5: 정기결제

- [x] 정기결제 타입 정의 (src/types/recurring.types.ts)
- [x] 정기결제 서비스 (src/services/recurring.service.ts: CRUD, 자동 실현)
- [x] 정기결제 스토어 (src/stores/recurringStore.ts)
- [x] 정기결제 컴포넌트 (RecurringCard, RecurringForm)
- [x] 정기결제 페이지 (RecurringPage.tsx, 정렬 3종, 평균 단위 전환)

### Phase 1.4: 거래내역

- [x] 거래내역 타입 정의 (src/types/transaction.types.ts)
- [x] 거래내역 서비스 (src/services/transaction.service.ts: CRUD, 일괄 생성)
- [x] 거래내역 스토어 (src/stores/transactionStore.ts: 월별 탐색, 필터)
- [x] 거래내역 컴포넌트 (TransactionForm, TransactionList, PeriodNavigator)
- [x] 거래내역 페이지 (TransactionsPage.tsx, 수입/지출 요약)
- [x] 날짜 유틸리티 (src/utils/date.ts)

### Phase 1.3: 정기결제 계산 유틸리티

- [x] 발생일 계산 (addInterval: 월말/윤년 자동 보정)
- [x] 범위 내 발생일 목록 (calculateOccurrences)
- [x] 미실현 건 조회 (getUnrealizedOccurrences)
- [x] 평균 금액 계산 (getDailyAverage, getAverageByPeriod)
- [x] 다음 발생일 + 남은 일수 (getNextOccurrence, getDaysUntilNext)

### Phase 1.2: 통장

- [x] 통장 타입 정의 (src/types/account.types.ts: Account, AccountBalance, TransferFormData)
- [x] 통장 서비스 (src/services/account.service.ts: CRUD, 이체, 잔액 관리)
- [x] 통장 스토어 (src/stores/accountStore.ts: Zustand, 낙관적 업데이트)
- [x] 통장 컴포넌트 (AccountCard, AccountForm, TransferDialog, BalanceEditDialog)
- [x] 통장 페이지 (AccountsPage.tsx, /accounts 라우트)
- [x] 통화 유틸리티 (src/utils/currency.ts: formatCurrency, formatSignedCurrency)
- [x] Phase 1.2 빌드 검증: lint 0 에러, tsc + vite build 성공

### Phase 1.1: 카테고리 관리

- [x] 카테고리 타입 정의 (src/types/category.types.ts: Category, CategoryFormData, mapDbToCategory)
- [x] 카테고리 서비스 (src/services/category.service.ts: CRUD, 즐겨찾기, 기본 설정, 순서 변경, 시드)
- [x] 카테고리 스토어 (src/stores/categoryStore.ts: Zustand, 낙관적 업데이트)
- [x] 카테고리 컴포넌트 (CategoryForm, CategoryItem, CategoryManager)
- [x] 시드 초기화 훅 (src/hooks/useCategoryInit.ts: 첫 로그인 시 기본 카테고리 생성)
- [x] 설정 > 카테고리 페이지 (SettingsCategoriesPage.tsx, /settings/categories 라우트)
- [x] Phase 1.1 빌드 검증: lint 0 에러, tsc + vite build 성공

### Phase 0.5: DB 스키마

- [x] Supabase 테이블 설계 (15개 테이블: vault_user_settings, vault_accounts, vault_account_balances, vault_categories, vault_transactions, vault_transfers, vault_recurring_payments, vault_recurring_overrides, vault_savings, vault_savings_deposits, vault_budgets, vault_announcements, vault_announcement_comments, vault_announcement_likes, vault_inquiries)
- [x] 인덱스 설정 (user_id 기반 + deleted_at IS NULL 부분 인덱스)
- [x] RLS 정책 설정 (사용자 데이터: user_id 기반, 공지: 인증 사용자 전체 읽기, 문의: 본인+관리자)
- [x] TypeScript DB 타입 정의 (Insert/Update 파생 타입 포함)

### 프로젝트 부트스트랩

- [x] 프로젝트 부트스트랩 (Vite React-TS 템플릿)
- [x] 추가 의존성 설치 (supabase, zustand, react-router-dom, tailwind)
- [x] Tailwind CSS 설정 (tailwind.config.ts, postcss.config.js)
- [x] 환경변수 설정 (.env, .env.example)
- [x] Supabase 클라이언트 초기화 (src/services/supabase.ts)
- [x] 인증 타입 정의 (src/types/auth.types.ts)
- [x] Claude 커스텀 스킬 6개 생성 (.claude/skills/)
- [x] CLAUDE.md 작성
- [x] docs/ 구조 초기화
- [x] Pretendard + Nunito 폰트 CDN 설정
- [x] .vscode/settings.json + extensions.json 최적화
- [x] .gitignore 업데이트 (.env, .vscode 설정 포함)
