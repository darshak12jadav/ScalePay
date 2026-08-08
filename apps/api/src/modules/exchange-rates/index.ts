import { ExchangeRateRepository } from './repositories/exchange-rate.repository';
import { ExchangeRateService } from './services/exchange-rate.service';

const exchangeRateRepository = new ExchangeRateRepository();
export const exchangeRateService = new ExchangeRateService(exchangeRateRepository);
