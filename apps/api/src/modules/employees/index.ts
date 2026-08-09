import { EmployeeRepository } from './repositories/employee.repository.js';
import { EmployeeService } from './services/employee.service.js';

const employeeRepository = new EmployeeRepository();

export const employeeService = new EmployeeService(employeeRepository);
