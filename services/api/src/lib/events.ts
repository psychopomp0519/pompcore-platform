/**
 * @file events.ts
 * @description In-process event bus for the PompCore platform.
 *
 * Phase 1: Simple typed EventEmitter (single process).
 * Phase 2: Replace with Supabase Realtime / pg_notify.
 * Phase 3: Replace with Redis Streams for consumer groups.
 *
 * @module @pompcore/api/lib/events
 */

import type { PlatformEvent } from '@pompcore/types';

// ── Types ───────────────────────────────────────────

type EventHandler<T = unknown> = (event: PlatformEvent<T>) => void | Promise<void>;

// ── Event Bus ───────────────────────────────────────

const handlers = new Map<string, EventHandler[]>();

/**
 * Subscribe to an event type.
 *
 * @example
 *   on('vault.transaction.created', (event) => {
 *     console.log('New transaction:', event.data);
 *   });
 */
export function on<T = unknown>(eventType: string, handler: EventHandler<T>): void {
  const list = handlers.get(eventType) ?? [];
  list.push(handler as EventHandler);
  handlers.set(eventType, list);
}

/**
 * Unsubscribe a handler from an event type.
 */
export function off<T = unknown>(eventType: string, handler: EventHandler<T>): void {
  const list = handlers.get(eventType);
  if (!list) return;

  const idx = list.indexOf(handler as EventHandler);
  if (idx !== -1) list.splice(idx, 1);
  if (list.length === 0) handlers.delete(eventType);
}

/**
 * Emit an event. All handlers are called asynchronously (fire-and-forget).
 * Errors in handlers are logged but do not propagate to the caller.
 *
 * @example
 *   emit({
 *     id: crypto.randomUUID(),
 *     type: 'vault.transaction.created',
 *     source: 'vault',
 *     userId: user.id,
 *     timestamp: new Date().toISOString(),
 *     data: { transactionId: '...', amount: 50000 },
 *   });
 */
export function emit<T = unknown>(event: PlatformEvent<T>): void {
  const list = handlers.get(event.type);
  if (!list || list.length === 0) return;

  for (const handler of list) {
    Promise.resolve()
      .then(() => handler(event as PlatformEvent))
      .catch((err) => {
        console.error(`[EventBus] Handler error for "${event.type}":`, err);
      });
  }
}

/**
 * Subscribe to all events matching a prefix.
 *
 * @example
 *   onPrefix('vault.', (event) => { ... }); // matches vault.*
 */
export function onPrefix<T = unknown>(prefix: string, handler: EventHandler<T>): void {
  const wrappedKey = `__prefix:${prefix}`;
  const list = handlers.get(wrappedKey) ?? [];
  list.push(handler as EventHandler);
  handlers.set(wrappedKey, list);
}

// Override emit to also dispatch to prefix subscribers
const originalEmit = emit;

/**
 * Enhanced emit that also triggers prefix-based subscribers.
 */
export function emitWithPrefix<T = unknown>(event: PlatformEvent<T>): void {
  originalEmit(event);

  // Check prefix subscribers
  for (const [key, list] of handlers) {
    if (!key.startsWith('__prefix:')) continue;
    const prefix = key.slice('__prefix:'.length);
    if (event.type.startsWith(prefix)) {
      for (const handler of list) {
        Promise.resolve()
          .then(() => handler(event as PlatformEvent))
          .catch((err) => {
            console.error(`[EventBus] Prefix handler error for "${event.type}":`, err);
          });
      }
    }
  }
}

// ── Convenience: Event factory ──────────────────────

/**
 * Create a PlatformEvent with auto-generated id and timestamp.
 */
export function createEvent<T>(
  type: string,
  source: string,
  userId: string,
  data: T,
  metadata?: PlatformEvent['metadata'],
): PlatformEvent<T> {
  return {
    id: crypto.randomUUID(),
    type,
    source,
    userId,
    timestamp: new Date().toISOString(),
    data,
    metadata,
  };
}

// ── Re-export grouped ───────────────────────────────

export const eventBus = { on, off, emit: emitWithPrefix, onPrefix, createEvent };
