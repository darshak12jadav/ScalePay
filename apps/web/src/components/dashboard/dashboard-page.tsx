'use client';

import { BarChart3, DollarSign, Users, Wallet } from 'lucide-react';

import {
  useAnalyticsByCountry,
  useAnalyticsByDepartment,
  useAnalyticsSummary,
  useSalaryDistribution,
} from '@/hooks/use-analytics';

import { DashboardKpiCard } from './dashboard-kpi-card';
import { SalaryDistributionChart } from './salary-distribution-chart';
import { DepartmentSalaryChart } from './department-salary-chart';
import { CountrySalaryChart } from './country-salary-chart';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US');

export function DashboardPage() {
  const summaryQuery = useAnalyticsSummary();
  const countryQuery = useAnalyticsByCountry();
  const departmentQuery = useAnalyticsByDepartment();
  const distributionQuery = useSalaryDistribution();

  const summary = summaryQuery.data;

  const hasSummaryError = summaryQuery.isError;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">ScalePay</p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Overview of employee and payroll metrics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void summaryQuery.refetch();
              void countryQuery.refetch();
              void departmentQuery.refetch();
              void distributionQuery.refetch();
            }}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary error */}
      {hasSummaryError && (
        <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">Unable to load dashboard summary.</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Check that the API server is running and try refreshing.
          </p>
        </div>
      )}

      {/* KPI cards */}
      <section aria-label="Payroll summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardKpiCard
          title="Total Employees"
          value={summary ? numberFormatter.format(summary.totalEmployees) : ''}
          description="Employees in ScalePay"
          loading={summaryQuery.isLoading}
          icon={<Users className="size-4" />}
        />

        <DashboardKpiCard
          title="Employees With Salary"
          value={summary ? numberFormatter.format(summary.employeesWithSalary) : ''}
          description="Employees with a current salary"
          loading={summaryQuery.isLoading}
          icon={<Wallet className="size-4" />}
        />

        <DashboardKpiCard
          title="Total Annual Payroll"
          value={summary ? currencyFormatter.format(summary.totalAnnualPayrollUsd) : ''}
          description="Current annual payroll in USD"
          loading={summaryQuery.isLoading}
          icon={<DollarSign className="size-4" />}
        />

        <DashboardKpiCard
          title="Average Salary"
          value={summary ? currencyFormatter.format(summary.averageSalaryUsd) : ''}
          description="Average current salary in USD"
          loading={summaryQuery.isLoading}
          icon={<BarChart3 className="size-4" />}
        />
      </section>

      {/* Additional summary */}
      {!summaryQuery.isLoading && !summaryQuery.isError && summary && (
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">Salary overview</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Additional salary statistics from current employee records.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryMetric
              label="Median Salary"
              value={currencyFormatter.format(summary.medianSalaryUsd)}
            />

            <SummaryMetric
              label="Minimum Salary"
              value={currencyFormatter.format(summary.minSalaryUsd)}
            />

            <SummaryMetric
              label="Maximum Salary"
              value={currencyFormatter.format(summary.maxSalaryUsd)}
            />
          </div>
        </section>
      )}

      {/* Charts */}
      <section className="grid gap-6 xl:grid-cols-2">
        <SalaryDistributionChart
          data={distributionQuery.data}
          loading={distributionQuery.isLoading}
          error={distributionQuery.isError}
        />

        <DepartmentSalaryChart
          data={departmentQuery.data}
          loading={departmentQuery.isLoading}
          error={departmentQuery.isError}
        />
      </section>

      <CountrySalaryChart
        data={countryQuery.data}
        loading={countryQuery.isLoading}
        error={countryQuery.isError}
      />
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
