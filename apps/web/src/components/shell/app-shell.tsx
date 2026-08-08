'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { allNavigation, type NavItem } from './navigation';
import { Sidebar } from './sidebar';
import { Header, type Breadcrumb } from './header';

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Breadcrumb[];
};

export function AppShell({ children, title, breadcrumbs }: AppShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeItem = useMemo(() => {
    if (pathname === '/') {
      return allNavigation.find((item) => item.href === '/');
    }

    return allNavigation.find(
      (item) =>
        item.href !== '/' && (pathname === item.href || pathname.startsWith(`${item.href}/`)),
    );
  }, [pathname]);

  const activeKey = activeItem?.key ?? 'dashboard';

  const resolvedTitle = title ?? activeItem?.label ?? 'Dashboard';

  const resolvedBreadcrumbs: Breadcrumb[] = breadcrumbs ?? [
    { label: 'ScalePay', href: '/' },
    { label: resolvedTitle },
  ];

  const handleNavigate = (_item: NavItem) => {
    // Navigation itself is handled by Next.js <Link>.
    // We only close the mobile navigation here.
    setMobileNavOpen(false);
  };

  const showSearch = pathname === '/employees';

  return (
    <div className="flex min-h-svh w-full bg-background">
      <Sidebar activeKey={activeKey} onNavigate={handleNavigate} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={resolvedTitle}
          breadcrumbs={resolvedBreadcrumbs}
          activeKey={activeKey}
          mobileNavOpen={mobileNavOpen}
          onMobileNavChange={setMobileNavOpen}
          onNavigate={handleNavigate}
          showSearch={showSearch}
        />

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
