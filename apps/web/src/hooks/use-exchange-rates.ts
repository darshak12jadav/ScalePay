import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { ExchangeRateResponse, ExchangeRatesResponse } from '@/types/exchange-rate';

export function useExchangeRates() {
  return useQuery<ExchangeRatesResponse>({
    queryKey: ['exchange-rates'],
    queryFn: () => api.get<ExchangeRatesResponse>('/api/exchange-rates'),
  });
}

export function useExchangeRate(currency: string) {
  return useQuery<ExchangeRateResponse>({
    queryKey: ['exchange-rates', currency],
    queryFn: () => api.get<ExchangeRateResponse>(`/api/exchange-rates/${currency}`),
    enabled: Boolean(currency),
  });
}
