'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

import type { NavItem } from './navigation';
import { MobileNavigation } from './mobile-navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  showSearch?: boolean;
};

export function Header({
  title,
  breadcrumbs = [],
  activeKey,
  mobileNavOpen,
  onMobileNavChange,
  onNavigate,
  showSearch = false,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * Employee search is only active on the employees list page.
   */
  const isEmployeesPage = pathname === '/employees';

  const urlSearch = searchParams.get('search') ?? '';

  const [search, setSearch] = useState(urlSearch);

  /*
   * Keep local search state synchronized with URL.
   *
   * This handles:
   * - browser back/forward
   * - clicking Employees from another route
   * - clearing search from another component
   */
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  /*
   * Update the employee search query after the user stops typing.
   *
   * Example:
   *
   * /employees
   *
   * typing "Patel" becomes:
   *
   * /employees?search=Patel&page=1
   */
  useEffect(() => {
    if (!isEmployeesPage || !showSearch) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const currentSearch = search.trim();

      /*
       * Don't update the URL if nothing actually changed.
       */
      if (currentSearch === urlSearch) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      if (currentSearch) {
        params.set('search', currentSearch);
      } else {
        params.delete('search');
      }

      /*
       * New search should always start from page 1.
       */
      params.set('page', '1');

      const query = params.toString();

      router.replace(query ? `/employees?${query}` : '/employees', {
        scroll: false,
      });
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search, urlSearch, isEmployeesPage, showSearch, router, searchParams]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');

    const params = new URLSearchParams(searchParams.toString());

    params.delete('search');
    params.set('page', '1');

    const query = params.toString();

    router.replace(query ? `/employees?${query}` : '/employees', {
      scroll: false,
    });
  };

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

      {/* Right-side actions */}
      <div className="flex items-center gap-1.5">
        {/* Employee search — desktop */}
        {isEmployeesPage && showSearch && (
          <div className="hidden h-9 w-64 items-center gap-2 rounded-md border border-border bg-card px-3 md:flex">
            <Search className="size-4 shrink-0 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search employees..."
              aria-label="Search employees"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            {search ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear employee search"
                className="shrink-0 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            ) : (
              <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            )}
          </div>
        )}

        {/* Employee search — mobile */}
        {isEmployeesPage && showSearch && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Search employees"
                  onClick={() => {
                    /*
                     * Focus the employee search field on mobile.
                     * The actual search input should exist on
                     * the Employees page.
                     */
                    const input =
                      document.querySelector<HTMLInputElement>('[data-employee-search]');

                    input?.focus();
                  }}
                />
              }
            >
              <Search />
            </TooltipTrigger>

            <TooltipContent>Search employees</TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
