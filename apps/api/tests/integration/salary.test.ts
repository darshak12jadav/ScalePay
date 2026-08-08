import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

const TEST_CODE = 'TEST-SAL-001';
let employeeId: string;

describe('Salary API', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/employees').send({
      employeeCode: TEST_CODE,
      firstName: 'Salary',
      lastName: 'Tester',
      department: 'Engineering',
      designation: 'Software Engineer',
      country: 'India',
    });
    employeeId = res.body.data.id;
  });

  afterAll(async () => {
    await prisma.employee.deleteMany({ where: { employeeCode: TEST_CODE } });
  });

  it('GET /api/employees/:id/salary returns 404 when no salary exists', async () => {
    const res = await request(app).get(`/api/employees/${employeeId}/salary`);
    expect(res.status).toBe(404);
  });

  it('POST /api/employees/:id/salary creates the first salary record', async () => {
    const res = await request(app)
      .post(`/api/employees/${employeeId}/salary`)
      .send({ annualSalary: 75000, currency: 'USD', effectiveFrom: '2026-01-01' });
    expect(res.status).toBe(201);
    expect(res.body.data.annualSalary).toBe('75000');
    expect(res.body.data.effectiveTo).toBeNull();
  });

  it('GET /api/employees/:id/salary returns the current salary', async () => {
    const res = await request(app).get(`/api/employees/${employeeId}/salary`);
    expect(res.status).toBe(200);
    expect(res.body.data.effectiveTo).toBeNull();
  });

  it('POST /api/employees/:id/salary revises salary and closes the previous record', async () => {
    const res = await request(app)
      .post(`/api/employees/${employeeId}/salary`)
      .send({ annualSalary: 90000, currency: 'USD', effectiveFrom: '2027-01-01' });
    expect(res.status).toBe(201);
    expect(res.body.data.annualSalary).toBe('90000');
    expect(res.body.data.effectiveTo).toBeNull();
  });

  it('GET /api/employees/:id/salary/history shows both records with correct effectiveTo', async () => {
    const res = await request(app).get(`/api/employees/${employeeId}/salary/history`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);

    const current = res.body.data.find((s: any) => s.annualSalary === '90000');
    const previous = res.body.data.find((s: any) => s.annualSalary === '75000');

    expect(current.effectiveTo).toBeNull();
    expect(previous.effectiveTo).not.toBeNull();
  });

  it('POST /api/employees/:id/salary rejects backdated effectiveFrom with 400', async () => {
    const res = await request(app)
      .post(`/api/employees/${employeeId}/salary`)
      .send({ annualSalary: 50000, currency: 'USD', effectiveFrom: '2025-01-01' });
    expect(res.status).toBe(400);
  });

  it('POST /api/employees/:id/salary returns 404 for nonexistent employee', async () => {
    const res = await request(app)
      .post('/api/employees/does-not-exist/salary')
      .send({ annualSalary: 50000, currency: 'USD', effectiveFrom: '2026-01-01' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });
});
