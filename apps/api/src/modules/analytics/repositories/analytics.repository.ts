import { prisma } from '../../../lib/prisma.js';

export class AnalyticsRepository {
  async getTotalEmployees() {
    return prisma.employee.count();
  }

  async getCurrentSalariesWithEmployee() {
    return prisma.salaryHistory.findMany({
      where: { effectiveTo: null },
      select: {
        annualSalary: true,
        currency: true,
        employee: {
          select: { country: true, department: true },
        },
      },
    });
  }

  async getExchangeRates() {
    return prisma.exchangeRate.findMany({
      select: { currency: true, rateToUsd: true },
    });
  }
}
