# 发布手册

`@plinth/*` 系列包的发布全流程。本手册的一切都假设你站在 `quentin-lian/plinth` 仓库的 `main` 分支，且本地一切 gate 全绿。

---

## 〇、心智模型

```
开发者              GitHub PR         CI                npm registry
  │                   │                │                    │
  │ pnpm changeset    │                │                    │
  ├──────────────────>│                │                    │
  │                   │ merge to main  │                    │
  │                   ├───────────────>│                    │
  │                   │                │ open Release PR    │
  │                   │<───────────────┤ (chore(release))   │
  │ review Release PR │                │                    │
  │                   │ merge          │                    │
  │                   ├───────────────>│ run pnpm release   │
  │                   │                ├───────────────────>│ publish 9 pkgs
```

**核心约束**：所有发布都走 CI，不在本地 `pnpm publish`。本地只用来加 changeset、跑预览、写代码。

---

## 一、首发前置（一次性）

### 1.1 注册 npm 账号 + 申明 scope

> 仓库已切到公开 npm registry（`access: public`），不需要付费账号。

1. 打开 https://www.npmjs.com/signup 注册账号
2. 启用 2FA：Account → Set up Two-Factor Authentication（强烈推荐 `Authorization and Publishing` 级别）
3. 验证邮箱
4. 验证 scope `@plinth` 未被占用：

   ```bash
   npm view @plinth/utils
   # 期望输出 "404 Not Found - GET https://registry.npmjs.org/@plinth%2futils"
   ```

   404 = 可用。如果返回了别人的包，需要换 scope（参考路线图调整决策）。

### 1.2 生成 Automation Token

1. https://www.npmjs.com/settings/<你的账号>/tokens
2. **Generate New Token → Granular Access Token**（推荐，比 Classic 安全）
   - **Token name**：`plinth-ci`
   - **Expiration**：365 天（到期前 30 天会有邮件提醒）
   - **Packages and scopes** → `@plinth` 全部 read+write
   - **IP allowlist**：留空（GitHub Actions IP 不固定）
   - **Bypass 2FA**：✅ 勾上（Automation token 必须勾，否则 CI 会卡 2FA 提示）
3. 复制 token（`npm_xxxxx`），关掉页面后看不到第二次

### 1.3 把 Token 注入到 GitHub Secrets

```
仓库 → Settings → Secrets and variables → Actions → New repository secret
  Name:  NPM_TOKEN
  Value: <粘贴 npm_xxxxx>
```

> 不要存在 `GITHUB_TOKEN`，那个是 GitHub 自动注入的内置 secret，不要被覆盖。

### 1.4 确认 GitHub Actions 权限

```
仓库 → Settings → Actions → General → Workflow permissions
  ◉ Read and write permissions
  ☑ Allow GitHub Actions to create and approve pull requests
```

不勾这两项，changesets bot 没法开 Release PR。

---

## 二、首次发布（9 个包同时到 0.1.0）

### 2.1 确认仓库已 push

```bash
git remote -v          # 应指向 https://github.com/quentin-lian/plinth.git
git push -u origin main
```

### 2.2 触发 Release PR

CI 在 `main` 推送后会自动跑 `.github/workflows/release.yml`，发现 `.changeset/*.md` 中有未发布的 changeset，会开一个标题为 `chore(release): version packages` 的 PR。

打开这个 PR，应该看到：

- 9 个 `package.json` 的 `version` 从 `0.0.0` 改到 `0.1.0`
- 每个包目录下新增（或更新）`CHANGELOG.md`
- 6 个 changeset 文件（包括 `initial-public-release.md`）被删掉

> 这个 PR **由 bot 自动维护**，每次往 main 加新的 changeset 它会自己 force-push 重写。不要手动 commit 到这个分支。

### 2.3 评审并合入 Release PR

合入后 CI 自动二次跑 release.yml：

```
1. pnpm install --frozen-lockfile
2. changesets/action 检测到没有未发布 changeset 了
3. 走 publish 分支：执行 `pnpm release`
   = `turbo run build --filter=./packages/* && changeset publish`
4. 9 个包用 NPM_TOKEN 发到 npm，每个发 git tag（如 @plinth/utils@0.1.0）
```

### 2.4 验证发布

```bash
# 查包是否都到了
for pkg in eslint-config prettier-config prettier-config-tailwind typescript-config \
           test-config commitlint-config utils api-client env; do
  echo -n "@plinth/$pkg: "
  npm view "@plinth/$pkg" version 2>/dev/null || echo "MISSING"
done

# 期望全部输出 0.1.0
```

```bash
# 在临时目录拉一下，确认能装
mkdir /tmp/plinth-smoke && cd /tmp/plinth-smoke
npm init -y >/dev/null
npm install @plinth/utils @plinth/api-client @plinth/env zod
node -e "console.log(require('@plinth/utils'))"
```

不过 — `@plinth/utils` 是 ESM-only 包（`type: module`），node 命令行用 `import()` 或 `.mjs` 文件验证：

```bash
node --input-type=module -e "import('@plinth/utils').then(m => console.log(Object.keys(m)))"
```

---

## 三、后续日常发布

### 3.1 改了某个包

```bash
# 在 feature 分支
pnpm changeset            # 交互式选受影响的包 + 升级类型 + 写说明
git add .changeset/*.md
git commit -m "feat(utils): add chunk helper"
git push -u origin feat/utils-chunk
# 开 PR → review → merge into main
```

### 3.2 升级类型怎么选

| 类型  | 何时选                                  | 例                                          |
| ----- | --------------------------------------- | ------------------------------------------- |
| patch | 修 bug、内部重构、文档、不影响外部 API  | 修一个边界 case、改 README                  |
| minor | 加新能力、向后兼容、加可选参数          | 新增 `chunk()` 工具、给 retry 加新 option   |
| major | 删 / 改名 API、改默认值、消费方需要迁移 | 把 `safe()` 重命名为 `tryCatch()`、调整签名 |

**0.x 阶段的特殊约定**：semver 允许在 0.x 用 minor 表达破坏性变更。但建议团队仍按上述常规理解，避免被业务方频繁打扰。

### 3.3 紧急回滚

npm 包发出去 72 小时内可用 `npm unpublish`，超过 72 小时只能 `npm deprecate` + 发新版：

```bash
# 立刻撤回（72h 内）
npm unpublish @plinth/utils@0.2.1

# 或者标记为废弃（任何时候）
npm deprecate @plinth/utils@0.2.1 "broken release, please use 0.2.2+"
```

回滚后立刻发一个修复版本盖上去。

---

## 四、CHANGELOG 与 GitHub Release

- 每个包目录下 `CHANGELOG.md` 由 changesets 自动生成
- GitHub Releases 由 `@changesets/changelog-github` 自动写：包名 + 版本 + 链接到 PR / contributor

不需要手动维护任何 CHANGELOG 文件。

---

## 五、常见问题

**Q: Release PR 没自动创建？**
A: 检查三件事：

1. `.changeset/*.md` 中有没有 changeset（除了 `README.md` 和 `config.json`）
2. GitHub Actions Workflow permissions 是否设为 `Read and write`
3. release.yml 触发分支是不是 `main`

**Q: CI 报 `npm error 401 Unauthorized`？**
A: `NPM_TOKEN` 没设、过期、或不是 Automation token。Granular token 必须勾 "Bypass 2FA"。

**Q: CI 报 `npm error 403 Forbidden - PUT https://registry.npmjs.org/@plinth%2fxxx`？**
A: scope `@plinth` 不属于你的 npm 账号 / 没勾这个 scope 的 read+write 权限。回到 1.2 重发 token。

**Q: CI 报 `EPUBLISHCONFLICT`？**
A: 当前版本号已被发布过。可能是：

- Release PR 没合就手动改过版本号
- 之前 `npm unpublish` 过同版本（npm 不允许复用版本号）
  解法：跑一遍 `pnpm changeset` 生成新 changeset，再合 Release PR 升到下一个版本号。

**Q: 想跑 dry-run 看会发什么？**
A: 本地跑 `pnpm changeset status --verbose` 看预览。不要在本地跑 `changeset publish`，会真的发出去。

**Q: 想发 prerelease（如 0.1.0-beta.0）？**
A: 走 changesets 的 `pre` 模式：

```bash
pnpm changeset pre enter beta
pnpm changeset       # 加变更
# merge release PR → 发出 0.1.0-beta.0
pnpm changeset pre exit  # 完成 beta，下次发正式版
```

---

## 六、首发 checklist

复制下面到 issue 里逐项 ✅：

```md
- [ ] npm 账号已注册 + 2FA 已开
- [ ] `npm view @plinth/utils` 返回 404（scope 未被占用）
- [ ] `NPM_TOKEN` 已加到 repo secrets，且 Bypass 2FA
- [ ] Workflow permissions = Read and write + 允许 PR
- [ ] 本地 `pnpm changeset status --verbose` 显示 9 包升到 0.1.0
- [ ] `git push -u origin main` 完成
- [ ] CI 跑绿（ci.yml）
- [ ] release.yml 触发并自动开 Release PR
- [ ] Release PR 合入
- [ ] release.yml 二次运行，9 包发布成功
- [ ] `npm view @plinth/utils version` = 0.1.0
- [ ] 临时目录 `npm install @plinth/utils` 成功
- [ ] 试点业务项目按 [CONSUMING.md](./CONSUMING.md) 接入跑通
```
