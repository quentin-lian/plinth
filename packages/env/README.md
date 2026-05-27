# @plinth/env

运行时环境变量校验工具，基于 [zod](https://zod.dev/)。启动时缺失或格式错误的变量直接抛错，避免线上裸奔。

## 安装

```bash
pnpm add @plinth/env zod
```

## 使用

### Next.js（默认 `NEXT_PUBLIC_` 前缀）

```ts
// src/lib/env.ts
import { z } from 'zod';

import { createEnv } from '@plinth/env';

export const env = createEnv({
  server: z.object({
    DATABASE_URL: z.string().url(),
    SESSION_SECRET: z.string().min(32),
  }),
  client: z.object({
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  }),
});
```

```ts
// 任意位置
import { env } from '@/lib/env';

const apiUrl = env.NEXT_PUBLIC_API_BASE_URL; // string，浏览器可读
const dbUrl = env.DATABASE_URL; // string，仅服务端；浏览器侧为 undefined
```

### Vite / Vue（`VITE_` 前缀）

```ts
import { z } from 'zod';

import { createEnv } from '@plinth/env';

export const env = createEnv({
  client: z.object({
    VITE_API_BASE_URL: z.string().url(),
  }),
  clientPrefix: 'VITE_',
  source: import.meta.env, // Vite 注入的对象
});
```

### Node.js / 后端服务

```ts
import { z } from 'zod';

import { createEnv } from '@plinth/env';

export const env = createEnv({
  server: z.object({
    PORT: z.coerce.number().int().positive().default(3000),
    NODE_ENV: z.enum(['development', 'staging', 'production']),
  }),
  isServer: true,
});
```

## API

### `createEnv(options)`

| 选项             | 默认                            | 说明                                                    |
| ---------------- | ------------------------------- | ------------------------------------------------------- |
| `server`         | `undefined`                     | 仅服务端可读的 zod schema                               |
| `client`         | `undefined`                     | 浏览器可读的 zod schema，字段必须以 `clientPrefix` 开头 |
| `clientPrefix`   | `'NEXT_PUBLIC_'`                | 客户端字段前缀                                          |
| `source`         | `process.env`                   | 实际读取来源；Vite 项目传 `import.meta.env`             |
| `isServer`       | `typeof window === 'undefined'` | 是否服务端运行时                                        |
| `skipValidation` | `false`                         | 跳过校验（仅测试快照临时使用）                          |

### `EnvValidationError`

校验失败时抛出，`error.issues` 包含每个字段的 `{ path, message }`。

## 设计要点

- **服务端隔离**：`server` schema 中的变量在浏览器侧自动置 `undefined`，避免误用泄露密钥
- **前缀强制**：`client` 字段不带 `clientPrefix` 直接报错，提前拦截配置错误
- **聚合错误**：所有字段问题一次性报出，不要解一个修一个

## 何时不该用

- 单纯的开关型 feature flag → 用专门的 feature flag 服务
- 需要热更新的配置 → 走配置中心，不要走 env
