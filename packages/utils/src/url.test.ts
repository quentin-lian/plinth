import { describe, expect, it } from 'vitest';

import { buildQuery, withQuery } from './url.js';

describe('buildQuery', () => {
  it('encodes simple object', () => {
    expect(buildQuery({ a: 1, b: 'x' })).toBe('a=1&b=x');
  });

  it('skips null/undefined', () => {
    expect(buildQuery({ a: 1, b: undefined, c: null })).toBe('a=1');
  });

  it('expands arrays as repeated keys', () => {
    expect(buildQuery({ tag: ['x', 'y'] })).toBe('tag=x&tag=y');
  });
});

describe('withQuery', () => {
  it('appends to a base url', () => {
    expect(withQuery('/users', { page: 2 })).toBe('/users?page=2');
  });

  it('overrides existing keys', () => {
    expect(withQuery('/users?page=1&size=10', { page: 2 })).toBe('/users?page=2&size=10');
  });

  it('removes key when value is null', () => {
    expect(withQuery('/users?page=1', { page: null })).toBe('/users');
  });
});
