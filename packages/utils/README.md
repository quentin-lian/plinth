# @plinth/utils

业务高频复用的轻量工具集。零运行时依赖，全 ESM，tree-shakeable（`sideEffects: false`）。

## 安装

```bash
pnpm add @plinth/utils
```

## API 一览

| 模块        | 导出                                     | 用途                                  |
| ----------- | ---------------------------------------- | ------------------------------------- |
| 时序        | `sleep`, `debounce`, `throttle`          | 异步等待、节流防抖（带 cancel/flush） |
| 异步控制    | `retry`                                  | 指数退避 + 抖动重试                   |
| Result 类型 | `Result`, `ok`, `err`, `safe`            | 把异常变成数据                        |
| Storage     | `safeLocalStorage`, `safeSessionStorage` | 自动 JSON、SSR 安全                   |
| URL         | `buildQuery`, `withQuery`                | 拼装/覆盖 query string                |

## 示例

### sleep

```ts
import { sleep } from '@plinth/utils';

await sleep(300);
await sleep(1000, { signal: controller.signal }); // 可被中止
```

### debounce / throttle

```ts
import { debounce } from '@plinth/utils';

const onSearch = debounce((q: string) => fetch(`/api?q=${q}`), 200);
input.addEventListener('input', (e) => onSearch((e.target as HTMLInputElement).value));

// 立即执行最后一次：
onSearch.flush();
// 取消所有 pending：
onSearch.cancel();
```

### retry

```ts
import { retry } from '@plinth/utils';

const data = await retry(() => fetch('/api').then((r) => r.json()), {
  retries: 5,
  initialDelay: 300,
  shouldRetry: (e) => e instanceof TypeError, // 只在网络错误时重试
});
```

### Result

```ts
import { safe } from '@plinth/utils';

const r = await safe(() => api.fetchUser(id));
if (!r.ok) {
  logger.warn('fetchUser failed', r.error);
  return fallback;
}
return r.value;
```

### Storage

```ts
import { safeLocalStorage } from '@plinth/utils';

safeLocalStorage.set('settings', { theme: 'dark' });
const settings = safeLocalStorage.get<{ theme: string }>('settings');
// SSR 或浏览器禁用 storage 时返回 null，不抛错
```

### URL

```ts
import { buildQuery, withQuery } from '@plinth/utils';

buildQuery({ a: 1, b: undefined, c: ['x', 'y'] }); // 'a=1&c=x&c=y'
withQuery('/users?page=1', { page: 2, size: 20 }); // '/users?page=2&size=20'
```

## 设计原则

- **零依赖**：不引入 lodash、qs 等大块头。需要单点能力，优先在这里加，不在业务里造轮子
- **SSR 安全**：所有访问 window/storage 的工具都做了 `typeof` 守卫
- **可取消**：异步工具尽量接受 `AbortSignal`
- **小颗粒**：每个文件一个职责，便于摇树
