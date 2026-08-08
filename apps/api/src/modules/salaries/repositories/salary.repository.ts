import { prisma } from '../../../lib/prisma';
import { Currency } from '../../../generated/prisma/client';

export class SalaryRepository {
  async findCurrentSalary(employeeId: string) {
    return prisma.salaryHistory.findFirst({
      where: { employeeId, effectiveTo: null },
      orderBy: { effectiveFrom: 'desc' },
    });
  }

  async findHistory(employeeId: string) {
    return prisma.salaryHistory.findMany({
      where: { employeeId },
      orderBy: { effectiveFrom: 'desc' },
    });
  }

  /**
   * Atomically closes the current salary (if any) and creates the new one.
   * The caller never supplies effectiveTo — this method owns that invariant
   * so salary history can never have gaps or overlaps.
   */
  async reviseSalary(
    employeeId: string,
    data: { annualSalary: number; currency: Currency; effectiveFrom: Date },
  ) {
    return prisma.$transaction(async (tx) => {
      const currentSalary = await tx.salaryHistory.findFirst({
        where: { employeeId, effectiveTo: null },
      });

      if (currentSalary) {
        const effectiveTo = new Date(data.effectiveFrom);
        effectiveTo.setDate(effectiveTo.getDate() - 1);

        await tx.salaryHistory.update({
          where: { id: currentSalary.id },
          data: { effectiveTo },
        });
      }

      return tx.salaryHistory.create({
        data: {
          employeeId,
          annualSalary: data.annualSalary,
          currency: data.currency,
          effectiveFrom: data.effectiveFrom,
          effectiveTo: null,
        },
      });
    });
  }
}
