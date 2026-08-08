import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

describe('Exchange Rates API', () => {
  it('GET /api/exchange-rates returns seeded rates', async () => {
    const res = await request(app).get('/api/exchange-rates');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/exchange-rates/:currency returns a specific rate', async () => {
    const res = await request(app).get('/api/exchange-rates/INR');
    expect(res.status).toBe(200);
    expect(res.body.data.currency).toBe('INR');
  });

  it('GET /api/exchange-rates/:currency returns 400 for invalid currency', async () => {
    const res = await request(app).get('/api/exchange-rates/XYZ');
    expect(res.status).toBe(400);
  });
});
