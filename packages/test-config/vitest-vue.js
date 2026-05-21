import vue from '@vitejs/plugin-vue';
import { mergeConfig } from 'vitest/config';

import base from './vitest.js';

/**
 * Vue 3 项目 Vitest 预设：
 * - 在通用 jsdom + coverage 之上叠加 @vitejs/plugin-vue
 * - 自动注入 setup-vue.js（@testing-library/jest-dom matchers + cleanup）
 *
 * 用法：
 *   import config from '@bitfe/test-config/vitest-vue';
 *   export default config;
 */
export default mergeConfig(base, {
  plugins: [vue()],
  test: {
    setupFiles: [new URL('./setup-vue.js', import.meta.url).pathname],
  },
});
