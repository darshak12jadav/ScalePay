import type { ReactNode } from 'react';

import { QueryProvider } from '@/components/providers/query-provider';
import { AppShell } from '@/components/shell/app-shell';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AppShell>{children}</AppShell>
    </QueryProvider>
  );
}
