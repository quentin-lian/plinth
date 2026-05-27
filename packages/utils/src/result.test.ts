import { describe, expect, it } from 'vitest';

import { err, ok, safe } from './result.js';

describe('result', () => {
  it('ok wraps value', () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 });
  });

  it('err wraps error', () => {
    expect(err('oops')).toEqual({ ok: false, error: 'oops' });
  });

  it('safe captures sync return', async () => {
    const r = await safe(() => 42);
    expect(r).toEqual({ ok: true, value: 42 });
  });

  it('safe captures async error', async () => {
    const r = await safe(async () => {
      throw new Error('x');
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect((r.error as Error).message).toBe('x');
  });
});
