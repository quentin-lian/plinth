# `@bitfe/typescript-config`

Monorepo 共享的 TypeScript 配置预设集合。覆盖常见前端栈，所有预设均启用 `strict` 与 `noUncheckedIndexedAccess`。

## 预设

| 预设                                          | 适用场景                      |
| --------------------------------------------- | ----------------------------- |
| `@bitfe/typescript-config/base.json`          | 通用 JS/TS 库，所有预设的基底 |
| `@bitfe/typescript-config/react.json`         | React 应用                    |
| `@bitfe/typescript-config/react-library.json` | 发布到 npm 的 React 组件库    |
| `@bitfe/typescript-config/nextjs.json`        | Next.js 应用                  |
| `@bitfe/typescript-config/vue.json`           | Vue 3 应用                    |
| `@bitfe/typescript-config/nuxt.json`          | Nuxt 应用                     |
| `@bitfe/typescript-config/node.json`          | Node.js 服务/CLI              |

## 使用

消费方根目录加 `tsconfig.json`：

```jsonc
{
  "extends": "@bitfe/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
  },
  "include": ["src", "next-env.d.ts"],
}
```

## 安装

```bash
pnpm add -D typescript @bitfe/typescript-config
```

## 关键开关

- `strict: true`、`noUncheckedIndexedAccess: true`
- `module / moduleResolution: NodeNext`
- `target / lib: ES2022 + DOM`（按预设差异）
- `isolatedModules: true`（兼容 esbuild / SWC / tsx 等单文件转译器）
- `skipLibCheck: true`（业务项目默认开，库类型问题去库内修）
