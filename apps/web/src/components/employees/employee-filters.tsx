'use client';

import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';

type EmployeeFiltersProps = {
  search: string;
  country: string;
  department: string;
  employmentStatus: string;
  onSearchChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onEmploymentStatusChange: (value: string) => void;
  onClear: () => void;
};

export function EmployeeFilters({
  search,
  country,
  department,
  employmentStatus,
  onSearchChange,
  onCountryChange,
  onDepartmentChange,
  onEmploymentStatusChange,
  onClear,
}: EmployeeFiltersProps) {
  const hasFilters = search || country || department || employmentStatus;

  const COUNTRIES = [
    'India',
    'United States',
    'United Kingdom',
    'Germany',
    'Canada',
    'Australia',
    'Singapore',
    'United Arab Emirates',
    'Switzerland',
  ];

  const DEPARTMENTS = [
    'Engineering',
    'Product',
    'Finance',
    'Human Resources',
    'Sales',
    'Marketing',
    'Operations',
  ];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employees..."
            className="pl-9"
            aria-label="Search employees"
          />
        </div>

        {/* Country Select */}
        <Select
          value={country || 'all'}
          onValueChange={(v: string | null) => {
            const val = v ?? '';
            onCountryChange(val === 'all' ? '' : val);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Department Select */}
        <Select
          value={department || 'all'}
          onValueChange={(v: string | null) => {
            const val = v ?? '';
            onDepartmentChange(val === 'all' ? '' : val);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employment Status Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={employmentStatus === 'ACTIVE' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onEmploymentStatusChange(employmentStatus === 'ACTIVE' ? '' : 'ACTIVE')}
        >
          Active
        </Button>

        <Button
          type="button"
          variant={employmentStatus === 'ON_LEAVE' ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onEmploymentStatusChange(employmentStatus === 'ON_LEAVE' ? '' : 'ON_LEAVE')
          }
        >
          On Leave
        </Button>

        <Button
          type="button"
          variant={employmentStatus === 'INACTIVE' ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onEmploymentStatusChange(employmentStatus === 'INACTIVE' ? '' : 'INACTIVE')
          }
        >
          Inactive
        </Button>

        {hasFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            <X className="size-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
