export interface AnalyticsSummary {
  totalEmployees: number;
  employeesWithSalary: number;
  totalAnnualPayrollUsd: number;
  averageSalaryUsd: number;
  medianSalaryUsd: number;
  minSalaryUsd: number;
  maxSalaryUsd: number;
}

export interface CountryAnalytics {
  country: string;
  employeeCount: number;
  totalSalaryUsd: number;
  averageSalaryUsd: number;
}

export interface DepartmentAnalytics {
  department: string;
  employeeCount: number;
  totalSalaryUsd: number;
  averageSalaryUsd: number;
}

export interface SalaryDistribution {
  under50000: number;
  from50000To99999: number;
  from100000To149999: number;
  from150000To199999: number;
  above200000: number;
}
