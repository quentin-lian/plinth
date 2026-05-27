/**
 * 把对象拼成 query string。undefined / null 字段会被跳过，数组按 `key=v1&key=v2` 展开。
 *
 * @example
 * ```ts
 * buildQuery({ a: 1, b: undefined, c: ['x', 'y'] }) // 'a=1&c=x&c=y'
 * ```
 */
export function buildQuery(params: Record<string, unknown>): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined && v !== null) usp.append(key, String(v));
      }
    } else {
      usp.append(key, String(value));
    }
  }
  return usp.toString();
}

/**
 * 在已有 URL 上叠加 query。已存在的 key 会被覆盖（而不是追加），
 * 这是绝大多数业务场景想要的语义。
 */
export function withQuery(url: string, params: Record<string, unknown>): string {
  const queryStart = url.indexOf('?');
  const base = queryStart === -1 ? url : url.slice(0, queryStart);
  const existing = queryStart === -1 ? '' : url.slice(queryStart + 1);
  const usp = new URLSearchParams(existing);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      usp.delete(key);
      continue;
    }
    if (Array.isArray(value)) {
      usp.delete(key);
      for (const v of value) {
        if (v !== undefined && v !== null) usp.append(key, String(v));
      }
    } else {
      usp.set(key, String(value));
    }
  }
  const qs = usp.toString();
  return qs ? `${base}?${qs}` : base;
}
