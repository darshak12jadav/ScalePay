import { EmployeeRepository } from './repositories/employee.repository';
import { EmployeeService } from './services/employee.service';

const employeeRepository = new EmployeeRepository();

export const employeeService = new EmployeeService(employeeRepository);
