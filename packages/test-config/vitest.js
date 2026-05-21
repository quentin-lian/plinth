import { defineConfig } from 'vitest/config';

/**
 * 通用 Vitest 预设：jsdom + globals + v8 coverage。
 * 框架无关，纯 TS/JS 库或工具适用。
 *
 * 用法：
 *   import config from '@bitfe/test-config/vitest';
 *   export default config;
 *
 * 项目需自行覆写：
 *   import { mergeConfig } from 'vitest/config';
 *   import base from '@bitfe/test-config/vitest';
 *   export default mergeConfig(base, { test: { include: ['custom/**'] } });
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/build/**'],
    css: false,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['**/*.{test,spec}.*', '**/__tests__/**', '**/*.d.ts', '**/types.ts', '**/index.ts'],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 60,
        branches: 60,
      },
    },
  },
});
