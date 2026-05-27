type AnyFn<TArgs extends unknown[]> = (...args: TArgs) => unknown;

export interface DebouncedFn<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel(): void;
  flush(): void;
}

/**
 * 标准的 trailing-edge 防抖。最后一次调用后等待 wait 毫秒再执行。
 * 提供 cancel / flush 控制。
 */
export function debounce<TArgs extends unknown[]>(
  fn: AnyFn<TArgs>,
  wait: number,
): DebouncedFn<TArgs> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: TArgs | null = null;

  const debounced = ((...args: TArgs) => {
    lastArgs = args;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (lastArgs) {
        const a = lastArgs;
        lastArgs = null;
        fn(...a);
      }
    }, wait);
  }) as DebouncedFn<TArgs>;

  debounced.cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (lastArgs) {
      const a = lastArgs;
      lastArgs = null;
      fn(...a);
    }
  };

  return debounced;
}

export interface ThrottledFn<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel(): void;
}

/**
 * leading-edge throttle。每 wait ms 内最多触发一次，并保留最后一次调用在窗口结束时执行。
 */
export function throttle<TArgs extends unknown[]>(
  fn: AnyFn<TArgs>,
  wait: number,
): ThrottledFn<TArgs> {
  let lastCallAt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: TArgs | null = null;

  const throttled = ((...args: TArgs) => {
    const now = Date.now();
    const remaining = wait - (now - lastCallAt);
    if (remaining <= 0) {
      lastCallAt = now;
      pendingArgs = null;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      fn(...args);
    } else {
      pendingArgs = args;
      if (timer === null) {
        timer = setTimeout(() => {
          lastCallAt = Date.now();
          timer = null;
          if (pendingArgs) {
            const a = pendingArgs;
            pendingArgs = null;
            fn(...a);
          }
        }, remaining);
      }
    }
  }) as ThrottledFn<TArgs>;

  throttled.cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    pendingArgs = null;
    lastCallAt = 0;
  };

  return throttled;
}
