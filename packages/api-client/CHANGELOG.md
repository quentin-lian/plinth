# @plinth/api-client

## 0.1.0

### Minor Changes

- [`37f87f0`](https://github.com/quentin-lian/plinth/commit/37f87f032832a61a073e8d8c7f3aa536db3eb1df) Thanks [@quentin-lian](https://github.com/quentin-lian)! - 新增 `@plinth/api-client`：基于原生 fetch 的 HTTP 客户端，统一所有业务项目的 API 访问语义。

  首版能力：
  - 鉴权 / 追踪 header 通过 `useRequest` 拦截器统一注入
  - 错误归一化到 `ApiError`，按 `code` 分类：`network` / `timeout` / `aborted` / `http` / `parse`
  - 默认对网络错误、超时、5xx 重试（指数退避 + 抖动，复用 `@plinth/utils` 的 retry）
  - 4xx 不重试，避免放大业务错误
  - 内置超时（AbortController + 外部 signal 协作）、JSON 默认编解码、query 自动拼装
  - `useRequest` / `useResponse` / `useError` 三类拦截器
  - 9 个单测覆盖 GET/POST、query、错误归一化、取消、重试策略、拦截器

  详见 [packages/api-client/README.md](../packages/api-client/README.md)。

- [`c082054`](https://github.com/quentin-lian/plinth/commit/c0820546c7640842f65e0eecd143ff456a741017) Thanks [@quentin-lian](https://github.com/quentin-lian)! - 首版发布到 npm 公开 registry（`access: public`）。

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

### Patch Changes

- Updated dependencies [[`c082054`](https://github.com/quentin-lian/plinth/commit/c0820546c7640842f65e0eecd143ff456a741017), [`7187a17`](https://github.com/quentin-lian/plinth/commit/7187a172df979ae11e3064a285d115b080072588)]:
  - @plinth/utils@0.1.0
