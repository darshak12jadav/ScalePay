import type { ReactNode } from 'react';

interface DashboardKpiCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  loading?: boolean;
}

export function DashboardKpiCard({
  title,
  value,
  description,
  icon,
  loading = false,
}: DashboardKpiCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          {loading ? (
            <div className="mt-3 h-8 w-32 animate-pulse rounded-md bg-muted" />
          ) : (
            <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
          )}

          {description && !loading && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
