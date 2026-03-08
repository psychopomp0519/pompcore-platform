/**
 * @file database.types.ts
 * @description Supabase DB 테이블에 대응하는 TypeScript 타입 정의
 * @module types/database
 */

// ============================================================
// 공통
// ============================================================

/** 소프트 삭제 가능한 테이블의 공통 필드 */
interface SoftDeletable {
  deleted_at: string | null;
}

// ============================================================
// vault_user_settings
// ============================================================

export interface DbUserSettings {
  id: string;
  user_id: string;
  primary_currency: string;
  recurring_avg_period: 'day' | 'week' | 'month' | 'year';
  tab_order: string[];
  display_name: string | null;
  avatar_url: string | null;
  birthday: string | null;
  created_at: string;
  updated_at: string;
}

export type DbUserSettingsInsert = Omit<DbUserSettings, 'id' | 'created_at' | 'updated_at'>;
export type DbUserSettingsUpdate = Partial<Omit<DbUserSettings, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_accounts
// ============================================================

export interface DbAccount extends SoftDeletable {
  id: string;
  user_id: string;
  name: string;
  supported_currencies: string[];
  default_currency: string;
  is_favorite: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type DbAccountInsert = Omit<DbAccount, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>;
export type DbAccountUpdate = Partial<Omit<DbAccount, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_account_balances
// ============================================================

export interface DbAccountBalance {
  id: string;
  account_id: string;
  currency: string;
  balance: number;
  updated_at: string;
}

export type DbAccountBalanceInsert = Omit<DbAccountBalance, 'id' | 'updated_at'>;
export type DbAccountBalanceUpdate = Partial<Pick<DbAccountBalance, 'balance'>>;

// ============================================================
// vault_categories
// ============================================================

export interface DbCategory extends SoftDeletable {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
  is_favorite: boolean;
  is_default: boolean;
  sort_order: number;
  icon: string | null;
  created_at: string;
}

export type DbCategoryInsert = Omit<DbCategory, 'id' | 'deleted_at' | 'created_at'>;
export type DbCategoryUpdate = Partial<Omit<DbCategory, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_transactions
// ============================================================

/** 거래 소스 유형 */
export type TransactionSourceType = 'manual' | 'transfer' | 'recurring' | 'savings';

/** 예산 액션 */
export type BudgetAction = 'deposit' | 'withdraw';

export interface DbTransaction extends SoftDeletable {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  transaction_date: string;
  source_type: TransactionSourceType;
  source_id: string | null;
  transfer_pair_id: string | null;
  budget_id: string | null;
  budget_action: BudgetAction | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export type DbTransactionInsert = Omit<DbTransaction, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>;
export type DbTransactionUpdate = Partial<Omit<DbTransaction, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_transfers
// ============================================================

export interface DbTransfer extends SoftDeletable {
  id: string;
  user_id: string;
  from_account_id: string;
  to_account_id: string;
  from_currency: string;
  to_currency: string;
  from_amount: number;
  to_amount: number;
  transfer_date: string;
  memo: string | null;
  created_at: string;
}

export type DbTransferInsert = Omit<DbTransfer, 'id' | 'deleted_at' | 'created_at'>;

// ============================================================
// vault_recurring_payments
// ============================================================

/** 정기결제 간격 단위 */
export type DbIntervalUnit = 'day' | 'week' | 'month' | 'year';

export interface DbRecurringPayment extends SoftDeletable {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  start_date: string;
  interval_unit: DbIntervalUnit;
  interval_value: number;
  last_generated_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type DbRecurringPaymentInsert = Omit<DbRecurringPayment, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>;
export type DbRecurringPaymentUpdate = Partial<Omit<DbRecurringPayment, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_recurring_overrides
// ============================================================

export interface DbRecurringOverride {
  id: string;
  recurring_id: string;
  occurrence_date: string;
  amount: number | null;
  name: string | null;
  is_skipped: boolean;
}

export type DbRecurringOverrideInsert = Omit<DbRecurringOverride, 'id'>;

// ============================================================
// vault_savings
// ============================================================

/** 예/적금 유형 */
export type SavingsType = 'fixed_deposit' | 'installment' | 'free_savings' | 'housing_subscription';

export interface DbSavings extends SoftDeletable {
  id: string;
  user_id: string;
  linked_account_id: string | null;
  name: string;
  savings_type: SavingsType;
  start_date: string;
  duration_months: number | null;
  interest_rate: number;
  principal: number;
  installment_amount: number | null;
  is_tax_free: boolean;
  created_at: string;
  updated_at: string;
}

export type DbSavingsInsert = Omit<DbSavings, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>;
export type DbSavingsUpdate = Partial<Omit<DbSavings, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_savings_deposits
// ============================================================

export interface DbSavingsDeposit {
  id: string;
  savings_id: string;
  account_id: string | null;
  amount: number;
  deposit_date: string;
  created_at: string;
}

export type DbSavingsDepositInsert = Omit<DbSavingsDeposit, 'id' | 'created_at'>;

// ============================================================
// vault_budgets
// ============================================================

/** 예산 유형 */
export type BudgetType = 'virtual' | 'actual';

export interface DbBudget extends SoftDeletable {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  budget_type: BudgetType;
  linked_account_id: string | null;
  created_at: string;
  updated_at: string;
}

export type DbBudgetInsert = Omit<DbBudget, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>;
export type DbBudgetUpdate = Partial<Omit<DbBudget, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_announcements
// ============================================================

export interface DbAnnouncement {
  id: string;
  author_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  pin_order: number | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export type DbAnnouncementInsert = Omit<DbAnnouncement, 'id' | 'likes_count' | 'created_at' | 'updated_at'>;
export type DbAnnouncementUpdate = Partial<Omit<DbAnnouncement, 'id' | 'author_id' | 'created_at'>>;

// ============================================================
// vault_announcement_comments
// ============================================================

export interface DbAnnouncementComment {
  id: string;
  announcement_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export type DbAnnouncementCommentInsert = Omit<DbAnnouncementComment, 'id' | 'created_at'>;

// ============================================================
// vault_announcement_likes
// ============================================================

export interface DbAnnouncementLike {
  announcement_id: string;
  user_id: string;
  created_at: string;
}

// ============================================================
// vault_inquiries
// ============================================================

export interface DbInquiry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  screenshot_urls: string[] | null;
  status: 'pending' | 'answered';
  admin_response: string | null;
  responded_at: string | null;
  user_rating: 'helpful' | 'not_helpful' | null;
  screenshot_expires_at: string | null;
  created_at: string;
}

export type DbInquiryInsert = Omit<DbInquiry, 'id' | 'status' | 'admin_response' | 'responded_at' | 'user_rating' | 'created_at'>;
export type DbInquiryUpdate = Partial<Pick<DbInquiry, 'admin_response' | 'responded_at' | 'status' | 'user_rating'>>;

// ============================================================
// vault_investment_portfolios
// ============================================================

/** 투자 자산 유형 */
export type AssetType = 'stock_kr' | 'stock_us' | 'crypto' | 'mixed';

/** 거래 유형 */
export type TradeType = 'buy' | 'sell' | 'dividend';

export interface DbInvestmentPortfolio extends SoftDeletable {
  id: string;
  user_id: string;
  name: string;
  broker: string | null;
  asset_type: AssetType;
  base_currency: string;
  linked_account_id: string | null;
  memo: string | null;
  is_favorite: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type DbInvestmentPortfolioInsert = Omit<DbInvestmentPortfolio, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>;
export type DbInvestmentPortfolioUpdate = Partial<Omit<DbInvestmentPortfolio, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_investment_trades
// ============================================================

export interface DbInvestmentTrade extends SoftDeletable {
  id: string;
  user_id: string;
  portfolio_id: string;
  ticker: string;
  asset_name: string;
  trade_type: TradeType;
  quantity: number;
  price: number;
  fee: number;
  trade_date: string;
  currency: string;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export type DbInvestmentTradeInsert = Omit<DbInvestmentTrade, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>;
export type DbInvestmentTradeUpdate = Partial<Omit<DbInvestmentTrade, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_investment_price_snapshots
// ============================================================

export interface DbInvestmentPriceSnapshot {
  portfolio_id: string;
  ticker: string;
  current_price: number;
  currency: string;
  updated_at: string;
}

// ============================================================
// vault_real_estate
// ============================================================

/** 부동산 유형 */
export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land' | 'other';

/** 소유자 or 임차인 관점 */
export type RealEstateRole = 'owner' | 'tenant';

export interface DbRealEstate extends SoftDeletable {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  property_type: PropertyType;
  role: RealEstateRole;
  acquisition_date: string | null;
  acquisition_price: number | null;
  current_value: number | null;
  currency: string;
  linked_account_id: string | null;
  memo: string | null;
  is_favorite: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type DbRealEstateInsert = Omit<DbRealEstate, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>;
export type DbRealEstateUpdate = Partial<Omit<DbRealEstate, 'id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_real_estate_leases
// ============================================================

/** 임대·임차 계약 유형 */
export type LeaseType = 'jeonse' | 'monthly' | 'commercial';

export interface DbRealEstateLease {
  id: string;
  real_estate_id: string;
  user_id: string;
  lease_type: LeaseType;
  counterpart_name: string | null;
  deposit: number;
  monthly_rent: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export type DbRealEstateLeaseInsert = Omit<DbRealEstateLease, 'id' | 'created_at' | 'updated_at'>;
export type DbRealEstateLeaseUpdate = Partial<Omit<DbRealEstateLease, 'id' | 'real_estate_id' | 'user_id' | 'created_at'>>;

// ============================================================
// vault_real_estate_expenses
// ============================================================

/** 부동산 비용 유형 */
export type ExpenseType = 'maintenance' | 'tax' | 'repair' | 'insurance' | 'loan_interest' | 'other';

export interface DbRealEstateExpense extends SoftDeletable {
  id: string;
  real_estate_id: string;
  user_id: string;
  expense_type: ExpenseType;
  amount: number;
  currency: string;
  expense_date: string;
  memo: string | null;
  created_at: string;
}

export type DbRealEstateExpenseInsert = Omit<DbRealEstateExpense, 'id' | 'deleted_at' | 'created_at'>;

