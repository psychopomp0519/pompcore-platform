# 시스템 구조

## 기술 아키텍처

```
[Client: React 19 SPA]
  |
  +-- Vite 7 (빌드/개발 서버)
  +-- Tailwind CSS 3 (스타일링)
  +-- Zustand 5 (상태관리)
  +-- react-router-dom 7 (라우팅)
  +-- Nivo (차트/통계)
  |
  +-- [Supabase]
        +-- Auth (Email/PW + Google OAuth)
        +-- Database (PostgreSQL)
        +-- Storage (이미지 업로드)
```

## 디렉토리 구조

```
src/
  config/        - 환경변수/설정 통합 (appConfig.ts)
  constants/     - 라우트, 통화, 카테고리, 간격 상수
  types/         - 타입 정의 (*.types.ts)
  services/      - Supabase 클라이언트, API 서비스
  stores/        - Zustand 스토어
  hooks/         - 커스텀 React 훅
  utils/         - 유틸리티 함수 (날짜, 통화, 이자 계산 등)
  components/
    common/      - 공통 UI (ErrorBoundary, Modal, GlassCard 등)
    layout/      - 레이아웃 (AppShell, Sidebar, BottomNav, Header)
    accounts/    - 통장 관련
    transactions/- 거래내역 관련
    recurring/   - 정기결제 관련
    savings/     - 예/적금 관련
    budget/      - 예산 관련
    statistics/  - 통계 차트 관련
    categories/  - 카테고리 관리
    announcements/- 공지사항
    inquiries/   - 문의
    trash/       - 휴지통
    settings/    - 설정
  pages/         - 라우트별 페이지 (lazy-loaded)
```

## 인증 구조

- Supabase Auth 사용
- 역할: `leader` (팀장) / `member` (팀원) / `user` (사용자)
- 역할 저장: `user_metadata.role`
- PompCore와 동일 Supabase 프로젝트 공유

## DB 설계 원칙

- 소프트 삭제: `deleted_at TIMESTAMPTZ` (NULL=활성, 값=삭제) → 휴지통 지원
- 다중 통화: `vault_account_balances` 별도 테이블로 통장별 통화 잔액 관리
- 정기결제: 미래 건은 DB 미저장, 클라이언트 계산 → 과거 미실현 건만 DB 반영
- 이체: 2개 거래내역 + 1개 이체 레코드, `transfer_pair_id`로 연결
- RLS: 모든 테이블에 `user_id = auth.uid()` 정책

## 디자인 시스템

- Nebula 테마 (Genshin Impact 영감)
- 라이트: 하늘 + 구름 그라데이션
- 다크: 밤하늘 + 별 파티클
- 글래스모피즘 카드 스타일

## SEO / Analytics

- **robots.txt**: 전체 허용 + sitemap 링크
- **sitemap.xml**: 공개 페이지 (/, /login, /register)
- **메타 태그**: description, keywords, Open Graph, Twitter Card
- **JSON-LD**: WebApplication 스키마 (GEO 대응)
- **Microsoft Clarity**: 사용자 행동 분석 (환경변수 VITE_CLARITY_ID)
- **Google AdSense**: 수익화 (환경변수 VITE_ADSENSE_CLIENT)

## 페이지 구성 (17개)

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | DashboardPage | 대시보드 (정보 중심형) |
| `/login` | LoginPage | 로그인 |
| `/register` | RegisterPage | 회원가입 |
| `/accounts` | AccountsPage | 통장 관리 |
| `/transactions` | TransactionsPage | 거래내역 |
| `/recurring` | RecurringPage | 정기결제 |
| `/savings` | SavingsPage | 예/적금 |
| `/budget` | BudgetPage | 예산 |
| `/statistics` | StatisticsPage | 통계 (Nivo 차트) |
| `/settings` | SettingsPage | 설정 메뉴 |
| `/settings/profile` | SettingsProfilePage | 프로필 |
| `/settings/menu` | SettingsMenuPage | 메뉴 커스터마이징 |
| `/settings/categories` | SettingsCategoriesPage | 카테고리 관리 |
| `/settings/preferences` | SettingsPreferencesPage | 환경설정 |
| `/announcements` | AnnouncementsPage | 공지사항 목록 |
| `/announcements/:id` | AnnouncementDetailPage | 공지사항 상세 |
| `/inquiries` | InquiriesPage | 문의 |
| `/trash` | TrashPage | 휴지통 |
