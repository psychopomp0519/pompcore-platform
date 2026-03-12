/**
 * @file Toast — Basic auto-dismiss notification
 * @module @pompcore/ui/Toast
 */

import { useEffect } from 'react';
import type { ReactNode } from 'react';

/** 자동 사라짐 시간 (ms) */
const AUTO_DISMISS_MS = 3000;

interface ToastProps {
  /** 토스트 메시지 */
  readonly message: string;
  /** 토스트 유형 */
  readonly variant?: 'success' | 'error' | 'info';
  /** 닫힘 콜백 */
  readonly onClose: () => void;
}

const VARIANT_STYLES = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-violet-500 text-white',
} as const;

/** 자동 사라지는 토스트 알림 */
export function Toast({ message, variant = 'info', onClose }: ToastProps): ReactNode {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${VARIANT_STYLES[variant]}`}
      role="alert"
    >
      {message}
    </div>
  );
}
