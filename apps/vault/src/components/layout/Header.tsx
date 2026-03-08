/**
 * @file Header.tsx
 * @description 상단 헤더 - 다크모드 토글, 프로필 드롭다운
 * @module components/layout/Header
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { signOut } from '../../services/auth.service';
import { ROUTES } from '../../constants/routes';
import { IconUser, IconArrowLeft } from '../icons/NavIcons';
import { ThemeToggle } from '../common/ThemeToggle';

// ============================================================
// Header 컴포넌트
// ============================================================

/** 상단 헤더 */
export function Header(): ReactNode {
  const { toggleMobileSidebar } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
        triggerRef.current?.focus();
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-navy/10 bg-white/60 px-4 backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-dark/60 tablet:px-5 desktop:px-6">
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
      <img src="/logo.svg" alt="Vault" className="h-5 tablet:hidden desktop:hidden dark:invert" />

      {/* 우측 영역 */}
      <div className="ml-auto flex items-center gap-3">
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
