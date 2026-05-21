import react from '@vitejs/plugin-react';
import { mergeConfig } from 'vitest/config';

import base from './vitest.js';

/**
 * React 项目 Vitest 预设：
 * - 在通用 jsdom + coverage 之上叠加 @vitejs/plugin-react
 * - 自动注入 setup-react.js（@testing-library/jest-dom matchers + cleanup）
 *
 * 用法：
 *   import config from '@bitfe/test-config/vitest-react';
 *   export default config;
 */
export default mergeConfig(base, {
  plugins: [react()],
  test: {
    setupFiles: [new URL('./setup-react.js', import.meta.url).pathname],
  },
});
