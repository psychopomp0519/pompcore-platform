import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { health } from './health.routes.js';

const app = new Hono();
app.route('/health', health);

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);

    const body = (await res.json()) as Record<string, unknown>;
    expect(body.status).toBe('ok');
    expect(body.service).toBe('@pompcore/api');
    expect(body).toHaveProperty('timestamp');
  });
});
