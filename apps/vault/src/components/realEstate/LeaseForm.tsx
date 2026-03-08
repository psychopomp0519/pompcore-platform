/**
 * @file LeaseForm.tsx
 * @description 임대·임차 계약 추가 폼 컴포넌트
 * @module components/realEstate/LeaseForm
 */

import { useState, type ReactNode, type FormEvent } from 'react';
import type { LeaseFormData } from '../../types/realEstate.types';
import type { LeaseType } from '../../types/database.types';
import { getToday } from '../../utils/date';

// ============================================================
// 상수
// ============================================================

const LEASE_TYPE_OPTIONS: Array<{ value: LeaseType; label: string }> = [
  { value: 'jeonse', label: '전세' },
  { value: 'monthly', label: '월세' },
  { value: 'commercial', label: '상가임대' },
];

const DEFAULT_FORM: LeaseFormData = {
  leaseType: 'monthly',
  counterpartName: '',
  deposit: '',
  monthlyRent: '',
  startDate: getToday(),
  endDate: '',
  memo: '',
};

// ============================================================
// 공통 클래스
// ============================================================

const INPUT_CLASS =
  'w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm text-navy placeholder-navy/30 dark:border-white/10 dark:bg-navy/60 dark:text-gray-100 dark:placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color';

const LABEL_CLASS = 'mb-1 block text-xs font-semibold text-navy/70 dark:text-gray-400';

// ============================================================
// 타입
// ============================================================

interface LeaseFormProps {
  onSubmit: (form: LeaseFormData) => void;
  onCancel: () => void;
}

// ============================================================
// LeaseForm
// ============================================================

/** 계약 추가 폼 */
export function LeaseForm({ onSubmit, onCancel }: LeaseFormProps): ReactNode {
  const [form, setForm] = useState<LeaseFormData>(DEFAULT_FORM);

  const set = (patch: Partial<LeaseFormData>): void =>
    setForm((prev) => ({ ...prev, ...patch }));

  const isJeonse = form.leaseType === 'jeonse';

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 계약 유형 */}
      <div>
        <label className={LABEL_CLASS}>계약 유형</label>
        <select
          value={form.leaseType}
          onChange={(e) => set({ leaseType: e.target.value as LeaseType })}
          className={INPUT_CLASS}
        >
          {LEASE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 상대방 이름 */}
      <div>
        <label className={LABEL_CLASS}>상대방 이름</label>
        <input
          type="text"
          placeholder="임차인 / 임대인 이름"
          value={form.counterpartName}
          onChange={(e) => set({ counterpartName: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      {/* 보증금 */}
      <div>
        <label className={LABEL_CLASS}>보증금 *</label>
        <input
          type="text"
          inputMode="numeric"
          required
          placeholder="0"
          value={form.deposit}
          onChange={(e) => set({ deposit: e.target.value.replace(/[^0-9]/g, '') })}
          className={`${INPUT_CLASS} tabular-nums`}
        />
      </div>

      {/* 월세 (전세가 아닌 경우만) */}
      {!isJeonse && (
        <div>
          <label className={LABEL_CLASS}>월세</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={form.monthlyRent}
            onChange={(e) => set({ monthlyRent: e.target.value.replace(/[^0-9]/g, '') })}
            className={`${INPUT_CLASS} tabular-nums`}
          />
        </div>
      )}

      {/* 계약 시작일 + 종료일 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASS}>계약 시작일 *</label>
          <input
            type="date"
            required
            value={form.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>계약 종료일</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => set({ endDate: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
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
          계약 추가
        </button>
      </div>
    </form>
  );
}
