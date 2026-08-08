import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

describe('Analytics API', () => {
  it('GET /api/analytics/summary returns aggregate stats', async () => {
    const res = await request(app).get('/api/analytics/summary');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalEmployees');
    expect(res.body.data).toHaveProperty('averageSalaryUsd');
    expect(res.body.data).toHaveProperty('medianSalaryUsd');
    expect(res.body.data.totalEmployees).toBeGreaterThan(0);
  });

  it('GET /api/analytics/by-country returns grouped salary data', async () => {
    const res = await request(app).get('/api/analytics/by-country');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data[0]).toHaveProperty('country');
    expect(res.body.data[0]).toHaveProperty('averageSalaryUsd');
  });

  it('GET /api/analytics/by-department returns grouped salary data', async () => {
    const res = await request(app).get('/api/analytics/by-department');
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toHaveProperty('department');
  });

  it('GET /api/analytics/salary-distribution returns bucketed counts', async () => {
    const res = await request(app).get('/api/analytics/salary-distribution');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('under50000');
    expect(res.body.data).toHaveProperty('above200000');

    const total = Object.values(res.body.data as Record<string, number>).reduce(
      (sum, n) => sum + n,
      0,
    );
    expect(total).toBeGreaterThan(0);
  });
});
