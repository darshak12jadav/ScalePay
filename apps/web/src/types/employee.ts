export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'SGD' | 'AED';

export interface SalaryHistory {
  id: string;
  employeeId: string;
  annualSalary: string;
  currency: Currency;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  country: string;
  employmentStatus: EmploymentStatus;
  createdAt: string;
  updatedAt: string;
  salaryHistory?: SalaryHistory[];
}

export interface EmployeePaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface EmployeesResponse {
  data: Employee[];
  meta: EmployeePaginationMeta;
}

export interface EmployeeFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  country?: string;
  department?: string;
  employmentStatus?: EmploymentStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/* -----------------------------
   Employee update
----------------------------- */

export interface UpdateEmployeeInput {
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  designation?: string;
  country?: string;
  employmentStatus?: EmploymentStatus;
}

export interface CreateEmployeeWithSalaryInput {
  employeeCode: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  country: string;
  employmentStatus: EmploymentStatus;

  salary: {
    annualSalary: number;
    currency: Currency;
    effectiveFrom: string;
  };
}

export interface CreateEmployeeWithSalaryResponse {
  data: {
    employee: unknown;
    salary: unknown;
  };
}

/* -----------------------------
   Salary
----------------------------- */

export interface ReviseSalaryInput {
  annualSalary: number;
  currency: Currency;
  effectiveFrom: string;
}

/* -----------------------------
   Payroll
----------------------------- */

export interface PayrollEmployee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
}

export interface PayrollSalary {
  annualSalary: number;
  currency: Currency;
  effectiveFrom: string;
}

export interface PayrollResult {
  currency: Currency;
  annualBaseSalary: number;
  monthlyBaseSalary: number;

  exchangeRate: number;

  sourceCurrency: Currency;
  targetCurrency: Currency;

  sourceRateToUsd: number;
  targetRateToUsd: number;
}

export interface PayrollCalculateInput {
  employeeId: string;
  currency: Currency;
}

export interface PayrollCalculateResponse {
  employee: PayrollEmployee;
  salary: PayrollSalary;
  payroll: PayrollResult;
}

/* -----------------------------
   Exchange rate
----------------------------- */

export interface ExchangeRateResponse {
  currency: Currency;
  rate: string | number;
  [key: string]: unknown;
}
