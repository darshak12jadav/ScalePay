'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { DepartmentAnalytics } from '@/types/analytics';

interface DepartmentSalaryChartProps {
  data?: DepartmentAnalytics[];
  loading?: boolean;
  error?: boolean;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function DepartmentSalaryChart({
  data,
  loading = false,
  error = false,
}: DepartmentSalaryChartProps) {
  if (loading) {
    return (
      <ChartContainer title="Salary by Department" description="Total annual salary by department">
        <ChartLoading />
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer title="Salary by Department" description="Total annual salary by department">
        <ChartMessage message="Unable to load department analytics." />
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="Salary by Department" description="Total annual salary by department">
        <ChartMessage message="No department salary data available." />
      </ChartContainer>
    );
  }

  const chartData = data
    .filter((item) => item.department)
    .map((item) => ({
      department: item.department ?? 'Unknown',
      totalSalaryUsd: item.totalSalaryUsd,
      employeeCount: item.employeeCount,
      averageSalaryUsd: item.averageSalaryUsd,
    }));

  return (
    <ChartContainer title="Salary by Department" description="Total annual salary by department">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="department"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${Number(value) / 1000}K`}
          />

          <Tooltip
            formatter={(value, name) => {
              if (name === 'totalSalaryUsd') {
                return [currencyFormatter.format(Number(value)), 'Total Salary'];
              }

              return [value, name];
            }}
          />

          <Bar dataKey="totalSalaryUsd" name="Total Salary" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function ChartContainer({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="h-[320px]">{children}</div>
    </section>
  );
}

function ChartLoading() {
  return (
    <div className="flex h-full items-end gap-4 px-8 pb-8">
      {[55, 75, 45, 85, 65].map((height, index) => (
        <div
          key={index}
          className="flex-1 animate-pulse rounded-t-md bg-muted"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function ChartMessage({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
