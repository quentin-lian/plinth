import { sleep } from './sleep.js';

export interface RetryOptions {
  /** 最多尝试次数（含第一次），默认 3 */
  retries?: number;
  /** 初始延迟 ms，默认 200 */
  initialDelay?: number;
  /** 退避因子，默认 2（指数退避） */
  factor?: number;
  /** 单次最大延迟 ms，默认 5000 */
  maxDelay?: number;
  /** 抖动比例 [0, 1]，默认 0.1（避免雷鸣群效应） */
  jitter?: number;
  /** 仅当返回 true 才重试。默认所有错误都重试。 */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** 取消信号 */
  signal?: AbortSignal;
}

/**
 * 带指数退避 + 抖动的重试。
 *
 * @example
 * ```ts
 * const data = await retry(() => fetch('/api/x').then(r => r.json()), {
 *   retries: 5,
 *   shouldRetry: (e) => e instanceof TypeError, // 仅网络错误重试
 * });
 * ```
 */
export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    retries = 3,
    initialDelay = 200,
    factor = 2,
    maxDelay = 5000,
    jitter = 0.1,
    shouldRetry = () => true,
    signal,
  } = options;

  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    if (signal?.aborted) throw signal.reason ?? new Error('Aborted');
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries || !shouldRetry(error, attempt)) {
        throw error;
      }
      const base = Math.min(initialDelay * Math.pow(factor, attempt - 1), maxDelay);
      const delay = base * (1 + (Math.random() * 2 - 1) * jitter);
      await sleep(delay, { signal });
    }
  }
  throw lastError;
}
