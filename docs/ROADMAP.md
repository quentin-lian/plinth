# plinth 演进路线图

记录 `plinth` 从"配置标准化骨架"演进到"完整企业级前端工程化"的全景规划。

> **当前完成度**：约 30%–40%。地基（lint / format / type / test / commit / release）已铺设；
> 共享运行时能力、脚手架、治理、协作模板尚未启动。

---

## 一、现状全景

### ✅ 已具备（配置标准化层）

| 维度       | 落地情况                                        | 位置                                                                                                                                |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo   | pnpm 10 workspaces + Turborepo 2                | [package.json](../package.json) / [turbo.json](../turbo.json)                                                                       |
| Lint       | ESLint 9 flat config + 多框架预设               | [packages/eslint-config](../packages/eslint-config)                                                                                 |
| Format     | Prettier 3 + import sort + Tailwind 插件        | [packages/prettier-config](../packages/prettier-config) / [packages/prettier-config-tailwind](../packages/prettier-config-tailwind) |
| TypeScript | base / nextjs / vue / node / nuxt 共享 tsconfig | [packages/typescript-config](../packages/typescript-config)                                                                         |
| Test       | Vitest 4 + Testing Library + jsdom 预设         | [packages/test-config](../packages/test-config)                                                                                     |
| Commit     | commitlint + husky + lint-staged                | [packages/commitlint-config](../packages/commitlint-config) / [.husky](../.husky)                                                   |
| 模板       | Next.js 16 / Vue 3.5 起步项目                   | [templates/](../templates)                                                                                                          |
| 发布       | changesets + npm 公开 registry                  | [.changeset/config.json](../.changeset/config.json)                                                                                 |
| CI         | ci.yml + release.yml                            | [.github/workflows](../.github/workflows)                                                                                           |
| 接入文档   | CONSUMING.md                                    | [docs/CONSUMING.md](./CONSUMING.md)                                                                                                 |

### ❌ 缺失（要走到"完整企业级"必补）

| 类别         | 缺失项                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------- |
| 共享运行时   | UI 组件库 / hooks / utils / icons / design tokens / API client / 错误监控 / 埋点 / i18n       |
| 工程基础设施 | 环境变量规范 / bundle size 守门 / 依赖审计 / license 合规 / Mock Server / E2E / Lighthouse CI |
| 发布与协作   | 分支策略统一 / PR・Issue・SECURITY 模板 / CODEOWNERS / CONTRIBUTING                           |
| 脚手架       | `create-plinth-app` CLI / codemod / 版本巡检                                                  |
| 治理         | 业务项目版本基线巡检 / 配置漂移检测 / 工程指标看板                                            |

---

## 二、阶段路线图

按"收益 / 成本"排序，分四个阶段推进。每个阶段都能独立交付价值，不依赖后续阶段。

### Phase 0 — 收尾现有阶段（半天）

**目标**：消除当前阻塞，让 B 阶段彻底干净。

- [x] 修复 Vue 模板 lint warning：在 `@plinth/eslint-config` Vue preset 中接入 `eslint-config-prettier`，关掉 `vue/max-attributes-per-line` 与 `vue/singleline-html-element-content-newline`
- [x] 统一分支策略：保持仓库默认分支为 `master`，将 [.changeset/config.json](../.changeset/config.json) 与 [.github/workflows/](../.github/workflows/) 中的 `main` 全部改为 `master`
- [x] 决定 `apps/web` `apps/docs` 去留：删除（推荐，模板已覆盖）或改造为可发布的演示站
- [x] 替换根 [README.md](../README.md) 内容（目前仍是 `create-turbo` 默认文案）

**产出**：`pnpm format && pnpm lint && pnpm check-types && pnpm test` 全绿 + 仓库一致。

---

### Phase 1 — 端到端发布验证（1–2 天）

**目标**：跑通 `@plinth/*` 从源码到业务项目的完整链路，证明流水线可用。

- [ ] 在 GitHub 创建 org（确定真实名称后替换 [.changeset/config.json](../.changeset/config.json) 的 `quentin-lian/plinth` 占位）
- [ ] 开发者本地 `~/.zshrc` 配 `NPM_TOKEN`（npm Automation token，公开包发布即可）
- [ ] 推送仓库到 GitHub，CI 跑绿
- [ ] 首次 `pnpm changeset publish`，把 6 个配置包推到 npm 公开 registry
- [ ] 挑 1 个真实业务项目按 [docs/CONSUMING.md](./CONSUMING.md) 接入，验证 lint/format/type/test/commit/CI 全链路
- [ ] 把试点中遇到的踩坑回写进 CONSUMING.md

**产出**：第 1 个业务项目 PR 合入，所有 gate 绿。

---

### Phase 2 — 协作与治理基础设施（2–3 天）

**目标**：让 10 个业务项目接入后，团队协作和依赖治理不靠人工。

#### 2.1 协作模板

- [x] [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) — PR 模板
- [x] [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/) — bug / feature / question 模板
- [x] [.github/CODEOWNERS](../.github/CODEOWNERS) — 关键路径自动 reviewer
- [x] [CONTRIBUTING.md](../CONTRIBUTING.md) — 贡献指南
- [x] [SECURITY.md](../SECURITY.md) — 安全披露策略

#### 2.2 依赖治理

- [x] Renovate（推荐）或 Dependabot 配置：每周聚合 PR、自动 patch、major 单独通知
- [x] `pnpm audit` 接入 CI，高危漏洞阻断合并
- [x] License 检查（`scripts/check-licenses.mjs`，prod 依赖白名单巡检）

#### 2.3 环境变量规范

- [x] 模板新增 `.env.example`
- [x] 引入 `@plinth/env`：基于 zod 的运行时 env schema 校验

**产出**：业务项目从"接入"到"长期维护"的协作链路自动化。

---

### Phase 3 — 共享运行时能力（2–4 周）

**目标**：业务项目复用代码，不再各自造轮子。这是企业级前端工程化的核心价值所在。

> 优先级按业务痛点排序，逐个交付，不必一次做完。

#### 3.1 共享工具层（先做，门槛低、收益直接）

- [x] `@plinth/utils` — 通用工具函数（date、url、storage、debounce、retry）
- [x] `@plinth/api-client` — 基于 fetch 的 HTTP 客户端（鉴权、拦截、错误码、重试、取消）
- [ ] `@plinth/icons` — 图标库（SVG sprite + tree-shaking）

#### 3.2 共享 UI（React 优先，Vue 跟进）

- [ ] `@plinth/ui-react` — 原子组件库（Button / Input / Modal / Toast / Form…）
  - [ ] Storybook 7 接入
  - [ ] design tokens（CSS variables）
  - [ ] a11y（axe-core）
  - [ ] 主题切换
- [ ] `@plinth/ui-vue` — Vue 版（结构对齐 React 版）

#### 3.3 监控与可观测

- [ ] `@plinth/monitor` — 错误监控 SDK 封装（Sentry 或自建）
- [ ] `@plinth/analytics` — 埋点 SDK 封装

#### 3.4 国际化

- [ ] `@plinth/i18n` — i18n 方案约定（i18next / vue-i18n 包装、翻译 key 提取脚本）

**产出**：业务项目核心代码 30%–50% 来自 `@plinth/*`，新项目启动时间从周降到小时。

---

### Phase 4 — 脚手架与质量门禁（1–2 周）

**目标**：从"能用"到"好用"，新项目秒级启动 + 性能/包体守门。

#### 4.1 脚手架 CLI

- [ ] `create-plinth-app` — 交互式生成器
  - [ ] 选框架（Next.js / Vue）
  - [ ] 选能力（i18n / 监控 / API client / Tailwind）
  - [ ] 自动生成 `.npmrc` / GitHub Actions / 完整可运行项目

#### 4.2 质量门禁

- [ ] E2E：模板内置 Playwright 配置 + 示例用例
- [ ] Bundle size：`size-limit` 或 Next.js `@next/bundle-analyzer` 接入 CI，超阈值阻断
- [ ] Lighthouse CI：性能 / a11y / SEO 预算
- [ ] 视觉回归（可选）：Chromatic 或 Loki，配合 Storybook

#### 4.3 Codemod / 迁移工具

- [ ] `@plinth/codemod` — 跨业务项目批量迁移（依赖升级、API 改名）

**产出**：新项目 `pnpm create @plinth/app` 一行命令拉起；性能/包体回归自动拦截。

---

### Phase 5 — 治理与可视化（持续）

**目标**：把 10 个业务项目的"工程健康度"汇聚到一个看板。

- [ ] **版本基线巡检**：定时扫描业务项目使用的 `@plinth/*` 版本，落后超 N 个 minor 自动开 issue
- [ ] **配置漂移检测**：业务项目本地是否覆盖了共享 ESLint / TS 规则，超阈值告警
- [ ] **工程指标看板**：聚合各项目的构建时长、产物大小、测试覆盖率、依赖漏洞数
- [ ] **文档站**：把 CONSUMING / ROADMAP / 各包 README / Storybook 聚合成一个 docs site（VitePress 或 Nextra）

**产出**：可视化的工程化成熟度，能向上汇报。

---

## 三、决策与权衡

### 推荐路径

**Phase 0 → 1 → 2.1 协作模板 → 3.1 工具层 → 2.2 依赖治理 → 3.2 UI**

理由：协作模板和工具层成本低、立即可用；UI 组件库虽然价值大但工期长，先把**框架性**东西铺完再做。

### 不推荐做的（明确不做）

- ❌ **自建监控 / 埋点服务**：直接基于 Sentry / 现有平台封装即可
- ❌ **自研构建工具**：Vite / Next.js 已经够好
- ❌ **超前抽象**：UI 组件库等真有 3+ 业务项目要用同一个组件再下沉

### 风险点

- **共享 UI 是双刃剑**：抽得太早会被业务定制需求撕裂。建议**先用 3+ 真实场景验证**再下沉到 `@plinth/ui`。
- **npm 公开 registry**：业务方安装慢、CI token 管理是长期痛点，需要在 CONSUMING.md 持续完善。
- **版本治理**：`@plinth/*` 频繁 major 会让业务方升级疲劳，需要严格遵守 semver 并准备 codemod。

---

## 四、当前 Backlog（可立即领取的任务）

> 完成 Phase 0 后随时可以按需挑。

| ID   | 任务                                              | 阶段 | 预估 |
| ---- | ------------------------------------------------- | ---- | ---- |
| B-01 | Vue 模板 lint 接入 eslint-config-prettier         | 0    | 0.5h |
| B-02 | 统一分支策略为 master                             | 0    | 0.5h |
| B-03 | 删除 apps/web 与 apps/docs                        | 0    | 0.5h |
| B-04 | 重写根 README                                     | 0    | 1h   |
| A-01 | 首次发布 @plinth/\* 到 npm 公开 registry          | 1    | 0.5d |
| A-02 | 试点业务项目端到端接入                            | 1    | 1d   |
| C-01 | PR / Issue / CODEOWNERS / CONTRIBUTING / SECURITY | 2    | 0.5d |
| C-02 | Renovate 配置                                     | 2    | 0.5d |
| C-03 | @plinth/env（zod env schema）                     | 2    | 1d   |
| D-01 | @plinth/utils 第一版                              | 3    | 2d   |
| D-02 | @plinth/api-client 第一版                         | 3    | 3d   |
| D-03 | @plinth/ui-react + Storybook 第一版               | 3    | 5d   |

---

## 五、参考与约定

- **scope 名**：`@plinth`
- **包管理器**：pnpm 10+
- **registry**：npm 公开 registry
- **分支策略**：trunk-based（master 为发布分支，feature 分支短生命周期）
- **版本策略**：semver + changesets，每个公开包每次行为变更必须带 changeset
- **提交规范**：Conventional Commits（commitlint 强制）

文档维护人：随路线图推进同步更新本文件。
