'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface HealthResponse {
  status: string;
}

export default function TestApiPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get<HealthResponse>('/health'),
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Checking API...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">API Connection Failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border p-8">
        <h1 className="text-2xl font-bold">ScalePay API</h1>

        <p className="mt-2 text-muted-foreground">Frontend successfully connected to backend.</p>

        <pre className="mt-4 rounded-md bg-muted p-4">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </main>
  );
}
