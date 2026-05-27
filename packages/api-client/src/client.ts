import { retry as retryFn } from '@plinth/utils';

import { ApiError } from './errors.js';
import type {
  ApiClientOptions,
  ApiRequest,
  ApiResponse,
  ErrorInterceptor,
  Method,
  RequestInterceptor,
  ResponseInterceptor,
} from './types.js';

const DEFAULT_RETRYABLE = (error: ApiError): boolean => {
  if (error.code === 'aborted') return false;
  if (error.code === 'network' || error.code === 'timeout') return true;
  if (error.code === 'http' && error.status !== undefined && error.status >= 500) return true;
  return false;
};

function joinUrl(baseUrl: string | undefined, path: string): string {
  if (!baseUrl) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const b = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

function appendQuery(url: string, query?: Record<string, unknown>): string {
  if (!query) return url;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      for (const item of v) if (item !== undefined && item !== null) usp.append(k, String(item));
    } else {
      usp.append(k, String(v));
    }
  }
  const qs = usp.toString();
  if (!qs) return url;
  return url.includes('?') ? `${url}&${qs}` : `${url}?${qs}`;
}

async function decodeBody<T>(
  response: Response,
  responseType: ApiRequest['responseType'],
): Promise<T> {
  if (responseType === 'response') return response as unknown as T;
  if (responseType === 'blob') return (await response.blob()) as T;
  if (responseType === 'text') return (await response.text()) as T;
  const ct = response.headers.get('content-type') ?? '';
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }
  if (ct.includes('application/json')) {
    return (await response.json()) as T;
  }
  // 默认尝试 JSON，失败回退 text
  const text = await response.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export class ApiClient {
  readonly baseUrl: string | undefined;
  readonly defaultHeaders: Record<string, string>;
  readonly defaultTimeout: number | undefined;
  readonly defaultRetries: number;
  readonly fetchImpl: typeof fetch;
  readonly shouldRetry: (error: ApiError, attempt: number) => boolean;

  private readonly requestInterceptors: RequestInterceptor[] = [];
  private readonly responseInterceptors: ResponseInterceptor[] = [];
  private readonly errorInterceptors: ErrorInterceptor[] = [];

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl;
    this.defaultHeaders = { Accept: 'application/json', ...options.headers };
    this.defaultTimeout = options.timeout;
    this.defaultRetries = options.retries ?? 1;
    this.fetchImpl = options.fetch ?? fetch.bind(globalThis);
    this.shouldRetry = options.shouldRetry ?? DEFAULT_RETRYABLE;
  }

  useRequest(interceptor: RequestInterceptor): this {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  useResponse(interceptor: ResponseInterceptor): this {
    this.responseInterceptors.push(interceptor);
    return this;
  }

  useError(interceptor: ErrorInterceptor): this {
    this.errorInterceptors.push(interceptor);
    return this;
  }

  async request<T = unknown>(input: Partial<ApiRequest> & { url: string }): Promise<T> {
    let req: ApiRequest = {
      method: input.method ?? 'GET',
      url: input.url,
      headers: { ...this.defaultHeaders, ...input.headers },
      query: input.query,
      body: input.body,
      signal: input.signal,
      timeout: input.timeout ?? this.defaultTimeout,
      retries: input.retries ?? this.defaultRetries,
      responseType: input.responseType ?? 'json',
      context: input.context,
    };

    for (const interceptor of this.requestInterceptors) {
      req = await interceptor(req);
    }

    const finalReq = req;

    const exec = async (): Promise<ApiResponse<T>> => {
      const url = appendQuery(joinUrl(this.baseUrl, finalReq.url), finalReq.query);

      let body: BodyInit | undefined;
      const headers = { ...finalReq.headers };
      if (finalReq.body !== undefined && finalReq.body !== null) {
        if (
          typeof finalReq.body === 'string' ||
          finalReq.body instanceof FormData ||
          finalReq.body instanceof Blob ||
          finalReq.body instanceof URLSearchParams ||
          finalReq.body instanceof ArrayBuffer
        ) {
          body = finalReq.body as BodyInit;
        } else {
          body = JSON.stringify(finalReq.body);
          if (!Object.keys(headers).some((k) => k.toLowerCase() === 'content-type')) {
            headers['Content-Type'] = 'application/json';
          }
        }
      }

      const controllers: AbortController[] = [];
      const timeoutController = new AbortController();
      controllers.push(timeoutController);
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      if (finalReq.timeout && finalReq.timeout > 0) {
        timeoutId = setTimeout(() => timeoutController.abort('timeout'), finalReq.timeout);
      }

      const externalSignal = finalReq.signal;
      const onExternalAbort = () => timeoutController.abort(externalSignal?.reason);
      if (externalSignal) {
        if (externalSignal.aborted) timeoutController.abort(externalSignal.reason);
        else externalSignal.addEventListener('abort', onExternalAbort, { once: true });
      }

      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          method: finalReq.method,
          headers,
          body,
          signal: timeoutController.signal,
        });
      } catch (cause) {
        if (timeoutId !== undefined) clearTimeout(timeoutId);
        externalSignal?.removeEventListener('abort', onExternalAbort);
        const aborted = (cause as { name?: string })?.name === 'AbortError';
        if (aborted && externalSignal?.aborted) {
          throw new ApiError({
            code: 'aborted',
            message: 'Request aborted',
            url,
            method: finalReq.method,
            cause,
          });
        }
        if (aborted) {
          throw new ApiError({
            code: 'timeout',
            message: `Request timed out after ${finalReq.timeout}ms`,
            url,
            method: finalReq.method,
            cause,
          });
        }
        throw new ApiError({
          code: 'network',
          message: (cause as Error)?.message ?? 'Network error',
          url,
          method: finalReq.method,
          cause,
        });
      } finally {
        if (timeoutId !== undefined) clearTimeout(timeoutId);
        externalSignal?.removeEventListener('abort', onExternalAbort);
      }

      if (!response.ok) {
        let errBody: unknown;
        try {
          errBody = await decodeBody<unknown>(response.clone(), finalReq.responseType);
        } catch {
          /* ignore decode failure for error path */
        }
        throw new ApiError({
          code: 'http',
          status: response.status,
          message: `HTTP ${response.status} ${response.statusText}`.trim(),
          body: errBody,
          url,
          method: finalReq.method,
        });
      }

      let data: T;
      try {
        data = await decodeBody<T>(response, finalReq.responseType);
      } catch (cause) {
        throw new ApiError({
          code: 'parse',
          message: 'Failed to decode response body',
          url,
          method: finalReq.method,
          cause,
        });
      }

      let result: ApiResponse<T> = {
        data,
        status: response.status,
        headers: response.headers,
        raw: response,
      };
      for (const interceptor of this.responseInterceptors) {
        result = (await interceptor(result, finalReq)) as ApiResponse<T>;
      }
      return result;
    };

    try {
      const result = await retryFn(exec, {
        retries: Math.max(1, finalReq.retries ?? this.defaultRetries),
        initialDelay: 200,
        shouldRetry: (error, attempt) =>
          error instanceof ApiError && this.shouldRetry(error, attempt),
        signal: finalReq.signal,
      });
      return result.data;
    } catch (raw) {
      let error =
        raw instanceof ApiError
          ? raw
          : new ApiError({
              code: 'network',
              message: (raw as Error)?.message ?? 'Unknown error',
              cause: raw,
            });
      for (const interceptor of this.errorInterceptors) {
        const handled = await interceptor(error, finalReq);
        if (handled instanceof ApiError) error = handled;
      }
      throw error;
    }
  }

  get<T = unknown>(url: string, init?: Partial<ApiRequest>): Promise<T> {
    return this.request<T>({ ...init, url, method: 'GET' });
  }

  post<T = unknown>(url: string, body?: unknown, init?: Partial<ApiRequest>): Promise<T> {
    return this.request<T>({ ...init, url, method: 'POST', body });
  }

  put<T = unknown>(url: string, body?: unknown, init?: Partial<ApiRequest>): Promise<T> {
    return this.request<T>({ ...init, url, method: 'PUT', body });
  }

  patch<T = unknown>(url: string, body?: unknown, init?: Partial<ApiRequest>): Promise<T> {
    return this.request<T>({ ...init, url, method: 'PATCH', body });
  }

  delete<T = unknown>(url: string, init?: Partial<ApiRequest>): Promise<T> {
    return this.request<T>({ ...init, url, method: 'DELETE' });
  }
}

export function createApiClient(options?: ApiClientOptions): ApiClient {
  return new ApiClient(options);
}

export type { Method };
