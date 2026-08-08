import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

const TEST_CODE = 'TEST-PAY-001';
let employeeId: string;

describe('Payroll API', () => {
  beforeAll(async () => {
    const empRes = await request(app).post('/api/employees').send({
      employeeCode: TEST_CODE,
      firstName: 'Payroll',
      lastName: 'Tester',
      department: 'Engineering',
      designation: 'Software Engineer',
      country: 'India',
    });
    employeeId = empRes.body.data.id;

    await request(app)
      .post(`/api/employees/${employeeId}/salary`)
      .send({ annualSalary: 1000000, currency: 'INR', effectiveFrom: '2026-01-01' });
  });

  afterAll(async () => {
    await prisma.employee.deleteMany({ where: { employeeCode: TEST_CODE } });
  });

  it('POST /api/payroll/calculate converts salary to the requested currency', async () => {
    const res = await request(app)
      .post('/api/payroll/calculate')
      .send({ employeeId, currency: 'USD' });
    expect(res.status).toBe(200);
    expect(res.body.data.salary.currency).toBe('INR');
    expect(res.body.data.payroll.currency).toBe('USD');
    expect(res.body.data.payroll.annualBaseSalary).toBeGreaterThan(0);
  });

  it('POST /api/payroll/calculate returns same amount when currencies match', async () => {
    const res = await request(app)
      .post('/api/payroll/calculate')
      .send({ employeeId, currency: 'INR' });
    expect(res.status).toBe(200);
    expect(res.body.data.payroll.annualBaseSalary).toBe(1000000);
  });

  it('POST /api/payroll/calculate returns 404 for nonexistent employee', async () => {
    const res = await request(app)
      .post('/api/payroll/calculate')
      .send({ employeeId: 'does-not-exist', currency: 'USD' });
    expect(res.status).toBe(404);
  });

  it('POST /api/payroll/calculate returns 400 for invalid currency', async () => {
    const res = await request(app)
      .post('/api/payroll/calculate')
      .send({ employeeId, currency: 'XYZ' });
    expect(res.status).toBe(400);
  });
});
