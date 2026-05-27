/**
 * 归一化的 HTTP 错误。所有非 2xx 响应、网络错误、超时都会被包成这个类。
 *
 * 业务侧只需 `instanceof ApiError` + 看 `code` 即可分类处理：
 * - `network` — fetch 自身抛错（断网、CORS、DNS）
 * - `timeout` — 自定义超时触发
 * - `aborted` — 调用方取消
 * - `http`    — 服务端返回非 2xx
 * - `parse`   — 响应体反序列化失败
 */
export type ApiErrorCode = 'network' | 'timeout' | 'aborted' | 'http' | 'parse';

export interface ApiErrorInit {
  code: ApiErrorCode;
  message: string;
  status?: number;
  /** 服务端返回的原始 body（已尽量解析为 JSON 或 text） */
  body?: unknown;
  cause?: unknown;
  url?: string;
  method?: string;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly body?: unknown;
  readonly url?: string;
  readonly method?: string;

  constructor(init: ApiErrorInit) {
    super(init.message, init.cause ? { cause: init.cause } : undefined);
    this.name = 'ApiError';
    this.code = init.code;
    this.status = init.status;
    this.body = init.body;
    this.url = init.url;
    this.method = init.method;
  }
}
