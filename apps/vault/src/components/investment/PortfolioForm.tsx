/**
 * @file PortfolioForm.tsx
 * @description 포트폴리오 생성/수정 폼 컴포넌트
 * @module components/investment/PortfolioForm
 */

import { useState, type FormEvent, type ReactNode } from 'react';
import type { PortfolioFormData } from '../../types/investment.types';
import type { AssetType } from '../../types/database.types';

// ============================================================
// 타입
// ============================================================

interface PortfolioFormProps {
  initial?: PortfolioFormData;
  onSubmit: (form: PortfolioFormData) => void;
  onCancel: () => void;
}

// ============================================================
// 상수
// ============================================================

/** 자산 유형 선택지 */
const ASSET_TYPE_OPTIONS: { value: AssetType; label: string }[] = [
  { value: 'stock_kr', label: '국내주식' },
  { value: 'stock_us', label: '해외주식' },
  { value: 'crypto', label: '암호화폐' },
  { value: 'mixed', label: '혼합' },
];

/** 기준통화 선택지 */
const CURRENCY_OPTIONS = ['KRW', 'USD', 'EUR', 'JPY', 'BTC', 'ETH'] as const;

/** 기본 폼 상태 */
const DEFAULT_FORM: PortfolioFormData = {
  name: '',
  broker: '',
  assetType: 'stock_kr',
  baseCurrency: 'KRW',
  linkedAccountId: null,
  memo: '',
};

// ============================================================
// 공통 인풋 클래스
// ============================================================

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm text-navy placeholder-navy/30 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500';

// ============================================================
// PortfolioForm
// ============================================================

/** 포트폴리오 생성/수정 폼 */
export function PortfolioForm({ initial, onSubmit, onCancel }: PortfolioFormProps): ReactNode {
  const [form, setForm] = useState<PortfolioFormData>(initial ?? DEFAULT_FORM);

  /** 문자열 필드 변경 핸들러 */
  function handleChange(field: keyof PortfolioFormData, value: string | null): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 포트폴리오 이름 */}
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
          포트폴리오 이름 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          maxLength={100}
          placeholder="예: 삼성증권 국내주식"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      {/* 증권사/거래소 */}
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
          증권사 / 거래소 <span className="text-navy/30 dark:text-gray-600">(선택)</span>
        </label>
        <input
          type="text"
          maxLength={100}
          placeholder="예: 삼성증권, 업비트"
          value={form.broker}
          onChange={(e) => handleChange('broker', e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      {/* 자산 유형 */}
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
          자산 유형 <span className="text-red-400">*</span>
        </label>
        <select
          value={form.assetType}
          onChange={(e) => handleChange('assetType', e.target.value)}
          className={INPUT_CLASS}
        >
          {ASSET_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 기준통화 */}
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
          기준통화 <span className="text-red-400">*</span>
        </label>
        <select
          value={form.baseCurrency}
          onChange={(e) => handleChange('baseCurrency', e.target.value)}
          className={INPUT_CLASS}
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 연결 계좌 ID */}
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
          연결 계좌 ID <span className="text-navy/30 dark:text-gray-600">(선택)</span>
        </label>
        <input
          type="text"
          maxLength={100}
          placeholder="연결할 계좌 ID"
          value={form.linkedAccountId ?? ''}
          onChange={(e) => handleChange('linkedAccountId', e.target.value || null)}
          className={INPUT_CLASS}
        />
      </div>

      {/* 메모 */}
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
          메모 <span className="text-navy/30 dark:text-gray-600">(선택)</span>
        </label>
        <textarea
          maxLength={500}
          rows={3}
          placeholder="포트폴리오에 대한 메모"
          value={form.memo}
          onChange={(e) => handleChange('memo', e.target.value)}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy/70 transition-colors hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-xl bg-vault-color px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          {initial ? '수정' : '생성'}
        </button>
      </div>
    </form>
  );
}
