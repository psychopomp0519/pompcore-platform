/**
 * @file SettingsCategoriesPage.tsx
 * @description 설정 > 카테고리 관리 페이지
 * @module pages/SettingsCategoriesPage
 */

import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryManager } from '../components/categories/CategoryManager';
import { ROUTES } from '../constants/routes';
import { IconArrowLeft } from '../components/icons/NavIcons';

/** 카테고리 관리 페이지 */
export function SettingsCategoriesPage(): ReactNode {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
            aria-label="설정으로 돌아가기"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">
            카테고리 관리
          </h1>
        </div>
        <p className="mt-1 pl-10 text-sm text-navy/60 dark:text-gray-400">
          수입과 지출 카테고리를 관리합니다
        </p>
      </div>

      {/* 카테고리 관리 */}
      <CategoryManager />
    </div>
  );
}
