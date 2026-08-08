import { prisma } from '../../../lib/prisma';
import { Currency } from '../../../generated/prisma/client';

export class ExchangeRateRepository {
  async findByCurrency(currency: Currency) {
    return prisma.exchangeRate.findUnique({ where: { currency } });
  }

  async findAll() {
    return prisma.exchangeRate.findMany({ orderBy: { currency: 'asc' } });
  }
}
