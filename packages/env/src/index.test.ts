import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createEnv, EnvValidationError } from './index.js';

describe('createEnv', () => {
  it('returns parsed values when all server + client variables are valid', () => {
    const env = createEnv({
      server: z.object({
        DATABASE_URL: z.string().url(),
      }),
      client: z.object({
        NEXT_PUBLIC_API_URL: z.string().url(),
      }),
      source: {
        DATABASE_URL: 'postgres://localhost:5432/db',
        NEXT_PUBLIC_API_URL: 'https://api.example.com',
      },
      isServer: true,
    });

    expect(env.DATABASE_URL).toBe('postgres://localhost:5432/db');
    expect(env.NEXT_PUBLIC_API_URL).toBe('https://api.example.com');
  });

  it('hides server variables on the client', () => {
    const env = createEnv({
      server: z.object({
        DATABASE_URL: z.string().url(),
      }),
      client: z.object({
        NEXT_PUBLIC_API_URL: z.string().url(),
      }),
      source: {
        DATABASE_URL: 'postgres://localhost:5432/db',
        NEXT_PUBLIC_API_URL: 'https://api.example.com',
      },
      isServer: false,
    });

    expect((env as Record<string, unknown>).DATABASE_URL).toBeUndefined();
    expect(env.NEXT_PUBLIC_API_URL).toBe('https://api.example.com');
  });

  it('throws EnvValidationError aggregating all field issues', () => {
    expect(() =>
      createEnv({
        server: z.object({
          DATABASE_URL: z.string().url(),
          SESSION_SECRET: z.string().min(32),
        }),
        source: {
          DATABASE_URL: 'not-a-url',
          SESSION_SECRET: 'too-short',
        },
        isServer: true,
      }),
    ).toThrow(EnvValidationError);
  });

  it('rejects client variable that does not match clientPrefix', () => {
    expect(() =>
      createEnv({
        client: z.object({
          API_URL: z.string().url(),
        }),
        source: { API_URL: 'https://x.com' },
        clientPrefix: 'NEXT_PUBLIC_',
      }),
    ).toThrow(/must start with "NEXT_PUBLIC_"/);
  });

  it('honors custom clientPrefix (Vite)', () => {
    const env = createEnv({
      client: z.object({
        VITE_API_URL: z.string().url(),
      }),
      source: { VITE_API_URL: 'https://api.example.com' },
      clientPrefix: 'VITE_',
      isServer: false,
    });

    expect(env.VITE_API_URL).toBe('https://api.example.com');
  });

  it('returns frozen object', () => {
    const env = createEnv({
      client: z.object({
        NEXT_PUBLIC_X: z.string(),
      }),
      source: { NEXT_PUBLIC_X: 'y' },
      isServer: false,
    });

    expect(Object.isFrozen(env)).toBe(true);
  });

  it('skipValidation bypasses schema (escape hatch)', () => {
    const env = createEnv({
      server: z.object({ DATABASE_URL: z.string().url() }),
      source: { DATABASE_URL: 'invalid' },
      skipValidation: true,
      isServer: true,
    }) as Record<string, unknown>;

    expect(env.DATABASE_URL).toBe('invalid');
  });
});
