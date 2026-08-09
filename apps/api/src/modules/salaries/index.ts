import { SalaryRepository } from './repositories/salary.repository.js';
import { EmployeeRepository } from '../employees/repositories/employee.repository.js';
import { SalaryService } from './services/salary.service.js';

const salaryRepository = new SalaryRepository();
const employeeRepository = new EmployeeRepository();

export const salaryService = new SalaryService(salaryRepository, employeeRepository);
