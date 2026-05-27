---
'@plinth/utils': minor
---

新增 `@plinth/utils`：业务高频复用的轻量工具集，零运行时依赖。

首版包含：

- 时序：`sleep`（带 AbortSignal）、`debounce`（cancel/flush）、`throttle`（leading + trailing）
- 异步控制：`retry`（指数退避 + 抖动 + shouldRetry 谓词）
- Result 类型：`Result<T, E>`、`ok`、`err`、`safe`
- Storage：`safeLocalStorage` / `safeSessionStorage`（自动 JSON、SSR 安全）
- URL：`buildQuery`、`withQuery`（跳过 null/undefined、覆盖语义）

22 个单测覆盖核心语义，详见 [packages/utils/README.md](../packages/utils/README.md)。
