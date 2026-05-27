import { describe, expect, it, vi } from 'vitest';

import { debounce, throttle } from './debounce.js';

describe('debounce', () => {
  it('only fires once after wait ms with the latest args', async () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const d = debounce(spy, 100);

    d('a');
    d('b');
    d('c');
    expect(spy).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('c');
    vi.useRealTimers();
  });

  it('cancel prevents pending call', async () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const d = debounce(spy, 100);

    d('x');
    d.cancel();
    await vi.advanceTimersByTimeAsync(200);
    expect(spy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('flush executes immediately with the latest args', () => {
    const spy = vi.fn();
    const d = debounce(spy, 100);
    d('a');
    d('b');
    d.flush();
    expect(spy).toHaveBeenCalledWith('b');
  });
});

describe('throttle', () => {
  it('fires immediately on leading edge then suppresses within window', async () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const t = throttle(spy, 100);

    t('a');
    t('b');
    t('c');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');

    await vi.advanceTimersByTimeAsync(100);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('c');
    vi.useRealTimers();
  });
});
