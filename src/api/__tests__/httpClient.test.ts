import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, requestJson } from '../httpClient';

function mockLocalStorageWithSession(rawSession: string | null) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => (key === 'girlcare-session' ? rawSession : null)),
    },
    configurable: true,
  });
}

describe('httpClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('sends x-user-email header when session exists', async () => {
    mockLocalStorageWithSession(
      JSON.stringify({
        email: 'mentor@example.com',
        name: 'mentor',
        loggedInAt: '2026-03-23T10:00:00.000Z',
      }),
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    globalThis.fetch = fetchMock;

    await requestJson('/questions');

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = requestInit.headers as Record<string, string>;
    expect(headers['X-User-Email']).toBe('mentor@example.com');
  });

  it('throws ApiError with backend message when response fails', async () => {
    mockLocalStorageWithSession(null);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Invalid payload' }),
    });
    globalThis.fetch = fetchMock;

    await expect(requestJson('/questions', { method: 'POST', body: { content: '' } })).rejects.toMatchObject({
      status: 400,
      message: 'Invalid payload',
    } satisfies Partial<ApiError>);
  });
});
