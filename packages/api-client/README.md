# @bitfe/api-client

基于原生 `fetch` 的 HTTP 客户端。统一鉴权注入、错误归一化、超时、重试、取消、JSON 默认编解码。所有业务端用同一套语义，避免每个项目自己写 wrapper。

## 安装

```bash
pnpm add @bitfe/api-client
```

## 快速上手

```ts
import { ApiError, createApiClient } from '@bitfe/api-client';

export const api = createApiClient({
  baseUrl: 'https://api.example.com',
  timeout: 10_000,
  retries: 3,
});

api.useRequest((req) => ({
  ...req,
  headers: { ...req.headers, Authorization: `Bearer ${getToken()}` },
}));

api.useError((error) => {
  if (error.code === 'http' && error.status === 401) {
    redirectToLogin();
  }
  return error;
});

const user = await api.get<User>('/v1/users/me');
const created = await api.post<User>('/v1/users', { name: 'a' });
```

## 错误处理

所有失败都会抛 `ApiError`，业务侧用 `error.code` 分类即可：

| code      | 含义                                     |
| --------- | ---------------------------------------- |
| `network` | fetch 自身报错（断网、CORS、DNS）        |
| `timeout` | 客户端配置的超时触发                     |
| `aborted` | 调用方主动取消（AbortSignal）            |
| `http`    | 服务端返回非 2xx，`status` + `body` 可读 |
| `parse`   | 响应体反序列化失败                       |

```ts
try {
  const data = await api.get('/x');
} catch (e) {
  if (e instanceof ApiError && e.code === 'http' && e.status === 404) {
    return null;
  }
  throw e;
}
```

## 重试策略

默认对 `network` / `timeout` / `5xx` 重试（由 `@bitfe/utils` 的 `retry` 提供指数退避 + 抖动）。`4xx` 不会重试。

自定义：

```ts
createApiClient({
  retries: 5,
  shouldRetry: (error, attempt) => {
    if (error.code === 'http' && error.status === 429) return attempt < 3;
    return error.code === 'network';
  },
});
```

## 拦截器

| 钩子          | 用途                                                   |
| ------------- | ------------------------------------------------------ |
| `useRequest`  | 在发出之前修改请求（鉴权、追加 trace header）          |
| `useResponse` | 在解码之后处理响应（解包 `{ data, code }` 之类的协议） |
| `useError`    | 统一处理失败（401 跳登录、上报监控）                   |

拦截器按注册顺序执行，`useError` 中返回 `ApiError` 表示继续抛出（可替换错误对象），抛出新错误也支持。

## 与 zod 配合

```ts
import { z } from 'zod';

const User = z.object({ id: z.string(), name: z.string() });
const data = User.parse(await api.get('/v1/users/me'));
```

后续可考虑出 `defineEndpoint(schema)` 的语法糖（Phase 3 后续）。

## 设计要点

- **零核心依赖**：仅依赖 `@bitfe/utils` 的 `retry`
- **编解码可关闭**：`responseType: 'response'` 拿到原 `Response`，业务自由处理流式 / SSE
- **取消优先**：`AbortSignal` 贯穿外部取消、超时、重试
- **不内置 baseURL 多环境切换**：环境差异由 `@bitfe/env` 注入 baseUrl，分层清晰
