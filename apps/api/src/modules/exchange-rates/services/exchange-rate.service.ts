import { ExchangeRateRepository } from '../repositories/exchange-rate.repository';
import { BadRequestError, NotFoundError } from '../../../shared/errors/app-errors';
import { Currency } from '../../../generated/prisma/client';

export class ExchangeRateService {
  constructor(private readonly exchangeRateRepository: ExchangeRateRepository) {}

  async getExchangeRates() {
    return this.exchangeRateRepository.findAll();
  }

  async getExchangeRate(currency: Currency) {
    const rate = await this.exchangeRateRepository.findByCurrency(currency);
    if (!rate) {
      throw new NotFoundError(`Exchange rate not found for ${currency}`);
    }
    return rate;
  }
}
