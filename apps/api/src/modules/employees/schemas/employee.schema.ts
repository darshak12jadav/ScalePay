import { z } from 'zod';

import { Currency } from '../../../generated/prisma/client';

export const employmentStatusEnum = z.enum(['ACTIVE', 'ON_LEAVE', 'INACTIVE']);

export const createEmployeeSchema = z.object({
  employeeCode: z.string().trim().min(1, 'employeeCode is required'),

  firstName: z.string().trim().min(1, 'firstName is required'),

  lastName: z.string().trim().min(1, 'lastName is required'),

  department: z.string().trim().min(1, 'department is required'),

  designation: z.string().trim().min(1, 'designation is required'),

  country: z.string().trim().min(1, 'country is required'),

  employmentStatus: employmentStatusEnum.optional(),
});

export const createEmployeeWithSalarySchema = z.object({
  employeeCode: z.string().trim().min(1, 'employeeCode is required'),

  firstName: z.string().trim().min(1, 'firstName is required'),

  lastName: z.string().trim().min(1, 'lastName is required'),

  department: z.string().trim().min(1, 'department is required'),

  designation: z.string().trim().min(1, 'designation is required'),

  country: z.string().trim().min(1, 'country is required'),

  employmentStatus: employmentStatusEnum.default('ACTIVE'),

  salary: z.object({
    annualSalary: z.coerce.number().positive('annualSalary must be greater than 0'),

    currency: z.nativeEnum(Currency),

    effectiveFrom: z.string().trim().min(1, 'effectiveFrom is required'),
  }),
});

export const updateEmployeeSchema = z
  .object({
    firstName: z.string().trim().min(1, 'firstName cannot be empty').optional(),

    lastName: z.string().trim().min(1, 'lastName cannot be empty').optional(),

    department: z.string().trim().min(1, 'department cannot be empty').optional(),

    designation: z.string().trim().min(1, 'designation cannot be empty').optional(),

    country: z.string().trim().min(1, 'country cannot be empty').optional(),

    employmentStatus: employmentStatusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
  });

export const employeeIdParamSchema = z.object({
  id: z.string().trim().min(1, 'id param is required'),
});

export const getEmployeesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  country: z.string().trim().optional(),
  department: z.string().trim().optional(),
  employmentStatus: employmentStatusEnum.optional(),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName', 'employeeCode']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GetEmployeesQuery = z.infer<typeof getEmployeesQuerySchema>;

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export type CreateEmployeeWithSalaryInput = z.infer<typeof createEmployeeWithSalarySchema>;
