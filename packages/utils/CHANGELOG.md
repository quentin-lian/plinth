# @plinth/utils

## 0.1.0

### Minor Changes

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

- [`7187a17`](https://github.com/quentin-lian/plinth/commit/7187a172df979ae11e3064a285d115b080072588) Thanks [@quentin-lian](https://github.com/quentin-lian)! - 新增 `@plinth/utils`：业务高频复用的轻量工具集，零运行时依赖。

  首版包含：
  - 时序：`sleep`（带 AbortSignal）、`debounce`（cancel/flush）、`throttle`（leading + trailing）
  - 异步控制：`retry`（指数退避 + 抖动 + shouldRetry 谓词）
  - Result 类型：`Result<T, E>`、`ok`、`err`、`safe`
  - Storage：`safeLocalStorage` / `safeSessionStorage`（自动 JSON、SSR 安全）
  - URL：`buildQuery`、`withQuery`（跳过 null/undefined、覆盖语义）

  22 个单测覆盖核心语义，详见 [packages/utils/README.md](../packages/utils/README.md)。
