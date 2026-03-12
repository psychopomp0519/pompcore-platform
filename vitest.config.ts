/**
 * @file Vitest Root Config — 프로젝트 모드
 * @description 각 프로젝트 설정은 해당 디렉토리의 vitest.config.ts 참조
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/types',
      'packages/ui',
      'packages/auth',
      'packages/sdk',
      'apps/vault',
      'apps/web',
    ],
  },
});
