/**
 * @file Modal — Accessible modal dialog with focus trapping
 * @module @pompcore/ui/Modal
 */

import { useEffect, useCallback, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

const MAX_WIDTH_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
} as const;

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])' as const;

/** 모달 다이얼로그 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}: ModalProps): ReactNode {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    } else {
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={`relative w-full ${MAX_WIDTH_MAP[maxWidth]} animate-slide-up motion-reduce:animate-none rounded-2xl bg-white/95 p-6 shadow-glass-lg backdrop-blur-[16px] dark:bg-surface-dark/95`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-title" className="font-display text-lg font-bold text-navy dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
            aria-label="닫기"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
