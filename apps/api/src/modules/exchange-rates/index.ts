import { ExchangeRateRepository } from './repositories/exchange-rate.repository.js';
import { ExchangeRateService } from './services/exchange-rate.service.js';

const exchangeRateRepository = new ExchangeRateRepository();
export const exchangeRateService = new ExchangeRateService(exchangeRateRepository);
