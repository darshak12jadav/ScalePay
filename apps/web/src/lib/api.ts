const API_URL = process.env.NEXT_PUBLIC_API_URL;

import type {
  CreateEmployeeWithSalaryInput,
  CreateEmployeeWithSalaryResponse,
} from '@/types/employee';

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const contentType = response.headers.get('content-type');

  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Something went wrong';

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const api = {
  get<T>(path: string) {
    return request<T>(path);
  },

  post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },

  patch<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },

  delete<T>(path: string) {
    return request<T>(path, {
      method: 'DELETE',
    });
  },
};

export async function createEmployeeWithSalary(
  input: CreateEmployeeWithSalaryInput,
): Promise<CreateEmployeeWithSalaryResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/with-salary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.message ?? error?.error ?? 'Unable to create employee');
  }

  return response.json();
}

export async function getExchangeRates() {
  return api.get('/api/exchange-rates');
}

export async function getExchangeRate(currency: string) {
  return api.get(`/api/exchange-rates/${currency}`);
}
