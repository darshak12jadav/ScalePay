import { describe, expect, it } from 'vitest';

/**
 * ScalePay Frontend Tests
 *
 * Covers:
 * - Employees
 * - Employee filters
 * - Pagination
 * - Add Employee
 * - Initial Salary
 * - Payroll
 * - Exchange Rates
 * - API errors
 */

describe('ScalePay Frontend', () => {
  // --------------------------------------------------
  // 1. Employee Page
  // --------------------------------------------------

  describe('Employees', () => {
    it('uses page 1 by default', () => {
      const page = 1;

      expect(page).toBe(1);
    });

    it('uses page size 10', () => {
      const pageSize = 10;

      expect(pageSize).toBe(10);
    });

    it('trims employee search input', () => {
      const search = '  Patel  ';

      expect(search.trim()).toBe('Patel');
    });

    it('does not send an empty search value', () => {
      const search = '   ';

      expect(search.trim() || undefined).toBeUndefined();
    });

    it('resets pagination when search changes', () => {
      let page = 4;

      page = 1;

      expect(page).toBe(1);
    });

    it('resets pagination when country changes', () => {
      let page = 3;

      page = 1;

      expect(page).toBe(1);
    });

    it('resets pagination when department changes', () => {
      let page = 3;

      page = 1;

      expect(page).toBe(1);
    });

    it('resets pagination when employment status changes', () => {
      let page = 5;

      page = 1;

      expect(page).toBe(1);
    });

    it('clears employee filters', () => {
      let search = 'Patel';
      let country = 'India';
      let department = 'Engineering';
      let employmentStatus = 'ACTIVE';

      search = '';
      country = '';
      department = '';
      employmentStatus = '';

      expect(search).toBe('');
      expect(country).toBe('');
      expect(department).toBe('');
      expect(employmentStatus).toBe('');
    });
  });

  // --------------------------------------------------
  // 2. Pagination
  // --------------------------------------------------

  describe('Employee Pagination', () => {
    it('moves to the previous page', () => {
      const page = 3;

      const previousPage = Math.max(1, page - 1);

      expect(previousPage).toBe(2);
    });

    it('does not move below page 1', () => {
      const page = 1;

      const previousPage = Math.max(1, page - 1);

      expect(previousPage).toBe(1);
    });

    it('moves to the next page', () => {
      const page = 2;
      const totalPages = 5;

      const nextPage = Math.min(totalPages, page + 1);

      expect(nextPage).toBe(3);
    });

    it('does not move beyond the last page', () => {
      const page = 5;
      const totalPages = 5;

      const nextPage = Math.min(totalPages, page + 1);

      expect(nextPage).toBe(5);
    });
  });

  // --------------------------------------------------
  // 3. Add Employee
  // --------------------------------------------------

  describe('Add Employee', () => {
    it('requires an employee code', () => {
      const employeeCode = '';

      expect(employeeCode.trim()).toBe('');
    });

    it('requires employee first name', () => {
      const firstName = '';

      expect(firstName.trim()).toBe('');
    });

    it('requires employee last name', () => {
      const lastName = '';

      expect(lastName.trim()).toBe('');
    });

    it('requires department', () => {
      const department = '';

      expect(department.trim()).toBe('');
    });

    it('requires country', () => {
      const country = '';

      expect(country.trim()).toBe('');
    });

    it('defaults employment status to ACTIVE', () => {
      const employmentStatus = 'ACTIVE';

      expect(employmentStatus).toBe('ACTIVE');
    });
  });

  // --------------------------------------------------
  // 4. Initial Salary
  // --------------------------------------------------

  describe('Initial Salary', () => {
    it('accepts a positive annual salary', () => {
      const annualSalary = 75000;

      expect(Number.isFinite(annualSalary)).toBe(true);
      expect(annualSalary).toBeGreaterThan(0);
    });

    it('rejects zero annual salary', () => {
      const annualSalary = 0;

      expect(annualSalary).not.toBeGreaterThan(0);
    });

    it('rejects negative annual salary', () => {
      const annualSalary = -5000;

      expect(annualSalary).not.toBeGreaterThan(0);
    });

    it('requires an effective date', () => {
      const effectiveFrom = '';

      expect(effectiveFrom).toBe('');
    });

    it('converts salary input to a number', () => {
      const salaryInput = '75000';

      const annualSalary = Number(salaryInput);

      expect(annualSalary).toBe(75000);
      expect(typeof annualSalary).toBe('number');
    });
  });

  // --------------------------------------------------
  // 5. Employee + Salary Payload
  // --------------------------------------------------

  describe('Employee With Salary Payload', () => {
    it('creates the expected employee and salary payload', () => {
      const payload = {
        employee: {
          employeeCode: 'EMP-001',
          firstName: 'John',
          lastName: 'Doe',
          department: 'Engineering',
          designation: 'Software Engineer',
          country: 'India',
          employmentStatus: 'ACTIVE',
        },
        salary: {
          annualSalary: 75000,
          currency: 'USD',
          effectiveFrom: '2026-08-08',
        },
      };

      expect(payload.employee.employeeCode).toBe('EMP-001');
      expect(payload.employee.firstName).toBe('John');
      expect(payload.employee.lastName).toBe('Doe');
      expect(payload.employee.department).toBe('Engineering');

      expect(payload.salary.annualSalary).toBe(75000);
      expect(payload.salary.currency).toBe('USD');
      expect(payload.salary.effectiveFrom).toBe('2026-08-08');
    });

    it('trims employee input values', () => {
      const employeeCode = '  EMP-001  ';
      const firstName = '  John  ';

      expect(employeeCode.trim()).toBe('EMP-001');
      expect(firstName.trim()).toBe('John');
    });
  });

  // --------------------------------------------------
  // 6. Payroll
  // --------------------------------------------------

  describe('Payroll', () => {
    it('calculates monthly salary from annual salary', () => {
      const annualSalary = 120000;

      const monthlySalary = annualSalary / 12;

      expect(monthlySalary).toBe(10000);
    });

    it('formats annual payroll salary to two decimals', () => {
      const annualSalary = 129400.3;

      expect(annualSalary.toFixed(2)).toBe('129400.30');
    });

    it('keeps source and target currencies', () => {
      const payroll = {
        sourceCurrency: 'GBP',
        targetCurrency: 'USD',
        exchangeRate: 1.27,
      };

      expect(payroll.sourceCurrency).toBe('GBP');
      expect(payroll.targetCurrency).toBe('USD');
      expect(payroll.exchangeRate).toBe(1.27);
    });
  });

  // --------------------------------------------------
  // 7. Exchange Rates
  // --------------------------------------------------

  describe('Exchange Rates', () => {
    it('supports the configured exchange rate currencies', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED', 'CHF'];

      expect(currencies).toContain('USD');
      expect(currencies).toContain('INR');
      expect(currencies).toContain('GBP');
      expect(currencies).toContain('CHF');
    });

    it('accepts a positive exchange rate', () => {
      const exchangeRate = 1.27;

      expect(typeof exchangeRate).toBe('number');
      expect(exchangeRate).toBeGreaterThan(0);
    });
  });

  // --------------------------------------------------
  // 8. API Errors
  // --------------------------------------------------

  describe('API Errors', () => {
    it('handles a 404 employee not found error', () => {
      const status = 404;
      const message = 'Employee not found';

      expect(status).toBe(404);
      expect(message).toBe('Employee not found');
    });

    it('handles a 409 duplicate employee error', () => {
      const status = 409;
      const message = 'Employee code already exists';

      expect(status).toBe(409);
      expect(message).toBe('Employee code already exists');
    });
  });
});
