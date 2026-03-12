/**
 * @file ProfileForm.tsx
 * @description 프로필 수정 폼 (닉네임, 생년월일)
 * @module components/settings/ProfileForm
 */

import { memo, type ReactNode, type FormEvent } from 'react';
import { GlassCard } from '@pompcore/ui';

/** ProfileForm에 전달되는 props */
interface ProfileFormProps {
  /** 현재 닉네임 값 */
  readonly displayName: string;
  /** 현재 생년월일 값 */
  readonly birthday: string;
  /** 저장 완료 토스트 노출 여부 */
  readonly saved: boolean;
  /** 닉네임 변경 핸들러 */
  readonly onDisplayNameChange: (value: string) => void;
  /** 생년월일 변경 핸들러 */
  readonly onBirthdayChange: (value: string) => void;
  /** 폼 제출 핸들러 */
  readonly onSubmit: (e: FormEvent) => void;
}

/** 프로필 수정 폼 (닉네임 + 생년월일) */
function ProfileFormInner({
  displayName,
  birthday,
  saved,
  onDisplayNameChange,
  onBirthdayChange,
  onSubmit,
}: ProfileFormProps): ReactNode {
  return (
    <GlassCard padding="md">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">프로필 수정</div>
        <div>
          <label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">닉네임</label>
          <input
            id="profile-name"
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="닉네임"
            maxLength={30}
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label htmlFor="profile-birthday" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">생년월일</label>
          <input
            id="profile-birthday"
            type="date"
            value={birthday}
            onChange={(e) => onBirthdayChange(e.target.value)}
            className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-vault-color">저장됨</span>}
          <button
            type="submit"
            className="rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white hover:bg-vault-color/90"
          >
            저장
          </button>
        </div>
      </form>
    </GlassCard>
  );
}

export const ProfileForm = memo(ProfileFormInner);
