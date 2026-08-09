import { PayrollService } from './services/payroll.service.js';
import { EmployeeRepository } from '../employees/repositories/employee.repository.js';
import { SalaryRepository } from '../salaries/repositories/salary.repository.js';
import { ExchangeRateRepository } from '../exchange-rates/repositories/exchange-rate.repository.js';

const employeeRepository = new EmployeeRepository();
const salaryRepository = new SalaryRepository();
const exchangeRateRepository = new ExchangeRateRepository();

export const payrollService = new PayrollService(
  employeeRepository,
  salaryRepository,
  exchangeRateRepository,
);
