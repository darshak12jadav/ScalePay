'use client';

import { useState } from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';

import { EmployeeFilters } from '@/components/employees/employee-filters';
import { EmployeeTable } from '@/components/employees/employee-table';

import { useEmployees } from '@/hooks/use-employees';

import type { EmploymentStatus } from '@/types/employee';
import Link from 'next/link';

const PAGE_SIZE = 10;

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus | ''>('');

  const [page, setPage] = useState(1);

  const filters = {
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    country: country || undefined,
    department: department || undefined,
    employmentStatus: employmentStatus || undefined,
  };

  const employeesQuery = useEmployees(filters);

  const response = employeesQuery.data;

  const employees = response?.data ?? [];

  const total = response?.meta.total ?? 0;

  const totalPages = response?.meta.totalPages ?? 1;

  function clearFilters() {
    setSearch('');
    setCountry('');
    setDepartment('');
    setEmploymentStatus('');
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage employees and their employment information.
          </p>
        </div>

        <Link
          href="/employees/new"
          className={buttonVariants({ variant: 'default', size: 'default' })}
        >
          <UserPlus className="size-4 shrink-0" />
          <span>Add Employee</span>
        </Link>
      </div>

      {/* Filters */}
      <EmployeeFilters
        search={search}
        country={country}
        department={department}
        employmentStatus={employmentStatus}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onCountryChange={(value) => {
          setCountry(value);
          setPage(1);
        }}
        onDepartmentChange={(value) => {
          setDepartment(value);
          setPage(1);
        }}
        onEmploymentStatusChange={(value) => {
          setEmploymentStatus(value as EmploymentStatus | '');
          setPage(1);
        }}
        onClear={clearFilters}
      />

      {/* Table controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {employeesQuery.isLoading
            ? 'Loading employees...'
            : `${total.toLocaleString()} employee${total === 1 ? '' : 's'}`}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => employeesQuery.refetch()}
          disabled={employeesQuery.isFetching}
        >
          <RefreshCw className={employeesQuery.isFetching ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {employeesQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-medium">Unable to load employees</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading employee data.
          </p>

          <Button className="mt-4" variant="outline" onClick={() => employeesQuery.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          {/* Employee table */}
          <EmployeeTable employees={employees} loading={employeesQuery.isLoading} />

          {/* Empty state */}
          {!employeesQuery.isLoading && !employeesQuery.isFetching && employees.length === 0 && (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <h2 className="font-medium">No employees found</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          {!employeesQuery.isLoading && employees.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {response?.meta.page ?? page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || employeesQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || employeesQuery.isFetching}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
