'use client';

import Link from 'next/link';

import { Eye } from 'lucide-react';

import type { Employee } from '@/types/employee';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type EmployeeTableProps = {
  employees: Employee[];
  loading?: boolean;
};

function EmployeeStatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  return (
    <span
      className={
        normalized === 'ACTIVE'
          ? 'inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700'
          : 'inline-flex rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
      }
    >
      {status}
    </span>
  );
}

function EmployeeTableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 7 }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <div className="h-4 w-full max-w-32 animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function EmployeeTable({ employees, loading = false }: EmployeeTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <EmployeeTableSkeleton />
          ) : employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.employeeCode}</TableCell>

                <TableCell>
                  <Link href={`/employees/${employee.id}`} className="font-medium hover:underline">
                    {employee.firstName} {employee.lastName}
                  </Link>
                </TableCell>

                <TableCell>{employee.department}</TableCell>

                <TableCell>{employee.designation}</TableCell>

                <TableCell>{employee.country}</TableCell>

                <TableCell>
                  <EmployeeStatusBadge status={employee.employmentStatus} />
                </TableCell>

                <TableCell className="text-right">
                  <Link
                    href={`/employees/${employee.id}`}
                    aria-label={`View ${employee.firstName} ${employee.lastName}`}
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Eye className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
