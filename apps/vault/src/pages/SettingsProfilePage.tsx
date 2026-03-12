/**
 * @file SettingsProfilePage.tsx
 * @description 프로필 설정 페이지 (서브 컴포넌트 조합)
 * @module pages/SettingsProfilePage
 */

import { useState, useEffect, useCallback, useMemo, type ReactNode, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { GlassCard, LoadingSpinner, toUserMessage, evaluatePassword } from '@pompcore/ui';
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
import { IconArrowLeft } from '@pompcore/ui';
import { ProfileForm } from '../components/settings/ProfileForm';
import { PasswordForm } from '../components/settings/PasswordForm';
import { SocialLinking } from '../components/settings/SocialLinking';
import { DangerZone } from '../components/settings/DangerZone';

// ============================================================
// SettingsProfilePage
// ============================================================

/** 프로필 설정 페이지 */
export function SettingsProfilePage(): ReactNode {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { settings, isLoading, error, loadSettings, updateProfile, changePassword, clearError } = useSettingsStore();

  const [currentPassword, setCurrentPassword] = useState('');
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
    setCurrentPassword('');
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
      {/* 헤더 */}
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

      {/* 글로벌 에러 */}
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
      <ProfileForm
        displayName={displayName}
        birthday={birthday}
        saved={profileSaved}
        onDisplayNameChange={setDisplayNameOverride}
        onBirthdayChange={setBirthdayOverride}
        onSubmit={handleProfileSubmit}
      />

      {/* 비밀번호 변경 */}
      <PasswordForm
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        error={passwordError}
        saved={passwordSaved}
        onCurrentPasswordChange={setCurrentPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handlePasswordSubmit}
      />

      {/* 소셜 계정 연동 */}
      <SocialLinking
        googleIdentity={googleIdentity}
        canUnlink={canUnlink}
        loading={socialLoading}
        error={socialError}
        onLinkGoogle={handleLinkGoogle}
        onUnlinkGoogle={handleUnlinkGoogle}
        onClearError={() => setSocialError(null)}
      />

      {/* 위험 영역 */}
      <DangerZone
        deleteError={deleteError}
        showDeleteConfirm={showDeleteConfirm}
        onSignOut={() => signOut()}
        onShowDeleteConfirm={() => setShowDeleteConfirm(true)}
        onCloseDeleteConfirm={() => setShowDeleteConfirm(false)}
        onDeleteAccount={handleDeleteAccount}
        onClearDeleteError={() => setDeleteError(null)}
      />
    </div>
  );
}
