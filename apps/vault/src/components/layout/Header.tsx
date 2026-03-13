/**
 * @file Header.tsx
 * @description 상단 헤더 - 다크모드 토글, 프로필 드롭다운
 * @module components/layout/Header
 */

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { signOut } from '../../services/auth.service';
import { ROUTES } from '../../constants/routes';
import { IconUser, IconArrowLeft, IconBell, ThemeToggle } from '@pompcore/ui';
import { NOTIFICATION_TYPE_LABELS } from '../../types/notification.types';

// ============================================================
// 헬퍼
// ============================================================

/** 상대 시간 포맷 (간략형) */
function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return '방금';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

// ============================================================
// Header 컴포넌트
// ============================================================

/** 상단 헤더 */
export function Header(): ReactNode {
  const { toggleMobileSidebar } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const { notifications, unreadCount, load: loadNotifications, markAsRead, markAllAsRead, remove: removeNotification } = useNotificationStore();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /** 알림 패널 로드 */
  useEffect(() => {
    if (user?.id) loadNotifications(user.id);
  }, [user?.id, loadNotifications]);

  /** 알림 패널 외부 클릭 닫기 */
  const handleNotiOutside = useCallback((e: MouseEvent): void => {
    if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
      setIsNotiOpen(false);
    }
  }, []);

  /** 외부 클릭 + Escape 키 시 드롭다운 닫기 */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsNotiOpen(false);
        triggerRef.current?.focus();
      }
    }
    if (isDropdownOpen || isNotiOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('mousedown', handleNotiOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleNotiOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen, isNotiOpen, handleNotiOutside]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-navy/10 bg-white/80 px-4 backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-dark/60 tablet:px-5 desktop:px-6">
      {/* 모바일 메뉴 버튼 */}
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="rounded-lg p-2 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5 tablet:hidden desktop:hidden"
        aria-label="메뉴 열기"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 로고 (데스크톱 숨김) */}
      <img src="/logo.svg" alt="Vault" className="h-5 tablet:hidden desktop:hidden" />

      {/* 우측 영역 */}
      <div className="ml-auto flex items-center gap-3">
        {/* 알림 벨 */}
        {user && (
          <div className="relative" ref={notiRef}>
            <button
              type="button"
              onClick={() => { setIsNotiOpen((p) => !p); setIsDropdownOpen(false); }}
              className="relative rounded-lg p-2 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
              aria-label="알림"
            >
              <IconBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {isNotiOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-navy/10 bg-white/95 shadow-glass backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-dark/95">
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-navy/5 px-4 py-3 dark:border-white/5">
                  <span className="text-sm font-semibold text-navy dark:text-gray-100">알림</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => { if (user.id) markAllAsRead(user.id); }}
                      className="text-xs text-vault-color hover:underline"
                    >
                      모두 읽음
                    </button>
                  )}
                </div>

                {/* 알림 목록 */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-navy/40 dark:text-gray-500">
                      알림이 없습니다.
                    </div>
                  ) : (
                    notifications.map((noti) => (
                      <div
                        key={noti.id}
                        className={[
                          'group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-navy/5 dark:hover:bg-white/5',
                          noti.isRead ? 'opacity-60' : '',
                        ].join(' ')}
                      >
                        {/* 읽음 표시 점 */}
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${noti.isRead ? 'bg-transparent' : 'bg-vault-color'}`} />
                        <button
                          type="button"
                          className="flex-1 text-left"
                          onClick={() => markAsRead(noti.id)}
                        >
                          <div className="text-xs font-medium text-navy dark:text-gray-200">{noti.title}</div>
                          {noti.message && (
                            <div className="mt-0.5 text-xs text-navy/50 dark:text-gray-400 line-clamp-2">{noti.message}</div>
                          )}
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-navy/30 dark:text-gray-500">
                            <span>{NOTIFICATION_TYPE_LABELS[noti.type]}</span>
                            <span>{formatRelative(noti.createdAt)}</span>
                          </div>
                        </button>
                        {/* 삭제 버튼 */}
                        <button
                          type="button"
                          onClick={() => removeNotification(noti.id)}
                          className="mt-1 hidden shrink-0 text-navy/30 hover:text-red-400 group-hover:block dark:text-gray-500 dark:hover:text-red-400"
                          aria-label="알림 삭제"
                        >
                          &times;
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 다크모드 토글 */}
        <ThemeToggle />

        {/* 프로필 드롭다운 */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-vault-color/20 text-sm font-semibold text-vault-color transition-colors hover:bg-vault-color/30"
              aria-label="프로필 메뉴"
              aria-expanded={isDropdownOpen}
            >
              {user.displayName?.charAt(0) ?? user.email.charAt(0).toUpperCase()}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-navy/10 bg-white/95 shadow-glass backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-dark/95">
                {/* 사용자 정보 */}
                <div className="border-b border-navy/5 px-4 py-3 dark:border-white/5">
                  <div className="text-sm font-medium text-navy dark:text-gray-100">
                    {user.displayName ?? '사용자'}
                  </div>
                  <div className="truncate text-xs text-navy/50 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>

                {/* 메뉴 항목 */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate(ROUTES.SETTINGS_PROFILE);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-navy/70 transition-colors hover:bg-navy/5 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    <IconUser className="h-4 w-4" />
                    마이페이지
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <IconArrowLeft className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
