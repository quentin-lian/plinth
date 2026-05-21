# `@bitfe/eslint-config`

Monorepo 共享的 ESLint v9 flat config。所有 plugin 已作为 `dependencies` 内置，消费方只需安装 `eslint` 本体。

## 入口

| 入口                         | 适用场景                                  |
| ---------------------------- | ----------------------------------------- |
| `@bitfe/eslint-config/base`  | 通用 JS/TS 库、Node 脚本，无框架          |
| `@bitfe/eslint-config/react` | React 应用/库（含 hooks + jsx-a11y）      |
| `@bitfe/eslint-config/next`  | Next.js 应用（在 react 之上加 Next 规则） |
| `@bitfe/eslint-config/vue`   | Vue 3 应用（`<script lang="ts">` 支持）   |
| `@bitfe/eslint-config/node`  | Node.js 服务/CLI（仅 node globals）       |

## 使用

消费方根目录加 `eslint.config.js`：

```js
import config from '@bitfe/eslint-config/next';

export default config;
```

需要项目级覆盖：

```js
import config from '@bitfe/eslint-config/next';

export default [
  ...config,
  {
    rules: {
      'no-console': 'off',
    },
  },
];
```

## 与 Prettier 协作

- 已 extends `eslint-config-prettier`，关闭与 Prettier 冲突的格式规则
- import 顺序由 `@bitfe/prettier-config` 里的 `@ianvs/prettier-plugin-sort-imports` 负责，ESLint 不再开 `import/order`

## 依赖

```bash
pnpm add -D eslint typescript @bitfe/eslint-config@workspace:*
```
