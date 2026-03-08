/**
 * @file SettingsProfilePage.tsx
 * @description 프로필 설정 페이지
 * @module pages/SettingsProfilePage
 */

import { useState, useEffect, useCallback, useMemo, type ReactNode, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { GlassCard } from '../components/common/GlassCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import * as settingsService from '../services/settings.service';
import {
  signOut,
  getLinkedIdentities,
  linkGoogleAccount,
  unlinkGoogleAccount,
  type LinkedIdentity,
} from '../services/auth.service';
import { ROUTES } from '../constants/routes';
import { TOAST_DURATION_MS } from '../constants/ui';
import { IconArrowLeft } from '../components/icons/NavIcons';
import { toUserMessage } from '../utils/errorMessages';
import { evaluatePassword } from '../utils/passwordStrength';
import { PasswordStrengthBar } from '../components/common/PasswordStrengthBar';

// ============================================================
// SettingsProfilePage
// ============================================================

/** 프로필 설정 페이지 */
export function SettingsProfilePage(): ReactNode {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { settings, isLoading, error, loadSettings, updateProfile, changePassword, clearError } = useSettingsStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => evaluatePassword(newPassword), [newPassword]);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  /* 프로필 필드: settings를 소스로 사용, 사용자 수정분만 로컬 오버라이드 */
  const [displayNameOverride, setDisplayNameOverride] = useState<string | null>(null);
  const [birthdayOverride, setBirthdayOverride] = useState<string | null>(null);
  const displayName = displayNameOverride ?? settings?.displayName ?? '';
  const birthday = birthdayOverride ?? settings?.birthday ?? '';

  /* 소셜 연동 상태 */
  const [identities, setIdentities] = useState<LinkedIdentity[]>([]);
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialError, setSocialError] = useState<string | null>(null);

  const googleIdentity = identities.find((i) => i.provider === 'google') ?? null;
  /** 연동 해제 가능 여부: 2개 이상의 identity가 있어야 잠금 방지 */
  const canUnlink = identities.length >= 2;

  const loadIdentities = useCallback(async (): Promise<void> => {
    try {
      const list = await getLinkedIdentities();
      setIdentities(list);
    } catch {
      // 조회 실패 시 빈 목록 유지
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadSettings(user.id);
      loadIdentities();
    }
  }, [user?.id, loadSettings, loadIdentities]);

  function handleProfileSubmit(e: FormEvent): void {
    e.preventDefault();
    if (!user?.id) return;
    updateProfile(user.id, {
      displayName: displayName.trim(),
      birthday: birthday || null,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), TOAST_DURATION_MS);
  }

  function handlePasswordSubmit(e: FormEvent): void {
    e.preventDefault();
    setPasswordError(null);

    if (!passwordStrength.isValid) {
      setPasswordError('비밀번호가 모든 규칙을 충족하지 않습니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    changePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), TOAST_DURATION_MS);
  }

  async function handleLinkGoogle(): Promise<void> {
    setSocialLoading(true);
    setSocialError(null);
    try {
      await linkGoogleAccount();
      // OAuth redirect이므로 이후 코드는 실행되지 않음
    } catch (err) {
      setSocialError(toUserMessage(err, 'Google 연동에 실패했습니다.'));
      setSocialLoading(false);
    }
  }

  async function handleUnlinkGoogle(): Promise<void> {
    if (!googleIdentity) return;
    setSocialLoading(true);
    setSocialError(null);
    try {
      await unlinkGoogleAccount(googleIdentity);
      await loadIdentities();
    } catch (err) {
      setSocialError(toUserMessage(err, 'Google 연동 해제에 실패했습니다.'));
    } finally {
      setSocialLoading(false);
    }
  }

  async function handleDeleteAccount(): Promise<void> {
    if (!user?.id) return;
    try {
      await settingsService.deleteAccount();
    } catch (err) {
      setDeleteError(toUserMessage(err, '계정 삭제에 실패했습니다.'));
    }
  }

  if (isLoading && !settings) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.SETTINGS)}
          className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
          aria-label="설정으로 돌아가기"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">프로필</h1>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={clearError} className="text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
          </div>
        </div>
      )}

      {/* 계정 정보 */}
      <GlassCard padding="md">
        <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">계정 정보</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-navy/60 dark:text-gray-400">이메일</span>
            <span className="font-medium text-navy dark:text-gray-100">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy/60 dark:text-gray-400">가입일</span>
            <span className="font-medium text-navy dark:text-gray-100">{user?.createdAt?.slice(0, 10)}</span>
          </div>
        </div>
      </GlassCard>

      {/* 프로필 수정 */}
      <GlassCard padding="md">
        <form onSubmit={handleProfileSubmit} className="space-y-3">
          <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">프로필 수정</div>
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">닉네임</label>
            <input
              id="profile-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayNameOverride(e.target.value)}
              placeholder="닉네임"
              maxLength={30}
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label htmlFor="profile-birthday" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">생년월일</label>
            <input
              id="profile-birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthdayOverride(e.target.value)}
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            {profileSaved && <span className="text-xs text-vault-color">저장됨</span>}
            <button
              type="submit"
              className="rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white hover:bg-vault-color/90"
            >
              저장
            </button>
          </div>
        </form>
      </GlassCard>

      {/* 비밀번호 변경 */}
      <GlassCard padding="md">
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">비밀번호 변경</div>
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">새 비밀번호</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="영문 대/소문자, 숫자, 특수문자 포함 8자 이상"
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <PasswordStrengthBar password={newPassword} />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">비밀번호 확인</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="다시 입력"
              className="w-full rounded-xl border border-navy/10 bg-white/60 px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
          {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
          <div className="flex items-center justify-end gap-3">
            {passwordSaved && <span className="text-xs text-vault-color">변경됨</span>}
            <button
              type="submit"
              disabled={!newPassword || !confirmPassword}
              className="rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
            >
              변경
            </button>
          </div>
        </form>
      </GlassCard>

      {/* 소셜 계정 연동 */}
      <GlassCard padding="md">
        <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">소셜 계정 연동</div>

        {socialError && (
          <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <div className="flex items-center justify-between">
              <span>{socialError}</span>
              <button type="button" onClick={() => setSocialError(null)} className="ml-2 text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
            </div>
          </div>
        )}

        {/* Google */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google 공식 로고 */}
            <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <div>
              <div className="text-sm font-medium text-navy dark:text-gray-100">Google</div>
              <div className="text-xs text-navy/50 dark:text-gray-400">
                {googleIdentity
                  ? `연동됨 · ${googleIdentity.identity_data?.['email'] as string ?? ''}`
                  : '연동되지 않음'}
              </div>
            </div>
          </div>

          {googleIdentity ? (
            <button
              type="button"
              onClick={handleUnlinkGoogle}
              disabled={socialLoading || !canUnlink}
              title={!canUnlink ? '최소 1개의 로그인 방법이 필요합니다' : ''}
              className="rounded-xl border border-navy/10 px-3 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
            >
              {socialLoading ? '처리 중...' : '연동 해제'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLinkGoogle}
              disabled={socialLoading}
              className="rounded-xl border border-navy/10 px-3 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-navy/5 disabled:opacity-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
            >
              {socialLoading ? '처리 중...' : '연동하기'}
            </button>
          )}
        </div>
      </GlassCard>

      {deleteError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{deleteError}</span>
            <button type="button" onClick={() => setDeleteError(null)} className="text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
          </div>
        </div>
      )}

      {/* 위험 영역 */}
      <GlassCard padding="md" className="border-red-200 dark:border-red-500/20">
        <div className="mb-3 text-xs font-medium text-red-500">위험 영역</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-navy dark:text-gray-100">로그아웃</div>
            <div className="text-xs text-navy/50 dark:text-gray-400">현재 세션에서 로그아웃합니다.</div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
          >
            로그아웃
          </button>
        </div>
        <hr className="my-3 border-navy/5 dark:border-white/5" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-navy dark:text-gray-100">회원 탈퇴</div>
            <div className="text-xs text-navy/50 dark:text-gray-400">모든 데이터가 삭제됩니다.</div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            탈퇴
          </button>
        </div>
      </GlassCard>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다."
        confirmText="탈퇴"
        isDangerous
      />
    </div>
  );
}
