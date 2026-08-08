'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { EmployeeFilters, Employee, EmployeesResponse } from '@/types/employee';

import { createEmployeeWithSalary } from '@/lib/api';

import type { CreateEmployeeWithSalaryInput } from '@/types/employee';

function buildEmployeeQuery(filters: EmployeeFilters): string {
  const params = new URLSearchParams();

  params.set('page', String(filters.page ?? 1));
  params.set('pageSize', String(filters.pageSize ?? 10));

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters.country) {
    params.set('country', filters.country);
  }

  if (filters.department) {
    params.set('department', filters.department);
  }

  if (filters.employmentStatus) {
    params.set('employmentStatus', filters.employmentStatus);
  }

  if (filters.sortBy) {
    params.set('sortBy', filters.sortBy);
  }

  if (filters.sortOrder) {
    params.set('sortOrder', filters.sortOrder);
  }

  return params.toString();
}

export function useEmployees(filters: EmployeeFilters) {
  return useQuery<EmployeesResponse>({
    queryKey: ['employees', filters],
    queryFn: async () => {
      const query = buildEmployeeQuery(filters);
      return api.get<EmployeesResponse>(`/api/employees?${query}`);
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateEmployeeWithSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeWithSalaryInput) => createEmployeeWithSalary(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}
