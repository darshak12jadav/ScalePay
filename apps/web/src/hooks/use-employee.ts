'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type {
  Employee,
  ExchangeRateResponse,
  PayrollCalculateInput,
  PayrollCalculateResponse,
  ReviseSalaryInput,
  SalaryHistory,
  UpdateEmployeeInput,
} from '@/types/employee';

export function useEmployee(employeeId: string) {
  return useQuery({
    queryKey: ['employee', employeeId],

    queryFn: async () => {
      const response = await api.get<{ data: Employee }>(`/api/employees/${employeeId}`);

      return response.data;
    },

    enabled: Boolean(employeeId),
  });
}

/* --------------------------------
   UPDATE EMPLOYEE
--------------------------------- */

export function useUpdateEmployee(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateEmployeeInput) => {
      return api.patch<{ data: Employee }>(`/api/employees/${employeeId}`, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee', employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}

/* --------------------------------
   DELETE EMPLOYEE
--------------------------------- */

export function useDeleteEmployee(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.delete(`/api/employees/${employeeId}`);
    },

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['employee', employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}

/* --------------------------------
   CURRENT SALARY
--------------------------------- */

export function useEmployeeSalary(employeeId: string) {
  return useQuery({
    queryKey: ['employee-salary', employeeId],

    queryFn: async () => {
      const response = await api.get<{
        data: SalaryHistory | null;
      }>(`/api/employees/${employeeId}/salary`);

      return response.data;
    },

    enabled: Boolean(employeeId),
  });
}

/* --------------------------------
   SALARY HISTORY
--------------------------------- */

export function useEmployeeSalaryHistory(employeeId: string) {
  return useQuery({
    queryKey: ['employee-salary-history', employeeId],

    queryFn: async () => {
      const response = await api.get<{
        data: SalaryHistory[];
      }>(`/api/employees/${employeeId}/salary/history`);

      return response.data;
    },

    enabled: Boolean(employeeId),
  });
}

/* --------------------------------
   REVISE SALARY
--------------------------------- */

export function useReviseSalary(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReviseSalaryInput) => {
      return api.post(`/api/employees/${employeeId}/salary`, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee', employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ['employee-salary', employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ['employee-salary-history', employeeId],
      });
    },
  });
}

/* --------------------------------
   PAYROLL CALCULATE
--------------------------------- */

export function useCalculatePayroll() {
  return useMutation({
    mutationFn: async (input: PayrollCalculateInput) => {
      const response = await api.post<{ data: PayrollCalculateResponse }>(
        '/api/payroll/calculate',
        input,
      );

      return response.data;
    },
  });
}

/* --------------------------------
   EXCHANGE RATE
--------------------------------- */

export function useExchangeRate(currency: string) {
  return useQuery({
    queryKey: ['exchange-rate', currency],

    queryFn: async () => {
      const response = await api.get<ExchangeRateResponse>(`/api/exchange-rates/${currency}`);

      return response;
    },

    enabled: Boolean(currency),
  });
}
