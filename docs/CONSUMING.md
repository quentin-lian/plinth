# 业务项目接入指南

把 `@plinth/*` 一组共享配置接到一个新的或已有的业务项目里，3 步即可。

> `@plinth/*` 发布在 **npm 公开 registry**，可见性 **public**。任何人 `pnpm add` 即可装到。无需 token、无需 `.npmrc`。

---

## 一、安装共享配置

```bash
# 按需选择
pnpm add -D @plinth/eslint-config @plinth/typescript-config @plinth/prettier-config

# Tailwind 项目额外加：
pnpm add -D @plinth/prettier-config-tailwind

# 用 commitlint 的话：
pnpm add -D @plinth/commitlint-config @commitlint/cli husky

# 业务运行时（按需）：
pnpm add @plinth/env zod                    # 环境变量校验
pnpm add @plinth/api-client                 # HTTP 客户端
pnpm add @plinth/utils                      # 通用工具
```

同时安装对应 peer：

```bash
pnpm add -D eslint typescript prettier
```

---

## 二、接入配置

### 2.1 ESLint（v9 flat config）

`eslint.config.js`：

```js
// Next.js 项目
import config from '@plinth/eslint-config/next';
export default config;

// 普通 React 项目
import config from '@plinth/eslint-config/react';
export default config;

// Vue 3 项目
import config from '@plinth/eslint-config/vue';
export default config;

// Node.js 服务/工具
import config from '@plinth/eslint-config/node';
export default config;
```

### 2.2 TypeScript

`tsconfig.json`：

```jsonc
{
  // 按项目类型选一个
  "extends": "@plinth/typescript-config/nextjs.json",
  // "extends": "@plinth/typescript-config/react.json",
  // "extends": "@plinth/typescript-config/react-library.json",
  // "extends": "@plinth/typescript-config/vue.json",
  // "extends": "@plinth/typescript-config/nuxt.json",
  // "extends": "@plinth/typescript-config/node.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
  },
  "include": ["src", "next-env.d.ts"],
}
```

### 2.3 Prettier

`package.json`：

```json
{
  "prettier": "@plinth/prettier-config"
}
```

Tailwind 项目改成 `@plinth/prettier-config-tailwind`。

### 2.4 Commitlint + Husky（可选）

`commitlint.config.mjs`：

```js
export default { extends: ['@plinth/commitlint-config'] };
```

`package.json` 里加：

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

```bash
pnpm install     # 触发 prepare，初始化 .husky
echo 'pnpm exec commitlint --edit "$1"' > .husky/commit-msg
chmod +x .husky/commit-msg
```

---

## 三、加常用脚本

`package.json` `scripts`：

```json
{
  "scripts": {
    "lint": "eslint --max-warnings 0",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check-types": "tsc --noEmit"
  }
}
```

---

## 四、环境变量约定

业务项目的运行时配置走 **环境变量**，不要硬编码到源码。

### 文件分层

| 文件                    | 用途                    | 是否进 git  |
| ----------------------- | ----------------------- | ----------- |
| `.env.example`          | schema / 占位，团队共享 | ✅ 进 git   |
| `.env.local`            | 本地开发覆盖（含敏感）  | ❌ 不进 git |
| `.env.production.local` | 生产构建本地覆盖        | ❌ 不进 git |

`.gitignore` 必须保证：

```
.env
.env.*
!.env.example
```

模板已带样板，新业务项目复制 `.env.example` → `.env.local` 即可：

```bash
cp .env.example .env.local
```

### 命名规范

- **Next.js**：仅 `NEXT_PUBLIC_*` 暴露到浏览器，其他默认仅服务端可读
- **Vite/Vue**：仅 `VITE_*` 暴露到浏览器
- **敏感信息**（DB 连接串、密钥、token）严禁加 `NEXT_PUBLIC_` / `VITE_` 前缀

### 运行时校验（推荐）

用 [`@plinth/env`](../packages/env/README.md) 在启动时校验 env，缺失或非法值直接抛错，避免线上裸奔。

```bash
pnpm add @plinth/env zod
```

```ts
// src/lib/env.ts （Next.js 示例）
import { z } from 'zod';

import { createEnv } from '@plinth/env';

export const env = createEnv({
  server: z.object({
    DATABASE_URL: z.string().url(),
    SESSION_SECRET: z.string().min(32),
  }),
  client: z.object({
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  }),
});
```

Vite/Vue 项目把 `clientPrefix` 改为 `'VITE_'`，并把 `source` 改为 `import.meta.env`。

服务端 schema 中的变量在浏览器侧自动置 `undefined`，不会泄露。详见 [@plinth/env README](../packages/env/README.md)。

模板参考：

- [templates/nextjs-app/.env.example](../templates/nextjs-app/.env.example)
- [templates/vue-app/.env.example](../templates/vue-app/.env.example)

---

## 常见问题

**Q: 想升级配置版本？**
A: `pnpm up @plinth/eslint-config@latest`。所有 `@plinth/*` 都遵循 semver，看 [plinth releases](https://github.com/quentin-lian/plinth/releases) 了解破坏性变更。

**Q: CI 装不上 `@plinth/*`？**
A: `@plinth/*` 是 **npm 公开 registry** 的 public 包，任何 CI 环境直接 `pnpm install` 即可，不需要 token / `.npmrc`。如果你的 CI 配了内网镜像，确认那个镜像同步了 npm 公开 registry（一般都同步）。
