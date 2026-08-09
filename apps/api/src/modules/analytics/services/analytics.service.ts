import { AnalyticsRepository } from '../repositories/analytics.repository.js';

interface SalaryUsdRow {
  salaryUsd: number;
  country: string;
  department: string;
}

export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  private async getSalaryRowsInUsd(): Promise<SalaryUsdRow[]> {
    const [salaries, exchangeRates] = await Promise.all([
      this.analyticsRepository.getCurrentSalariesWithEmployee(),
      this.analyticsRepository.getExchangeRates(),
    ]);

    const rates = new Map(exchangeRates.map((r) => [r.currency, Number(r.rateToUsd)]));

    return salaries
      .map((s) => {
        if (!s.employee) return null;
        const rate = rates.get(s.currency);
        if (rate === undefined) return null;
        return {
          salaryUsd: Number(s.annualSalary) * rate,
          country: s.employee.country,
          department: s.employee.department,
        };
      })
      .filter((row): row is SalaryUsdRow => row !== null);
  }

  private median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  async getSummary() {
    const [totalEmployees, rows] = await Promise.all([
      this.analyticsRepository.getTotalEmployees(),
      this.getSalaryRowsInUsd(),
    ]);

    const salaries = rows.map((r) => r.salaryUsd);
    const totalPayrollUsd = salaries.reduce((sum, s) => sum + s, 0);
    const averageSalaryUsd = salaries.length > 0 ? totalPayrollUsd / salaries.length : 0;

    return {
      totalEmployees,
      employeesWithSalary: salaries.length,
      totalAnnualPayrollUsd: Number(totalPayrollUsd.toFixed(2)),
      averageSalaryUsd: Number(averageSalaryUsd.toFixed(2)),
      medianSalaryUsd: Number(this.median(salaries).toFixed(2)),
      minSalaryUsd: salaries.length ? Number(Math.min(...salaries).toFixed(2)) : 0,
      maxSalaryUsd: salaries.length ? Number(Math.max(...salaries).toFixed(2)) : 0,
    };
  }

  async getByCountry() {
    const rows = await this.getSalaryRowsInUsd();
    return this.groupBy(rows, 'country');
  }

  async getByDepartment() {
    const rows = await this.getSalaryRowsInUsd();
    return this.groupBy(rows, 'department');
  }

  private groupBy(rows: SalaryUsdRow[], key: 'country' | 'department') {
    const groups = new Map<string, { count: number; total: number }>();

    for (const row of rows) {
      const groupKey = row[key];
      const existing = groups.get(groupKey);
      if (existing) {
        existing.count += 1;
        existing.total += row.salaryUsd;
      } else {
        groups.set(groupKey, { count: 1, total: row.salaryUsd });
      }
    }

    return Array.from(groups.entries())
      .map(([name, { count, total }]) => ({
        [key]: name,
        employeeCount: count,
        totalSalaryUsd: Number(total.toFixed(2)),
        averageSalaryUsd: Number((total / count).toFixed(2)),
      }))
      .sort((a, b) => b.totalSalaryUsd - a.totalSalaryUsd);
  }

  async getSalaryDistribution() {
    const rows = await this.getSalaryRowsInUsd();

    const distribution = {
      under50000: 0,
      from50000To99999: 0,
      from100000To149999: 0,
      from150000To199999: 0,
      above200000: 0,
    };

    for (const { salaryUsd } of rows) {
      if (salaryUsd < 50000) distribution.under50000 += 1;
      else if (salaryUsd < 100000) distribution.from50000To99999 += 1;
      else if (salaryUsd < 150000) distribution.from100000To149999 += 1;
      else if (salaryUsd < 200000) distribution.from150000To199999 += 1;
      else distribution.above200000 += 1;
    }

    return distribution;
  }
}
