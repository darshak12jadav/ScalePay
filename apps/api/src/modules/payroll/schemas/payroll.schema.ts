import { z } from 'zod';

export const payrollCurrencyEnum = z.enum([
  'USD',
  'EUR',
  'GBP',
  'INR',
  'CAD',
  'AUD',
  'SGD',
  'AED',
  'CHF',
]);

export const calculatePayrollSchema = z.object({
  employeeId: z.string().trim().min(1, 'employeeId is required'),
  currency: payrollCurrencyEnum,
});

export type CalculatePayrollInput = z.infer<typeof calculatePayrollSchema>;
