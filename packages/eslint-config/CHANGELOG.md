# @plinth/eslint-config

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

- [`6c0d4a2`](https://github.com/quentin-lian/plinth/commit/6c0d4a2015baee034a18c418a253f4879cf7f8ab) Thanks [@quentin-lian](https://github.com/quentin-lian)! - Vue preset 接入 `eslint-config-prettier` 并明确关闭与 Prettier 冲突的 Vue 模板格式规则（`vue/max-attributes-per-line`、`vue/singleline-html-element-content-newline`、`vue/multiline-html-element-content-newline`、`vue/html-self-closing`、`vue/html-indent`、`vue/html-closing-bracket-newline`、`vue/html-closing-bracket-spacing`、`vue/first-attribute-linebreak`）。Prettier 成为格式化的唯一事实来源，避免与 vue-eslint 之间的死循环。
