/**
 * @file database.types.ts
 * @description Supabase DB 테이블에 대응하는 TypeScript 타입 정의
 * @module types/database
 *
 * 원본은 @pompcore/types/vault.types.ts에 정의.
 * 이 파일은 하위 호환을 위해 re-export만 수행한다.
 */

export type {
  DbUserSettings, DbUserSettingsInsert, DbUserSettingsUpdate,
  DbAccount, DbAccountInsert, DbAccountUpdate,
  DbAccountBalance, DbAccountBalanceInsert, DbAccountBalanceUpdate,
  DbCategory, DbCategoryInsert, DbCategoryUpdate,
  DbTransaction, DbTransactionInsert, DbTransactionUpdate,
  TransactionSourceType, BudgetAction,
  DbTransfer, DbTransferInsert,
  DbIntervalUnit,
  DbRecurringPayment, DbRecurringPaymentInsert, DbRecurringPaymentUpdate,
  DbRecurringOverride, DbRecurringOverrideInsert,
  SavingsType,
  DbSavings, DbSavingsInsert, DbSavingsUpdate,
  DbSavingsDeposit, DbSavingsDepositInsert,
  BudgetType,
  DbBudget, DbBudgetInsert, DbBudgetUpdate,
  DbAnnouncement, DbAnnouncementInsert, DbAnnouncementUpdate,
  DbAnnouncementComment, DbAnnouncementCommentInsert,
  DbAnnouncementLike,
  DbInquiry, DbInquiryInsert, DbInquiryUpdate,
  AssetType, TradeType,
  DbInvestmentPortfolio, DbInvestmentPortfolioInsert, DbInvestmentPortfolioUpdate,
  DbInvestmentTrade, DbInvestmentTradeInsert, DbInvestmentTradeUpdate,
  DbInvestmentPriceSnapshot,
  PropertyType, RealEstateRole,
  DbRealEstate, DbRealEstateInsert, DbRealEstateUpdate,
  LeaseType,
  DbRealEstateLease, DbRealEstateLeaseInsert, DbRealEstateLeaseUpdate,
  ExpenseType,
  DbRealEstateExpense, DbRealEstateExpenseInsert,
} from '@pompcore/types';
