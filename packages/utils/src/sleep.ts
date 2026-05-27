/**
 * 等待指定毫秒数。比 setTimeout + Promise 更好读，可以被 AbortSignal 取消。
 *
 * @example
 * ```ts
 * await sleep(300);
 * await sleep(1000, { signal: controller.signal });
 * ```
 */
export function sleep(ms: number, options?: { signal?: AbortSignal }): Promise<void> {
  return new Promise((resolve, reject) => {
    if (options?.signal?.aborted) {
      reject(options.signal.reason ?? new Error('Aborted'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    options?.signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(options.signal?.reason ?? new Error('Aborted'));
      },
      { once: true },
    );
  });
}
