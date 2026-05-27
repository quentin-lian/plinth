# @plinth/template-nextjs-app

公司 Next.js 16 起手式模板，预接：

- `@plinth/eslint-config/next` — ESLint v9 flat config
- `@plinth/prettier-config` — 含 import 排序
- `@plinth/typescript-config/nextjs.json` — TS 5 严格模式
- `@plinth/test-config/vitest-react` — Vitest + jsdom + Testing Library
- React 19 + Next 16 App Router

## 复用方式

直接把本目录复制到新仓库（**不要 fork 整个 monorepo**）：

```bash
# 1. 复制模板（替换 my-app 为你的项目名）
cp -R templates/nextjs-app/ ../my-app
cd ../my-app

# 2. 把 workspace 协议替换成已发布的版本
sed -i '' 's/workspace:\*/^0.1.0/g' package.json   # 按实际版本替换

# 3. 安装并启动
pnpm install
pnpm dev   # http://localhost:3100
```

> `@plinth/*` 是 npm 公开 registry 的 public 包，无需配置 `.npmrc` / token。

> 详细的"业务工程接入指南"见仓库 [docs/CONSUMING.md](../../docs/CONSUMING.md)。

## 目录

```
app/
  layout.tsx       # 根布局
  page.tsx         # 首页
  page.test.tsx    # 示例测试（vitest + RTL + jest-dom）
eslint.config.js   # 仅 import @plinth/eslint-config/next
tsconfig.json      # extends @plinth/typescript-config/nextjs.json
vitest.config.ts   # import @plinth/test-config/vitest-react
vitest.d.ts        # jest-dom matcher 类型扩展
```

## Scripts

| 命令                | 作用                                                |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Next dev server（默认 3100，避开 monorepo 内 3000） |
| `pnpm build`        | Next 生产构建                                       |
| `pnpm start`        | 跑构建产物                                          |
| `pnpm lint`         | ESLint（max-warnings 0）                            |
| `pnpm format`       | Prettier 写入                                       |
| `pnpm format:check` | Prettier 校验                                       |
| `pnpm check-types`  | next typegen + `tsc --noEmit`                       |
| `pnpm test`         | Vitest 一次性                                       |
| `pnpm test:watch`   | Vitest watch                                        |
