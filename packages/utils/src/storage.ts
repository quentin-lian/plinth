/**
 * 安全的 storage 包装：
 * - 自动 JSON 序列化
 * - 浏览器禁用 storage / SSR 时不抛错（返回 null / 默默失败）
 * - get 解析失败返回 null 而不是抛 SyntaxError
 */
export interface SafeStorage {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

function pickStorage(kind: 'local' | 'session'): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function build(storage: Storage | null): SafeStorage {
  return {
    get<T>(key: string): T | null {
      if (!storage) return null;
      try {
        const raw = storage.getItem(key);
        if (raw === null) return null;
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    set<T>(key: string, value: T): void {
      if (!storage) return;
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch {
        // 配额超限 / 隐私模式：默默忽略，业务自行兜底
      }
    },
    remove(key: string): void {
      if (!storage) return;
      try {
        storage.removeItem(key);
      } catch {
        /* noop */
      }
    },
    clear(): void {
      if (!storage) return;
      try {
        storage.clear();
      } catch {
        /* noop */
      }
    },
  };
}

export const safeLocalStorage: SafeStorage = build(pickStorage('local'));
export const safeSessionStorage: SafeStorage = build(pickStorage('session'));
