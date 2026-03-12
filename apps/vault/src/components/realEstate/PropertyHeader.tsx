/**
 * @file PropertyHeader.tsx
 * @description 부동산 상세 페이지 물건 헤더 (이름, 유형, 역할, 편집/삭제 버튼)
 * @module components/realEstate/PropertyHeader
 */

import { memo, type ReactNode } from 'react';
import type { RealEstate } from '../../types/realEstate.types';

// ============================================================
// 상수
// ============================================================

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  apartment: '아파트',
  house: '단독주택',
  villa: '빌라',
  commercial: '상가',
  land: '토지',
  other: '기타',
};

const ROLE_LABEL: Record<string, string> = {
  owner: '소유',
  tenant: '임차',
};

// ============================================================
// 타입
// ============================================================

export interface PropertyHeaderProps {
  /** 부동산 물건 데이터 */
  property: RealEstate;
  /** 편집 버튼 클릭 핸들러 */
  onEdit: () => void;
  /** 삭제 버튼 클릭 핸들러 */
  onDelete: () => void;
}

// ============================================================
// PropertyHeader
// ============================================================

/** 부동산 물건 헤더 — 유형 배지, 이름, 주소, 편집/삭제 버튼 */
function PropertyHeaderInner({ property, onEdit, onDelete }: PropertyHeaderProps): ReactNode {
  return (
    <div className="mb-6 flex items-start justify-between gap-3">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-vault-color/10 px-2.5 py-0.5 text-xs font-semibold text-vault-color dark:bg-vault-color/20">
            {PROPERTY_TYPE_LABEL[property.propertyType] ?? property.propertyType}
          </span>
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
            {ROLE_LABEL[property.role] ?? property.role}
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-navy dark:text-gray-100">
          {property.name}
        </h1>
        {property.address && (
          <p className="mt-1 text-sm text-navy/60 dark:text-gray-400">{property.address}</p>
        )}
      </div>

      {/* 편집 / 삭제 */}
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl border border-navy/10 px-3 py-1.5 text-sm font-semibold text-navy/70 hover:bg-navy/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          편집
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export const PropertyHeader = memo(PropertyHeaderInner);
