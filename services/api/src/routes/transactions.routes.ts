/**
 * @file transactions.routes.ts
 * @description Vault transaction management API routes.
 * @module @pompcore/api/routes/transactions
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
import { requireService, requireQuota, type ServiceVariables } from '../middleware/service.js';
import { createUserClient } from '../lib/supabase.js';
import { ValidationError } from '../lib/errors.js';
import * as transactionService from '../services/transaction.service.js';
import { eventBus, createEvent } from '../lib/events.js';

const transactions = new Hono<{ Variables: ServiceVariables }>();

transactions.use('/*', authMiddleware);
transactions.use('/*', requirePermission('use_services'));
transactions.use('/*', requireService('vault'));

/** GET /vault/transactions?start=YYYY-MM-DD&end=YYYY-MM-DD&accountId=&type= */
transactions.get('/', async (c) => {
  const user = c.get('user');
  const db = createUserClient(c.get('accessToken'));

  const start = c.req.query('start');
  const end = c.req.query('end');
  if (!start || !end) throw new ValidationError('start, end 쿼리 파라미터가 필요합니다.');

  const filters = {
    accountId: c.req.query('accountId'),
    categoryId: c.req.query('categoryId'),
    currency: c.req.query('currency'),
    type: c.req.query('type') as 'income' | 'expense' | undefined,
  };

  const data = await transactionService.fetchTransactions(db, user.id, start, end, filters);
  return c.json({ data, error: null });
});

/** POST /vault/transactions — Create a transaction */
transactions.post('/', requireQuota('vault', 'transactions_per_month'), async (c) => {
  const user = c.get('user');
  const db = createUserClient(c.get('accessToken'));
  const body = await c.req.json();

  const data = await transactionService.createTransaction(db, user.id, body);

  // Fire-and-forget event for analytics & quota tracking
  eventBus.emit(createEvent('vault.transaction.created', 'vault', user.id, {
    transactionId: data.id,
    type: data.type,
    amount: data.amount,
    currency: data.currency,
  }));

  return c.json({ data, error: null }, 201);
});

/** DELETE /vault/transactions/:id — Soft-delete a transaction */
transactions.delete('/:id', async (c) => {
  const db = createUserClient(c.get('accessToken'));
  await transactionService.deleteTransaction(db, c.req.param('id'));
  return c.json({ data: null, error: null });
});

export { transactions };
