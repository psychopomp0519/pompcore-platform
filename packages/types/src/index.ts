/**
 * @file @pompcore/types — Shared type definitions for the PompCore platform
 * @module @pompcore/types
 */

export type { UserRole, UserProfile, LoginRequest, RegisterRequest, AuthState, Permission } from './auth.types';
export { VALID_ROLES } from './auth.types';
export { mapUserToProfile } from './profile';
export type { SupabaseUserLike } from './profile';
export { ROLE_LABELS, ROLE_PERMISSIONS, hasPermission } from './roles';
export type { ProjectStatus, ProjectCategory, Project } from './project.types';
export type { ApiResponse, PaginatedResult } from './common.types';
export type {
  ServiceStatus, SubscriptionTier, ServiceRateLimit, ServiceQuotas,
  ServiceFeatures, ServiceConfig, Service, ServiceSubscription,
  PlatformEvent, UsageCounters, ServiceUsage,
} from './service.types';

// ── Vault DB entity types ──────────────────────────────────
export type {
  DbUserSettings, DbUserSettingsInsert, DbUserSettingsUpdate,
  DbAccount, DbAccountInsert, DbAccountUpdate,
  DbAccountBalance, DbAccountBalanceInsert, DbAccountBalanceUpdate,
  DbCategory, DbCategoryInsert, DbCategoryUpdate,
  DbTransaction, DbTransactionInsert, DbTransactionUpdate,
  DbTransfer, DbTransferInsert,
  DbRecurringPayment, DbRecurringPaymentInsert, DbRecurringPaymentUpdate,
  DbRecurringOverride, DbRecurringOverrideInsert,
  DbSavings, DbSavingsInsert, DbSavingsUpdate,
  DbSavingsDeposit, DbSavingsDepositInsert,
  DbBudget, DbBudgetInsert, DbBudgetUpdate,
  DbAnnouncement, DbAnnouncementInsert, DbAnnouncementUpdate,
  DbAnnouncementComment, DbAnnouncementCommentInsert,
  DbAnnouncementLike,
  DbInquiry, DbInquiryInsert, DbInquiryUpdate,
  DbInvestmentPortfolio, DbInvestmentPortfolioInsert, DbInvestmentPortfolioUpdate,
  DbInvestmentTrade, DbInvestmentTradeInsert, DbInvestmentTradeUpdate,
  DbInvestmentPriceSnapshot,
  DbRealEstate, DbRealEstateInsert, DbRealEstateUpdate,
  DbRealEstateLease, DbRealEstateLeaseInsert, DbRealEstateLeaseUpdate,
  DbRealEstateExpense, DbRealEstateExpenseInsert,
  TransactionSourceType, BudgetAction, DbIntervalUnit, SavingsType, BudgetType,
  AssetType, TradeType, PropertyType, RealEstateRole, LeaseType, ExpenseType,
  CreateAccountInput, CreateTransactionInput, TransactionFilters,
} from './vault.types';
