/**
 * @file SocialLinking.tsx
 * @description 소셜 계정 연동 섹션 (Google 연동/해제)
 * @module components/settings/SocialLinking
 */

import { memo, type ReactNode } from 'react';
import { GlassCard } from '@pompcore/ui';
import type { LinkedIdentity } from '../../services/auth.service';

/** SocialLinking에 전달되는 props */
interface SocialLinkingProps {
  /** 현재 연동된 Google identity (없으면 null) */
  readonly googleIdentity: LinkedIdentity | null;
  /** 연동 해제 가능 여부 */
  readonly canUnlink: boolean;
  /** 소셜 작업 로딩 상태 */
  readonly loading: boolean;
  /** 소셜 에러 메시지 */
  readonly error: string | null;
  /** Google 연동 핸들러 */
  readonly onLinkGoogle: () => void;
  /** Google 연동 해제 핸들러 */
  readonly onUnlinkGoogle: () => void;
  /** 에러 닫기 핸들러 */
  readonly onClearError: () => void;
}

/** Google 공식 로고 SVG */
function GoogleLogo(): ReactNode {
  return (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

/** 소셜 계정 연동 섹션 */
function SocialLinkingInner({
  googleIdentity,
  canUnlink,
  loading,
  error,
  onLinkGoogle,
  onUnlinkGoogle,
  onClearError,
}: SocialLinkingProps): ReactNode {
  return (
    <GlassCard padding="md">
      <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">소셜 계정 연동</div>

      {error && (
        <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={onClearError} className="ml-2 text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
          </div>
        </div>
      )}

      {/* Google */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GoogleLogo />
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
            onClick={onUnlinkGoogle}
            disabled={loading || !canUnlink}
            title={!canUnlink ? '최소 1개의 로그인 방법이 필요합니다' : ''}
            className="rounded-xl border border-navy/10 px-3 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
          >
            {loading ? '처리 중...' : '연동 해제'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onLinkGoogle}
            disabled={loading}
            className="rounded-xl border border-navy/10 px-3 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-navy/5 disabled:opacity-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
          >
            {loading ? '처리 중...' : '연동하기'}
          </button>
        )}
      </div>
    </GlassCard>
  );
}

export const SocialLinking = memo(SocialLinkingInner);
