import { getSupabase } from '@pompcore/auth';
import type { UserProfile, DbAccount, DbTransaction, CreateAccountInput, CreateTransactionInput, TransactionFilters } from '@pompcore/types';

/**
 * Typed API client for calling the PompCore platform API.
 * Automatically attaches the current user's JWT to all requests.
 */

let baseUrl = '';

export function initApiClient(url: string) {
  baseUrl = url.replace(/\/$/, '');
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  code?: string;
}

// ── Retry configuration ────────────────────────────

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 100;
const MAX_DELAY_MS = 10_000;

/** 재시도 대상 HTTP 상태 코드 */
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

/** 지수 백오프 + 지터 계산 */
function getRetryDelay(attempt: number): number {
  const exponential = INITIAL_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * exponential * 0.5;
  return Math.min(exponential + jitter, MAX_DELAY_MS);
}

function isRetryable(status: number): boolean {
  return RETRYABLE_STATUS_CODES.has(status);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
      });

      /** 4xx (429 제외) 클라이언트 에러는 즉시 실패 */
      if (!res.ok && !isRetryable(res.status)) {
        const json: ApiResponse<T> = await res.json();
        throw new Error(json.error ?? `API error: ${res.status}`);
      }

      /** 재시도 가능한 서버 에러 */
      if (!res.ok && isRetryable(res.status)) {
        lastError = new Error(`API error: ${res.status}`);
        if (attempt < MAX_RETRIES) {
          await sleep(getRetryDelay(attempt));
          continue;
        }
        throw lastError;
      }

      const json: ApiResponse<T> = await res.json();

      if (json.error) {
        throw new Error(json.error);
      }

      return json.data as T;
    } catch (error) {
      /** 네트워크 에러 (fetch 자체 실패) — 재시도 */
      if (error instanceof TypeError && attempt < MAX_RETRIES) {
        lastError = error;
        await sleep(getRetryDelay(attempt));
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error('Request failed after retries');
}

// ── Auth endpoints ──────────────────────────────────

export const authApi = {
  getMe: () => request<UserProfile>('GET', '/auth/me'),

  getUser: (id: string) => request<UserProfile>('GET', `/auth/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    request<UserProfile>('PATCH', `/auth/users/${id}/role`, { role }),
};

// ── Vault: Accounts ─────────────────────────────────

export const accountsApi = {
  list: () => request<DbAccount[]>('GET', '/vault/accounts'),

  create: (input: CreateAccountInput) =>
    request<DbAccount>('POST', '/vault/accounts', input),

  delete: (id: string) => request<void>('DELETE', `/vault/accounts/${id}`),
};

// ── Vault: Transactions ─────────────────────────────

export const transactionsApi = {
  list: (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters?.month) params.set('month', filters.month);
    if (filters?.account_id) params.set('account_id', filters.account_id);
    if (filters?.category_id) params.set('category_id', filters.category_id);
    if (filters?.type) params.set('type', filters.type);
    const qs = params.toString();
    return request<DbTransaction[]>('GET', `/vault/transactions${qs ? `?${qs}` : ''}`);
  },

  create: (input: CreateTransactionInput) =>
    request<DbTransaction>('POST', '/vault/transactions', input),

  delete: (id: string) => request<void>('DELETE', `/vault/transactions/${id}`),
};

// ── Health ───────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string; timestamp: string }>('GET', '/health'),
};
