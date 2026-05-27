import { fileURLToPath, URL } from 'node:url';
import { mergeConfig } from 'vitest/config';

import base from '@plinth/test-config/vitest-vue';

export default mergeConfig(base, {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
