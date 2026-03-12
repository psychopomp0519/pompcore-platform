/**
 * @file Supabase 클라이언트 mock
 * @description 테스트에서 실제 Supabase 호출을 방지하기 위한 공용 mock
 */

import { vi } from 'vitest';

/** Supabase query builder mock (체이닝 지원) */
function createQueryBuilder() {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};

  const chainable = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike',
    'is', 'in', 'contains', 'containedBy',
    'order', 'limit', 'range', 'single', 'maybeSingle',
    'match', 'not', 'or', 'filter', 'textSearch',
  ] as const;

  for (const method of chainable) {
    builder[method] = vi.fn().mockReturnValue(builder);
  }

  builder['then'] = vi.fn().mockResolvedValue({ data: [], error: null });

  return builder;
}

/** mock Supabase 클라이언트 생성 */
export function createMockSupabaseClient() {
  return {
    from: vi.fn(() => createQueryBuilder()),
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ data: { url: '' }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
      updateUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
}
