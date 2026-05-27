import type { z } from 'zod';

/**
 * 运行时 env 校验失败时抛出的错误，包含每个字段的具体原因，便于在启动日志里快速定位。
 */
export class EnvValidationError extends Error {
  readonly issues: ReadonlyArray<{ path: string; message: string }>;

  constructor(issues: ReadonlyArray<{ path: string; message: string }>) {
    const lines = issues.map((i) => `  - ${i.path}: ${i.message}`).join('\n');
    super(`Invalid environment variables:\n${lines}`);
    this.name = 'EnvValidationError';
    this.issues = issues;
  }
}

export interface CreateEnvOptions<TServer extends z.ZodRawShape, TClient extends z.ZodRawShape> {
  /**
   * 仅服务端可读的变量。Next.js 中不要带 NEXT_PUBLIC_ 前缀；Vite 中不要带 VITE_ 前缀。
   */
  server?: z.ZodObject<TServer>;
  /**
   * 暴露到浏览器的变量。Next.js 必须以 NEXT_PUBLIC_ 开头，Vite 必须以 VITE_ 开头。
   */
  client?: z.ZodObject<TClient>;
  /**
   * 校验前缀（默认 NEXT_PUBLIC_）。Vite 项目传 'VITE_'。
   */
  clientPrefix?: string;
  /**
   * 实际读取的来源，默认 process.env。SSR 边界自定义来源时传入。
   */
  source?: Record<string, string | undefined>;
  /**
   * 服务端运行时（typeof window === 'undefined'）。提供给非标准环境（如 deno、edge runtime）覆盖。
   */
  isServer?: boolean;
  /**
   * 跳过校验（仅推荐在测试快照中临时使用）。
   */
  skipValidation?: boolean;
}

type Merge<A, B> = { [K in keyof A]: A[K] } & { [K in keyof B]: B[K] };

/**
 * 校验环境变量并返回类型安全的对象。
 *
 * 在浏览器侧，server schema 中的字段会被全部置为 undefined（即使 source 里有也不暴露），
 * 防止泄露。client schema 中的字段必须带 clientPrefix。
 *
 * @example
 * ```ts
 * import { z } from 'zod';
 * import { createEnv } from '@bitfe/env';
 *
 * export const env = createEnv({
 *   server: z.object({
 *     DATABASE_URL: z.string().url(),
 *     SESSION_SECRET: z.string().min(32),
 *   }),
 *   client: z.object({
 *     NEXT_PUBLIC_API_BASE_URL: z.string().url(),
 *   }),
 * });
 * ```
 */
export function createEnv<TServer extends z.ZodRawShape, TClient extends z.ZodRawShape>(
  options: CreateEnvOptions<TServer, TClient>,
): Readonly<Merge<z.infer<z.ZodObject<TServer>>, z.infer<z.ZodObject<TClient>>>> {
  const {
    server,
    client,
    clientPrefix = 'NEXT_PUBLIC_',
    source = typeof process !== 'undefined' ? process.env : {},
    isServer = typeof (globalThis as { window?: unknown }).window === 'undefined',
    skipValidation = false,
  } = options;

  if (skipValidation) {
    return source as never;
  }

  if (client) {
    for (const key of Object.keys(client.shape)) {
      if (!key.startsWith(clientPrefix)) {
        throw new EnvValidationError([
          {
            path: key,
            message: `client variable must start with "${clientPrefix}"`,
          },
        ]);
      }
    }
  }

  const issues: { path: string; message: string }[] = [];
  const merged: Record<string, unknown> = {};

  if (isServer && server) {
    const result = server.safeParse(source);
    if (result.success) {
      Object.assign(merged, result.data);
    } else {
      for (const issue of result.error.issues) {
        issues.push({ path: issue.path.join('.'), message: issue.message });
      }
    }
  }

  if (client) {
    const result = client.safeParse(source);
    if (result.success) {
      Object.assign(merged, result.data);
    } else {
      for (const issue of result.error.issues) {
        issues.push({ path: issue.path.join('.'), message: issue.message });
      }
    }
  }

  if (issues.length > 0) {
    throw new EnvValidationError(issues);
  }

  return Object.freeze(merged) as never;
}
