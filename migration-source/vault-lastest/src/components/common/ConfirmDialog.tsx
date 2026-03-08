/**
 * @file ConfirmDialog.tsx
 * @description 확인/취소 다이얼로그 컴포넌트
 * @module components/common/ConfirmDialog
 */

import type { ReactNode } from 'react';
import { Modal } from './Modal';

// ============================================================
// 타입
// ============================================================

interface ConfirmDialogProps {
  /** 열림 여부 */
  isOpen: boolean;
  /** 닫기 콜백 */
  onClose: () => void;
  /** 확인 콜백 */
  onConfirm: () => void;
  /** 다이얼로그 제목 */
  title: string;
  /** 다이얼로그 내용 */
  message: string;
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  /** 취소 버튼 텍스트 */
  cancelText?: string;
  /** 위험한 작업 여부 (빨간 확인 버튼) */
  isDangerous?: boolean;
}

// ============================================================
// ConfirmDialog
// ============================================================

/** 확인/취소 다이얼로그 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  isDangerous = false,
}: ConfirmDialogProps): ReactNode {
  const confirmBtnClass = isDangerous
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-vault-color hover:bg-vault-color/90 text-white';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <p className="mb-6 text-sm text-navy/70 dark:text-gray-300">
        {message}
      </p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy/70 transition-colors hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${confirmBtnClass}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
