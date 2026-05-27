# plinth

公司前端基础设施仓库。承载一组 `@plinth/*` 共享配置包，提供给所有业务前端项目（React / Vue）使用，确保整个组织的代码风格、类型、测试、提交、发布流水线统一。

> 当前迭代阶段与未来计划见 [docs/ROADMAP.md](./docs/ROADMAP.md)。

---

## 仓库结构

```
plinth/
├── packages/                    可发布的 @plinth/* 共享配置
│   ├── eslint-config/           ESLint 9 flat config（base/react/next/vue/node）
│   ├── prettier-config/         Prettier 3 + 导入排序
│   ├── prettier-config-tailwind/  Prettier + Tailwind class 排序
│   ├── typescript-config/       共享 tsconfig（base/nextjs/vue/node/nuxt）
│   ├── test-config/             Vitest + Testing Library 预设（React/Vue）
│   └── commitlint-config/       commitlint 规则
├── templates/                   业务起步模板（不发布）
│   ├── nextjs-app/              Next.js 16 + React 19
│   └── vue-app/                 Vue 3.5 + Vite 7
├── docs/                        接入指南与路线图
│   ├── CONSUMING.md             业务项目接入步骤
│   └── ROADMAP.md               演进路线图
└── .changeset/                  changesets 版本管理
```

---

## 工具栈

| 维度       | 选型                                                |
| ---------- | --------------------------------------------------- |
| 包管理器   | pnpm 10+                                            |
| Monorepo   | pnpm workspaces + Turborepo 2                       |
| Node       | ≥ 18                                                |
| Lint       | ESLint 9 flat config + typescript-eslint v8         |
| Format     | Prettier 3.7 + import sort + Tailwind 插件          |
| TypeScript | 5.9                                                 |
| Test       | Vitest 4 + jsdom + Testing Library (React 16/Vue 8) |
| Commit     | commitlint + husky + lint-staged                    |
| 发布       | changesets + npm 公开 registry                      |
| CI         | GitHub Actions（CI / Release）                      |

---

## 快速开始（本仓库内开发）

```bash
# 安装依赖
pnpm install

# 全量校验
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build

# 添加一个 changeset（修改 packages/* 必备）
pnpm changeset
```

> 每次修改 `packages/*` 中的可发布包，**必须**附带一个 changeset。`templates/*` 不发布，可省略。

---

## 业务项目如何接入

去看 [docs/CONSUMING.md](./docs/CONSUMING.md)，按 5 步即可把 `@plinth/*` 接到任意业务项目里。

---

## 模板使用

`templates/` 下的两个起步项目为新业务项目提供参考：

- [templates/nextjs-app](./templates/nextjs-app) — Next.js 16 + React 19，端口 3100
- [templates/vue-app](./templates/vue-app) — Vue 3.5 + Vite 7，端口 3200

> 在脚手架（`create-plinth-app`，见 ROADMAP Phase 4）就绪前，新业务项目可手动复制对应模板。

---

## 提交与分支

- **默认分支**：`master`
- **提交规范**：Conventional Commits（commitlint 强制）
- **提交格式**：`type(scope): subject` —— `feat / fix / chore / docs / refactor / perf / test / build / ci / style / revert`

```bash
# 例
git commit -m "feat(eslint-config): add Vue type-aware preset"
```

husky pre-commit 会自动跑 lint-staged（prettier --write）。

---

## 发布

发布走 changesets 流水线，由 [.github/workflows/release.yml](./.github/workflows/release.yml) 在 `master` 推送时触发：

1. PR 中 `pnpm changeset` 添加变更说明
2. PR 合入 `master` 后，bot 自动创建 "Version Packages" PR
3. 合入 Version PR，CI 自动 `pnpm release`，发布到 npm 公开 registry

详见 [docs/ROADMAP.md](./docs/ROADMAP.md) 的 Phase 1。

---

## 许可证

[MIT](./LICENSE)
