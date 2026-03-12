import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: '@pompcore/sdk',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
