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
// Icons — RPG 판타지 테마 (Nebula Design System)
// ============================================================

export type { IconProps } from './components/icons';
export { svgDefaults } from './components/icons';
export { VaultIcon, QuestIcon, AcademyIcon, ForgeIcon, PompCoreIcon } from './components/icons';
export {
  // 방향/네비게이션
  IconArrowUp, IconArrowDown, IconArrowLeft, IconChevronRight,
  // 액션/상태
  IconPlus, IconCheck, IconClose, IconSearch, IconFilter,
  // 커뮤니케이션
  IconBell, IconMegaphone, IconChat,
  // 사용자/계정
  IconUser, IconUsers,
  // 시스템/UI
  IconSettings, IconTrash, IconDocument, IconTag, IconSliders, IconTransfer,
  IconHome, IconPhone, IconDevice, IconPuzzle, IconProtect, IconCelebration, IconWrench,
  IconPalette, IconCode, IconRepeat,
  // 감정/피드백
  IconHeartFilled, IconHeartOutline, IconSparkle,
  // 기타
  IconLink, IconShield, IconKey, IconTarget, IconRocket, IconTrendUp, IconClipboard,
  // 금융/Vault 도메인
  IconCoin, IconBank, IconReceipt, IconGem, IconWallet, IconChart,
  IconUtensils, IconBus, IconCart, IconHouse, IconSmartphone, IconMedical,
  IconFilm, IconBook, IconCoffee, IconGamepad, IconPlane, IconGift,
  IconBanknote, IconPiggyBank, IconInvestment, IconRealEstate,
} from './components/icons';
export { GoogleIcon, GitHubIcon, DiscordIcon } from './components/icons';

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
