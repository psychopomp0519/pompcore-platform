/**
 * @file PasswordForm.tsx
 * @description 비밀번호 변경 폼
 * @module components/settings/PasswordForm
 */

import { memo, type ReactNode, type FormEvent } from 'react';
import { GlassCard, PasswordStrengthBar } from '@pompcore/ui';

/** PasswordForm에 전달되는 props */
interface PasswordFormProps {
  /** 현재 비밀번호 */
  readonly currentPassword: string;
  /** 새 비밀번호 */
  readonly newPassword: string;
  /** 비밀번호 확인 */
  readonly confirmPassword: string;
  /** 유효성 검사 에러 메시지 */
  readonly error: string | null;
  /** 변경 완료 토스트 노출 여부 */
  readonly saved: boolean;
  /** 현재 비밀번호 변경 핸들러 */
  readonly onCurrentPasswordChange: (value: string) => void;
  /** 새 비밀번호 변경 핸들러 */
  readonly onNewPasswordChange: (value: string) => void;
  /** 비밀번호 확인 변경 핸들러 */
  readonly onConfirmPasswordChange: (value: string) => void;
  /** 폼 제출 핸들러 */
  readonly onSubmit: (e: FormEvent) => void;
}

/** 비밀번호 변경 폼 */
function PasswordFormInner({
  currentPassword,
  newPassword,
  confirmPassword,
  error,
  saved,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: PasswordFormProps): ReactNode {
  /** 확인 다이얼로그 후 제출 */
  const handleSubmitWithConfirm = (e: FormEvent): void => {
    e.preventDefault();
    if (!window.confirm('비밀번호를 변경하시겠습니까?')) return;
    onSubmit(e);
  };

  return (
    <GlassCard padding="md">
      <form onSubmit={handleSubmitWithConfirm} className="space-y-3">
        <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">비밀번호 변경</div>
        <div>
          <label htmlFor="current-password" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">현재 비밀번호</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            placeholder="현재 비밀번호 입력"
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">새 비밀번호</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder="영문 대/소문자, 숫자, 특수문자 포함 8자 이상"
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <PasswordStrengthBar password={newPassword} />
        </div>
        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">비밀번호 확인</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="다시 입력"
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-vault-color">변경됨</span>}
          <button
            type="submit"
            disabled={!currentPassword || !newPassword || !confirmPassword}
            className="rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
          >
            변경
          </button>
        </div>
      </form>
    </GlassCard>
  );
}

export const PasswordForm = memo(PasswordFormInner);
