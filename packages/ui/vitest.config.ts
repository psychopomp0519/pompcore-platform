import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: '@pompcore/ui',
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['../../tests/setup.ts'],
  },
});
