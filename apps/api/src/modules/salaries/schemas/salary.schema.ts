import { z } from 'zod';

export const currencyEnum = z.enum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED', 'CHF']);

export const createSalarySchema = z.object({
  annualSalary: z.coerce.number().positive('annualSalary must be greater than 0'),
  currency: currencyEnum,
  effectiveFrom: z.coerce.date({ message: 'effectiveFrom must be a valid date' }),
});

export const employeeIdParamSchema = z.object({
  id: z.string().trim().min(1, 'id param is required'),
});

export type CreateSalaryInput = z.infer<typeof createSalarySchema>;
