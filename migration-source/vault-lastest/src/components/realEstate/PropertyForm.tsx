/**
 * @file PropertyForm.tsx
 * @description 부동산 물건 생성/수정 폼 컴포넌트
 * @module components/realEstate/PropertyForm
 */

import { useState, type ReactNode, type FormEvent } from 'react';
import type { RealEstateFormData } from '../../types/realEstate.types';
import type { PropertyType, RealEstateRole } from '../../types/database.types';
import { getToday } from '../../utils/date';

// ============================================================
// 상수
// ============================================================

const PROPERTY_TYPE_OPTIONS: Array<{ value: PropertyType; label: string }> = [
  { value: 'apartment', label: '아파트' },
  { value: 'house', label: '단독주택' },
  { value: 'villa', label: '빌라' },
  { value: 'commercial', label: '상가' },
  { value: 'land', label: '토지' },
  { value: 'other', label: '기타' },
];

const ROLE_OPTIONS: Array<{ value: RealEstateRole; label: string }> = [
  { value: 'owner', label: '소유자' },
  { value: 'tenant', label: '임차인' },
];

const CURRENCY_OPTIONS = ['KRW', 'USD', 'EUR', 'JPY'];

const DEFAULT_FORM: RealEstateFormData = {
  name: '',
  address: '',
  propertyType: 'apartment',
  role: 'owner',
  acquisitionDate: '',
  acquisitionPrice: '',
  currentValue: '',
  currency: 'KRW',
  linkedAccountId: null,
  memo: '',
};

// ============================================================
// 공통 입력 클래스
// ============================================================

const INPUT_CLASS =
  'w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm text-navy placeholder-navy/30 dark:border-white/10 dark:bg-navy/60 dark:text-gray-100 dark:placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color';

const LABEL_CLASS = 'mb-1 block text-xs font-semibold text-navy/70 dark:text-gray-400';

// ============================================================
// 타입
// ============================================================

interface PropertyFormProps {
  initial?: RealEstateFormData;
  onSubmit: (form: RealEstateFormData) => void;
  onCancel: () => void;
}

// ============================================================
// PropertyForm
// ============================================================

/** 부동산 물건 생성/수정 폼 */
export function PropertyForm({ initial, onSubmit, onCancel }: PropertyFormProps): ReactNode {
  const [form, setForm] = useState<RealEstateFormData>(initial ?? DEFAULT_FORM);

  const set = (patch: Partial<RealEstateFormData>): void =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 물건명 */}
      <div>
        <label className={LABEL_CLASS}>물건명 *</label>
        <input
          type="text"
          required
          placeholder="예: 강남구 아파트"
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      {/* 주소 */}
      <div>
        <label className={LABEL_CLASS}>주소</label>
        <input
          type="text"
          placeholder="예: 서울시 강남구 역삼동 123"
          value={form.address}
          onChange={(e) => set({ address: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      {/* 유형 + 역할 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASS}>유형</label>
          <select
            value={form.propertyType}
            onChange={(e) => set({ propertyType: e.target.value as PropertyType })}
            className={INPUT_CLASS}
          >
            {PROPERTY_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>역할</label>
          <select
            value={form.role}
            onChange={(e) => set({ role: e.target.value as RealEstateRole })}
            className={INPUT_CLASS}
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 취득일 */}
      <div>
        <label className={LABEL_CLASS}>취득일</label>
        <input
          type="date"
          max={getToday()}
          value={form.acquisitionDate}
          onChange={(e) => set({ acquisitionDate: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      {/* 취득가 + 현재가 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASS}>취득가</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={form.acquisitionPrice}
            onChange={(e) => set({ acquisitionPrice: e.target.value.replace(/[^0-9]/g, '') })}
            className={`${INPUT_CLASS} tabular-nums`}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>현재가</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={form.currentValue}
            onChange={(e) => set({ currentValue: e.target.value.replace(/[^0-9]/g, '') })}
            className={`${INPUT_CLASS} tabular-nums`}
          />
        </div>
      </div>

      {/* 통화 */}
      <div>
        <label className={LABEL_CLASS}>통화</label>
        <select
          value={form.currency}
          onChange={(e) => set({ currency: e.target.value })}
          className={INPUT_CLASS}
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 연결 계좌 ID */}
      <div>
        <label className={LABEL_CLASS}>연결 계좌 ID (선택)</label>
        <input
          type="text"
          placeholder="계좌 ID"
          value={form.linkedAccountId ?? ''}
          onChange={(e) => set({ linkedAccountId: e.target.value || null })}
          className={INPUT_CLASS}
        />
      </div>

      {/* 메모 */}
      <div>
        <label className={LABEL_CLASS}>메모</label>
        <textarea
          rows={3}
          placeholder="추가 메모"
          value={form.memo}
          onChange={(e) => set({ memo: e.target.value })}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-navy/70 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-xl bg-vault-color px-5 py-2 text-sm font-semibold text-white hover:bg-vault-color/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color focus-visible:ring-offset-2"
        >
          {initial ? '저장' : '추가'}
        </button>
      </div>
    </form>
  );
}
