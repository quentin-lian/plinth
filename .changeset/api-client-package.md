---
'@plinth/api-client': minor
---

新增 `@plinth/api-client`：基于原生 fetch 的 HTTP 客户端，统一所有业务项目的 API 访问语义。

首版能力：

- 鉴权 / 追踪 header 通过 `useRequest` 拦截器统一注入
- 错误归一化到 `ApiError`，按 `code` 分类：`network` / `timeout` / `aborted` / `http` / `parse`
- 默认对网络错误、超时、5xx 重试（指数退避 + 抖动，复用 `@plinth/utils` 的 retry）
- 4xx 不重试，避免放大业务错误
- 内置超时（AbortController + 外部 signal 协作）、JSON 默认编解码、query 自动拼装
- `useRequest` / `useResponse` / `useError` 三类拦截器
- 9 个单测覆盖 GET/POST、query、错误归一化、取消、重试策略、拦截器

详见 [packages/api-client/README.md](../packages/api-client/README.md)。
