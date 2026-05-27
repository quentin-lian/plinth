import type { ApiError } from './errors.js';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiRequest {
  url: string;
  method: Method;
  headers: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
  signal?: AbortSignal;
  /** 单次请求超时 ms，覆盖客户端默认 */
  timeout?: number;
  /** 单次请求重试覆盖（数字代表次数） */
  retries?: number;
  /** 期望的响应解码方式，默认 'json' */
  responseType?: 'json' | 'text' | 'blob' | 'response';
  /** 任意上下文，传给拦截器 / shouldRetry 使用 */
  context?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
  /** 原始 Response，仅在 responseType='response' 或调试时使用 */
  raw: Response;
}

export interface RequestInterceptor {
  (request: ApiRequest): ApiRequest | Promise<ApiRequest>;
}

export interface ResponseInterceptor {
  <T>(response: ApiResponse<T>, request: ApiRequest): ApiResponse<T> | Promise<ApiResponse<T>>;
}

export interface ErrorInterceptor {
  (error: ApiError, request: ApiRequest): never | Promise<never> | ApiError | Promise<ApiError>;
}

export interface ApiClientOptions {
  baseUrl?: string;
  /** 默认 headers，会被请求级 headers 覆盖 */
  headers?: Record<string, string>;
  /** 默认请求超时 ms。0 / undefined 表示不超时。 */
  timeout?: number;
  /** 默认重试次数（含首次），1 表示不重试。 */
  retries?: number;
  /** 自定义 fetch 实现（测试时注入 mock） */
  fetch?: typeof fetch;
  /** 哪些错误值得重试。默认网络错误、超时、5xx 重试。 */
  shouldRetry?: (error: ApiError, attempt: number) => boolean;
}
