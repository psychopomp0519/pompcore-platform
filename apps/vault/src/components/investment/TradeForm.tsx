/**
 * @file TradeForm.tsx
 * @description 거래 기록 추가 폼 컴포넌트
 * @module components/investment/TradeForm
 */

import { useState, memo, type FormEvent, type ReactNode } from 'react';
import type { TradeFormData } from '../../types/investment.types';
import type { TradeType } from '../../types/database.types';
import { getToday } from '../../utils/date';

// ============================================================
// 타입
// ============================================================

interface TradeFormProps {
  /** 포트폴리오 기준통화 (기본 통화 선택에 사용) */
  portfolioCurrency: string;
  onSubmit: (form: TradeFormData) => void;
  onCancel: () => void;
}

// ============================================================
// 상수
// ============================================================

/** 거래 유형 선택지 */
const TRADE_TYPE_OPTIONS: { value: TradeType; label: string }[] = [
  { value: 'buy', label: '매수' },
  { value: 'sell', label: '매도' },
  { value: 'dividend', label: '배당' },
];

/** 통화 선택지 */
const CURRENCY_OPTIONS = ['KRW', 'USD', 'EUR', 'JPY', 'BTC', 'ETH'] as const;

// ============================================================
// 공통 인풋 클래스
// ============================================================

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-navy placeholder-navy/30 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500';

// ============================================================
// TradeForm
// ============================================================

/** 거래 기록 추가 폼 */
function TradeFormInner({ portfolioCurrency, onSubmit, onCancel }: TradeFormProps): ReactNode {
  const [form, setForm] = useState<TradeFormData>({
    ticker: '',
    assetName: '',
    tradeType: 'buy',
    quantity: '',
    price: '',
    fee: '0',
    tradeDate: getToday(),
    currency: portfolioCurrency,
    memo: '',
  });

  /** 필드 값 변경 */
  function handleChange(field: keyof TradeFormData, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /** 티커 대문자 변환 */
  function handleTickerChange(value: string): void {
    setForm((prev) => ({ ...prev, ticker: value.toUpperCase() }));
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 티커 + 종목명 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
            티커 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={20}
            placeholder="예: AAPL"
            value={form.ticker}
            onChange={(e) => handleTickerChange(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
            종목명 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={100}
            placeholder="예: Apple Inc."
            value={form.assetName}
            onChange={(e) => handleChange('assetName', e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* 거래 유형 */}
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
          거래 유형 <span className="text-red-400">*</span>
        </label>
        <select
          value={form.tradeType}
          onChange={(e) => handleChange('tradeType', e.target.value)}
          className={INPUT_CLASS}
        >
          {TRADE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 수량 + 단가 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
            수량 <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            required
            min="0"
            max="9999999999"
            step="any"
            placeholder="0"
            value={form.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
            단가 <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            required
            min="0"
            max="9999999999"
            step="any"
            placeholder="0"
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* 수수료 + 통화 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
            수수료
          </label>
          <input
            type="number"
            min="0"
            max="9999999999"
            step="any"
            placeholder="0"
            value={form.fee}
            onChange={(e) => handleChange('fee', e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
            통화 <span className="text-red-400">*</span>
          </label>
          <select
            value={form.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className={INPUT_CLASS}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 거래일 */}
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/70 dark:text-gray-400">
          거래일 <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          required
          value={form.tradeDate}
          onChange={(e) => handleChange('tradeDate', e.target.value)}
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
          rows={2}
          placeholder="거래에 대한 메모"
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
          거래 추가
        </button>
      </div>
    </form>
  );
}

export const TradeForm = memo(TradeFormInner);
