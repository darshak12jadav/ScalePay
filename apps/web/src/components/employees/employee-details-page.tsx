'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calculator,
  Edit,
  Globe,
  Trash2,
  User,
  Wallet,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import {
  useCalculatePayroll,
  useDeleteEmployee,
  useEmployee,
  useEmployeeSalary,
  useEmployeeSalaryHistory,
  useExchangeRate,
  useReviseSalary,
  useUpdateEmployee,
} from '@/hooks/use-employee';

import type { Currency, EmploymentStatus } from '@/types/employee';

const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED'];

const employmentStatuses: EmploymentStatus[] = ['ACTIVE', 'ON_LEAVE', 'INACTIVE'];

export default function EmployeeDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const employeeId = params.id;

  const employeeQuery = useEmployee(employeeId);
  const salaryQuery = useEmployeeSalary(employeeId);
  const salaryHistoryQuery = useEmployeeSalaryHistory(employeeId);

  const updateEmployee = useUpdateEmployee(employeeId);
  const deleteEmployee = useDeleteEmployee(employeeId);
  const reviseSalary = useReviseSalary(employeeId);

  const calculatePayroll = useCalculatePayroll();

  const employee = employeeQuery.data;

  const [editingEmployee, setEditingEmployee] = useState(false);
  const [editingSalary, setEditingSalary] = useState(false);

  const [payrollCurrency, setPayrollCurrency] = useState<Currency>('USD');

  const payroll = calculatePayroll.data;

  const exchangeRateQuery = useExchangeRate(payrollCurrency);

  if (employeeQuery.isLoading) {
    return <EmployeeDetailsSkeleton />;
  }

  if (employeeQuery.isError) {
    return (
      <div className="space-y-6">
        <BackButton />

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold">Unable to load employee</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The employee could not be loaded from the server.
          </p>

          <Button className="mt-4" variant="outline" onClick={() => employeeQuery.refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-6">
        <BackButton />

        <div className="rounded-xl border p-8 text-center">
          <h2 className="font-semibold">Employee not found</h2>

          <p className="mt-1 text-sm text-muted-foreground">This employee does not exist.</p>
        </div>
      </div>
    );
  }

  const currentSalary =
    salaryQuery.data ??
    employee.salaryHistory?.find((salary) => salary.effectiveTo === null) ??
    null;

  const salaryHistory = salaryHistoryQuery.data ?? employee.salaryHistory ?? [];

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee?.firstName} ${employee?.lastName}?`,
    );

    if (!confirmed) return;

    try {
      await deleteEmployee.mutateAsync();

      router.push('/employees');
    } catch {
      window.alert('Unable to delete employee.');
    }
  }

  async function handleUpdateEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      await updateEmployee.mutateAsync({
        employeeCode: String(formData.get('employeeCode') ?? ''),
        firstName: String(formData.get('firstName') ?? ''),
        lastName: String(formData.get('lastName') ?? ''),
        department: String(formData.get('department') ?? ''),
        designation: String(formData.get('designation') ?? ''),
        country: String(formData.get('country') ?? ''),
        employmentStatus: String(formData.get('employmentStatus')) as EmploymentStatus,
      });

      setEditingEmployee(false);
    } catch {
      window.alert('Unable to update employee.');
    }
  }

  async function handleReviseSalary(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      await reviseSalary.mutateAsync({
        annualSalary: Number(formData.get('annualSalary')),
        currency: String(formData.get('currency')) as Currency,
        effectiveFrom: String(formData.get('effectiveFrom')),
      });

      setEditingSalary(false);
    } catch {
      window.alert('Unable to update salary.');
    }
  }

  async function handleCalculatePayroll() {
    try {
      await calculatePayroll.mutateAsync({
        employeeId,
        currency: payrollCurrency,
      });
    } catch {
      window.alert('Unable to calculate payroll.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Back */}

      <BackButton />

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Employee</p>

          <h1 className="mt-1 text-2xl font-semibold">
            {employee.firstName} {employee.lastName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">{employee.employeeCode}</p>
        </div>

        <div className="flex items-center gap-2">
          <EmployeeStatusBadge status={employee.employmentStatus} />

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteEmployee.isPending}
          >
            <Trash2 className="size-4" />

            {deleteEmployee.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Employee information */}

      <section className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />

              <h2 className="font-semibold">Employee Information</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">Basic employment information.</p>
          </div>

          <Button variant="outline" size="sm" onClick={() => setEditingEmployee((value) => !value)}>
            <Edit className="size-4" />

            {editingEmployee ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {editingEmployee ? (
          <form onSubmit={handleUpdateEmployee} className="grid gap-4 p-6 sm:grid-cols-2">
            <FormInput
              name="employeeCode"
              label="Employee Code"
              defaultValue={employee.employeeCode}
            />

            <FormInput name="firstName" label="First Name" defaultValue={employee.firstName} />

            <FormInput name="lastName" label="Last Name" defaultValue={employee.lastName} />

            <FormInput name="department" label="Department" defaultValue={employee.department} />

            <FormInput name="designation" label="Designation" defaultValue={employee.designation} />

            <FormInput name="country" label="Country" defaultValue={employee.country} />

            <div>
              <label className="text-sm font-medium">Employment Status</label>

              <select
                name="employmentStatus"
                defaultValue={employee.employmentStatus}
                className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                {employmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" disabled={updateEmployee.isPending}>
                {updateEmployee.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              icon={<User className="size-4" />}
              label="Employee Code"
              value={employee.employeeCode}
            />

            <InfoItem label="First Name" value={employee.firstName} />

            <InfoItem label="Last Name" value={employee.lastName} />

            <InfoItem
              icon={<Building2 className="size-4" />}
              label="Department"
              value={employee.department}
            />

            <InfoItem
              icon={<Briefcase className="size-4" />}
              label="Designation"
              value={employee.designation}
            />

            <InfoItem
              icon={<Globe className="size-4" />}
              label="Country"
              value={employee.country}
            />

            <InfoItem label="Employment Status" value={employee.employmentStatus} />

            <InfoItem label="Created" value={formatDate(employee.createdAt)} />

            <InfoItem label="Last Updated" value={formatDate(employee.updatedAt)} />
          </div>
        )}
      </section>

      {/* Salary */}

      <section className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-muted-foreground" />

              <h2 className="font-semibold">Salary</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">Current employee salary.</p>
          </div>

          <Button variant="outline" size="sm" onClick={() => setEditingSalary((value) => !value)}>
            <Edit className="size-4" />

            {editingSalary ? 'Cancel' : 'Change Salary'}
          </Button>
        </div>

        {editingSalary ? (
          <form onSubmit={handleReviseSalary} className="grid gap-4 p-6 sm:grid-cols-3">
            <FormInput
              name="annualSalary"
              label="Annual Salary"
              type="number"
              min="0"
              defaultValue={currentSalary?.annualSalary ?? ''}
              required
            />

            <div>
              <label className="text-sm font-medium">Currency</label>

              <select
                name="currency"
                defaultValue={currentSalary?.currency ?? 'USD'}
                className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <FormInput name="effectiveFrom" label="Effective From" type="date" required />

            <div className="sm:col-span-3">
              <Button type="submit" disabled={reviseSalary.isPending}>
                {reviseSalary.isPending ? 'Updating...' : 'Update Salary'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            {currentSalary ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <InfoItem
                  label="Annual Salary"
                  value={formatCurrency(currentSalary.annualSalary, currentSalary.currency)}
                />

                <InfoItem label="Currency" value={currentSalary.currency} />

                <InfoItem label="Effective From" value={formatDate(currentSalary.effectiveFrom)} />

                <InfoItem label="Status" value="Current" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No salary information.</p>
            )}
          </div>
        )}
      </section>

      {/* Salary History */}

      <section className="rounded-xl border bg-card">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Salary History</h2>

          <p className="mt-1 text-sm text-muted-foreground">Complete salary revision history.</p>
        </div>

        {salaryHistoryQuery.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading salary history...</div>
        ) : salaryHistory.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium">No salary history</p>

            <p className="mt-1 text-sm text-muted-foreground">No salary records are available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-6 py-3 text-left">Annual Salary</th>

                  <th className="px-6 py-3 text-left">Currency</th>

                  <th className="px-6 py-3 text-left">Effective From</th>

                  <th className="px-6 py-3 text-left">Effective To</th>

                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {salaryHistory.map((salary) => {
                  const isCurrent = salary.effectiveTo === null;

                  return (
                    <tr key={salary.id} className="border-b last:border-0">
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(salary.annualSalary, salary.currency)}
                      </td>

                      <td className="px-6 py-4">{salary.currency}</td>

                      <td className="px-6 py-4">{formatDate(salary.effectiveFrom)}</td>

                      <td className="px-6 py-4">
                        {salary.effectiveTo ? formatDate(salary.effectiveTo) : '—'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            isCurrent
                              ? 'rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
                              : 'rounded-full border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'
                          }
                        >
                          {isCurrent ? 'Current' : 'Historical'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Payroll */}

      <section className="rounded-xl border bg-card">
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Calculator className="size-4 text-muted-foreground" />

            <h2 className="font-semibold">Payroll</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Calculate this employee's salary in another currency.
          </p>
        </div>

        <div className="space-y-6 p-6">
          {/* Currency + Calculate button */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-xs">
              <label className="text-sm font-medium">Payroll Currency</label>

              <select
                value={payrollCurrency}
                onChange={(event) => setPayrollCurrency(event.target.value as Currency)}
                className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={handleCalculatePayroll} disabled={calculatePayroll.isPending}>
              <Calculator className="size-4" />

              {calculatePayroll.isPending ? 'Calculating...' : 'Calculate Payroll'}
            </Button>
          </div>

          {/* Payroll result */}

          {payroll && (
            <div className="space-y-6">
              {/* Currency Conversion */}

              <div className="rounded-xl border bg-card">
                <div className="border-b px-5 py-4">
                  <h3 className="font-semibold">Currency Conversion</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Exchange rate information used for this payroll calculation.
                  </p>
                </div>

                <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoItem label="Source Currency" value={payroll?.payroll?.sourceCurrency} />

                  <InfoItem label="Target Currency" value={payroll?.payroll?.targetCurrency} />

                  <InfoItem label="Exchange Rate" value={String(payroll?.payroll?.exchangeRate)} />

                  <InfoItem label="Currency" value={payroll?.payroll?.currency} />
                </div>
              </div>

              {/* Exchange Rates */}

              <div className="rounded-xl border bg-card">
                <div className="border-b px-5 py-4">
                  <h3 className="font-semibold">Exchange Rates</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Exchange rates used for the USD conversion.
                  </p>
                </div>

                <div className="grid gap-6 p-5 sm:grid-cols-2">
                  <InfoItem
                    label="Source Rate to USD"
                    value={String(payroll?.payroll?.sourceRateToUsd)}
                  />

                  <InfoItem
                    label="Target Rate to USD"
                    value={String(payroll?.payroll?.targetRateToUsd)}
                  />
                </div>
              </div>

              {/* Converted Payroll */}

              <div className="rounded-xl border bg-card">
                <div className="border-b px-5 py-4">
                  <h3 className="font-semibold">Converted Payroll</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Salary converted to {payroll?.payroll?.targetCurrency}.
                  </p>
                </div>

                <div className="grid gap-6 p-5 sm:grid-cols-2">
                  <InfoItem
                    label="Annual Base Salary"
                    value={formatCurrency(
                      String(payroll?.payroll?.annualBaseSalary),
                      payroll?.payroll?.currency,
                    )}
                  />

                  <InfoItem
                    label="Monthly Base Salary"
                    value={formatCurrency(
                      String(payroll?.payroll?.monthlyBaseSalary),
                      payroll?.payroll?.currency,
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* No result */}

          {!payroll && !calculatePayroll.isPending && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Calculator className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 font-medium">No payroll calculation yet</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Select a currency and click Calculate Payroll.
              </p>
            </div>
          )}

          {/* Calculation error */}

          {calculatePayroll.isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">Unable to calculate payroll.</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please check the employee's salary and exchange-rate information and try again.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------
   Components
--------------------------------- */

function BackButton() {
  return (
    <Link
      href="/employees"
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
    >
      <ArrowLeft className="size-4" />
      Back to Employees
    </Link>
  );
}

function EmployeeStatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const className =
    normalized === 'ACTIVE'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : normalized === 'ON_LEAVE'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-border bg-muted text-muted-foreground';

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function FormInput({
  name,
  label,
  defaultValue,
  type = 'text',
  min,
  required = true,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  min?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        min={min}
        required={required}
        className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function formatCurrency(value: string, currency: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `${value} ${currency}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function EmployeeDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />

      <div>
        <div className="h-7 w-64 animate-pulse rounded bg-muted" />

        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index}>
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />

              <div className="mt-2 h-5 w-32 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
