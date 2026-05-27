# 贡献指南

感谢你愿意为 `plinth` 贡献代码 / 文档 / 反馈。本文说明本仓库的工作流，目标是让任何成员都能在 30 分钟内提交第一个 PR。

> 你只是要把 `@plinth/*` 接入业务项目？请直接看 [docs/CONSUMING.md](./docs/CONSUMING.md)，本文档不适合你。

---

## 一、本地开发

### 环境要求

- Node ≥ 18（推荐 20 LTS）
- pnpm ≥ 10
- Git ≥ 2.30

### 启动

```bash
git clone https://github.com/quentin-lian/plinth.git
cd plinth
pnpm install
```

`pnpm install` 会自动激活 husky 钩子。

### 常用命令

```bash
pnpm format         # prettier 写入
pnpm format:check   # 仅检查
pnpm lint           # 全 workspace eslint
pnpm check-types    # 全 workspace tsc / vue-tsc
pnpm test           # 全 workspace vitest
pnpm build          # 全 workspace 构建（如有）

# 调试单个包
pnpm --filter @plinth/eslint-config build
pnpm --filter @plinth/template-vue-app dev
```

---

## 二、提交规范

提交消息走 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，由 commitlint 强制：

```
type(scope): subject
```

`type` 取值：

| type     | 用途                             |
| -------- | -------------------------------- |
| feat     | 新功能（**必须配 changeset**）   |
| fix      | bug 修复（**必须配 changeset**） |
| refactor | 重构，无外部行为变化             |
| perf     | 性能优化                         |
| test     | 测试相关                         |
| docs     | 文档                             |
| chore    | 工程化、依赖、配置               |
| ci       | CI 流程                          |
| style    | 仅格式 / 空白（不应单独出现）    |
| revert   | 回滚                             |
| build    | 构建系统                         |

`scope` 推荐取包名后缀，如 `eslint-config`、`vue-template`。

`subject` 用英文小写，不加句号，限制在 100 字符内，正文每行也不要超 100 字符（commitlint 规则）。

### Hooks 行为

- **pre-commit**：lint-staged 跑 prettier --write
- **commit-msg**：commitlint 校验

如果 hook 阻止了提交，**修复问题再次提交**，不要用 `--no-verify` 绕过。

---

## 三、Changesets

`packages/*` 是发布到 npm 公开 registry 的公开包，每次行为变更都要附 changeset：

```bash
pnpm changeset
```

按提示选择受影响的包和升级类型（patch / minor / major），再写一段简短的变更说明。

判断规则：

- **patch**：修 bug、文档、内部重构
- **minor**：新增能力，向后兼容
- **major**：移除/重命名 API、改默认值、消费方需要迁移

`templates/*` 不发布，已在 `.changeset/config.json` 的 `ignore` 列表里，不需要 changeset。

---

## 四、PR 流程

1. 从 `main` 创建 feature 分支：`git checkout -b feat/xxx`
2. 在分支上提交，每个 PR 尽量保持原子（一个目的）
3. 跑通本地 gate：

   ```bash
   pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm build
   ```

4. 推送并开 PR，按 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md) 填写
5. 等 CI 绿 + Code Owner 评审通过后合并

CI 见 [.github/workflows/ci.yml](.github/workflows/ci.yml)。

### PR 评审注意点

- 改 `packages/*` 的，**强制要求** 至少一个 [CODEOWNERS](.github/CODEOWNERS) 中对应组的 reviewer
- 破坏性变更必须在 PR 描述里写明迁移步骤，并在 changeset 里以 `BREAKING CHANGE:` 开头

---

## 五、发布流程

发布由 [.github/workflows/release.yml](.github/workflows/release.yml) 自动触发：

1. PR 合入 `main` 后，CI 跑 changesets/action
2. 若 `.changeset/*.md` 中有未发布的 changeset，bot 会自动开一个 "chore(release): version packages" PR
3. 该 PR 把版本号、CHANGELOG、依赖范围一并更新好
4. 合入此 PR → CI 自动 `pnpm release` 把包发布到 npm 公开 registry

> ⚠️ 直接在 main 上手动 `pnpm changeset publish` 会绕过 CI，**不要这么干**。

---

## 六、调试与排错

### Lint / Type / Test 在 CI 失败但本地通过

- 本地 `rm -rf node_modules && pnpm install --frozen-lockfile` 后重试
- 比对 Node / pnpm 版本是否与 CI 一致（CI 用 Node 20）

### Husky 钩子没触发

```bash
pnpm install   # 重新跑 prepare
ls .husky/     # 确认 commit-msg、pre-commit 存在
```

### 找不到 `@plinth/xxx`

workspace 内是 symlink，运行 `pnpm install` 即可。

---

## 七、行为准则

- 在 issue / PR 中保持专业、尊重
- 不在公开 issue 里贴公司机密、token、生产数据
- 安全问题走 [SECURITY.md](./SECURITY.md)，不要在公开 issue 里披露

---

## 八、继续阅读

- [README.md](./README.md) — 仓库结构与工具栈
- [docs/CONSUMING.md](./docs/CONSUMING.md) — 业务项目接入
- [docs/ROADMAP.md](./docs/ROADMAP.md) — 演进路线图
