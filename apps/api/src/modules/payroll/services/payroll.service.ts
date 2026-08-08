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
    // -----------------------------------------
    // 1. Find employee
    // -----------------------------------------

    const employee = await this.employeeRepository.findById(input.employeeId);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // -----------------------------------------
    // 2. Find current salary
    // -----------------------------------------

    const currentSalary = await this.salaryRepository.findCurrentSalary(input.employeeId);

    if (!currentSalary) {
      throw new NotFoundError('No current salary found for this employee');
    }

    // -----------------------------------------
    // 3. Prepare currencies and salary
    // -----------------------------------------

    const sourceCurrency = currentSalary.currency;
    const targetCurrency = input.currency as Currency;

    const annualSalary = Number(currentSalary.annualSalary);

    if (!Number.isFinite(annualSalary)) {
      throw new Error('Invalid salary amount');
    }

    // -----------------------------------------
    // 4. Calculate conversion
    // -----------------------------------------

    let convertedAnnualSalary = annualSalary;
    let exchangeRate = 1;

    let sourceRateToUsd = 1;
    let targetRateToUsd = 1;

    // Same currency → no conversion required
    if (sourceCurrency !== targetCurrency) {
      // -----------------------------------------
      // Get source currency rate
      // -----------------------------------------

      const sourceRate = await this.exchangeRateRepository.findByCurrency(sourceCurrency);

      if (!sourceRate) {
        throw new NotFoundError(`Exchange rate not found for ${sourceCurrency}`);
      }

      // -----------------------------------------
      // Get target currency rate
      // -----------------------------------------

      const targetRate = await this.exchangeRateRepository.findByCurrency(targetCurrency);

      if (!targetRate) {
        throw new NotFoundError(`Exchange rate not found for ${targetCurrency}`);
      }

      sourceRateToUsd = Number(sourceRate.rateToUsd);
      targetRateToUsd = Number(targetRate.rateToUsd);

      if (
        !Number.isFinite(sourceRateToUsd) ||
        !Number.isFinite(targetRateToUsd) ||
        sourceRateToUsd <= 0 ||
        targetRateToUsd <= 0
      ) {
        throw new Error('Invalid exchange rate');
      }

      // -----------------------------------------
      // Source currency → USD → Target currency
      // -----------------------------------------

      exchangeRate = sourceRateToUsd / targetRateToUsd;

      convertedAnnualSalary = annualSalary * exchangeRate;
    }

    // -----------------------------------------
    // 5. Calculate monthly salary
    // -----------------------------------------

    const monthlySalary = convertedAnnualSalary / 12;

    // -----------------------------------------
    // 6. Return payroll result
    // -----------------------------------------

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
        annualSalary,
        currency: sourceCurrency,
        effectiveFrom: currentSalary.effectiveFrom,
      },

      payroll: {
        currency: targetCurrency,

        annualBaseSalary: Number(convertedAnnualSalary.toFixed(2)),

        monthlyBaseSalary: Number(monthlySalary.toFixed(2)),

        exchangeRate: Number(exchangeRate.toFixed(6)),

        sourceCurrency,
        targetCurrency,

        sourceRateToUsd: Number(sourceRateToUsd.toFixed(6)),

        targetRateToUsd: Number(targetRateToUsd.toFixed(6)),
      },
    };
  }
}
