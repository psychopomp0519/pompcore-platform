/**
 * @file routes.ts
 * @description 라우트 경로 상수 정의
 * @module constants/routes
 */

/** 앱 내 라우트 경로 */
export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_CALLBACK: '/auth/callback',
  ACCOUNTS: '/accounts',
  TRANSACTIONS: '/transactions',
  RECURRING: '/recurring',
  SAVINGS: '/savings',
  BUDGET: '/budget',
  STATISTICS: '/statistics',
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_MENU: '/settings/menu',
  SETTINGS_CATEGORIES: '/settings/categories',
  SETTINGS_PREFERENCES: '/settings/preferences',
  SETTINGS_THEME: '/settings/theme',
  SETTINGS_CREDITS: '/settings/credits',
  SETTINGS_FRIENDS: '/settings/friends',
  INVITE_ACCEPT: '/invite/:code',
  SHARED_VIEW: '/shared/:ownerId',
  ANNOUNCEMENTS: '/announcements',
  ANNOUNCEMENT_DETAIL: '/announcements/:id',
  INQUIRIES: '/inquiries',
  TRASH: '/trash',
  INVESTMENTS: '/investments',
  INVESTMENT_DETAIL: '/investments/:id',
  REAL_ESTATE: '/real-estate',
  REAL_ESTATE_DETAIL: '/real-estate/:id',
} as const;
