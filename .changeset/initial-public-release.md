---
'@plinth/eslint-config': minor
'@plinth/prettier-config': minor
'@plinth/prettier-config-tailwind': minor
'@plinth/typescript-config': minor
'@plinth/test-config': minor
'@plinth/commitlint-config': minor
'@plinth/utils': minor
'@plinth/api-client': minor
'@plinth/env': minor
---

首版发布到 npm 公开 registry（`access: public`）。

`@plinth/*` 一组共享配置 + 运行时工具：

- 配置类（前端 lint / format / TS / 测试 / commit 规范）
  - `@plinth/eslint-config`：ESLint 9 flat config，预设 base / react / next / vue / node
  - `@plinth/prettier-config` & `@plinth/prettier-config-tailwind`：Prettier 3 + 导入排序（+ Tailwind class 排序）
  - `@plinth/typescript-config`：base / nextjs / vue / nuxt / node 共享 tsconfig
  - `@plinth/test-config`：Vitest 4 + Testing Library (React/Vue) + jsdom 预设
  - `@plinth/commitlint-config`：Conventional Commits 规则
- 运行时类（业务高频复用）
  - `@plinth/utils`：debounce / throttle / retry / sleep / Result / safeStorage / query 工具
  - `@plinth/api-client`：基于 fetch 的 HTTP 客户端，统一拦截、错误归一化、超时、重试、取消
  - `@plinth/env`：基于 zod 的运行时 env schema 校验，server/client 自动分流

接入指南：[docs/CONSUMING.md](https://github.com/quentin-lian/plinth/blob/main/docs/CONSUMING.md)
路线图：[docs/ROADMAP.md](https://github.com/quentin-lian/plinth/blob/main/docs/ROADMAP.md)
