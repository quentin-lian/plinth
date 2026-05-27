# `@plinth/prettier-config-tailwind`

在 [`@plinth/prettier-config`](../prettier-config) 之上叠加 [`prettier-plugin-tailwindcss`](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)，自动按 Tailwind 推荐顺序整理 `class` 属性。

## 使用

`package.json` 里加：

```json
{
  "prettier": "@plinth/prettier-config-tailwind"
}
```

## 安装

```bash
pnpm add -D prettier @plinth/prettier-config-tailwind
```

> 普通（非 Tailwind）项目请用 [`@plinth/prettier-config`](../prettier-config)。
