import type { Currency } from '@/types/employee';

export interface ExchangeRate {
  currency: Currency;
  rateToUsd: number | string;
}

export interface ExchangeRatesResponse {
  data: ExchangeRate[];
}

export interface ExchangeRateResponse {
  data: ExchangeRate;
}
