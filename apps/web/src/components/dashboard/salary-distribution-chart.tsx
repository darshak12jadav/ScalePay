'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { SalaryDistribution } from '@/types/analytics';

interface SalaryDistributionChartProps {
  data?: SalaryDistribution;
  loading?: boolean;
  error?: boolean;
}

const labels = [
  {
    key: 'under50000',
    label: 'Under $50K',
  },
  {
    key: 'from50000To99999',
    label: '$50K–$99K',
  },
  {
    key: 'from100000To149999',
    label: '$100K–$149K',
  },
  {
    key: 'from150000To199999',
    label: '$150K–$199K',
  },
  {
    key: 'above200000',
    label: '$200K+',
  },
] as const;

export function SalaryDistributionChart({
  data,
  loading = false,
  error = false,
}: SalaryDistributionChartProps) {
  if (loading) {
    return (
      <ChartContainer title="Salary Distribution" description="Employees by annual salary range">
        <ChartLoading />
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer title="Salary Distribution" description="Employees by annual salary range">
        <ChartMessage message="Unable to load salary distribution." />
      </ChartContainer>
    );
  }

  if (!data) {
    return (
      <ChartContainer title="Salary Distribution" description="Employees by annual salary range">
        <ChartMessage message="No salary distribution data available." />
      </ChartContainer>
    );
  }

  const chartData = labels.map(({ key, label }) => ({
    label,
    employees: data[key],
  }));

  const hasData = chartData.some((item) => item.employees > 0);

  if (!hasData) {
    return (
      <ChartContainer title="Salary Distribution" description="Employees by annual salary range">
        <ChartMessage message="No salary data available." />
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="Salary Distribution" description="Employees by annual salary range">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
          />

          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />

          <Tooltip
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            formatter={(value) => [value, 'Employees']}
          />

          <Bar dataKey="employees" name="Employees" radius={[5, 5, 0, 0]} />
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
      {[40, 65, 50, 75, 35].map((height, index) => (
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
