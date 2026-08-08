import { PayrollService } from './services/payroll.service';
import { EmployeeRepository } from '../employees/repositories/employee.repository';
import { SalaryRepository } from '../salaries/repositories/salary.repository';
import { ExchangeRateRepository } from '../exchange-rates/repositories/exchange-rate.repository';

const employeeRepository = new EmployeeRepository();
const salaryRepository = new SalaryRepository();
const exchangeRateRepository = new ExchangeRateRepository();

export const payrollService = new PayrollService(
  employeeRepository,
  salaryRepository,
  exchangeRateRepository,
);
