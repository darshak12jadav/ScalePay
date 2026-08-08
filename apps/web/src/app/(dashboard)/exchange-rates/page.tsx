'use client';

import { useState } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useExchangeRate, useExchangeRates } from '@/hooks/use-exchange-rates';

import type { Currency } from '@/types/employee';

const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED'];

export default function ExchangeRatesPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR');

  const exchangeRatesQuery = useExchangeRates();

  const selectedRateQuery = useExchangeRate(selectedCurrency);

  const rates = exchangeRatesQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="size-5 text-muted-foreground" />

          <h1 className="text-2xl font-semibold">Exchange Rates</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          View currency exchange rates used for payroll calculations.
        </p>
      </div>

      {/* Currency lookup */}

      <section className="rounded-xl border bg-card">
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="size-4 text-muted-foreground" />

            <h2 className="font-semibold">Currency Lookup</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a currency to view its current rate to USD.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="currency" className="text-sm font-medium">
              Currency
            </label>

            <select
              id="currency"
              value={selectedCurrency}
              onChange={(event) => setSelectedCurrency(event.target.value as Currency)}
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border bg-muted/20 px-5 py-3">
            {selectedRateQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading rate...</p>
            ) : selectedRateQuery.isError ? (
              <p className="text-sm text-destructive">Unable to load exchange rate.</p>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground">Rate to USD</p>

                <p className="text-lg font-semibold">
                  {selectedRateQuery.data?.data?.rateToUsd ?? '—'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All exchange rates */}

      <section className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="font-semibold">Exchange Rates</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              All supported currencies and their USD conversion rates.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exchangeRatesQuery.refetch()}
            disabled={exchangeRatesQuery.isFetching}
          >
            <RefreshCw
              className={exchangeRatesQuery.isFetching ? 'size-4 animate-spin' : 'size-4'}
            />
            Refresh
          </Button>
        </div>

        {/* Error */}

        {exchangeRatesQuery.isError ? (
          <div className="p-6">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
              <h3 className="font-medium">Unable to load exchange rates</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Something went wrong while loading exchange-rate information.
              </p>

              <Button
                className="mt-4"
                variant="outline"
                onClick={() => exchangeRatesQuery.refetch()}
              >
                Try again
              </Button>
            </div>
          </div>
        ) : exchangeRatesQuery.isLoading ? (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Loading exchange rates...</p>
          </div>
        ) : rates.length === 0 ? (
          <div className="p-10 text-center">
            <ArrowRightLeft className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 font-medium">No exchange rates found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no exchange rates available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="px-6 py-3 text-left font-medium">Currency</th>

                  <th className="px-6 py-3 text-right font-medium">Rate to USD</th>
                </tr>
              </thead>

              <tbody>
                {rates.map((rate: any) => (
                  <tr key={rate.id} className="border-b last:border-0">
                    <td className="px-6 py-4 font-medium">{rate.currency}</td>

                    <td className="px-6 py-4 text-right">{Number(rate.rateToUsd).toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
