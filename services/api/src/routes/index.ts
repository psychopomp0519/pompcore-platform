/**
 * @file routes/index.ts
 * @description Route aggregator — mounts all route modules onto the app.
 * @module @pompcore/api/routes
 */

import type { Hono } from 'hono';
import { health } from './health.routes.js';
import { auth } from './auth.routes.js';
import { accounts } from './accounts.routes.js';
import { transactions } from './transactions.routes.js';

export function registerRoutes(app: Hono): void {
  app.route('/health', health);
  app.route('/auth', auth);
  app.route('/vault/accounts', accounts);
  app.route('/vault/transactions', transactions);
}
