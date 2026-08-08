'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { NavItem } from './navigation';
import { MobileNavigation } from './mobile-navigation';

export type Breadcrumb = {
  label: string;
  href?: string;
};

type HeaderProps = {
  title: string;
  breadcrumbs?: Breadcrumb[];
  activeKey: string;
  mobileNavOpen: boolean;
  onMobileNavChange: (open: boolean) => void;
  onNavigate?: (item: NavItem) => void;
};

export function Header({
  title,
  breadcrumbs = [],
  activeKey,
  mobileNavOpen,
  onMobileNavChange,
  onNavigate,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      {/* Mobile navigation */}
      <div className="lg:hidden">
        <MobileNavigation
          open={mobileNavOpen}
          onOpenChange={onMobileNavChange}
          activeKey={activeKey}
          onNavigate={onNavigate}
        />
      </div>

      {/* Page title / breadcrumbs */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="hidden md:block">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                    {index > 0 && (
                      <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
                    )}

                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="transition-colors hover:text-foreground">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? 'text-foreground' : undefined}>{crumb.label}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : (
          <h1 className="truncate text-sm font-medium text-foreground">{title}</h1>
        )}
      </div>
    </header>
  );
}
