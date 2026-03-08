/**
 * @file @pompcore/ui — Shared design system for the PompCore platform
 * @module @pompcore/ui
 */

// ============================================================
// Components
// ============================================================

export { ErrorBoundary } from './components/ErrorBoundary';
export { ErrorFallback } from './components/ErrorFallback';
export { GlassCard } from './components/GlassCard';
export { Button } from './components/Button';
export { Modal } from './components/Modal';
export { ConfirmDialog } from './components/ConfirmDialog';
export { ThemeToggle } from './components/ThemeToggle';
export { EmptyState } from './components/EmptyState';
export { LoadingSpinner } from './components/LoadingSpinner';
export { PasswordStrengthBar } from './components/PasswordStrengthBar';

// ============================================================
// Stores
// ============================================================

export { useThemeStore } from './stores/themeStore';

// ============================================================
// Hooks
// ============================================================

export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useDeviceType } from './hooks/useMediaQuery';

// ============================================================
// Utils
// ============================================================

export { toUserMessage, getErrorMessage } from './utils/errorMessages';
export { evaluatePassword } from './utils/passwordStrength';
export type { PasswordStrengthLevel, PasswordRuleResult, PasswordStrengthResult } from './utils/passwordStrength';
export { getToday, formatDateKr, getMonthPeriod, getCurrentMonthPeriod, getPrevMonth, getNextMonth, formatShortDate, formatDisplayDate } from './utils/date';
export type { MonthPeriod } from './utils/date';
export { formatCurrency, formatSignedCurrency, CURRENCIES } from './utils/currency';
export type { CurrencyCode } from './utils/currency';
