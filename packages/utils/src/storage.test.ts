import { beforeEach, describe, expect, it } from 'vitest';

import { safeLocalStorage } from './storage.js';

describe('safeLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('round-trips JSON values', () => {
    safeLocalStorage.set('k', { a: 1 });
    expect(safeLocalStorage.get<{ a: number }>('k')).toEqual({ a: 1 });
  });

  it('returns null for missing key', () => {
    expect(safeLocalStorage.get('missing')).toBeNull();
  });

  it('returns null for corrupted JSON instead of throwing', () => {
    window.localStorage.setItem('bad', '{not json');
    expect(safeLocalStorage.get('bad')).toBeNull();
  });

  it('remove deletes the key', () => {
    safeLocalStorage.set('k', 1);
    safeLocalStorage.remove('k');
    expect(safeLocalStorage.get('k')).toBeNull();
  });
});
