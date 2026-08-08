import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

import type {
  AnalyticsSummary,
  CountryAnalytics,
  DepartmentAnalytics,
  SalaryDistribution,
} from '@/types/analytics';

interface ApiResponse<T> {
  data: T;
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AnalyticsSummary>>('/api/analytics/summary');

      return response.data;
    },
  });
}

export function useAnalyticsByCountry() {
  return useQuery({
    queryKey: ['analytics', 'country'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CountryAnalytics[]>>('/api/analytics/by-country');

      return response.data;
    },
  });
}

export function useAnalyticsByDepartment() {
  return useQuery({
    queryKey: ['analytics', 'department'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DepartmentAnalytics[]>>(
        '/api/analytics/by-department',
      );

      return response.data;
    },
  });
}

export function useSalaryDistribution() {
  return useQuery({
    queryKey: ['analytics', 'distribution'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SalaryDistribution>>(
        '/api/analytics/salary-distribution',
      );

      return response.data;
    },
  });
}
