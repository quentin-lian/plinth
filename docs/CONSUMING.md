# 业务项目接入指南

把 `@bitfe/*` 一组共享配置接到一个新的或已有的业务项目里，5 步即可。

---

## 一、准备 GitHub PAT（每位开发者一次性）

`@bitfe/*` 发布在 **GitHub Packages**，是私有 registry，安装时需要带 token。

1. 打开 https://github.com/settings/tokens 生成一个 **Classic** PAT。
2. 勾选 scope：
   - `read:packages`（必选，安装依赖）
   - `write:packages`（仅当你要发布时勾）
3. 把 token 写进 `~/.zshrc`（或 `~/.bashrc`）：

   ```bash
   export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
   ```

   然后 `source ~/.zshrc`。

> CI 环境（GitHub Actions）不需要做这步，会自动注入 `GITHUB_TOKEN`。

---

## 二、在业务项目根写 `.npmrc`

```
@bitfe:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> `${GITHUB_TOKEN}` 用环境变量占位，**不要写死 token**。这个文件可以提交进 git。

---

## 三、安装共享配置

```bash
# 按需选择
pnpm add -D @bitfe/eslint-config @bitfe/typescript-config @bitfe/prettier-config

# Tailwind 项目额外加：
pnpm add -D @bitfe/prettier-config-tailwind

# 用 commitlint 的话：
pnpm add -D @bitfe/commitlint-config @commitlint/cli husky
```

同时安装对应 peer：

```bash
pnpm add -D eslint typescript prettier
```

---

## 四、接入配置

### 4.1 ESLint（v9 flat config）

`eslint.config.js`：

```js
// Next.js 项目
import config from '@bitfe/eslint-config/next';
export default config;

// 普通 React 项目
import config from '@bitfe/eslint-config/react';
export default config;

// Vue 3 项目
import config from '@bitfe/eslint-config/vue';
export default config;

// Node.js 服务/工具
import config from '@bitfe/eslint-config/node';
export default config;
```

### 4.2 TypeScript

`tsconfig.json`：

```jsonc
{
  // 按项目类型选一个
  "extends": "@bitfe/typescript-config/nextjs.json",
  // "extends": "@bitfe/typescript-config/react.json",
  // "extends": "@bitfe/typescript-config/react-library.json",
  // "extends": "@bitfe/typescript-config/vue.json",
  // "extends": "@bitfe/typescript-config/nuxt.json",
  // "extends": "@bitfe/typescript-config/node.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
  },
  "include": ["src", "next-env.d.ts"],
}
```

### 4.3 Prettier

`package.json`：

```json
{
  "prettier": "@bitfe/prettier-config"
}
```

Tailwind 项目改成 `@bitfe/prettier-config-tailwind`。

### 4.4 Commitlint + Husky（可选）

`commitlint.config.mjs`：

```js
export default { extends: ['@bitfe/commitlint-config'] };
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

## 五、加常用脚本

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

## 常见问题

**Q: `pnpm install` 报 401 / 403？**
A: PAT 没注入或没勾 `read:packages`。先 `echo $GITHUB_TOKEN` 验证，再去 GitHub 重发 token。

**Q: 想升级配置版本？**
A: `pnpm up @bitfe/eslint-config@latest`。所有 `@bitfe/*` 都遵循 semver，看 [bitfe-infra CHANGELOG](https://github.com/bitfe/bitfe-infra/releases) 了解破坏性变更。

**Q: CI 报 "Cannot find package '@bitfe/...'"？**
A: 检查 CI 里有没有这两步：

```yaml
- uses: actions/setup-node@v4
  with:
    registry-url: https://npm.pkg.github.com
    scope: '@bitfe'
- run: pnpm install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
