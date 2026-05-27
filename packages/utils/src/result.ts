/**
 * Result 类型：把抛错变成数据。便于在调用点用结构化方式处理失败。
 *
 * @example
 * ```ts
 * const r = await safe(() => api.fetchUser(id));
 * if (!r.ok) {
 *   logger.warn('fetchUser failed', r.error);
 *   return fallback;
 * }
 * return r.value;
 * ```
 */
export type Result<T, E = unknown> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export async function safe<T>(fn: () => Promise<T> | T): Promise<Result<T, unknown>> {
  try {
    return ok(await fn());
  } catch (error) {
    return err(error);
  }
}
