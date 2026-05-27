# @plinth/env

## 0.1.0

### Minor Changes

- [`71a1ed0`](https://github.com/quentin-lian/plinth/commit/71a1ed0a13fc41d99b56c1d01425c3d37562c5d2) Thanks [@quentin-lian](https://github.com/quentin-lian)! - 新增 `@plinth/env`：基于 zod 的运行时环境变量校验工具。
  - `createEnv({ server, client, clientPrefix, source, isServer })` 校验启动时的 env 配置
  - 服务端 schema 中的字段在浏览器侧自动置 undefined，避免误用泄露密钥
  - client 字段强制带 prefix（默认 `NEXT_PUBLIC_`，Vite 项目改为 `VITE_`）
  - 校验失败抛 `EnvValidationError`，聚合所有字段问题，便于一次性定位

  业务项目接入示例参见 [packages/env/README.md](../packages/env/README.md)，CONSUMING.md 也已加上接入指引。

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
