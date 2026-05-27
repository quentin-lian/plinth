# @plinth Project Templates

业务工程起手式模板集合。每个模板都已预接 `@plinth/*` 配置包（eslint / prettier / typescript / test-config），开箱即用。

## 可用模板

| 模板                                 | 技术栈                           | 默认端口 | 说明                                     |
| ------------------------------------ | -------------------------------- | -------- | ---------------------------------------- |
| [nextjs-app](./nextjs-app/README.md) | Next.js 16 App Router + React 19 | 3100     | SSR / RSC / 应用路由                     |
| [vue-app](./vue-app/README.md)       | Vue 3.5 + Vite 7                 | 3200     | SPA / Composition API + `<script setup>` |

## 使用方式

模板**不会**发布到 npm，仅作为起手式存在仓库内。新业务工程的接入流程：

```bash
# 1. 拷贝模板到工程目录（脱离 monorepo）
cp -R templates/<template-name>/ ../my-new-app
cd ../my-new-app

# 2. 替换 workspace 协议为已发布版本
sed -i '' 's/workspace:\*/^0.1.0/g' package.json

# 3. 安装并启动
pnpm install
pnpm dev
```

> `@plinth/*` 是 npm 公开 registry 的 public 包，无需配置 `.npmrc` / token。

> 完整接入指南：[docs/CONSUMING.md](../docs/CONSUMING.md)

## 模板维护约定

- 模板包标记 `"private": true`，不会被 changesets 发布
- `.changeset/config.json` 的 `ignore` 列表已包含全部模板
- 模板内部依赖 `@plinth/*` 使用 `workspace:*`，业务工程拷贝出去后改成 `^x.y.z`
- 模板示例代码保持**最小可用**：一个页面 + 一个 smoke 测试，避免业务逻辑入侵
