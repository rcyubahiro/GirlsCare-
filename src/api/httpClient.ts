const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
const SESSION_KEY = 'girlcare-session';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

interface ApiErrorResponse {
  message?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getSessionEmail(): string | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { email?: string };
    return parsed.email ?? null;
  } catch {
    return null;
  }
}

function buildHeaders(extraHeaders?: Record<string, string>): Record<string, string> {
  const sessionEmail = getSessionEmail();
  const apiToken = import.meta.env.VITE_API_TOKEN;

  return {
    'Content-Type': 'application/json',
    ...(sessionEmail ? { 'X-User-Email': sessionEmail } : {}),
    ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
    ...(extraHeaders ?? {}),
  };
}

export async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: buildHeaders(options.headers),
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const errorBody = (await response.json()) as ApiErrorResponse;
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep default message when response body is not JSON.
    }

    throw new ApiError(response.status, message);
  }

  return (await response.json()) as T;
}

export { API_BASE_URL };
