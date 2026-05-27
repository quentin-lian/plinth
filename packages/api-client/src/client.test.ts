import { describe, expect, it, vi } from 'vitest';

import { createApiClient } from './client.js';
import { ApiError } from './errors.js';

function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

describe('ApiClient', () => {
  it('GET decodes JSON and joins baseUrl', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ hello: 'world' }));
    const client = createApiClient({ baseUrl: 'https://api.example.com', fetch: fetchMock });
    const data = await client.get<{ hello: string }>('/v1/hello');
    expect(data).toEqual({ hello: 'world' });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/v1/hello');
  });

  it('POST serializes body to JSON and sets Content-Type', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ id: 1 }));
    const client = createApiClient({ fetch: fetchMock });
    await client.post('https://api.example.com/users', { name: 'a' });
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    expect(init?.body).toBe(JSON.stringify({ name: 'a' }));
    expect((init?.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });

  it('appends query params from `query`', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}));
    const client = createApiClient({ fetch: fetchMock });
    await client.get('https://api.example.com/users', { query: { page: 2, q: undefined } });
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/users?page=2');
  });

  it('throws ApiError with status + body for non-2xx', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ message: 'nope' }, { status: 400, statusText: 'Bad Request' }),
    );
    const client = createApiClient({ fetch: fetchMock });
    await expect(client.get('https://api.example.com/x')).rejects.toMatchObject({
      code: 'http',
      status: 400,
      body: { message: 'nope' },
    });
  });

  it('request interceptor can mutate headers (e.g. inject auth)', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}));
    const client = createApiClient({ fetch: fetchMock });
    client.useRequest((req) => ({
      ...req,
      headers: { ...req.headers, Authorization: 'Bearer t' },
    }));
    await client.get('https://api.example.com/x');
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer t');
  });

  it('retries on 500 then succeeds', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      if (calls < 2) return jsonResponse({}, { status: 500 });
      return jsonResponse({ ok: true });
    });
    const client = createApiClient({ fetch: fetchMock, retries: 3 });
    const data = await client.get<{ ok: boolean }>('https://api.example.com/x');
    expect(data).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry 4xx', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}, { status: 400 }));
    const client = createApiClient({ fetch: fetchMock, retries: 5 });
    await expect(client.get('https://api.example.com/x')).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('honors AbortSignal', async () => {
    const fetchMock = vi.fn(
      (_url: unknown, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            const err = new Error('aborted');
            err.name = 'AbortError';
            reject(err);
          });
        }),
    );
    const client = createApiClient({ fetch: fetchMock as unknown as typeof fetch });
    const ctrl = new AbortController();
    const p = client.get('https://api.example.com/x', { signal: ctrl.signal });
    ctrl.abort();
    await expect(p).rejects.toMatchObject({ code: 'aborted' });
  });

  it('error interceptor sees ApiError with request context', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}, { status: 401 }));
    const client = createApiClient({ fetch: fetchMock });
    const seen: { code: string; status?: number }[] = [];
    client.useError((error) => {
      seen.push({ code: error.code, status: error.status });
      return error;
    });
    await expect(client.get('https://api.example.com/x')).rejects.toBeInstanceOf(ApiError);
    expect(seen).toEqual([{ code: 'http', status: 401 }]);
  });
});
