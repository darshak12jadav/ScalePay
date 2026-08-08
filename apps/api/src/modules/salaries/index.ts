import { SalaryRepository } from './repositories/salary.repository';
import { EmployeeRepository } from '../employees/repositories/employee.repository';
import { SalaryService } from './services/salary.service';

const salaryRepository = new SalaryRepository();
const employeeRepository = new EmployeeRepository();

export const salaryService = new SalaryService(salaryRepository, employeeRepository);
