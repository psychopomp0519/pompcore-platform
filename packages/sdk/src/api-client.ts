import { getSupabase } from '@pompcore/auth';
import type { UserProfile } from '@pompcore/types';

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

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeaders();

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || json.error) {
    throw new Error(json.error ?? `API error: ${res.status}`);
  }

  return json.data as T;
}

// ── Auth endpoints ──────────────────────────────────

export const authApi = {
  getMe: () => request<UserProfile>('GET', '/auth/me'),

  getUser: (id: string) => request<UserProfile>('GET', `/auth/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    request<UserProfile>('PATCH', `/auth/users/${id}/role`, { role }),
};

// ── Vault: Accounts ─────────────────────────────────

export interface Account {
  id: string;
  user_id: string;
  name: string;
  supported_currencies: string[];
  default_currency: string;
  is_favorite: boolean;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountInput {
  name: string;
  supported_currencies?: string[];
  default_currency?: string;
}

export const accountsApi = {
  list: () => request<Account[]>('GET', '/vault/accounts'),

  create: (input: CreateAccountInput) =>
    request<Account>('POST', '/vault/accounts', input),

  delete: (id: string) => request<void>('DELETE', `/vault/accounts/${id}`),
};

// ── Vault: Transactions ─────────────────────────────

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  transaction_date: string;
  memo: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionInput {
  account_id: string;
  category_id?: string;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  currency?: string;
  transaction_date?: string;
  memo?: string;
}

export interface TransactionFilters {
  month?: string;
  account_id?: string;
  category_id?: string;
  type?: 'income' | 'expense';
}

export const transactionsApi = {
  list: (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters?.month) params.set('month', filters.month);
    if (filters?.account_id) params.set('account_id', filters.account_id);
    if (filters?.category_id) params.set('category_id', filters.category_id);
    if (filters?.type) params.set('type', filters.type);
    const qs = params.toString();
    return request<Transaction[]>('GET', `/vault/transactions${qs ? `?${qs}` : ''}`);
  },

  create: (input: CreateTransactionInput) =>
    request<Transaction>('POST', '/vault/transactions', input),

  delete: (id: string) => request<void>('DELETE', `/vault/transactions/${id}`),
};

// ── Health ───────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string; timestamp: string }>('GET', '/health'),
};
