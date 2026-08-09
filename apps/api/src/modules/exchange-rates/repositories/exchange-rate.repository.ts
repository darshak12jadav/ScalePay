import { prisma } from '../../../lib/prisma.js';
import { Currency } from '../../../generated/prisma/client.js';

export class ExchangeRateRepository {
  async findByCurrency(currency: Currency) {
    return prisma.exchangeRate.findUnique({ where: { currency } });
  }

  async findAll() {
    return prisma.exchangeRate.findMany({ orderBy: { currency: 'asc' } });
  }
}
