import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

const TEST_CODE = 'TEST-EMP-001';
let createdEmployeeId: string;

describe('Employees API', () => {
  afterAll(async () => {
    await prisma.employee.deleteMany({ where: { employeeCode: { startsWith: 'TEST-EMP-' } } });
  });

  it('GET /api/employees returns paginated results', async () => {
    const res = await request(app).get('/api/employees?page=1&pageSize=5');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta).toMatchObject({ page: 1, pageSize: 5 });
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  it('GET /api/employees supports search', async () => {
    const res = await request(app).get('/api/employees?search=Patel&pageSize=5');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('GET /api/employees supports country/department filters', async () => {
    const res = await request(app).get('/api/employees?country=India&department=Engineering');
    expect(res.status).toBe(200);
    for (const emp of res.body.data) {
      expect(emp.country).toBe('India');
      expect(emp.department).toBe('Engineering');
    }
  });

  it('POST /api/employees creates an employee', async () => {
    const res = await request(app).post('/api/employees').send({
      employeeCode: TEST_CODE,
      firstName: 'Test',
      lastName: 'User',
      department: 'Engineering',
      designation: 'Software Engineer',
      country: 'India',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.employeeCode).toBe(TEST_CODE);
    createdEmployeeId = res.body.data.id;
  });

  it('POST /api/employees rejects duplicate employeeCode with 409', async () => {
    const res = await request(app).post('/api/employees').send({
      employeeCode: TEST_CODE,
      firstName: 'Test',
      lastName: 'User',
      department: 'Engineering',
      designation: 'Software Engineer',
      country: 'India',
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Employee code already exists');
  });

  it('POST /api/employees rejects invalid body with 400', async () => {
    const res = await request(app).post('/api/employees').send({ firstName: 'OnlyFirstName' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('GET /api/employees/:id returns the employee', async () => {
    const res = await request(app).get(`/api/employees/${createdEmployeeId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdEmployeeId);
  });

  it('GET /api/employees/:id returns 404 for nonexistent id', async () => {
    const res = await request(app).get('/api/employees/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });

  it('PATCH /api/employees/:id updates the employee', async () => {
    const res = await request(app)
      .patch(`/api/employees/${createdEmployeeId}`)
      .send({ department: 'Product' });
    expect(res.status).toBe(200);
    expect(res.body.data.department).toBe('Product');
  });

  it('DELETE /api/employees/:id deletes the employee', async () => {
    const res = await request(app).delete(`/api/employees/${createdEmployeeId}`);
    expect(res.status).toBe(204);
  });

  it('GET /api/employees/:id returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/employees/${createdEmployeeId}`);
    expect(res.status).toBe(404);
  });
});
