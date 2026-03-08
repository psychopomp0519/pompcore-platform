/**
 * @file ConfirmDialog — Confirm/cancel dialog component
 * @module @pompcore/ui/ConfirmDialog
 */

import type { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <p className="mb-6 text-sm text-navy/70 dark:text-gray-300">
        {message}
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          variant={isDangerous ? 'danger' : 'primary'}
          size="sm"
          type="button"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
