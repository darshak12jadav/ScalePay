import { z } from 'zod';

export const currencyEnum = z.enum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED', 'CHF']);

export const currencyParamSchema = z.object({
  currency: currencyEnum,
});
