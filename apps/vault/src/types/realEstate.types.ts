/**
 * @file realEstate.types.ts
 * @description 부동산 관련 도메인 타입 정의
 * @module types/realEstate
 */

import type { PropertyType, RealEstateRole, LeaseType, ExpenseType } from './database.types';

// ============================================================
// 부동산 물건
// ============================================================

/** 부동산 물건 (소유자 or 임차인 관점 통합) */
export interface RealEstate {
  id: string;
  userId: string;
  name: string;
  address: string | null;
  propertyType: PropertyType;
  /** owner: 내가 소유 / tenant: 내가 임차 */
  role: RealEstateRole;
  acquisitionDate: string | null;
  /** owner: 취득가 / tenant: 보증금 */
  acquisitionPrice: number | null;
  currentValue: number | null;
  currency: string;
  linkedAccountId: string | null;
  memo: string | null;
  isFavorite: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RealEstateFormData {
  name: string;
  address: string;
  propertyType: PropertyType;
  role: RealEstateRole;
  acquisitionDate: string;
  acquisitionPrice: string;
  currentValue: string;
  currency: string;
  linkedAccountId: string | null;
  memo: string;
}

// ============================================================
// 임대·임차 계약
// ============================================================

/** 임대·임차 계약 정보 */
export interface RealEstateLease {
  id: string;
  realEstateId: string;
  userId: string;
  leaseType: LeaseType;
  counterpartName: string | null;
  deposit: number;
  monthlyRent: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeaseFormData {
  leaseType: LeaseType;
  counterpartName: string;
  deposit: string;
  monthlyRent: string;
  startDate: string;
  endDate: string;
  memo: string;
}

// ============================================================
// 비용 기록
// ============================================================

/** 부동산 비용 기록 (관리비·세금·수리비 등) */
export interface RealEstateExpense {
  id: string;
  realEstateId: string;
  userId: string;
  expenseType: ExpenseType;
  amount: number;
  currency: string;
  expenseDate: string;
  memo: string | null;
  createdAt: string;
}

export interface ExpenseFormData {
  expenseType: ExpenseType;
  amount: string;
  currency: string;
  expenseDate: string;
  memo: string;
}

// ============================================================
// 수익률 요약
// ============================================================

/** 부동산 수익률 요약 */
export interface RealEstateSummary {
  /** 연 월세 수익률 (%) */
  annualRentalYield: number | null;
  /** 전세 수익률 (%) */
  jeonseYield: number | null;
  /** 계약 만료까지 남은 일수 */
  daysUntilLeaseEnd: number | null;
}
