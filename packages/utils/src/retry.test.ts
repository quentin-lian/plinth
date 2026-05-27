import { describe, expect, it, vi } from 'vitest';

import { retry } from './retry.js';

describe('retry', () => {
  it('returns value on first success', async () => {
    const fn = vi.fn(async () => 'ok');
    expect(await retry(fn)).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure up to retries times', async () => {
    let calls = 0;
    const fn = vi.fn(async () => {
      calls++;
      if (calls < 3) throw new Error('boom');
      return 'ok';
    });
    expect(await retry(fn, { retries: 3, initialDelay: 1, jitter: 0 })).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws original error after exhausting retries', async () => {
    const fn = vi.fn(async () => {
      throw new Error('always fails');
    });
    await expect(retry(fn, { retries: 2, initialDelay: 1, jitter: 0 })).rejects.toThrow(
      'always fails',
    );
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('respects shouldRetry predicate', async () => {
    const fn = vi.fn(async () => {
      throw new Error('skip');
    });
    await expect(
      retry(fn, { retries: 5, initialDelay: 1, jitter: 0, shouldRetry: () => false }),
    ).rejects.toThrow('skip');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
