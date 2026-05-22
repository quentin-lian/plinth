# @bitfe/template-vue-app

公司 Vue 3 + Vite 起手式模板，预接：

- `@bitfe/eslint-config/vue` — Vue flat/recommended + type-aware 规则
- `@bitfe/prettier-config` — 含 import 排序
- `@bitfe/typescript-config/vue.json` — TS 5 严格 + Vite client types
- `@bitfe/test-config/vitest-vue` — Vitest + jsdom + @testing-library/vue
- Vue 3.5 + Vite 7 + vue-tsc

## 复用方式

```bash
# 1. 复制模板
cp -R templates/vue-app/ ../my-vue-app
cd ../my-vue-app

# 2. 私有源 token（一次性设置在 ~/.zshrc）
echo 'export GITHUB_TOKEN=<your_pat_with_read:packages>' >> ~/.zshrc
source ~/.zshrc

# 3. 复制 npmrc 模板
cp .npmrc.example .npmrc

# 4. 把 workspace 协议替换成已发布版本
sed -i '' 's/workspace:\*/^0.1.0/g' package.json

# 5. 安装并启动
pnpm install
pnpm dev   # http://localhost:3200
```

> 详细的"业务工程接入指南"见仓库 [docs/CONSUMING.md](../../docs/CONSUMING.md)。

## 目录

```
index.html
src/
  App.vue          # 示例组件（含 ref 计数）
  App.test.ts      # 示例测试（vitest + @testing-library/vue + jest-dom）
  env.d.ts         # vite/client + *.vue 类型声明
  main.ts          # 应用入口
eslint.config.js   # 仅 import @bitfe/eslint-config/vue
tsconfig.json      # extends @bitfe/typescript-config/vue.json
vite.config.ts     # Vite + @ → src alias
vitest.config.ts   # 在 @bitfe/test-config/vitest-vue 之上加 alias
vitest.d.ts        # jest-dom matcher 类型扩展
```

## Scripts

| 命令                | 作用                                         |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Vite dev server（默认 3200）                 |
| `pnpm build`        | `vue-tsc -b && vite build`                   |
| `pnpm preview`      | 跑构建产物                                   |
| `pnpm lint`         | ESLint（max-warnings 0，含 type-aware 检查） |
| `pnpm format`       | Prettier 写入                                |
| `pnpm format:check` | Prettier 校验                                |
| `pnpm check-types`  | `vue-tsc --noEmit`                           |
| `pnpm test`         | Vitest 一次性                                |
| `pnpm test:watch`   | Vitest watch                                 |
