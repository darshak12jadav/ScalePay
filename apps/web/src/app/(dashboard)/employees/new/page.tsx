'use client';

import Link from 'next/link';
import { ArrowLeft, UserPlus, Wallet, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCreateEmployeeWithSalary } from '@/hooks/use-employees';

import type { Currency, EmploymentStatus } from '@/types/employee';

const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED'];

const employmentStatuses: EmploymentStatus[] = ['ACTIVE', 'ON_LEAVE', 'INACTIVE'];

export default function NewEmployeePage() {
  const router = useRouter();

  const createEmployee = useCreateEmployeeWithSalary();

  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage('');

    const formData = new FormData(event.currentTarget);

    const payload = {
      employeeCode: String(formData.get('employeeCode') ?? '').trim(),
      firstName: String(formData.get('firstName') ?? '').trim(),
      lastName: String(formData.get('lastName') ?? '').trim(),
      department: String(formData.get('department') ?? '').trim(),
      designation: String(formData.get('designation') ?? '').trim(),
      country: String(formData.get('country') ?? '').trim(),
      employmentStatus: String(formData.get('employmentStatus') ?? 'ACTIVE') as EmploymentStatus,

      salary: {
        annualSalary: Number(formData.get('annualSalary')),
        currency: String(formData.get('currency') ?? 'USD') as Currency,
        effectiveFrom: String(formData.get('effectiveFrom') ?? ''),
      },
    };

    if (
      !payload.employeeCode ||
      !payload.firstName ||
      !payload.lastName ||
      !payload.department ||
      !payload.designation ||
      !payload.country
    ) {
      setErrorMessage('Please fill in all employee details.');
      return;
    }

    if (!Number.isFinite(payload.salary.annualSalary) || payload.salary.annualSalary <= 0) {
      setErrorMessage('Annual salary must be greater than 0.');
      return;
    }

    if (!payload.salary.effectiveFrom) {
      setErrorMessage('Please select the salary effective date.');
      return;
    }

    try {
      await createEmployee.mutateAsync(payload);

      router.push('/employees');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create employee.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back */}

      <Link
        href="/employees"
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
      >
        <ArrowLeft className="size-4" />
        Back to Employees
      </Link>

      {/* Header */}

      <div>
        <div className="flex items-center gap-2">
          <UserPlus className="size-5 text-muted-foreground" />

          <h1 className="text-2xl font-semibold">Add Employee</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Create an employee and their initial salary information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Information */}

        <section className="rounded-xl border bg-card">
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <UserPlus className="size-4 text-muted-foreground" />

              <h2 className="font-semibold">Employee Information</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter the employee's employment information.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <FormInput name="employeeCode" label="Employee Code" placeholder="EMP-001" />

            <FormInput name="firstName" label="First Name" placeholder="John" />

            <FormInput name="lastName" label="Last Name" placeholder="Doe" />

            <FormInput name="department" label="Department" placeholder="Engineering" />

            <FormInput name="designation" label="Designation" placeholder="Software Engineer" />

            <FormInput name="country" label="Country" placeholder="India" />

            <div>
              <label className="text-sm font-medium">Employment Status</label>

              <select
                name="employmentStatus"
                defaultValue="ACTIVE"
                className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {employmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Salary Information */}

        <section className="rounded-xl border bg-card">
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-muted-foreground" />

              <h2 className="font-semibold">Initial Salary</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Add the employee's initial salary record.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-3">
            <FormInput
              name="annualSalary"
              label="Annual Salary"
              type="number"
              min="0"
              step="0.01"
              placeholder="75000"
            />

            <div>
              <label className="text-sm font-medium">Currency</label>

              <select
                name="currency"
                defaultValue="USD"
                className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <FormInput name="effectiveFrom" label="Effective From" type="date" />
          </div>
        </section>

        {/* Error */}

        {errorMessage && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">{errorMessage}</p>
          </div>
        )}

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/employees')}
            disabled={createEmployee.isPending}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={createEmployee.isPending}>
            <Save className="size-4" />

            {createEmployee.isPending ? 'Creating Employee...' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* --------------------------------
   Form Input
--------------------------------- */

function FormInput({
  name,
  label,
  placeholder,
  type = 'text',
  min,
  step,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        min={min}
        step={step}
        required
        className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
