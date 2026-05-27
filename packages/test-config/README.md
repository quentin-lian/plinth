# @plinth/test-config

公司前端共享 Vitest 测试预设。基于 `vitest@^4` + `jsdom@^29` + `@vitest/coverage-v8`，提供框架无关、React、Vue 三套预设，并内置 Testing Library 的 `cleanup()` + `jest-dom` matchers。

## 预设矩阵

| 入口                               | 适用场景                | 包含                                                 |
| ---------------------------------- | ----------------------- | ---------------------------------------------------- |
| `@plinth/test-config/vitest`       | 纯 TS/JS 库或 Node 工具 | jsdom + globals + v8 coverage                        |
| `@plinth/test-config/vitest-react` | React/Next.js 应用      | 通用预设 + `@vitejs/plugin-react` + `setup-react.js` |
| `@plinth/test-config/vitest-vue`   | Vue 3 应用              | 通用预设 + `@vitejs/plugin-vue` + `setup-vue.js`     |

`setup-react.js` / `setup-vue.js` 各自注入：

- `@testing-library/jest-dom/vitest` 扩展 matchers
- `afterEach(() => cleanup())` 自动清理 DOM

## 安装

业务工程作为 peer 安装（按所选框架挑选）：

```bash
# 通用 / 纯逻辑
pnpm add -D @plinth/test-config vitest @vitest/coverage-v8 jsdom

# React
pnpm add -D @plinth/test-config vitest @vitest/coverage-v8 jsdom \
  @vitejs/plugin-react @testing-library/react @testing-library/jest-dom

# Vue
pnpm add -D @plinth/test-config vitest @vitest/coverage-v8 jsdom \
  @vitejs/plugin-vue @vue/test-utils @testing-library/vue @testing-library/jest-dom
```

## 使用

### 直接使用预设

```ts
// vitest.config.ts
import config from '@plinth/test-config/vitest-react';

export default config;
```

### 覆写或扩展

```ts
// vitest.config.ts
import { mergeConfig } from 'vitest/config';

import base from '@plinth/test-config/vitest-react';

export default mergeConfig(base, {
  test: {
    include: ['app/**/*.test.{ts,tsx}'],
    coverage: {
      thresholds: {
        lines: 80,
      },
    },
  },
});
```

## 默认值

- `environment`: `jsdom`
- `globals`: `true`（无需手动 import `describe / it / expect`）
- `include`: `**/*.{test,spec}.{ts,tsx,js,jsx}`
- `exclude`: `node_modules` / `dist` / `.next` / `build`
- `clearMocks` / `restoreMocks`: `true`
- coverage：`v8` provider，`text + html + lcov` 三种 reporter，阈值 lines/statements 70%、functions/branches 60%

如需更高阈值或不同 reporter，按上面的"覆写"示例 mergeConfig 即可。
