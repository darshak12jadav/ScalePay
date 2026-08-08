import { EmployeeRepository } from '../../employees/repositories/employee.repository';
import { SalaryRepository } from '../../salaries/repositories/salary.repository';
import { ExchangeRateRepository } from '../../exchange-rates/repositories/exchange-rate.repository';
import { NotFoundError } from '../../../shared/errors/app-errors';
import { CalculatePayrollInput } from '../schemas/payroll.schema';
import { Currency } from '../../../generated/prisma/client';

export class PayrollService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly salaryRepository: SalaryRepository,
    private readonly exchangeRateRepository: ExchangeRateRepository,
  ) {}

  async calculatePayroll(input: CalculatePayrollInput) {
    const employee = await this.employeeRepository.findById(input.employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const currentSalary = await this.salaryRepository.findCurrentSalary(input.employeeId);
    if (!currentSalary) {
      throw new NotFoundError('No current salary found for this employee');
    }

    const targetCurrency = input.currency as Currency;
    const salary = Number(currentSalary.annualSalary);

    let convertedSalary: number;

    if (currentSalary.currency === targetCurrency) {
      convertedSalary = salary;
    } else {
      const sourceRate = await this.exchangeRateRepository.findByCurrency(currentSalary.currency);
      if (!sourceRate) {
        throw new NotFoundError(`Exchange rate not found for ${currentSalary.currency}`);
      }

      const targetRate = await this.exchangeRateRepository.findByCurrency(targetCurrency);
      if (!targetRate) {
        throw new NotFoundError(`Exchange rate not found for ${targetCurrency}`);
      }

      const salaryInUsd = salary * Number(sourceRate.rateToUsd);
      convertedSalary = salaryInUsd / Number(targetRate.rateToUsd);
    }

    return {
      employee: {
        id: employee.id,
        employeeCode: employee.employeeCode,
        firstName: employee.firstName,
        lastName: employee.lastName,
        department: employee.department,
        designation: employee.designation,
      },
      salary: {
        annualSalary: salary,
        currency: currentSalary.currency,
        effectiveFrom: currentSalary.effectiveFrom,
      },
      payroll: {
        currency: targetCurrency,
        annualBaseSalary: Number(convertedSalary.toFixed(2)),
      },
    };
  }
}
