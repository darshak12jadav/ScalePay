import { SalaryRepository } from '../repositories/salary.repository.js';
import { EmployeeRepository } from '../../employees/repositories/employee.repository.js';
import { NotFoundError, BadRequestError } from '../../../shared/errors/app-errors.js';
import { CreateSalaryInput } from '../schemas/salary.schema.js';

export class SalaryService {
  constructor(
    private readonly salaryRepository: SalaryRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  private async ensureEmployeeExists(employeeId: string) {
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }
  }

  async getCurrentSalary(employeeId: string) {
    await this.ensureEmployeeExists(employeeId);
    const salary = await this.salaryRepository.findCurrentSalary(employeeId);
    if (!salary) {
      throw new NotFoundError('No current salary found for this employee');
    }
    return salary;
  }

  async getSalaryHistory(employeeId: string) {
    await this.ensureEmployeeExists(employeeId);
    return this.salaryRepository.findHistory(employeeId);
  }

  async reviseSalary(employeeId: string, input: CreateSalaryInput) {
    await this.ensureEmployeeExists(employeeId);

    const currentSalary = await this.salaryRepository.findCurrentSalary(employeeId);

    if (currentSalary && input.effectiveFrom <= currentSalary.effectiveFrom) {
      throw new BadRequestError("effectiveFrom must be after the current salary's effective date");
    }

    return this.salaryRepository.reviseSalary(employeeId, input);
  }
}
