/**
 * @file accounts.routes.ts
 * @description Vault account management API routes.
 * @module @pompcore/api/routes/accounts
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
import { requireService, type ServiceVariables } from '../middleware/service.js';
import { createUserClient } from '../lib/supabase.js';
import * as accountService from '../services/account.service.js';

const accounts = new Hono<{ Variables: ServiceVariables }>();

// All account routes require auth + use_services + active vault subscription
accounts.use('/*', authMiddleware);
accounts.use('/*', requirePermission('use_services'));
accounts.use('/*', requireService('vault'));

/** GET /vault/accounts — List all accounts for the current user */
accounts.get('/', async (c) => {
  const user = c.get('user');
  const db = createUserClient(c.get('accessToken'));
  const data = await accountService.fetchAccounts(db, user.id);
  return c.json({ data, error: null });
});

/** POST /vault/accounts — Create a new account */
accounts.post('/', async (c) => {
  const user = c.get('user');
  const db = createUserClient(c.get('accessToken'));
  const body = await c.req.json<{
    name: string;
    defaultCurrency: string;
    supportedCurrencies: string[];
    isFavorite?: boolean;
    sortOrder?: number;
  }>();

  const data = await accountService.createAccount(db, user.id, body, body.sortOrder ?? 0);
  return c.json({ data, error: null }, 201);
});

/** DELETE /vault/accounts/:id — Soft-delete an account */
accounts.delete('/:id', async (c) => {
  const db = createUserClient(c.get('accessToken'));
  await accountService.deleteAccount(db, c.req.param('id'));
  return c.json({ data: null, error: null });
});

export { accounts };
