/**
 * @file App.tsx
 * @description 앱 루트 컴포넌트 - 라우팅 설정
 * @module App
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { useAuthInit } from './hooks/useAuthInit';
import { useCategoryInit } from './hooks/useCategoryInit';

// ============================================================
// 페이지 lazy-load
// ============================================================

const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const SettingsCategoriesPage = lazy(() =>
  import('./pages/SettingsCategoriesPage').then((m) => ({ default: m.SettingsCategoriesPage })),
);
const AccountsPage = lazy(() =>
  import('./pages/AccountsPage').then((m) => ({ default: m.AccountsPage })),
);
const TransactionsPage = lazy(() =>
  import('./pages/TransactionsPage').then((m) => ({ default: m.TransactionsPage })),
);
const RecurringPage = lazy(() =>
  import('./pages/RecurringPage').then((m) => ({ default: m.RecurringPage })),
);
const SavingsPage = lazy(() =>
  import('./pages/SavingsPage').then((m) => ({ default: m.SavingsPage })),
);
const BudgetPage = lazy(() =>
  import('./pages/BudgetPage').then((m) => ({ default: m.BudgetPage })),
);
const StatisticsPage = lazy(() =>
  import('./pages/StatisticsPage').then((m) => ({ default: m.StatisticsPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const SettingsProfilePage = lazy(() =>
  import('./pages/SettingsProfilePage').then((m) => ({ default: m.SettingsProfilePage })),
);
const SettingsMenuPage = lazy(() =>
  import('./pages/SettingsMenuPage').then((m) => ({ default: m.SettingsMenuPage })),
);
const SettingsPreferencesPage = lazy(() =>
  import('./pages/SettingsPreferencesPage').then((m) => ({ default: m.SettingsPreferencesPage })),
);
const AnnouncementsPage = lazy(() =>
  import('./pages/AnnouncementsPage').then((m) => ({ default: m.AnnouncementsPage })),
);
const AnnouncementDetailPage = lazy(() =>
  import('./pages/AnnouncementDetailPage').then((m) => ({ default: m.AnnouncementDetailPage })),
);
const InquiriesPage = lazy(() =>
  import('./pages/InquiriesPage').then((m) => ({ default: m.InquiriesPage })),
);
const TrashPage = lazy(() =>
  import('./pages/TrashPage').then((m) => ({ default: m.TrashPage })),
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const InvestmentsPage = lazy(() =>
  import('./pages/InvestmentsPage').then((m) => ({ default: m.InvestmentsPage })),
);
const InvestmentDetailPage = lazy(() =>
  import('./pages/InvestmentDetailPage').then((m) => ({ default: m.InvestmentDetailPage })),
);
const RealEstatePage = lazy(() =>
  import('./pages/RealEstatePage').then((m) => ({ default: m.RealEstatePage })),
);
const RealEstateDetailPage = lazy(() =>
  import('./pages/RealEstateDetailPage').then((m) => ({ default: m.RealEstateDetailPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

// ============================================================
// 로딩 스피너
// ============================================================

function PageLoader(): React.ReactNode {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-vault-color border-t-transparent" />
    </div>
  );
}

// ============================================================
// App 컴포넌트
// ============================================================

/** 앱 루트 - 라우팅 및 전역 프로바이더 */
export function App(): React.ReactNode {
  useAuthInit();
  useCategoryInit();

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 공개 라우트 */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* 인증 필요 라우트 (AppShell 레이아웃 적용) */}
          <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.ACCOUNTS} element={<AccountsPage />} />
            <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
            <Route path={ROUTES.RECURRING} element={<RecurringPage />} />
            <Route path={ROUTES.SAVINGS} element={<SavingsPage />} />
            <Route path={ROUTES.BUDGET} element={<BudgetPage />} />
            <Route path={ROUTES.STATISTICS} element={<StatisticsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.SETTINGS_PROFILE} element={<SettingsProfilePage />} />
            <Route path={ROUTES.SETTINGS_MENU} element={<SettingsMenuPage />} />
            <Route path={ROUTES.SETTINGS_CATEGORIES} element={<SettingsCategoriesPage />} />
            <Route path={ROUTES.SETTINGS_PREFERENCES} element={<SettingsPreferencesPage />} />
            <Route path={ROUTES.ANNOUNCEMENTS} element={<AnnouncementsPage />} />
            <Route path={ROUTES.ANNOUNCEMENT_DETAIL} element={<AnnouncementDetailPage />} />
            <Route path={ROUTES.INQUIRIES} element={<InquiriesPage />} />
            <Route path={ROUTES.INVESTMENTS} element={<InvestmentsPage />} />
            <Route path={ROUTES.INVESTMENT_DETAIL} element={<InvestmentDetailPage />} />
            <Route path={ROUTES.REAL_ESTATE} element={<RealEstatePage />} />
            <Route path={ROUTES.REAL_ESTATE_DETAIL} element={<RealEstateDetailPage />} />
            <Route path={ROUTES.TRASH} element={<TrashPage />} />
          </Route>
          </Route>

          {/* 404 catch-all (인증 불필요) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
